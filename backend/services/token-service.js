import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from "../config/index.js";
import { LoginActivityModel } from "../models/index.js";

class TokenService {
  generateTokens(payload) {
    // Generate Access Token
    const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: 1 * 60,
    });

    // Generate Refresh Token
    const refreshToken = jwt.sign(payload, JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: 60 * 60 * 24 * 15,
    });

    return { accessToken, refreshToken };
  }

  async storeLoginActivity(token, userId) {
    try {
      await LoginActivityModel.create({
        token,
        userId,
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async verifyAccessToken(token) {
    return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  }
  async verifyRefreshToken(token) {
    return jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  }
}

export default new TokenService();
