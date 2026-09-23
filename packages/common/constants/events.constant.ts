import { createValidatedEvents } from 'helper/eventCreator.zHelper.js';
import { ISocketEvent } from '@/types/base.zType.js';

// Chat events - compile-time safety with satisfies + runtime validation + branding
export const ChatEvents = createValidatedEvents({
  'chat:message': '' as string,
  'chat:typing': '' as string,
  'chat:join-room': '' as string,
  'chat:room-message': {} as { room: string; message: string },
} satisfies ISocketEvent);

// Notification events - compile-time safety with satisfies + runtime validation + branding
export const NotificationEvents = createValidatedEvents({
  'notification:subscribe': '' as string,
  'notification:test': '' as string,
  'notification:new': {} as { title: string; message: string },
} satisfies ISocketEvent);
