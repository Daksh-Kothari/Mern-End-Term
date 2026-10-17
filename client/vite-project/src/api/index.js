import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept requests to add Authorization header from localStorage if cookie is not sent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('studyflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Intercept responses for consistent error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

export default api;
