import React from 'react';
import { Bell, CheckCheck, Info, CheckCircle2, Clock } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import Button from '../../components/common/Button';

export default function StudentNotifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Notifications Center</h1>
            <p className="text-slate-500 text-xs">Real-time status updates and recruitment notifications.</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" icon={CheckCheck} onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
            No notifications received yet.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markAsRead(n._id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                n.isRead
                  ? 'bg-white border-slate-200/80 text-slate-700'
                  : 'bg-blue-50/50 border-blue-200 text-slate-900 ring-1 ring-blue-500/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1 font-mono">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
