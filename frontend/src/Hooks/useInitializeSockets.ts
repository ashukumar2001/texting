import { useEffect } from "react";
import { useRefreshAccessTokenMutation } from "../api/apiSlice";
import {
  refreshAccessToken,
  selectAccessToken,
  selectMobileVerified,
  selectSessionId,
  selectToken,
  setSessionId,
} from "../Components/AuthSteps/authSlice";
import { chatApiSlice } from "../Pages/Chats/chatApiSlice";
import {
  inboxInterface,
  setCurrentInbox,
  setCurrentPage,
} from "../Pages/Chats/chatSlice";
import { initializeSocket, socket } from "../ws/socket";
import { useAppDispatch, useAppSelector } from "./redux";
import MessageRecievedSound from "../assets/sounds/message-recieved.wav";

export interface socketMessageInterface {
  content: { messageText: string; timestamp: number };
  from: string;
  status: number;
  groupId: string;
  to?: string;
}

interface socketInboxInterface extends inboxInterface {
  _id: string;
}

const useInitializeSockets = () => {
  const token = useAppSelector(selectToken);
  const currentInbox = useAppSelector((state) => state.chat.currentInobx);
  const sessionId = useAppSelector(selectSessionId);
  const isMobileVerified = useAppSelector(selectMobileVerified);
  const { groupId: currentGroupId } = useAppSelector(
    (state) => state.chat.currentInobx
  );
  const [refreshTokenRequest] = useRefreshAccessTokenMutation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (token && isMobileVerified) initializeSocket(token, sessionId);
  }, [token, initializeSocket, sessionId, isMobileVerified]);

  useEffect(() => {
    socket.on("session", ({ sessionId, userId }) => {
      dispatch(setSessionId(sessionId));
    });

    socket.on("connect_error", async (error) => {
      console.log("Socket Connection Error: ", error.message);

      if (error.message === "Token Expired") {
        const refreshTokenResponse = await refreshTokenRequest({}).unwrap();
        dispatch(refreshAccessToken(refreshTokenResponse));
      }

      return () => {
        socket.off("connect_error");
        socket.off("session");
      };
    });
  }, []);

  useEffect(() => {
    socket.on("group:added", (inbox: socketInboxInterface) => {
      dispatch(
        chatApiSlice.util.updateQueryData("getInboxList", {}, (inboxList) => {
          inboxList.reverse();
          inboxList.push({ ...inbox, inboxId: inbox._id });
          inboxList.reverse();
        })
      );
      if (
        !currentInbox.groupId &&
        currentInbox.participant?._id === inbox.participant?._id
      ) {
        dispatch(
          setCurrentInbox({
            inboxId: inbox._id,
            groupId: inbox.group,
            participant: inbox.participant,
            unreadMessageCount: inbox.unreadMessageCount || 0,
          })
        );
      }
    });
    return () => {
      socket.off("group:added");
    };
  }, [currentInbox]);

  useEffect(() => {
    socket.on(
      "group:message",
      ({ content, from, status, groupId }: socketMessageInterface) => {
        if (currentGroupId === groupId) {
          const messageRecievedSound = new Audio(MessageRecievedSound);
          messageRecievedSound.play();
          // add new message into the messages cache
          dispatch(setCurrentPage(0));
          dispatch(
            chatApiSlice.util.updateQueryData(
              "getMessagesByGroup",
              { groupId, currentPage: 0 },

              (data) => {
                data.messages.reverse();
                data.messages.push({ content, from, status });
                data.messages.reverse();
              }
            )
          );
          // update the inbox list cache for unread messages and last message
          dispatch(
            chatApiSlice.util.updateQueryData(
              "getInboxList",
              {},
              (inboxList) => {
                inboxList.map((inbox) => {
                  if (inbox.group === groupId) {
                    inbox.updatedAt = content.timestamp;
                    // update last message
                    inbox.lastMessage = { content, from, status };
                  }
                  return inbox;
                });
              }
            )
          );
          // update unread message when chatbox is opened
          socket.emit("group:seen_unread_message", {
            groupId,
          });
        } else {
          // // send the messaage to update unread messages in redis cache
          // socket.emit("group:update_unread_message", {
          //   content,
          //   from,
          //   groupId,
          // });
          // update the inbox list cache for unread messages and last message
          dispatch(
            chatApiSlice.util.updateQueryData(
              "getInboxList",
              {},
              (inboxList) => {
                inboxList.map((inbox) => {
                  if (inbox.group === groupId) {
                    inbox.updatedAt = content.timestamp;
                    inbox.lastMessage = { content, from, status };
                    // update count for unread messages
                    inbox.unreadMessageCount = inbox.unreadMessageCount
                      ? ++inbox.unreadMessageCount
                      : 1;
                  }
                  return inbox;
                });
              }
            )
          );
        }
      }
    );
    return () => {
      // clean the listners on socket instance when component unmount from DOM.
      socket.off("group:message");
      socket.off("group:seen_unread_message");
      // socket.off("group:update_unread_message");
    };
  }, [currentGroupId]);

  return null;
};

export default useInitializeSockets;
