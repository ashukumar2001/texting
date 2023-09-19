export const mobileValidationRegEx = /^(\+\d{1,3}[- ]?)?\d{10}$/;
export const otpValidationRegEx = /^\d{4}$/;
export const detectMobileDeviceRegEx = /android|iphone|kindle|ipad/i;
export const authSteps = [
  {
    step: 0,
    title: "sign in",
  },
  {
    step: 1,
    title: "continue with your phone",
  },
  {
    step: 2,
    title: "verify phone",
  },
  {
    step: 3,
    title: "phone verified successfully",
  },
  {
    step: 4,
    title: "loggin successfull!",
  },
];
export const errorMessages = {
  serverError: "We have a little problem.",
};
