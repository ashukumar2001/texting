import { detectMobileDeviceRegEx } from "./constants";

export const detectMobileDevice = () =>
  detectMobileDeviceRegEx.test(window.navigator.userAgent);

export const isMobileDevice = detectMobileDevice();
