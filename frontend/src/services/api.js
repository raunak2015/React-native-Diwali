import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Dynamic API URL resolver for Expo Go on physical devices
const getApiUrl = () => {
  // 1. First priority: Use environment variable from .env (e.g., Render cloud URL)
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim();
  }

  // 2. Second priority: Extract live Metro host IP when running in Expo Go locally
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.developer?.manifest?.debuggerHost ||
    Constants.manifest?.debuggerHost ||
    '';

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:5000/api`;
    }
  }

  // 3. Fallback
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();
console.log('[API] Connecting to backend at:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Auth Token if available
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from AsyncStorage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        `Network error. Could not connect to server at ${API_URL}`,
      status: error.response?.status || 500,
      data: error.response?.data || null,
    };
    return Promise.reject(customError);
  }
);

export default api;
