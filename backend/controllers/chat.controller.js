import { chatsStore, messageStore } from "../index.js";
import { GroupMembersModel, GroupModel, InboxModel } from "../models/index.js";
import { ChatService, ErrorHandlerService } from "../services/index.js";
class ChatController {
  async getInbox(req, res, next) {
    try {
      const { id } = req.user;
      const filters = req.query;
      if (!id) {
        return next(ErrorHandlerService.unAuthorizedAccess());
      }
      let data = [];
      if (id && filters && Object.keys(filters).length === 0) {
        data = await chatsStore.getInboxList(id);
        if (data && data.length === 0) {
          // fetch list of inbox with given userId
          data = await ChatService.getInbox(id);
        }
      }
      return res.send({ status: true, result: data });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
  async createInbox(req, res, next) {
    try {
      const { user } = req.body;
      const { id } = req.user;
      if (!id) {
        return res
          .status(401)
          .send({ status: false, messgage: "Unauthroized" });
      }
      if (!user) {
        return next(ErrorHandlerService.validationError());
      }

      const inbox = await InboxModel.findOne(
        {
          userId: id,
          participant: user,
        },
        "_id"
      );
      if (inbox) {
        return res.send({ status: true, result: inbox._id });
      }

      const group = await GroupModel.create({ isMultiple: false });
      let groupMembers = [];
      let inboxList = [];
      let result = null;
      if (user && id && group) {
        groupMembers = [user, id].map((userId) => ({
          group: group._id,
          userId,
        }));
        if (groupMembers.length > 0) {
          groupMembers = await GroupMembersModel.create([...groupMembers]);

          inboxList = [user, id].map((userId) => ({
            userId,
            group: group._id,
            participant: userId === id ? user : id,
          }));

          inboxList = await InboxModel.create([...inboxList]);
          result = inboxList.find((item) => item.userId.toString() === id);
        }
      }
      if (result) {
        res.send({ status: true, result: result._id });
      } else {
        next(new ErrorHandlerService(500, "Server Error"));
      }
    } catch (error) {
      next(error);
    }
  }
  async searchUser(req, res, next) {
    const userName = req.query.q;
    if (!/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/.test(userName)) {
      return next(new Error("Invalid user name"));
    }

    const user = await ChatService.searchUserByUserName(userName);
    if (!user) {
      return next(ErrorHandlerService.notFound("No results found"));
    }

    res.send({
      status: true,
      result: {
        _id: user._id,
        fullName: user.fullName,
        userName: user.userName,
        profilePicture: user.profilePicture,
      },
    });
  }
  async getMessagesByGroup(req, res, next) {
    try {
      const { groupId, currentPage } = req.query;
      const data = await messageStore.getMessagesFromGroup(
        groupId,
        currentPage
      );
      res.send({ status: true, data });
    } catch (error) {
      return next(error);
    }
  }
  async getOnlineStatus(req, res, next) {
    try {
      const { userId } = req.query;
      if (!userId) {
        return next(ErrorHandlerService.validationError("userId is required"));
      }

      const online_status = await chatsStore.getOnlineStatus(userId);
      res.send({ status: true, data: { online_status } });
    } catch (error) {
      return next(error);
    }
  }
}

export default new ChatController();
