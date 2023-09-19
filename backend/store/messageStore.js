import moment from "moment";

const LIMIT = 10;
class messageStore {
  saveMessage(groupId, content, from, status) {}
  async getMessagesFromGroup(groupId, currentPage) {}
}

class RedisMessageStore extends messageStore {
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
  }

  saveMessage(groupId, content, from, status = 0) {
    const EXPIRE_AT = moment().endOf("day").unix();
    this.redisClient
      .multi()
      .zadd(
        `message:${groupId}`,
        content.timestamp,
        JSON.stringify({ content, from, status })
      )
      .expireat(`message:${groupId}`, EXPIRE_AT)
      .exec();
  }

  async getMessagesFromGroup(groupId, currentPage = 0) {
    let messages = [];
    const offset = currentPage * LIMIT;
    const totalCount = await this.redisClient.zcount(
      `message:${groupId}`,
      "-inf",
      "+inf"
    );
    const max = totalCount === LIMIT + offset;
    if (offset < totalCount) {
      messages = await this.redisClient.zrevrangebyscore(
        `message:${groupId}`,
        "+inf",
        "-inf",
        "LIMIT",
        offset,
        LIMIT
      );
    }
    console.log({ totalCount, LIMIT, offset });

    return messages && messages.length > 0
      ? {
          messages: messages?.map((item) => JSON.parse(item)),
          offset,
          max,
        }
      : { messages: [], offset, max };
  }
}
export { RedisMessageStore };
