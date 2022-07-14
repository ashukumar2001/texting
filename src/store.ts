import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import auth from "./Components/AuthSteps/authSlice";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./saga";

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  devTools: true,
  reducer: {
    auth,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
