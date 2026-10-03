import api from './api';

export const applyToJobApi = async (jobId, resumeUrl) => {
  return await api.post('/applications', { jobId, resumeUrl });
};

export const fetchMyApplications = async () => {
  return await api.get('/applications/my');
};

export const fetchApplicationById = async (id) => {
  return await api.get(`/applications/${id}`);
};

export const updateApplicationStatusApi = async (id, status) => {
  return await api.patch(`/applications/${id}/status`, { status });
};

export const withdrawApplicationApi = async (id) => {
  return await api.delete(`/applications/${id}`);
};
