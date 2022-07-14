import { all, fork } from "redux-saga/effects";
import authSaga from "./Components/AuthSteps/authSaga";
export default function* rootSaga() {
  yield all([fork(authSaga)]);
}
