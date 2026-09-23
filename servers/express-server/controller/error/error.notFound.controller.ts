import type { Response } from 'express';
import { ApiError } from '../../utils/api.error.js';
import { BaseResponseClass } from '../../utils/base.controller.class.js';

type ResData = Record<string, any>;

/**
 * Handles Not Found errors (HTTP 404).
 * This class builds a NotFound error response and sends it to the client.
 */
export class NotFound<TObj extends ResData> extends BaseResponseClass<
  TObj,
  ApiError<TObj>
> {
  constructor() {
    super(ApiError);
  }

  /**
   * Builds and handles the NotFound error response.
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
      .setStatus(404)
      .setMessage('Sorry request not found.')
      .setData(data as TObj)
      .build(res);
  }
}
