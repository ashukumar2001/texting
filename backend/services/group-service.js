import { GroupModel } from "../models/index.js";

class GroupService {
  async createGroup(isMultiple = false) {
    const group = await GroupModel.create({ isMultiple });
    return group;
  }
}

export default new GroupService();
