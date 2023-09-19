import { UserModel } from "../models/index.js";

class UserService {
  async findUser(filter, selectStr = "") {
    const user = await UserModel.findOne(filter).select(
      selectStr || "-__v -updatedAt"
    );
    return user;
  }
  async createUser(data) {
    const user = await UserModel.create(data);
    return user;
  }
}

export default new UserService();
