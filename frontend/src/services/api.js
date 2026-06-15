import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000' });

export const submitKYC = (data) => API.post('/api/kyc/submit', data);
export const getApplications = (params) => API.get('/api/kyc/applications', { params });
export const reviewApplication = (id, data) => API.put(`/api/kyc/review/${id}`, data);
export const getAuditLogs = () => API.get('/api/audit/logs');
export const exportCSV = () => window.open('http://localhost:8000/api/audit/export-csv');
export const getStatistics = () => API.get('/api/kyc/statistics');
export const uploadDocuments = (id, formData) => 
API.post(`/api/kyc/upload/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const loginUser = (data) => API.post('/api/auth/login', data);

// Add token to all requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});