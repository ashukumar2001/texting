import mongoose from "mongoose";
import { GroupService, UserService } from "./index.js";
import { GroupMembersModel, InboxModel } from "../models/index.js";
import { chatsStore } from "../index.js";

class ChatService {
  async getInbox(userId, filters = null) {
    // check if userId is not null
    if (userId) {
      let aggregate,
        data = null;
      if (userId && filters?.group) {
        // get inbox from redis store
        data = await chatsStore.getInbox(userId, filters.group);
      } else {
        aggregate = await InboxModel.aggregate([
          {
            $match: {
              // match the given userId in database
              userId: mongoose.Types.ObjectId(userId),
              ...(filters &&
                filters.inboxId && {
                  _id: mongoose.Types.ObjectId(filters.inboxId),
                }),
              ...(filters &&
                filters.group && {
                  group: mongoose.Types.ObjectId(filters.group),
                }),
              ...(filters &&
                filters.participant && {
                  participant: mongoose.Types.ObjectId(filters.participant),
                }),
            },
          },
          //  projecting the data to get only required fields
          {
            $project: {
              participant: 1,
              group: 1,
              lastMessage: 1,
              updatedAt: 1,
              // renaming the _id -> inboxId
              inboxId: "$_id",
              // removing _id
              _id: 0,
            },
          },
          {
            $sort: { updatedAt: -1 },
          },
        ]);
      }

      // Populate the data from database
      if (aggregate) {
        data = await InboxModel.populate(aggregate, {
          path: "participant",
          model: "User",
          // select only fullName and userName
          select: "fullName userName profilePicture",
          strictPopulate: false,
          ...(filters && { justOne: true }),
        });

        if (data?.length > 0) {
          data.forEach(async (item) => {
            const isAlreadyExists = await chatsStore.redisClient.hexists(
              `chats:${item.group}:${userId}`,
              "group"
            );
            if (!isAlreadyExists) {
              chatsStore.addInbox(
                userId,
                item.group,
                item.participant,
                item.updatedAt,
                item.inboxId
              );
            }
          });
        }
      }

      return filters ? data[0] || null : data;
    } else {
      return null;
    }
  }

  async createInbox(userId, participantId) {
    let group,
      groupMembers,
      inboxList,
      error = null;
    try {
      group = await GroupService.createGroup();
      if (group && userId && participantId) {
        groupMembers = [userId, participantId].map((id) => ({
          group: group._id,
          userId: id,
        }));

        inboxList = [userId, participantId].map((id) => ({
          group: group._id,
          userId: id,
          participant: id === userId ? participantId : userId,
        }));

        if (groupMembers?.length > 0) {
          groupMembers = await GroupMembersModel.create([...groupMembers]);
          if (groupMembers?.length > 0) {
            inboxList = await InboxModel.create([...inboxList]);
            inboxList = await InboxModel.populate(inboxList, {
              path: "participant",
              model: "User",
              select: "fullName userName profilePicture",
            });
            inboxList?.map((item) => {
              chatsStore.addInbox(
                item.userId,
                item.group,
                item.participant,
                item.updatedAt,
                item._id
              );
            });
          }
        }
      }
    } catch (err) {
      error = err;
    }
    return { group, groupMembers, error, inboxList };
  }

  async searchUserByMobileNumber(userName) {
    if (userName) {
      // find user with userName
      const user = await UserService.findUser(
        { userName },
        "fullName userName profilePicture"
      );
      return user;
    } else {
      return null;
    }
  }
  async searchUserByUserName(userName) {
    if (userName) {
      // find user with userName
      const user = await UserService.findUser(
        { userName },
        "fullName userName profilePicture"
      );
      return user;
    } else {
      return null;
    }
  }
}

export default new ChatService();
