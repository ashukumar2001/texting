import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { authenticate } from "../../api/apiRoutes";
import {
  authenticateRequest,
  authenticateRequestFailed,
  authenticateRequestSuccess,
} from "./authSlice";

function* sendAuthenticateRequest({
  payload,
}: PayloadAction<{ mobileNumber: string }>) {
  const { data, status } = yield call(authenticate, payload.mobileNumber);
  if (status === 200 && data.status) {
    const { hash } = data;
    yield put(authenticateRequestSuccess({ hash }));
  } else {
    authenticateRequestFailed();
  }
}

function* authSaga() {
  yield takeLatest(authenticateRequest, sendAuthenticateRequest);
}

export default authSaga;
