import type { Response } from 'express';
import { ResData } from 'helper/iHelper.js';

export class ApiResponse<TData extends ResData> {
  public message: string;
  public statusCode: number;
  public data?: TData;
  public constructor(message: string, statusCode: number, data?: TData) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }

  public ResponseSender(res: Response) {
    return res.status(this.statusCode).json({
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    });
  }
}
