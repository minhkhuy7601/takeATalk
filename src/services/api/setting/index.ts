import axios from 'axios';

export const updateSetting = async (data: any) => {
  return axios.post(`/api/setting`, { ...data });
};
