import type { Response } from 'express';
import { ResData } from 'helper/iHelper.js';
import { ApiError } from 'utils/api.error.js';
import { ApiResponse } from 'utils/api.response.js';

export class ApiBuilder<
  TClass extends ApiResponse<TData> | ApiError<TData>,
  TData extends ResData,
> {
  private apiInstance!: TClass;

  private static createApiInstance<TClass>(
    ApiClass: new (...args: any[]) => TClass,
    ...args: ConstructorParameters<typeof ApiClass>
  ) {
    return new ApiClass(...args);
  }

  public constructor(private ApiClass: new (...args: any[]) => TClass) {
    this.ApiClass = ApiClass;
    this.reset();
  }
  private reset() {
    this.apiInstance = ApiBuilder.createApiInstance(this.ApiClass, 200, 'OK');
  }
  public setMessage(message: string) {
    this.apiInstance.message = message;
    return this;
  }

  public setData(data?: TData) {
    if (data) {
      this.apiInstance.data = data;
    }
    return this;
  }
  public setStatus(status: number) {
    this.apiInstance.statusCode = status;
    return this;
  }
  // public build()

  public build(res: Response) {
    if (this.apiInstance instanceof ApiResponse) {
      console.log('Building ApiResponse');
      return (this.apiInstance as ApiResponse<TData>).ResponseSender(res);
    }
    console.log('Building ApiError');
    const error = this.apiInstance as ApiError<TData>;
    this.reset();
    console.log(error);
    return error;
  }
}
