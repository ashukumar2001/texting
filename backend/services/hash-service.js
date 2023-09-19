import { createHmac } from "crypto";
import { OTP_HASH_SECRET } from "../config/index.js";
class HashService {
  hashOtp(otp) {
    return createHmac("sha256", OTP_HASH_SECRET).update(otp).digest("hex");
  }
}

export default new HashService();
