import Joi from "joi";
import { OAuth2Client } from "google-auth-library";
import {
  FederateLoginModel,
  LoginActivityModel,
  UserModel,
} from "../models/index.js";

import {
  OtpService,
  TokenService,
  ErrorHandlerService,
  HashService,
} from "../services/index.js";
import UserService from "../services/user-service.js";
import { googleAuthTokenValiation } from "../validators/index.js";
import {
  ENVIRONMENT_PROD,
  FRONTEND_URL,
  GOOGLE_CLIENT_ID,
} from "../config/index.js";
import {
  googleAuthPayloadValidation,
  mobileNumberValidation,
} from "../validators/authSchema.js";
import { redisClient } from "../index.js";
import {
  MAX_OTP_LIMIT,
  MAX_OTP_TRY_PER_TIME,
  OTP_TTL,
} from "../constants/app.config.js";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const verify = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return { payload };
};
class AuthController {
  async authenticate(req, res, next) {
    // Validate auth token
    const { error } = googleAuthTokenValiation.validate(req.body);
    if (error) {
      return next(ErrorHandlerService.invalidAuthToken());
    }

    // Verify auth token from Google Auth
    try {
      const { payload } = await verify(req.body?.token);

      const { error: authPayloadValidationError } =
        googleAuthPayloadValidation.validate({
          email: payload?.email,
          email_verified: payload?.email_verified,
          name: payload?.name,
          picture: payload.picture,
          sub: payload.sub,
        });
      if (authPayloadValidationError) {
        return next(authPayloadValidationError);
      }
      let fedLoginDetails, user;

      fedLoginDetails = await FederateLoginModel.findOne(
        {
          subject: payload.sub,
        },
        "-_id -__v"
      );

      if (!fedLoginDetails) {
        user = await UserModel.create({
          email: payload.email,
          isEmailVerified: payload.email_verified,
          fullName: payload.name,
          profilePicture: payload.picture,
          isActivated: payload.email_verified,
        });

        if (!user) {
          return next(ErrorHandlerService.serverError("Unable to create user"));
        }

        if (user._id) {
          fedLoginDetails = await FederateLoginModel.create({
            userId: user._id,
            provider: payload.iss,
            subject: payload.sub,
          });
        }
      } else {
        user = await fedLoginDetails.populate({
          path: "userId",
          model: "User",
          select: "-__v -createdAt -updatedAt",
        });
        if (user.userId) {
          user = user.userId;
        }
      }

      const { accessToken, refreshToken } = TokenService.generateTokens({
        _id: user._id,
      });

      await TokenService.storeLoginActivity(refreshToken, user._id);

      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 15,
        secure: true,
        httpOnly: true,
        sameSite: "None",
        ...(ENVIRONMENT_PROD
          ? {
              domain: FRONTEND_URL,
              path: "/",
            }
          : {}),
      });

      res.status(200).send({ status: true, data: { user, accessToken } });
    } catch (err) {
      console.log(err);
      return next(ErrorHandlerService.invalidAuthToken());
    }
  }

  async sendOtp(req, res, next) {
    const { error } = mobileNumberValidation.validate({
      mobileNumber: req?.body?.mobileNumber,
    });
    if (error) {
      return next(
        ErrorHandlerService.validationError("Enter valid mobile number")
      );
    }
    const { mobileNumber } = req.body;

    const isAlreadyExists = await UserModel.exists({
      mobileNumber,
    });

    if (isAlreadyExists) {
      return res
        .status(409)
        .send({ status: false, message: "mobile number already exists" });
    }

    // Check if otp limit exeeded
    const otpLimitCounterKey = `otp_request:${req?.user?.id}`;
    const isOtpLimitCounterExists = await redisClient.exists(
      otpLimitCounterKey
    );

    if (!isOtpLimitCounterExists) {
      await redisClient
        .multi()
        .set(otpLimitCounterKey, 1)
        .expire(otpLimitCounterKey, MAX_OTP_TRY_PER_TIME)
        .exec();
    }
    if (isOtpLimitCounterExists) {
      const otpLimitCounter = await redisClient.get(otpLimitCounterKey);
      if (otpLimitCounter >= MAX_OTP_LIMIT) {
        return res.status(429).send({
          status: false,
          message: "otp max-limit exceeded. try after 1 hour",
        });
      } else {
        await redisClient.incr(otpLimitCounterKey);
      }
    }

    const otp = await OtpService.generateOtp();
    // otp is valid only for 2 minutes
    const ttl = 1000 * OTP_TTL; // time to live
    const expires = Date.now() + ttl; // otp expiry time
    // create data string with mobileNumber, otp and ttl
    const dataString = `${mobileNumber}.${otp}.${expires}`;
    const hashOtp = await HashService.hashOtp(dataString);

    // send otp to mobile number
    try {
      if (ENVIRONMENT_PROD) {
        await OtpService.sendOtpBySms(mobileNumber, otp);
      } else {
        console.log(mobileNumber, otp);
      }
      res.send({
        status: true,
        data: {
          hash: `${hashOtp}.${expires}`,
          mobileNumber,
        },
      });
    } catch (err) {
      res.status(500).send({ status: false, message: "Unable to send sms" });
    }
  }

  async verifyOtp(req, res, next) {
    // get all parameters
    const { otp, hash, mobileNumber } = req.body;

    if (!otp || !hash || !mobileNumber) {
      return res.status(400).send({ status: false, message: "OTP Invalid!" });
    }

    const [hashedOtp, expires] = hash.split(".");

    if (Date.now() > +expires) {
      return res
        .status(400)
        .send({ status: false, message: "OTP is expired!" });
    }

    const dataString = `${mobileNumber}.${otp}.${expires}`;
    const isValid = OtpService.verifyOtp(hashedOtp, dataString);
    if (!isValid)
      return res
        .status(400)
        .send({ status: false, message: "OTP is invalid!" });

    let user;
    try {
      user = await UserModel.findOneAndUpdate(
        { _id: req?.user?.id },
        { mobileNumber, isMobileVerified: true, isActivated: true },
        {
          new: true,
          projection: "-__v -createdAt -updatedAt",
        }
      );
    } catch (error) {
      return next(error);
    }
    if (user?._id) {
      res.status(200).send({ status: true, user });
    } else {
      return next(ErrorHandlerService.serverError());
    }
  }

  async getUser(req, res) {
    const { mobileNumber } = req.body;
    let user = null;
    if (mobileNumber) {
      user = await UserService.findUser({ mobileNumber });
    }
    res.send({ user });
  }

  async refreshTokens(req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    const refreshTokenSchema = Joi.object({
      refreshToken: Joi.string().required(),
    });

    const { error } = refreshTokenSchema.validate({ refreshToken });
    if (error) {
      return next(error);
    }

    try {
      const _refreshToken = await LoginActivityModel.findOne({
        token: refreshToken,
      });
      if (!_refreshToken) {
        return next(
          ErrorHandlerService.unAuthorizedAccess("Invalid refresh token")
        );
      }

      let user = await TokenService.verifyRefreshToken(_refreshToken.token);
      if (!user) {
        return next(
          ErrorHandlerService.unAuthorizedAccess("Invalid refresh token")
        );
      }

      user = await UserService.findUser({ _id: user._id }, "_id");

      if (!user) {
        return next(
          ErrorHandlerService.unAuthorizedAccess("Invalid refresh token")
        );
      }

      const { accessToken } = TokenService.generateTokens({
        _id: user._id,
      });

      res.send({ status: true, accessToken });
    } catch (error) {
      return next(ErrorHandlerService.authenticationExpired());
    }
  }
}

export default new AuthController();
