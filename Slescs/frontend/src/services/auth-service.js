import { authAxios } from '../lib/axiosConfig';


export const authService = {
    register: async (formData) => {
      const response = await authAxios.post('/auth/register', formData);
      return response.data;
    },    
    login: async (credentials) => {
      const response = await authAxios.post('/auth/token', credentials);
      return response.data;
    },    
    refreshToken: async (refreshToken) => {
        const response = await authAxios.post('/auth/token/refresh', { refresh: refreshToken });
        return response.data; 
    },    
    uniqueUsername: async (username) => {
      const response = await authAxios.get(`/confirm_user/${username}`)
      return response.data
    }


}