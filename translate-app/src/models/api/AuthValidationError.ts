class AuthValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthValidationError";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthValidationError);
    }
  }
}
