import type { Response } from 'express';
import { ApiError } from '../../utils/api.error.js';
import { BaseResponseClass } from '../../utils/base.controller.class.js';

type ResData = Record<string, any>;

/**
 * Handles Forbidden errors (HTTP 403).
 * This class builds a Forbidden error response and sends it to the client.
 */
export class ForbiddenErrorResponse<
  TObj extends ResData,
> extends BaseResponseClass<TObj, ApiError<TObj>> {
  constructor() {
    super(ApiError);
  }

  /**
   * Builds and handles the Forbidden error response.
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
      .setStatus(403)
      .setMessage("Sorry you don't have permission to visit this page.")
      .setData(data as TObj)
      .build(res);
  }
}
