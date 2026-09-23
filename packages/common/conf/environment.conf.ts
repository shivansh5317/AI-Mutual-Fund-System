import { createEnv } from '@t3-oss/env-core';
import dotenv from 'dotenv';
import { z } from 'zod';

const createInterfacialEnvironment = (
  runTimeEnv: Record<string, any> | null = null,
  path?: string
) => {
  if (path && runTimeEnv) {
    dotenv.config({ path });
  }

  return createEnv({
    server: {
      HTTP_SERVER_PORT: z
        .string()
        .min(4, 'Port must be at least 4 characters long')
        .max(4, 'Port must be at most 5 characters long')
        .regex(/^\d+$/, 'Port must be a number'),
      WS_SERVER_PORT: z
        .string()
        .min(4, 'Port must be at least 4 characters long')
        .max(4, 'Port must be at most 5 characters long')
        .regex(/^\d+$/, 'Port must be a number'),
      DATABASE_URL: z.string().min(10, 'Postgres Database URL is required'),
      BASE_API_ENDPOINT: z.string().min(10, 'Base API Endpoint is required'),
      PINECONE_API_KEY: z.string().min(10, 'Pinecone API Key is required'),
      PINECONE_INDEX_NAME: z.string().min(3, 'Pinecone Index Name is required'),
      OPENAI_API_KEY: z.string().optional(),
      GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(10, 'Gemini API Key is required'),
      AI_MODEL_PROVIDER: z.enum(['openai', 'gemini']).default('gemini'),
      GEMINI_MODEL: z.string().default('text-embedding-004'),
      JWT_SECRET: z.string().min(10, 'JWT Secret is required'),
    },
    clientPrefix: 'CLIENT',
    client: {
      CLIENT_ORIGIN: z.url('Invalid URL').default('http://localhost:3000'),
    },
    runtimeEnv: runTimeEnv ?? process.env,
  });
};

export { createInterfacialEnvironment };
