import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import {
  ENVIRONMENT_DEV,
  ENVIRONMENT_PROD,
  FRONTEND_URL,
  PORT,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USER_PASSWORD,
} from "./config/index.js";
import DbConnect from "./db.js";
import router from "./router/index.js";
import cors from "cors";
import crypto from "crypto";
import Redis from "ioredis";
import { createAdapter } from "socket.io-redis";
import errorHandlerMiddleware from "./middlewares/error.middleware.js";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  ChatService,
  SocketService,
  TokenService,
  PushService,
  UserService,
} from "./services/index.js";
import { GroupMembersModel } from "./models/index.js";
import { RedisSessionStore } from "./store/sessionStore.js";
import { RedisMessageStore } from "./store/messageStore.js";
import { RedisChatsStore } from "./store/chatsStore.js";
import { originList } from "./constants/app.config.js";
const app = express();
console.log(REDIS_HOST, REDIS_PORT);
const corsOriginWhiteList = [...originList, FRONTEND_URL];
export const redisClient = new Redis({
  port: REDIS_PORT,
  host: REDIS_HOST,
  ...(ENVIRONMENT_PROD && { password: REDIS_USER_PASSWORD }),
});
const sessionStore = new RedisSessionStore(redisClient);
export const messageStore = new RedisMessageStore(redisClient);
export const chatsStore = new RedisChatsStore(redisClient);

// server configurations
app.use(
  cors({
    credentials: true,
    origin: corsOriginWhiteList,
  })
);
app.use(express.json());
app.use(cookieParser());

// error handle middleware

// API request logger middleware
if (ENVIRONMENT_DEV) app.use(morgan("tiny"));

app.use("/api/", router);

app.get("/", (req, res) => {
  res.send("Texing V1.0.0");
});

app.use(errorHandlerMiddleware);
// connecting to database
DbConnect();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: corsOriginWhiteList,
  },
  path: "/ws",
  adapter: createAdapter({
    pubClient: redisClient,
    subClient: redisClient.duplicate(),
  }),
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  const sessionId = socket.handshake.auth.sessionId;

  try {
    if (sessionId) {
      // do check existing session
      const session = await sessionStore.findSession(sessionId);
      if (session) {
        socket.sessionId = sessionId;
        socket.userId = session.userId;
        let user = await UserService.findUser(
          { _id: session.userId },
          "fullName profilePicture"
        );
        if (user.fullName && user.profilePicture) {
          socket.fullName = user.fullName;
          socket.profilePicture = user.profilePicture;
        }
        return next();
      }
    }
    if (!token) {
      return next(new Error("Unauthorized"));
    }
    const user = await TokenService.verifyAccessToken(token);
    if (user && user._id) {
      socket.sessionId = crypto.randomBytes(16).toString("hex");
      socket.userId = user._id;
      let userDetails = await UserService.findUser(
        { _id: user._id },
        "fullName profilePicture"
      );
      if (userDetails.fullName && userDetails.profilePicture) {
        socket.fullName = userDetails.fullName;
        socket.profilePicture = userDetails.profilePicture;
      }
      next();
    } else {
      return next(new Error("Token Expired"));
    }
  } catch (error) {
    console.log("io connection middlware error: ", error.message);
    return next(new Error("Token Expired"));
  }
});

io.on("connection", async (socket) => {
  sessionStore.saveSession(socket.sessionId, {
    userId: socket.userId,
    connected: true,
  });
  // sending session to the client
  socket.emit("session", {
    sessionId: socket.sessionId,
    userId: socket.userId,
  });

  // join the room with userId
  socket.join(socket.userId);

  // update online status
  chatsStore.updateOnlineStatus(socket.userId, "true");

  // join all groups
  const groups = await GroupMembersModel.find(
    { userId: socket.userId },
    "group"
  );

  if (groups && groups?.length > 0) {
    groups.forEach((group) => {
      socket.join(`group:${group.group}`);
    });
  }
  // console.log({
  //   userId: socket.userId,
  //   socketId: socket.id,
  //   room: socket.rooms,
  // });
  socket.on("group:message", async ({ content, groupId, participantId }) => {
    if (!groupId) {
      const userId = socket.userId;
      if (participantId && userId) {
        // check if inbox already exists and select group
        let alreadyExistsGroup = await ChatService.getInbox(userId, {
          participant: participantId,
        });
        if (alreadyExistsGroup) {
          groupId = alreadyExistsGroup.group;
        } else {
          const { group, inboxList, error } = await ChatService.createInbox(
            userId,
            participantId
          );
          if (!error) {
            for (let [id, s] of io.of("/").sockets) {
              if (s.userId === participantId) {
                const room = `group:${group._id}`;
                socket.join(room);
                s.join(room);
                inboxList?.forEach((inbox) => {
                  if (inbox.userId?.toString() === s.userId) {
                    io.to(s.userId).emit("group:added", inbox);
                  } else if (inbox.userId?.toString() === userId) {
                    io.to(socket.userId).emit("group:added", inbox);
                  }
                });
                groupId = group._id;
              }
            }
          }
        }
      }
    }
    if (groupId) {
      messageStore.saveMessage(groupId, content, socket.userId);

      SocketService.sendMessage(socket, content, groupId);
      if (participantId) {
        PushService.sendNotification(
          participantId,
          JSON.stringify({
            type: "message",
            content,
            sender: socket.fullName,
            senderProfileImage: socket.profilePicture,
            senderId: socket.userId,
          })
        );
      }

      chatsStore.updateLastMessage(socket.userId, groupId, {
        content,
        from: socket.userId,
      });
      chatsStore.updateUnreadMessage(participantId, groupId, {
        content,
        from: socket.userId,
      });
    }
  });

  //  update the unread messages in inbox
  socket.on(
    "group:update_unread_message",
    async ({ content, from, groupId }) => {
      chatsStore.updateUnreadMessage(socket.userId, groupId, { content, from });
    }
  );
  // set unread message count to zero when user seen the messsages.
  socket.on("group:seen_unread_message", ({ groupId }) => {
    chatsStore.seenUnreadMessage(socket.userId, groupId);
  });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userId).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      sessionStore.saveSession(socket.sessionId, {
        userId: socket.userId,
        connected: false,
      });
      // set online status to offline
      chatsStore.updateOnlineStatus(socket.userId);
    }
    console.log("disconnected: ", socket.id);
  });
});

io.on("error", () => {
  console.log("error occured");
});
httpServer.listen(PORT, () =>
  console.log("server running at localhost:", PORT)
);
