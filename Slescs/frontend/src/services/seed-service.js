import { mainAxios } from "../lib/axiosConfig"

export const seedService = {
    submitSeedReport: async (payload) => {
      try {
        const response = await mainAxios.post('/user_create_seed_report', payload);
        console.log(response.data)
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    getUserSeedReports: async (username) => {
      try {
        const response = await mainAxios.get(`/getuser_seed_reports/${username}`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    updateUserSeedReports: async (username, seedId, updateData) => {
      try {
        const response = await mainAxios.post('/user_update_delete_seed_report/update', {
          username: username,
          seed_id: seedId,
          data: updateData
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    getInspectorPendingReports: async () => {
      try {
        const response = await mainAxios.get(`/getinspector_pending_seed_reports`);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    updateInspectorSeedReports: async (reportData) => {
      try {
        const response = await mainAxios.post('inspector_update_seed_report/create', reportData)
        return response.data;
      } catch (error) {
        throw error;  
      }
    },
    lockSeed: async (username, seedId, lockedByData) => {
      try {
        const response = await mainAxios.post('/user_update_delete_seed_report/update', {
          username: username,
          seed_id: seedId,
          data: {
            lockedby: lockedByData
          }
        });
        console.log(response.data)
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    checkSeedLock: async (seedId) => {
      try {
        const response = await mainAxios.get(`/getlocked_by/${seedId}`)
        return response.data.msg;
      } catch (error) {
        throw error;
      }
    },
    
    

}