import { apiSlice } from "../../api/apiSlice";
import { User } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    authenticate: build.mutation({
      query: (creds: { token: string }) => ({
        url: "authenticate",
        method: "POST",
        body: { ...creds },
      }),
    }),
    sendOtpRequest: build.mutation({
      query: (creds: { mobileNumber: string }) => ({
        url: "otp-request",
        method: "POST",
        body: { ...creds },
      }),
    }),
    verifyOtp: build.mutation({
      query: (creds) => ({
        url: "verify-otp",
        method: "POST",
        body: { ...creds },
      }),
    }),
    activateAccount: build.mutation<User, { fullName: string }>({
      query: (data) => ({
        url: "activate",
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (rawResult: {
        status: boolean;
        message: string;
        user: User;
      }) => rawResult.user,
    }),
  }),
});

export const {
  useAuthenticateMutation,
  useVerifyOtpMutation,
  useActivateAccountMutation,
  useSendOtpRequestMutation,
} = authApiSlice;
