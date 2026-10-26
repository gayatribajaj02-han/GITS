import api from './api';

export const loginUser = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const registerUser = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const fetchCurrentUser = async () => {
  return await api.get('/auth/me');
};

export const updateUserDetailsApi = async (details) => {
  return await api.put('/auth/update-details', details);
};

export const updatePasswordApi = async (passwords) => {
  return await api.put('/auth/update-password', passwords);
};
