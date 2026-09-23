import {
  ISocketEvent,
  socketEventSchema,
  ValidatedSocketEvents,
} from '@/types/base.zType.js';

// Helper function to validate and brand socket events
export const createValidatedEvents = <TEvent extends ISocketEvent>(
  events: TEvent // This ensures satisfies compatibility
): ValidatedSocketEvents<TEvent> => {
  socketEventSchema.parse(events);
  return events as ValidatedSocketEvents<TEvent>;
};
