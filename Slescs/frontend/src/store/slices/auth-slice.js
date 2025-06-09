import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../../services/auth-service';
import { userService } from '../../services/user-service';

export const useAuthStore = create(
 persist(
   (set, get) => ({
     accessToken: null,
     refreshToken: null,
     isAuthenticated: false,
     isLoading: false,
     error: null,
     user: null,

     checkUsernameUnique: async (username) => {
      set({ isLoading: true, error: null });
      try {
        const response = await authService.uniqueUsername(username);
        return !response.msg
      } catch (error) {
        console.error('Error checking username uniqueness:', error);
        throw error;
      }
    },


    checkAuthOnStartup: async () => {
      try {
        return await get().refreshAccessToken();
      } catch (error) {
        get().logout();
        return false;
      }
    },

     
     register: async (formData) => {
       set({ isLoading: true, error: null });
       try {
         const data = await authService.register(formData);
         return data;
       } catch (error) {
         const errorMessage = error.userMessage || 'Registration failed';
         set({ error: errorMessage });
         throw error;
       } finally {
         set({ isLoading: false });
       }
     },


     
     login: async (credentials) => {
       set({ isLoading: true, error: null });
       try {
         const { access, refresh } = await authService.login(credentials);
         
         set({
           accessToken: access,
           refreshToken: refresh,
           isAuthenticated: true,
           user: { username: credentials.username }
         });
         
         localStorage.setItem('refreshToken', refresh);
         localStorage.setItem('username', credentials.username); 

         try {
           const userData = await userService.getUserRole(credentials.username);
           if (userData && userData.msg) {
             set(state => ({
               user: { 
                 ...state.user, 
                 ...userData.msg,
                 role: userData.msg.label 
               }
             }));
           }
         } catch (error) {
           console.error('Error fetching user role:', error);
         }
         return { access, refresh };
       } catch (error) {
         const errorMessage = error?.response?.data?.detail || 'Login failed';
         set({ error: errorMessage });
         throw error;
       } finally {
         set({ isLoading: false });
       }
     },


     
     refreshAccessToken: async () => {
       const refreshToken = localStorage.getItem('refreshToken');      
       if (!refreshToken) return false;
       
       try {
         const response = await authService.refreshToken(refreshToken);
         const { access, refresh } = response;
         set({
           accessToken: access,
           refreshToken: refresh,
           isAuthenticated: true
         });
         localStorage.setItem('refreshToken', refresh);
         
         await get().hydrateUserState();
         
         return true;
       } catch (error) {
         set({
           accessToken: null,
           refreshToken: null,
           isAuthenticated: false,
           user: null
         });
         localStorage.removeItem('refreshToken');
         localStorage.removeItem('username');
         return false;
       }
     },

     
     setUserRole: async (label) => {
       set({ isLoading: true, error: null });
       try {
         const { user } = get();
         const username = user?.username || localStorage.getItem('username');
         
         if (!username) {
           throw new Error('User not authenticated');
         }
         await userService.updateUserLabel(username, label);         
         const updatedUserData = await userService.getUserRole(username);
         
         if (updatedUserData?.msg) {
           set(state => ({
             user: {
               ...state.user,
               username,
               ...updatedUserData.msg,
               role: updatedUserData.msg.label
             }
           }));
         }         
         return true;
       } catch (error) {
         const errorMessage =
           error?.response?.data?.message ||
           error?.response?.data?.detail  ||
           'Failed to update user role';
         set({ error: errorMessage });
         throw error;
       } finally {
         set({ isLoading: false });
       }
     },
     
     
     logout: () => {
       set({
         accessToken: null,
         refreshToken: null,
         user: null,
         isAuthenticated: false
       });
       localStorage.removeItem('refreshToken');
       localStorage.removeItem('username');
     },
     
     clearError: () => set({ error: null }),
     
     hydrateUserState: async () => {
       const username = localStorage.getItem('username');       
       if (username) {
         try {
           const userData = await userService.getUserRole(username);
           
           if (userData && userData.msg) {
             set(state => ({
               user: {
                 ...state.user,
                 username,
                 ...userData.msg,
                 role: userData.msg.label
               }
             }));
           } else {
             set(state => ({
               user: {
                 ...state.user,
                 username
               }
             }));
           }
         } catch (error) {
           console.error('Error restoring user state:', error);
         }
       }
     }
   }),
   {
     name: 'seed-certification-auth', 
     partialize: (state) => ({
       accessToken: state.accessToken,
       refreshToken: state.refreshToken,
       isAuthenticated: state.isAuthenticated,
       user: state.user,
     }),
   }
 )
);