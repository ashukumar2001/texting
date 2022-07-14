import { createSlice } from "@reduxjs/toolkit";

export interface User {
  fullName: string;
  mobileNumber: string;
  isMobileVerified: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface Auth {
  isMobileVerified: boolean;
  mobileNumber: string;
  otp: string;
  hash: string;
  user?: User | null;
  isLoading: boolean;
  currentPageStep: number;
}

const initialState: Auth = {
  isMobileVerified: false,
  mobileNumber: "",
  otp: "",
  hash: "",
  user: null,
  isLoading: false,
  currentPageStep: 0,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticateRequest: (state, { payload }) => {
      state.mobileNumber = payload.mobileNumber;
      state.isLoading = true;
    },
    authenticateRequestSuccess: (state, { payload }) => {
      // state.mobileNumber = payload.mobileNumber;
      state.hash = payload.hash;
      state.isLoading = false;
      state.currentPageStep = state.currentPageStep + 1;
    },
    authenticateRequestFailed: (state) => {
      state.isLoading = false;
    },
  },
});

export const {
  authenticateRequest,
  authenticateRequestSuccess,
  authenticateRequestFailed,
} = authSlice.actions;
export default authSlice.reducer;
