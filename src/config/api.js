// API configuration for different environments
export const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3001',
  },
  production: {
    // Option 1: Use hosted backend (update with your Railway/Vercel URL)
    baseURL: process.env.VITE_API_URL || 'http://localhost:3001',
    // Option 2: Use Railway URL when available
    // baseURL: 'https://your-app-name.railway.app',
    // Option 3: Use Vercel URL when available  
    // baseURL: 'https://your-app-name.vercel.app',
  }
};

export const getApiBaseUrl = () => {
  const isDevelopment = import.meta.env.DEV;
  return isDevelopment ? API_CONFIG.development.baseURL : API_CONFIG.production.baseURL;
};

export const createApiUrl = (endpoint) => {
  return `${getApiBaseUrl()}${endpoint}`;
};
