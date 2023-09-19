import Joi from "joi";
import { ErrorHandlerService } from "../services/index.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  let responseData = {
    message: "Internal server error",
    ...(true && {
      serverResponse: err.message,
    }),
  };

  if (err instanceof Joi.ValidationError) {
    statusCode = 422;
    responseData = {
      message: err.message,
    };
  }
  if (err instanceof ErrorHandlerService) {
    statusCode = err.status;
    responseData = {
      message: err.message,
    };
  }

  console.log("error: ", { err });

  return res.status(statusCode).send({ status: false, ...responseData });
};
export default errorHandlerMiddleware;
