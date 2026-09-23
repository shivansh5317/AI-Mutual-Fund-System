import type { Response } from 'express';
import { ApiError } from '../../utils/api.error.js';
import { BaseResponseClass } from '../../utils/base.controller.class.js';

type ResData = Record<string, any>;

/**
 * Handles Internal Server errors (HTTP 500).
 * This class builds an Internal Server error response and sends it to the client.
 */
export class InternalServerError<
  TObj extends ResData,
> extends BaseResponseClass<TObj, ApiError<TObj>> {
  constructor() {
    super(ApiError);
  }

  /**
   * Builds and handles the Internal Server error response.
   *
   * @param {Response} res - The Express response object.
   * @param {TObj} data - Optional additional data to include in the response.
   * @returns {ApiError<TObj>} The created error response.
   */
  public override handleResponse(
    res: Response,
    data?: TObj
  ): void | ApiError<TObj> {
    this.builderInstance
      .setStatus(500)
      .setMessage('Some server error occurred.')
      .setData(data as TObj)
      .build(res);
  }
}
