import { combineReducers, configureStore } from "@reduxjs/toolkit";
import auth from "./Components/AuthSteps/authSlice";
import search from "./Components/Search/searchSlice";
import chat from "./Pages/Chats/chatSlice";
import socket from "./ws/socketSlice";
import { persistStore, persistReducer, REGISTER, PERSIST } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { apiSlice } from "./api/apiSlice";
import { chatApiSlice } from "./Pages/Chats/chatApiSlice";

const reducers = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth,
  search,
  chat,
  socket
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "chat"],
};
const persistedReducer = persistReducer(persistConfig, reducers);
export const store = configureStore({
  devTools: import.meta.env.DEV,
  reducer: persistedReducer,
  middleware: (getDefaultMiddlewawre) =>
    getDefaultMiddlewawre({
      serializableCheck: {
        ignoredActions: [REGISTER, PERSIST],
      },
    }).concat(apiSlice.middleware),
});
export default persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
