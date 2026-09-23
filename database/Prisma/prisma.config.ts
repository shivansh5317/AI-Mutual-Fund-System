import path from 'node:path';
import type { PrismaConfig } from 'prisma';
import { env } from '@repo/zod-schemas/environment/environments.z.js';

export default {
  schema: path.join('schemas', 'prisma'),
  migrations: {
    path: path.join(__dirname, 'migrations'),
  },
  datasource: {
    url: env.DATABASE_URL!,
  },
} satisfies PrismaConfig;
