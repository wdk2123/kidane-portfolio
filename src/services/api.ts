import axios from 'axios';
import { Project, Skill, Experience, Education, BlogPost, ContactMessage, ApiResponse } from '../types';
import { projects, skills, experiences, education, blogPosts } from '../data/mockData';

/**
 * API Service Layer — FIXED CONFIGURATION
 */

// We hardcode these to ensure the connection works immediately
const API_BASE = 'https://kidane-portfolio.onrender.com/api'; 
const USE_REAL_API = true; 

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/#/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Helper: Safely handle both Paginated and non-Paginated responses
 */
function wrapResponse<T>(response: any): ApiResponse<T extends unknown[] ? T : T> {
  if (!response || !response.data) return { data: [] as any };
  
  const data = response.data;
  
  // If Django returns { "results": [...], "count": 10 }
  if (data && typeof data === 'object' && 'results' in data) {
    return {
      data: data.results,
      count: data.count,
    };
  }
  
  // If Django returns a simple list [...]
  return { data: data };
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ---- API Objects ----

export const projectApi = {
  getAll: async (): Promise<ApiResponse<Project[]>> => {
    if (!USE_REAL_API) return { data: projects, count: projects.length };
    const response = await api.get('/projects/');
    return wrapResponse<Project[]>(response);
  },
  getById: async (id: number): Promise<ApiResponse<Project>> => {
    const response = await api.get(`/projects/${id}/`);
    return { data: response.data };
  },
  getFeatured: async (): Promise<ApiResponse<Project[]>> => {
    const response = await api.get('/projects/featured/');
    return wrapResponse<Project[]>(response);
  },
  create: async (data: Partial<Project>) => api.post('/projects/', data),
  update: async (id: number, data: Partial<Project>) => api.patch(`/projects/${id}/`, data),
  remove: async (id: number) => api.delete(`/projects/${id}/`),
};

export const skillApi = {
  getAll: async (): Promise<ApiResponse<Skill[]>> => {
    if (!USE_REAL_API) return { data: skills, count: skills.length };
    const response = await api.get('/skills/');
    return wrapResponse<Skill[]>(response);
  },
  create: async (data: Partial<Skill>) => api.post('/skills/', data),
  update: async (id: number, data: Partial<Skill>) => api.patch(`/skills/${id}/`, data),
  remove: async (id: number) => api.delete(`/skills/${id}/`),
};

export const experienceApi = {
  getAll: async (): Promise<ApiResponse<Experience[]>> => {
    if (!USE_REAL_API) return { data: experiences, count: experiences.length };
    const response = await api.get('/experience/');
    return wrapResponse<Experience[]>(response);
  },
  create: async (data: Partial<Experience>) => api.post('/experience/', data),
  update: async (id: number, data: Partial<Experience>) => api.patch(`/experience/${id}/`, data),
  remove: async (id: number) => api.delete(`/experience/${id}/`),
};

export const educationApi = {
  getAll: async (): Promise<ApiResponse<Education[]>> => {
    if (!USE_REAL_API) return { data: education, count: education.length };
    const response = await api.get('/education/');
    return wrapResponse<Education[]>(response);
  },
  create: async (data: Partial<Education>) => api.post('/education/', data),
  update: async (id: number, data: Partial<Education>) => api.patch(`/education/${id}/`, data),
  remove: async (id: number) => api.delete(`/education/${id}/`),
};

export const blogApi = {
  getAll: async (): Promise<ApiResponse<BlogPost[]>> => {
    if (!USE_REAL_API) return { data: blogPosts, count: blogPosts.length };
    const response = await api.get('/blog/');
    return wrapResponse<BlogPost[]>(response);
  },
  getBySlug: async (slug: string) => {
    const response = await api.get(`/blog/?search=${slug}`);
    const data = response.data.results?.[0] || response.data;
    return { data };
  },
  getFeatured: async () => {
    const response = await api.get('/blog/featured/');
    return wrapResponse<BlogPost[]>(response);
  },
  create: async (data: Partial<BlogPost>) => api.post('/blog/', data),
  update: async (id: number, data: Partial<BlogPost>) => api.patch(`/blog/${id}/`, data),
  remove: async (id: number) => api.delete(`/blog/${id}/`),
};

export const contactApi = {
  submit: async (message: ContactMessage) => {
    const response = await api.post('/contact/', message);
    return { data: response.data, message: 'Sent!' };
  },
};

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login/', { username, password });
    const { access, refresh, user } = response.data;
    if (refresh) localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('token', access);
    return { token: access, user: user || { username, is_admin: true } };
  },
  refresh: async () => {
    const refresh = localStorage.getItem('refreshToken');
    const response = await api.post('/auth/refresh/', { refresh });
    return { token: response.data.access };
  },
};