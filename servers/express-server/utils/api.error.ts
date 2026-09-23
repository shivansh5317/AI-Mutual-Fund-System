import { ResData } from 'helper/iHelper.js';

export class ApiError<TData extends ResData> extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public data?: TData;

  public constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    data?: TData
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.data = data;
  }
}
