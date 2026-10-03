import api from './api';

export const fetchStudentProfile = async () => {
  return await api.get('/students/profile');
};

export const updateStudentProfileApi = async (profileData) => {
  return await api.put('/students/profile', profileData);
};

export const updateStudentSkillsApi = async (skills) => {
  return await api.put('/students/skills', { skills });
};

export const addStudentProjectApi = async (projectData) => {
  return await api.post('/students/projects', projectData);
};

export const deleteStudentProjectApi = async (projectId) => {
  return await api.delete(`/students/projects/${projectId}`);
};
