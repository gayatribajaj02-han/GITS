import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { initSocketClient, disconnectSocket } from '../services/socket';
import api from '../services/api';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/notifications');
      if (res.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications();

      const socket = initSocketClient(user.id);

      // Listen for incoming real-time notifications
      socket.on('new_notification', (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Show toast alert
        setToastMessage({
          title: newNotif.title,
          message: newNotif.message,
          type: 'info',
        });
      });

      return () => {
        socket.off('new_notification');
      };
    } else {
      disconnectSocket();
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user?.id, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err.message);
    }
  };

  const clearToast = () => setToastMessage(null);

  const value = {
    notifications,
    unreadCount,
    toastMessage,
    markAsRead,
    markAllAsRead,
    clearToast,
    refreshNotifications: fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
