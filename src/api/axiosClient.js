import axios from 'axios';

/**
 * Enterprise Axios HTTP Client Setup
 */
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.koreamartuae.ae/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const currentLang = localStorage.getItem('i18nextLng') || 'en';
    config.headers['Accept-Language'] = currentLang;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected network error occurred.',
      status: error.response?.status,
      data: error.response?.data
    };
    return Promise.reject(customError);
  }
);
