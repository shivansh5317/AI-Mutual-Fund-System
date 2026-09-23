import type { NextFunction, Request, Response } from 'express';
import { AsyncHandler, ModifiedRequest } from 'helper/iHelper.js';

export const catchAsync = (fn: AsyncHandler) => {
  return (
    req: Request | ModifiedRequest,
    res: Response,
    next: NextFunction
  ) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
