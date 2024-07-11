import { createSlice } from "@reduxjs/toolkit";
import { MessageInterface } from "./ChatBox";

export interface inboxParticipantInterface {
  _id: string;
  fullName: string;
  userName: string;
  profilePicture: string;
}

export interface inboxInterface {
  inboxId: string;
  group: string;
  lastMessage: MessageInterface | null;
  participant?: inboxParticipantInterface;
  updatedAt: number | string;
  unreadMessageCount?: number;
}

interface chatInterface {
  currentInobx: {
    inboxId: string | null;
    groupId: string | null;
    participant?: inboxParticipantInterface | null;
    currentPage: number;
    unreadMessageCount?: number;
  };
}

const initialState: chatInterface = {
  currentInobx: {
    inboxId: null,
    groupId: null,
    currentPage: 0,
  },
};

export const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setCurrentInbox: (state, { payload }) => {
      state.currentInobx.groupId = payload.groupId || null;
      state.currentInobx.inboxId = payload.inboxId || null;
      if (payload.participant)
        state.currentInobx.participant = payload.participant || null;
      if (payload.unreadMessageCount) {
        state.currentInobx.unreadMessageCount = payload.unreadMessageCount;
      }
    },
    setCurrentInboxParticipant: (state, { payload }) => {
      state.currentInobx.participant = payload;
    },
    setCurrentPage: (state, { payload }) => {
      state.currentInobx.currentPage = payload;
    },
    clearCurrentInbox: (state) => {
      state.currentInobx.groupId = null;
      state.currentInobx.inboxId = null;
      state.currentInobx.participant = null;
      state.currentInobx.currentPage = 0;
      state.currentInobx.unreadMessageCount = 0;
    },
  },
});

export const {
  setCurrentInbox,
  setCurrentPage,
  clearCurrentInbox,
  setCurrentInboxParticipant,
} = chatSlice.actions;
export default chatSlice.reducer;
