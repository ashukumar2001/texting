class ErrorHandler extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static alreadyExists(message) {
    return new ErrorHandler(409, message);
  }
  static validationError(message = "All fields are required.") {
    return new ErrorHandler(400, message);
  }
  static otpError(message = "Invalid OTP") {
    return new ErrorHandler(400, message);
  }
  static invalidAuthToken(message = "Invalid Auth Token") {
    return new ErrorHandler(400, message);
  }
  static unAuthorizedAccess(message = "Unauthorized") {
    return new ErrorHandler(401, message);
  }
  static authenticationExpired(message = "Session Expired") {
    return new ErrorHandler(440, message);
  }
  static notFound(message = "Not Found") {
    return new ErrorHandler(404, message);
  }
  static serverError(message = "Server Error") {
    return new ErrorHandler(500, message);
  }
}

export default ErrorHandler;
