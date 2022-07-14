import axiosInstance from ".";

const authenticate = (mobileNumber: string) =>
  axiosInstance.post("authenticate", { mobileNumber });

const verifyOtp = (payload: {
  otp: string;
  hash: string;
  mobileNumber: string;
}) => axiosInstance.post("verify-otp", payload);

export { authenticate, verifyOtp };
