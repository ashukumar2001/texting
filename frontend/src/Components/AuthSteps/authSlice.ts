import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface User {
  _id: string;
  fullName?: string;
  mobileNumber?: string;
  isMobileVerified: boolean;
  isActivated?: boolean;
  createdAt?: string;
  accessToken?: string;
  profilePicture?: string;
  email?: string;
}

export interface Auth {
  isMobileVerified: boolean;
  mobileNumber: string;
  otp: string;
  hash: string;
  user: User;
  currentPageStep: number;
  sessionId?: string | null;
}

const initialState: Auth = {
  isMobileVerified: false,
  mobileNumber: "",
  otp: "",
  hash: "",
  user: {
    _id: "",
    mobileNumber: "",
    isMobileVerified: false,
    createdAt: "",
    accessToken: "",
  },
  currentPageStep: 0,
  sessionId: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    nextStep: (state) => {
      state.currentPageStep = state.currentPageStep + 1;
    },
    backToMobileNumberStep: (state) => {
      state.hash = "";
      // state.mobileNumber = "";
      state.currentPageStep = state.currentPageStep - 1;
    },

    authenticateRequestSuccess: (
      state,
      { payload }: { payload: { user: User; accessToken: string } }
    ) => {
      // state.hash = payload.hash;
      // state.mobileNumber = payload.mobileNumber;
      state.user = {
        ...(payload.user || initialState.user),
        accessToken: payload.accessToken,
      };
      if (!payload?.user?.isMobileVerified) {
        state.currentPageStep = state.currentPageStep + 1;
      }
    },

    sendOtpRequestFulfilled: (
      state,
      {
        payload,
      }: { payload: { hash: string; mobileNumber: string; resend?: boolean } }
    ) => {
      state.hash = payload.hash;
      state.mobileNumber = payload.mobileNumber;
      if (!payload.resend) {
        state.currentPageStep = state.currentPageStep + 1;
      }
    },

    verifyOtpRequestFulfilled: (state, { payload }: { payload: Auth }) => {
      state.currentPageStep = payload.currentPageStep;
      state.hash = payload.hash;
      state.user.mobileNumber = payload.user.mobileNumber;
      state.user.isMobileVerified = payload?.user?.isMobileVerified;
      state.user.isActivated = payload?.user?.isActivated;
      state.otp = payload.otp;
      state.isMobileVerified = payload.isMobileVerified;
    },
    // Refresh credentials
    refreshAccessToken: (state, { payload }: { payload: string }) => {
      if (state.user) {
        state.user.accessToken = payload;
      }
    },

    // Logout
    logOut: (state) => {
      state.user = {
        _id: "",
        mobileNumber: "",
        isMobileVerified: false,
        createdAt: "",
        accessToken: "",
      };
      state.isMobileVerified = false;
      state.currentPageStep = 0;
      state.sessionId = null;
    },

    activateUserFullfilled: (state, { payload }) => {
      if (state.user) {
        state.user.isActivated = payload.isActivated || false;
        state.user.fullName = payload.fullName;
      }
    },
    setSessionId: (state, { payload }) => {
      state.sessionId = payload;
    },
  },
});

export const {
  nextStep,

  backToMobileNumberStep,
  // Authenticate
  authenticateRequestSuccess,

  // Send otp request fullfilled
  sendOtpRequestFulfilled,

  // Refresh token
  refreshAccessToken,

  // logout action
  logOut,

  // Verify Otp
  verifyOtpRequestFulfilled,

  // Activate User Profile
  activateUserFullfilled,

  // socket session id
  setSessionId,
} = authSlice.actions;
export default authSlice.reducer;

export const selectLoginUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.user.accessToken;
export const selectSessionId = (state: RootState) => state.auth.sessionId;
export const selectAccessToken = (state: RootState) =>
  state?.auth?.user?.accessToken;
export const selectMobileVerified = (state: RootState) =>
  state?.auth?.user?.isMobileVerified;
