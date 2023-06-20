import axios from 'axios';

import type { MessageType } from '@/types';

export const getMessagesByConversationId = async (conversationId: string) => {
  try {
    const messages = await axios.get(`/api/messages/${conversationId}`);
    return messages?.data;
  } catch (error) {
    return [];
  }
};
export const createNewMessage = async (data: MessageType) => {
  return axios.post(`/api/messages/newMessage`, { ...data });
};
