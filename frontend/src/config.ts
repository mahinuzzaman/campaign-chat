// Frontend configuration
const environment = process.env.REACT_APP_ENVIRONMENT || 'development';

export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  environment,
  isDevelopment: environment === 'development',
  isProduction: environment === 'production',
} as const;
