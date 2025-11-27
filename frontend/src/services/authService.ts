import axios from 'axios';

const API_URL = 'http://localhost:3000/auth';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your connection.';
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      error.message = 'Network error. Please make sure the backend server is running on http://localhost:3000';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post('/login', { email, password });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || !error.response) {
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 3000.');
      }
      throw error;
    }
  },

  async signup(email: string, password: string, tenantId: string) {
    try {
      const response = await api.post('/signup', { email, password, tenantId });
      return response.data;
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK' || !error.response) {
        throw new Error('Cannot connect to server. Please make sure the backend is running on port 3000.');
      }
      throw error;
    }
  },
};

