import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor để gắn token nếu có
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

// Helper functions
export const getPage = (slug) => API.get(`/pages/${slug}`);
export const getAllPages = () => API.get('/pages');
export const savePage = (data) => API.post('/pages', data);
export const deletePage = (slug) => API.delete(`/pages/${slug}`);

export const getMenu = (name) => API.get(`/menu/${name}`);
export const saveMenu = (data) => API.post('/menu', data);

export const getSetting = (key) => API.get(`/settings/${key}`);
export const saveSetting = (data) => API.post('/settings', data);

export const login = (email, password) => API.post('/auth/login', { email, password });

export const getProducts = () => API.get('/products');
export const getProduct = (slug) => API.get(`/products/${slug}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (slug, data) => API.put(`/products/${slug}`, data);
export const deleteProduct = (slug) => API.delete(`/products/${slug}`);

export const getProjects = () => API.get('/projects');
export const getProject = (slug) => API.get(`/projects/${slug}`);
export const createProject = (data) => API.post('/projects', data);
export const updateProject = (slug, data) => API.put(`/projects/${slug}`, data);
export const deleteProject = (slug) => API.delete(`/projects/${slug}`);