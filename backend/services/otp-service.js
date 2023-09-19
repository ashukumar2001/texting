import { randomInt } from "crypto";
import {
  SMS_SERVICE_AUTH_TOKEN,
  SMS_SERVICE_SID,
  SMS_SERVICE_SENDER_NUMBER,
} from "../config/index.js";
import twilio from "twilio";
import { HashService } from "./index.js";
class OtpService {
  // Generate OTP
  generateOtp() {
    // generating random integer in range of 1000-9999
    return randomInt(1000, 9999);
  }

  // Send OTP
  async sendOtpBySms(mobileNumber, otp) {
    const twilioInstance = twilio(SMS_SERVICE_SID, SMS_SERVICE_AUTH_TOKEN, {
      lazyLoading: true,
    });

    return await twilioInstance.messages.create({
      to: "+91" + mobileNumber,
      from: SMS_SERVICE_SENDER_NUMBER,
      body: `Your Texting verification code is ${otp}`,
    });
  }

  verifyOtp(hashedOtp, dataString) {
    let computeHash = HashService.hashOtp(dataString);
    return computeHash === hashedOtp;
  }
}

export default new OtpService();
