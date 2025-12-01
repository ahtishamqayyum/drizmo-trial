import axios from "axios";

// Get API URL from environment variable, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const API_URL = `${API_BASE_URL}/users`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout. Please check your connection.";
    } else if (error.code === "ERR_NETWORK" || !error.response) {
      error.message =
        "Network error. Please make sure the backend server is running on http://localhost:3001";
    }
    return Promise.reject(error);
  }
);

export const userService = {
  async getAllUsers() {
    try {
      const response = await api.get("/");
      return response.data;
    } catch (error: any) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new Error(
          "Cannot connect to server. Please make sure the backend is running on port 3001."
        );
      }
      throw error;
    }
  },

  async getUserById(id: string) {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.code === "ERR_NETWORK" || !error.response) {
        throw new Error(
          "Cannot connect to server. Please make sure the backend is running on port 3001."
        );
      }
      throw error;
    }
  },
};
