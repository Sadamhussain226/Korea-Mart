/**
 * Centralized API Endpoints Configuration
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    REFRESH: '/auth/refresh'
  },
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id) => `/products/${id}`,
    CATEGORIES: '/products/categories'
  },
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id) => `/orders/${id}`,
    WHATSAPP: '/orders/whatsapp'
  }
};
