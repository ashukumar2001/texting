import { createSlice } from "@reduxjs/toolkit";

export interface userSearchResultInterface {
  _id: string;
  fullName: string;
  mobileNumber: string;
  profilePicture: string;
}
export interface userSearchInterface {
  query: string;
}
export interface searchInterface {
  userSearch: userSearchInterface;
}
const initialState: searchInterface = {
  userSearch: {
    query: "",
  },
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setUserSearchQuery: (state, { payload }) => {
      state.userSearch.query = payload;
    },
    clearUserSearch: (state) => {
      state.userSearch.query = "";
    },
  },
});

export const { setUserSearchQuery, clearUserSearch } = searchSlice.actions;

export default searchSlice.reducer;
