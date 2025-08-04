// API configuration for different environments
export const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3001',
  },
  production: {
    baseURL: 'http://localhost:3001', // Users will run backend locally
    // Alternative: You could deploy backend to Vercel/Railway and use that URL
  }
};

export const getApiBaseUrl = () => {
  const isDevelopment = import.meta.env.DEV;
  return isDevelopment ? API_CONFIG.development.baseURL : API_CONFIG.production.baseURL;
};

export const createApiUrl = (endpoint) => {
  return `${getApiBaseUrl()}${endpoint}`;
};
