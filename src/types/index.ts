import type { Conversation, Message, User } from '@prisma/client';

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
  status?: 'pending' | 'success' | 'error';
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};

export type MessageType = {
  message?: string;
  image?: string;
  conversationId: string;
};
