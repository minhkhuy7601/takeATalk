import axios from 'axios';

export const getCurrentUser = async () => {
  try {
    const currentUser = await axios.get('/api/auth/currentUser');
    return currentUser?.data;
  } catch (error) {
    return null;
  }
};

export const getListUsers = async () => {
  try {
    const listUsers = await axios.get('/api/users');
    return listUsers.data;
  } catch (error) {
    return [];
  }
};
