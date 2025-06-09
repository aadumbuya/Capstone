import { mainAxios } from '../lib/axiosConfig';
import { authAxios } from '../lib/axiosConfig';

export const userService = {
  getUserRole: async (username) => {
    try {
      const response = await mainAxios.get(`/main_get_user_record/${username}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.data?.msg === "RECORD NOT FOUND") {
        return null;
      }
      throw error;
    }
  }, 

  updateUserLabel: async (username, label) => {
    const response = await mainAxios.post('/main_user_record', {
      username,
      data: { label }    
    });
    return response.data;
  },  

  getAllUserData: async (username) => {
    try {
      const userRoleResponse = await mainAxios.get(`/main_get_user_record/${username}`);     
      const userInfoResponse = await authAxios.get(`/get_user_all_info/${username}`);

      return {
        ...userInfoResponse.data.msg,
        ...userRoleResponse.data.msg,
      };
    } catch (error) {
      throw error;
    }
  },  
  updateUserInfo: async (username, userData) => {
    try {
      const payload = {
        username: username,
        ...userData 
      };
      const response = await authAxios.post(`/edit_user_info_only`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUserRecord: async (username, data) => {
    try {
      console.log("API payload for main_user_record:", {
        username,
        data
      });
      const response = await mainAxios.post('/main_user_record', {
        username,
        data
      });
      console.log("Response from main_user_record:", response.data);
      return response.data;
    } catch (error) {
      throw error;
    } 
  },  
  updateUserProfile: async (username, profileData) => {
    try {
      const mainData = {
        phone_number: profileData.phoneNumber,
        location: profileData.location,
      };
      console.log("Sending to updateUserRecord:", username, mainData);
      await userService.updateUserRecord(username, mainData);

      const authData = {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        email: profileData.email
      };
      console.log("Sending to updateUserInfo:", username, authData);
      await userService.updateUserInfo(username, authData);    
      return await userService.getAllUserData(username);
    } catch (error) {
      throw error;
    }
  },
  generateApiKey: async (username) => {
    const response = await mainAxios.post('/api_key_generation', {owner: username })
    return response.data
  },
  removeApiKey: async (username) => {
    const response = await mainAxios.post('/api_key_delete', {owner: username}, {username: username})
    return response.data
  }
};