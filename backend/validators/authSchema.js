import Joi from "joi";

export const mobileNumberValidation = Joi.object({
  mobileNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
});

export const googleAuthPayloadValidation = Joi.object({
  email: Joi.string().email().required(),
  email_verified: Joi.boolean().required(),
  name: Joi.string().required(),
  picture: Joi.string().uri(),
  sub: Joi.string().required(),
});

export const googleAuthTokenValiation = Joi.object({
  token: Joi.string(),
});
