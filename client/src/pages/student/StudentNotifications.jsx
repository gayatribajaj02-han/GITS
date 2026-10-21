import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Mail,
  MessageSquare,
  ExternalLink,
  Sparkles,
  Send,
  Eye,
  CheckCircle2,
  X,
  Smartphone
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { sendTestAlertApi } from '../../services/notificationService';
import Button from '../../components/common/Button';

export default function StudentNotifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();

  // Test notification modal/form states
  const [showTestForm, setShowTestForm] = useState(false);
  const [testEmail, setTestEmail] = useState('student@careerconnect.demo');
  const [testPhone, setTestPhone] = useState('9876543210');
  const [testStatus, setTestStatus] = useState('Shortlisted');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Email Preview Modal
  const [previewModalUrl, setPreviewModalUrl] = useState(null);

  const handleSendTestNotification = async (e) => {
    e.preventDefault();
    setSendingTest(true);
    setTestResult(null);

    try {
      const res = await sendTestAlertApi({
        email: testEmail,
        phone: testPhone,
        name: 'Rahul Sharma',
        jobTitle: 'Full Stack Software Engineer',
        companyName: 'TechCorp Solutions',
        status: testStatus,
      });

      if (res.success) {
        setTestResult(res.data);
        if (refreshNotifications) refreshNotifications();
      }
    } catch (err) {
      alert(`Failed to send test alert: ${err.message}`);
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Multi-Channel Notifications</h1>
            <p className="text-slate-500 text-xs">
              Real-time WebSockets, Automated Email Delivery & WhatsApp Alerts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={Send}
            onClick={() => setShowTestForm(!showTestForm)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20"
          >
            {showTestForm ? 'Hide Live Tester' : '⚡ Test Email & WhatsApp Alert'}
          </Button>

          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" icon={CheckCheck} onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Live Interactive Notification Tester (Requested for Practical 8 Enhancement) */}
      {showTestForm && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white border border-slate-700 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm">Practical 8 Enhancement: Live Notification Dispatcher</h3>
            </div>
            <button
              onClick={() => setShowTestForm(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-300">
            Demonstrate live multi-channel delivery to your evaluator by testing Email and WhatsApp notifications:
          </p>

          <form onSubmit={handleSendTestNotification} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Recipient Email</label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="student@example.com"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">WhatsApp Phone (+Country)</label>
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="9876543210"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Placement Status</label>
              <select
                value={testStatus}
                onChange={(e) => setTestStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Shortlisted">🌟 Shortlisted</option>
                <option value="Interview">📅 Interview Scheduled</option>
                <option value="Selected">🎉 Selected (Offer)</option>
                <option value="Under Review">🔍 Under Review</option>
              </select>
            </div>

            <div className="sm:col-span-3 pt-2 flex items-center justify-end">
              <Button
                variant="primary"
                size="sm"
                icon={Send}
                disabled={sendingTest}
                className="bg-blue-600 hover:bg-blue-500"
              >
                {sendingTest ? 'Dispatching Notifications...' : '🚀 Trigger Live Email & WhatsApp Alert'}
              </Button>
            </div>
          </form>

          {/* Test Results Banner */}
          {testResult && (
            <div className="p-4 bg-slate-800/90 rounded-2xl border border-emerald-500/40 space-y-3 mt-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Multi-Channel Notification Successfully Dispatched!</span>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                {/* Email Preview Link */}
                <a
                  href={`http://localhost:5000/api/notifications/preview-email/6a979e5d10490118d09b7353?name=Rahul%20Sharma&email=${encodeURIComponent(
                    testEmail
                  )}&status=${encodeURIComponent(testStatus)}&job=Full%20Stack%20Software%20Engineer&company=TechCorp%20Solutions`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>📧 View Rendered HTML Email</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>

                {/* WhatsApp Chat Link */}
                <a
                  href={testResult.whatsappResult?.waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>💬 Open WhatsApp Alert (wa.me)</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
            No notifications received yet.
          </div>
        ) : (
          notifications.map((n) => {
            const emailPreviewUrl = `http://localhost:5000/api/notifications/preview-email/${n._id}`;
            const whatsappText = encodeURIComponent(`🎓 CareerConnect Placement Update: ${n.title} - ${n.message}`);
            const waLink =
              n.whatsappNotification?.waLink ||
              `https://wa.me/919876543210?text=${whatsappText}`;

            return (
              <div
                key={n._id}
                className={`p-5 rounded-2xl border transition-all ${
                  n.isRead
                    ? 'bg-white border-slate-200/80 text-slate-700'
                    : 'bg-blue-50/40 border-blue-200 text-slate-900 ring-1 ring-blue-500/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      {!n.isRead && <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>}
                      <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>

                    <div className="flex items-center gap-3 pt-2 text-[10px] text-slate-400 font-mono">
                      <span>{new Date(n.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Multi-Channel Action Buttons for Evaluator Demonstration */}
                  <div className="flex items-center gap-2 pt-2 sm:pt-0 self-start">
                    {/* View Email Button */}
                    <a
                      href={emailPreviewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-[11px] font-bold transition-all"
                      title="Preview Placement HTML Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Preview</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>

                    {/* Open WhatsApp Button */}
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-[11px] font-bold transition-all"
                      title="Open WhatsApp Alert"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Alert</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>

                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg text-xs"
                        title="Mark as Read"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
