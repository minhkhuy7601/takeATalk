import axios from 'axios';

export const getListConversations = async () => {
  try {
    const conversations = await axios.get('/api/conversations');
    return conversations?.data;
  } catch (error) {
    return [];
  }
};
export const getConversationById = async (conversationId: string) => {
  try {
    const conversation = await axios.get(
      `/api/conversations/conversationId/${conversationId}`
    );
    return conversation?.data;
  } catch (error) {
    return null;
  }
};
export const createNewConversation = async (data: any) => {
  return axios.post(`/api/conversations/newConversation/`, { ...data });
};
export const deleteConversation = async (conversationId: string) => {
  return axios.delete(`/api/conversations/delete/${conversationId}`, {});
};
export const seenMessage = async (conversationId: string) => {
  return axios.post(`/api/conversations/seen/${conversationId}`);
};
