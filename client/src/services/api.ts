import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  async login(username: string, password: string) {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(username: string, email: string, password: string) {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/login';
  },

  getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }
};

// Services de fichiers
export const fileService = {
  async uploadFile(file: File, folderPath: string = '/') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderPath', folderPath);

    const response = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getFiles(folderPath: string = '/') {
    const response = await api.get(`/files/list?folder=${encodeURIComponent(folderPath)}`);
    return response.data;
  },

  async downloadFile(fileId: number) {
    const response = await api.get(`/files/download/${fileId}`, {
      responseType: 'blob',
    });
    return response;
  },

  async deleteFile(fileId: number) {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },

  async createFolder(name: string, parentPath: string = '/') {
    const response = await api.post('/files/folder', { name, parentPath });
    return response.data;
  },

  async getFolders(parentPath: string = '/') {
    const response = await api.get(`/files/folders?parent=${encodeURIComponent(parentPath)}`);
    return response.data;
  }
};

export default api;
