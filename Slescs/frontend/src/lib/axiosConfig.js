import axios from 'axios';
import { useAuthStore } from '../store/slices/auth-slice';

const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || 'https://seed-auth.onrender.com/api/v1.0';
const MAIN_BASE_URL = import.meta.env.VITE_MAIN_API_BASE_URL || 'https://seed-cert-and-tracking.onrender.com/seed_cert_and_tracking';

const authAxios = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const mainAxios = axios.create({
  baseURL: MAIN_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


const createRequestInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const { accessToken } = useAuthStore.getState();
      
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
};


const createResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const refreshSuccess = await useAuthStore.getState().refreshAccessToken();
        
        if (refreshSuccess) {

          const newToken = useAuthStore.getState().accessToken;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } else {

          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
      }
      
      return Promise.reject(error);
    }
  );
};

createRequestInterceptor(authAxios);
createRequestInterceptor(mainAxios);
createResponseInterceptor(authAxios);
createResponseInterceptor(mainAxios);

export { authAxios, mainAxios };