import api from './api';

export const fetchAdminStudents = async () => {
  return await api.get('/admin/students');
};

export const fetchAdminRecruiters = async () => {
  return await api.get('/admin/recruiters');
};

export const fetchAdminUsers = async () => {
  return await api.get('/admin/users');
};

export const fetchAdminJobs = async () => {
  return await api.get('/admin/jobs');
};

export const fetchAdminApplications = async () => {
  return await api.get('/admin/applications');
};

export const fetchAdminAnalytics = async () => {
  return await api.get('/admin/analytics');
};

export const updateJobStatusAdmin = async (id, status) => {
  return await api.patch(`/admin/jobs/${id}/status`, { status });
};

export const deleteUserAdmin = async (id) => {
  return await api.delete(`/admin/users/${id}`);
};
