export const environments = {
  dev: "development",
  prod: "production",
  uat: "userAcceptanceTesting",
};

export const originList = ["http://localhost:3000"];
export const MAX_OTP_LIMIT =
  process.env.NODE_ENV === environments.dev ? 100 : 5;
export const MAX_OTP_TRY_PER_TIME = 60 * 60; // 1 hour
export const OTP_TTL = 60 * 2; // 2 minutes
