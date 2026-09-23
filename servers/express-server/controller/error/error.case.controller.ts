import type { Response } from 'express';
import { ApiError } from '../../utils/api.error.js';
import { BaseResponseClass } from '../../utils/base.controller.class.js';

type ResData = Record<string, any>;

/**
 * Handles generic case errors (HTTP 500).
 * This class builds a CaseError response and sends it to the client.
 */
export class CaseError<TObj extends ResData> extends BaseResponseClass<
  TObj,
  ApiError<TObj>
> {
  constructor() {
    super(ApiError);
  }

  /**
   * Builds and handles the CaseError response.
   *
   * @param {Response} res - The Express response object.
   * @param {TObj} data - Optional additional data to include in the response.
   * @returns {ApiError<TObj>} The created case error response.
   */
  public override handleResponse(
    res: Response,
    data?: TObj
  ): void | ApiError<TObj> {
    this.builderInstance
      .setStatus(500)
      .setMessage('Sorry some internal error occurred , failed to fetch !')
      .setData(data as TObj)
      .build(res);
  }
}
