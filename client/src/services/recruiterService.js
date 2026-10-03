import api from './api';

export const fetchCompanyProfile = async () => {
  return await api.get('/recruiter/company');
};

export const updateCompanyProfileApi = async (companyData) => {
  return await api.put('/recruiter/company', companyData);
};

export const fetchRecruiterJobs = async () => {
  return await api.get('/recruiter/jobs');
};

export const fetchJobApplicantsApi = async (jobId) => {
  return await api.get(`/recruiter/jobs/${jobId}/applicants`);
};
