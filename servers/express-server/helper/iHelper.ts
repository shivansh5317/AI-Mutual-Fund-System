import type { Application, NextFunction, Request, Response } from 'express';

export type AsyncHandler = (
  req: Request | ModifiedRequest,
  res: Response,
  next: NextFunction
) => void;

export type ResData =
  | {
      [key: string]: any;
    }
  | undefined;

export interface ModifiedRequest extends Request {
  app: Application;
  user : {
    id: string,
  }
}
