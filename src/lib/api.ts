import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
  }) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Users API
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: Record<string, unknown>) => api.post('/users', data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  getStudents: () => api.get('/users/students'),
  getLecturers: () => api.get('/users/lecturers'),
  activate: (id: string) => api.patch(`/users/${id}/activate`),
  deactivate: (id: string) => api.patch(`/users/${id}/deactivate`),
};

// Courses API
export const coursesApi = {
  getAll: () => api.get('/courses'),
  getActive: () => api.get('/courses/active'),
  getMyCourses: () => api.get('/courses/my-courses'),
  getById: (id: string) => api.get(`/courses/${id}`),
  create: (data: Record<string, unknown>) => api.post('/courses', data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/courses/${id}`, data),
  updateSyllabus: (id: string, formData: FormData) =>
    api.patch(`/courses/${id}/syllabus`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateStatus: (id: string, status: string) =>
    api.patch(`/courses/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/courses/${id}`),
  search: (query: string) => api.get(`/courses/search?q=${query}`),
};

// Enrollments API
export const enrollmentsApi = {
  getAll: () => api.get('/enrollments'),
  getMy: () => api.get('/enrollments/my-enrollments'),
  getMyCourseEnrollments: () => api.get('/enrollments/my-course-enrollments'),
  create: (courseId: string) => api.post('/enrollments', { courseId }),
  approve: (id: string) => api.patch(`/enrollments/${id}/approve`),
  reject: (id: string) => api.patch(`/enrollments/${id}/reject`),
  updateGrade: (id: string, grade: number) =>
    api.patch(`/enrollments/${id}/grade`, { grade }),
  delete: (id: string) => api.delete(`/enrollments/${id}`),
};

// Assignments API
export const assignmentsApi = {
  getAll: () => api.get('/assignments'),
  getMy: () => api.get('/assignments/my-assignments'),
  getByLecturer: () => api.get('/assignments/my-course-assignments'),
  create: (data: Record<string, unknown>) => api.post('/assignments', data),
  uploadSubmission: (id: string, formData: FormData) =>
    api.patch(`/assignments/${id}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  grade: (id: string, grade: number, feedback?: string) =>
    api.patch(`/assignments/${id}/grade`, { grade, feedback }),
  delete: (id: string) => api.delete(`/assignments/${id}`),
};

// AI API
export const aiApi = {
  getRecommendations: () => api.get('/ai/recommendations'),
  generateSyllabus: (data: {
    courseTitle: string;
    courseDescription: string;
    credits: number;
  }) => api.post('/ai/generate-syllabus', data),
  getLearningProgress: () => api.get('/ai/learning-progress'),
  getCourseInsights: () => api.get('/ai/course-insights'),
  getSystemStatus: () => api.get('/ai/system-status'),
};