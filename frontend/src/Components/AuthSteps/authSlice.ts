import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface User {
  _id: string;
  fullName?: string;
  isUserAuthenticated?: boolean;
  isActivated?: boolean;
  userName?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
  accessToken?: string;
  profilePicture?: string;
  email?: string;
}

export interface Auth {
  user: User;
  currentPageStep: number;
  sessionId?: string | null;
}

const initialState: Auth = {
  user: {
    _id: "",
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
    authenticateRequestSuccess: (
      state,
      { payload }: { payload: { user: User; accessToken: string } }
    ) => {
      state.user = {
        ...(payload.user || initialState.user),
        isUserAuthenticated: payload.user?.isActivated && payload.user?.isEmailVerified,
        accessToken: payload.accessToken,
      };
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
        createdAt: "",
        accessToken: "",
      };
      state.currentPageStep = 0;
      state.sessionId = null;
    },

    activateUserFullfilled: (state, { payload }) => {
      if (state.user) {
        state.user.isUserAuthenticated = payload.isActivated || false;
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

  // Authenticate
  authenticateRequestSuccess,

  // Refresh token
  refreshAccessToken,

  // logout action
  logOut,

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
