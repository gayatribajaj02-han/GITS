import api from './api';

export const fetchNotificationsApi = async () => {
  return await api.get('/notifications');
};

export const markNotificationReadApi = async (id) => {
  return await api.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsReadApi = async () => {
  return await api.patch('/notifications/read-all');
};

export const sendTestAlertApi = async (payload) => {
  return await api.post('/notifications/send-test-alert', payload);
};
