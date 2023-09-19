const CHAT_BOX_TTL = 24 * 60 * 60;

class chatsStore {
  // redis key => chats:groupId:userId
  getInboxList(userId) {}
  getInbox(userId, filters) {}
  addInbox(userId, groupId, participant, updatedAt, inboxId) {}
  updateLastMessage(userId, groupId, message) {}
}

class RedisChatsStore extends chatsStore {
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
  }

  async getInboxList(userId) {
    let data = [];
    if (userId) {
      const keys = new Set();
      let nextIndex = 0;
      const [nextIndexStr, results] = await this.redisClient.scan(
        nextIndex,
        "MATCH",
        `chats:*:${userId}`,
        "COUNT",
        "20"
      );
      if (results && results.length > 0) {
        results.forEach((k) => keys.add(k));
        const commands = [];
        keys.forEach((key) => {
          commands.push([
            "hmget",
            key,
            "group",
            "lastMessage",
            "participant",
            "updatedAt",
            "inboxId",
            "unreadMessageCount",
          ]);
        });

        data = await this.redisClient
          .multi(commands)
          .exec()
          .then((result) => {
            return result
              .map(([err, data]) =>
                err
                  ? undefined
                  : {
                      group: data[0],
                      lastMessage: data[1] ? JSON.parse(data[1]) : data[1],
                      participant: JSON.parse(data[2]),
                      updatedAt: data[3],
                      inboxId: data[4],
                      unreadMessageCount: parseInt(data[5] || "0"),
                    }
              )
              .filter((d) => !!d);
          });
      }
    }
    return data;
  }

  async getInbox(userId, groupId) {
    return userId && groupId
      ? await this.redisClient.hgetall(`chats:${groupId}:${userId}`)
      : null;
  }

  async addInbox(userId, group, participant, updatedAt, inboxId) {
    await this.redisClient
      .multi()
      .hset(
        `chats:${group}:${userId}`,
        "group",
        group,
        "lastMessage",
        "",
        "participant",
        JSON.stringify(participant),
        "updatedAt",
        updatedAt,
        "inboxId",
        inboxId,
        "unreadMessageCount",
        0
      )
      .expire(`chats:${group}:${userId}`, CHAT_BOX_TTL)
      .exec();
  }

  async updateLastMessage(userId, groupId, message) {
    await this.redisClient.hset(
      `chats:${groupId}:${userId}`,
      "lastMessage",
      JSON.stringify(message)
    );
  }

  async updateUnreadMessage(userId, groupId, message) {
    const key = `chats:${groupId}:${userId}`;
    await this.redisClient
      .multi()
      .hincrby(key, "unreadMessageCount", 1)
      .hset(key, "lastMessage", JSON.stringify(message))
      .exec();
  }
  async seenUnreadMessage(userId, groupId) {
    await this.redisClient.hset(
      `chats:${groupId}:${userId}`,
      "unreadMessageCount",
      0
    );
  }
  async updateOnlineStatus(userId, status = "false") {
    const key = `connected_user:${userId}`;
    await this.redisClient
      .multi()
      .set(key, status)
      .expire(key, CHAT_BOX_TTL)
      .exec();
  }

  async getOnlineStatus(userId) {
    if (userId) {
      const key = `connected_user:${userId}`;
      const online_status = await this.redisClient.get(key);
      return online_status === "true";
    } else {
      return false;
    }
  }
}

export { RedisChatsStore };
