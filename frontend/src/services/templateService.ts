import axios from "axios";

const API_URL = "http://localhost:3001/templates";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add token to all requests
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

export interface Template {
  id: string;
  title: string;
  items?: string;
  tenantId: string;
  userId: string;
  user?: {
    id: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateData {
  title: string;
  items?: string;
}

export interface UpdateTemplateData {
  title?: string;
  items?: string;
}

export const templateService = {
  async getAllTemplates(): Promise<Template[]> {
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

  async getTemplateById(id: string): Promise<Template> {
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

  async createTemplate(data: CreateTemplateData): Promise<Template> {
    try {
      const response = await api.post("/", data);
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

  async updateTemplate(
    id: string,
    data: UpdateTemplateData
  ): Promise<Template> {
    try {
      const response = await api.patch(`/${id}`, data);
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

  async deleteTemplate(id: string): Promise<void> {
    try {
      await api.delete(`/${id}`);
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

