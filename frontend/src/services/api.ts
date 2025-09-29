import axios, { AxiosResponse } from 'axios';

import { config } from '../config';
import {
  ChatRequest,
  ChatResponse,
  DataSourcesResponse,
  ConnectRequest,
  ConnectResponse,
} from '../types';

// API Configuration
const API_BASE_URL = config.apiUrl;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging (only in development)
apiClient.interceptors.request.use(
  requestConfig => {
    if (config.isDevelopment) {
      console.log(
        `API Request: ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`
      );
    }
    return requestConfig;
  },
  error => {
    if (config.isDevelopment) {
      console.error('API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    if (config.isDevelopment) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  error => {
    if (config.isDevelopment) {
      console.error(
        'API Response Error:',
        error.response?.data || error.message
      );
    }
    return Promise.reject(error);
  }
);

// API Service Class
export class ApiService {
  // Chat endpoints
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response: AxiosResponse<ChatResponse> = await apiClient.post(
        '/api/chat/message',
        request
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  }

  // Data source endpoints
  static async getDataSources(): Promise<DataSourcesResponse> {
    try {
      const response: AxiosResponse<DataSourcesResponse> =
        await apiClient.get('/api/data-sources');
      return response.data;
    } catch (error) {
      console.error('Error fetching data sources:', error);
      throw new Error('Failed to fetch data sources.');
    }
  }

  static async connectDataSource(
    sourceId: string,
    credentials?: ConnectRequest
  ): Promise<ConnectResponse> {
    try {
      const response: AxiosResponse<ConnectResponse> = await apiClient.post(
        `/api/data-sources/${sourceId}/connect`,
        credentials || {}
      );
      return response.data;
    } catch (error) {
      console.error(`Error connecting to ${sourceId}:`, error);
      throw new Error(`Failed to connect to ${sourceId}. Please try again.`);
    }
  }

  static async disconnectDataSource(
    sourceId: string
  ): Promise<ConnectResponse> {
    try {
      const response: AxiosResponse<ConnectResponse> = await apiClient.delete(
        `/api/data-sources/${sourceId}/disconnect`
      );
      return response.data;
    } catch (error) {
      console.error(`Error disconnecting from ${sourceId}:`, error);
      throw new Error(`Failed to disconnect from ${sourceId}.`);
    }
  }
}

export default ApiService;
