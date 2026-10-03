import React, { useEffect } from 'react';
import { Bell, X, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

export default function Toast() {
  const { toastMessage, clearToast } = useNotifications();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full bg-slate-900 text-white rounded-2xl shadow-2xl border border-blue-500/30 p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl shrink-0">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-white">{toastMessage.title}</h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{toastMessage.message}</p>
        </div>
        <button
          onClick={clearToast}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
