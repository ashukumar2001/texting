import moment from "moment";
import {
  detectMobileDeviceRegEx,
  mobileValidationRegEx,
  otpValidationRegEx,
} from "./constants";
import { MessageInterface } from "../Pages/Chats/ChatBox";

export const isMobileNumber = (value: string) =>
  mobileValidationRegEx.test(value);
export const getTimeString = (timestamp: number) => {
  return timestamp ? moment(timestamp).format("h:mm") : "";
};
export const isOneTimePassword = (value: string) =>
  otpValidationRegEx.test(value);
export const isMobileDevice = (value: string) =>
  detectMobileDeviceRegEx.test(value);
export const getNameInitials = (data: string) => {
  const nameArr = data?.split(" ") || [];
  return `${nameArr[0][0]}${nameArr?.length > 1 ? nameArr[nameArr.length - 1][0] : ""
    }`;
};
export const getAvatarUrlFromSeed = (seed: string = "?") => {
  const nameInitials = getNameInitials(seed);
  return import.meta.env.VITE_AVATARS_URL + nameInitials;
};

export const urlB64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const checkIsStackMessage = (
  currentMessage: MessageInterface,
  nextMessage: MessageInterface
) => {
  return Boolean(
    currentMessage &&
    nextMessage &&
    currentMessage.from === nextMessage.from &&
    getTimeString(currentMessage.content.timestamp) ===
    getTimeString(nextMessage.content.timestamp)
  );
};
