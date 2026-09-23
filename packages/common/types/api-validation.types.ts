import { z } from 'zod';
import type { Brand } from './base.zType.js';

// Branded types for compile-time safety
export type ValidatedUrl = Brand<string, 'ValidatedUrl'>;
export type ValidatedGetConfig = Brand<
  z.infer<typeof GetConfigSchema>,
  'ValidatedGetConfig'
>;
export type ValidatedMutationConfig = Brand<
  z.infer<typeof MutationConfigSchema>,
  'ValidatedMutationConfig'
>;
export type ValidatedBody = Brand<Record<string, any>, 'ValidatedBody'>;

// Base config schema
const BaseConfigSchema = z.object({
  headers: z.record(z.string(), z.string()).optional(),
  params: z.record(z.string(), z.any()).optional(),
  timeout: z.number().positive().optional(),
  signal: z.instanceof(AbortSignal).optional(),
});

// GET request config - no data field allowed
export const GetConfigSchema = BaseConfigSchema.strict();

// POST/PATCH/DELETE request config - data field required internally
export const MutationConfigSchema = BaseConfigSchema.extend({
  data: z.record(z.string(), z.any()).optional(),
}).strict();

// URL validation
export const UrlSchema = z.string().min(1, 'URL cannot be empty');

// Body validation for mutations
export const BodySchema = z
  .record(z.string(), z.any())
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Request body cannot be empty',
  });

export class ApiValidationService {
  static validateGetConfig(config: unknown): ValidatedGetConfig {
    const result = GetConfigSchema.safeParse(config);
    if (!result.success) {
      throw new Error(`Invalid GET config: ${result.error.message}`);
    }
    return result.data as ValidatedGetConfig;
  }

  static validateMutationConfig(config: unknown): ValidatedMutationConfig {
    const result = MutationConfigSchema.safeParse(config);
    if (!result.success) {
      throw new Error(`Invalid mutation config: ${result.error.message}`);
    }
    return result.data as ValidatedMutationConfig;
  }

  static validateUrl(url: unknown): ValidatedUrl {
    const result = UrlSchema.safeParse(url);
    if (!result.success) {
      throw new Error(`Invalid URL: ${result.error.message}`);
    }
    return result.data as ValidatedUrl;
  }

  static validateBody(body: unknown): ValidatedBody {
    if (!body || (typeof body === 'object' && Object.keys(body).length === 0)) {
      throw new Error('Request body cannot be empty');
    }
    const result = BodySchema.safeParse(body);
    if (!result.success) {
      throw new Error(`Invalid request body: ${result.error.message}`);
    }
    return result.data as ValidatedBody;
  }

  static validateRequestData(
    method: 'get' | 'post' | 'patch' | 'delete',
    url: unknown,
    config: unknown,
    body?: unknown
  ) {
    const validatedUrl = this.validateUrl(url);

    if (method === 'get') {
      const validatedConfig = this.validateGetConfig(config);
      return { url: validatedUrl, config: validatedConfig };
    }
    if (!body) throw new Error('Request body is required for mutation methods');
    const validatedBody = this.validateBody(body);
    const validatedConfig = this.validateMutationConfig({
      ...(config as object),
      data: validatedBody,
    });
    return {
      url: validatedUrl,
      config: validatedConfig,
      body: validatedBody,
    };
  }
}
