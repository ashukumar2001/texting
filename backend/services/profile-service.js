import crypto from "node:crypto";
class ProfileService {
  async generateAvatarSeeds() {
    const seeds = [];
    for (let i = 0; i < 10; i++) {
      const seed = crypto.randomBytes(6).toString("hex");
      seeds.push(seed);
    }

    return seeds;
  }
}

export default new ProfileService();
