import type { Response, Request, NextFunction } from 'express';
import { DuplicateError } from 'controller/error/error.duplicate.controller.js';
import { ValidationError } from 'controller/error/error.validation.controller.js';
import { JSONWebTokenError } from 'controller/error/error.token.controller.js';
import { ApiError } from '../../utils/api.error.js';

type ResData = Record<string, any>;

/**
 * Handles error responses in the development environment.
 * Sends detailed error information including the stack trace.
 *
 * @param {ApiError<TObj>} err - The error object.
 * @param {Response} res - The Express response object.
 */
export const sendDevError = <TObj extends ResData>(
  err: ApiError<TObj>,
  res: Response
) => {
  if (res.headersSent) return;

  const statusCode = Number(err.statusCode) || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    status: statusCode,
    message,
    ...(err.data || {}),
    stack: err.stack,
    cause: err.cause,
  });
};

/**
 * Handles error responses in the production environment.
 * Sends generic error messages for operational errors and hides sensitive stack traces.
 *
 * @param {ApiError<TObj>} err - The error object.
 * @param {Response} res - The Express response object.
 */
export const sendProdError = <TObj extends ResData>(
  err: ApiError<TObj>,
  res: Response
) => {
  if (res.headersSent) return;

  const statusCode = Number(err.statusCode) || 500;
  const message = err.message || 'Internal Server Error';

  if (err.isOperational) {
    return res.status(statusCode).json({
      status: statusCode,
      message,
      ...(err.data || {}),
    });
  }

  return res.status(500).json({
    status: 500,
    message: 'Some internal error occurred',
    data: '',
  });
};

/**
 * Global error handler middleware
 */
export const globalErrorHandler = <TObj extends ResData>(
  err: ApiError<TObj>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('finally reached the master controller', err);
  console.log('stack', err.stack);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Some internal server error occurred.';

  if ((err as any).code === 11000) {
    err = new DuplicateError().handleResponse(res, {
      info: 'Current data already exist , try creating different',
    }) as ApiError<TObj>;
  }
  if (err.stack?.startsWith('ValidationError')) {
    err = new ValidationError().handleResponse(res, {
      info: 'Provide some valid fields',
    }) as ApiError<TObj>;
  }
  if (err.stack?.startsWith('CastError')) {
    err = new ValidationError().handleResponse(res, {
      info: 'Unable to fetch the data',
    }) as ApiError<TObj>;
  }
  if (err.stack?.startsWith('JsonWebTokenError')) {
    err = new JSONWebTokenError().handleResponse(res, {
      info: 'Invalid token associated with user',
    }) as ApiError<TObj>;
  }
  if (process.env.NODE_ENV === 'production') {
    sendProdError<TObj>(err, res);
  } else {
    sendDevError<TObj>(err, res);
  }
};
