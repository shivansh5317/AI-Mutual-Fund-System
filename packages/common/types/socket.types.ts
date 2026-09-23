import { z } from 'zod';
import type { Brand } from './base.zType.js';

// Zod schema for valid event keys
const eventKeySchema = z
  .string()
  .regex(/^[^:]+:[^:]+$/, 'Event key must follow pattern "namespace:event"');

// Zod schema for socket events
export const socketEventSchema = z.record(eventKeySchema, z.any());

export type ISocketEvent = z.infer<typeof socketEventSchema>;

export type ValidatedSocketEvents<T> = Brand<T, 'ValidatedEvents'>;
