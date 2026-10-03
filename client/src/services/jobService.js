import api from './api';

export const fetchJobs = async (params = {}) => {
  return await api.get('/jobs', { params });
};

export const fetchJobById = async (id) => {
  return await api.get(`/jobs/${id}`);
};

export const createJobPosting = async (jobData) => {
  return await api.post('/jobs', jobData);
};

export const updateJobPosting = async (id, jobData) => {
  return await api.put(`/jobs/${id}`, jobData);
};

export const deleteJobPosting = async (id) => {
  return await api.delete(`/jobs/${id}`);
};

export const updateJobStatusApi = async (id, status) => {
  return await api.patch(`/jobs/${id}/status`, { status });
};

export const syncMarketJobsApi = async () => {
  return await api.post('/jobs/sync-market-jobs');
};
