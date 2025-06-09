import { create } from 'zustand';
import { userService } from '../../services/user-service';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
    persist(
      (set, get) => ({
        userData: null,
        isLoading: false,
        error: null,

        fetchUserData: async (username) => {
          set({ isLoading: true, error: null });
          try {
            const userData = await userService.getAllUserData(username);
            set({ userData, isLoading: false });
            return userData;
          } catch (error) {
            set({ 
              error: error.message || 'Failed to fetch user data',
              isLoading: false
            });
            throw error;
          }
        },  

        getApiKey: async (username) => {
          set({ isLoading: true, error: null });
          try {
            const response = await userService.generateApiKey(username);
            const apiKey = response.msg;
            set({ apiKey, isLoading: false });
            return apiKey;
          } catch (error) {
            set({ 
              error: error.message || 'Failed to generate API key',
              isLoading: false
            });
            throw error;
          }
        },


        removeApiKey: async (username) => {
          set({ isLoading: true, error: null });
          try {
            await userService.removeApiKey(username);
            set({ apiKey: null, isLoading: false });            
            return true;
          } catch (error) {
            set({ 
              error: error.message || 'Failed to revoke API key',
              isLoading: false
            });
            throw error;
          }
        },

        updateUserProfile: async (username, profileData) => {
          set({ isLoading: true, error: null });
          try {
            await userService.updateUserProfile(username, profileData);
            const updatedData = await userService.getAllUserData(username);
            set({ 
              userData: updatedData,
              isLoading: false 
            });
            return true;
          } catch (error) {
            set({ 
              error: error.message || 'Failed to update user profile',
              isLoading: false
            });
            throw error;
          }
        },        
        clearError: () => set({ error: null }),        
        clearUserData: () => set({ userData: null })
      }),
      {
        name: 'seed-certification-user',
        partialize: (state) => ({
          userData: state.userData,
        }),
      }
    ),

  );
  