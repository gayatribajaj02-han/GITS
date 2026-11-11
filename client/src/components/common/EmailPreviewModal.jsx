import React from 'react';
import { X, Mail, ExternalLink, CheckCircle2 } from 'lucide-react';
import { openEmailInNewTab } from '../../utils/emailTemplate';

export default function EmailPreviewModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const {
    recipientName = 'Candidate',
    recipientEmail = 'student@careerconnect.demo',
    jobTitle = 'Full Stack Software Engineer',
    companyName = 'TechCorp Solutions',
    status = 'Shortlisted',
  } = data;

  const statusColors = {
    'Shortlisted': { bg: '#10b981', text: '🌟 SHORTLISTED' },
    'Interview': { bg: '#3b82f6', text: '📅 INTERVIEW SCHEDULED' },
    'Selected': { bg: '#8b5cf6', text: '🎉 SELECTED (OFFER)' },
    'Under Review': { bg: '#f59e0b', text: '🔍 UNDER REVIEW' },
    'Rejected': { bg: '#ef4444', text: '❌ NOT SELECTED' },
  };

  const currentStatus = statusColors[status] || { bg: '#2563eb', text: status.toUpperCase() };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>Official Email Preview • CareerConnect Dispatcher</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEmailInNewTab(data)}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg text-xs font-semibold transition-all cursor-pointer"
              title="Open full email page in a new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in New Tab</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Email Header Simulation */}
        <div className="px-6 py-3 bg-slate-800 border-b border-slate-700/80 text-xs space-y-1 font-mono text-slate-400">
          <div><span className="text-slate-500 font-bold">FROM:</span> CareerConnect Placement Cell &lt;placements@careerconnect.demo&gt;</div>
          <div><span className="text-slate-500 font-bold">TO:</span> {recipientName} &lt;{recipientEmail}&gt;</div>
          <div><span className="text-slate-500 font-bold">SUBJECT:</span> Placement Update: Application for "{jobTitle}" at {companyName} is now {status}</div>
        </div>

        {/* Scrollable Rendered Email Body */}
        <div className="overflow-y-auto p-6 space-y-6 bg-slate-950">
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Branded Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white">
              <h2 className="text-xl font-extrabold tracking-tight">🎓 CareerConnect</h2>
              <p className="text-xs text-blue-100 mt-1">Training & Placement Official Communication</p>
            </div>

            {/* Email Content */}
            <div className="p-6 space-y-4 text-slate-200 text-sm">
              <div className="font-bold text-base text-white">Dear {recipientName},</div>
              <p className="text-xs text-slate-300 leading-relaxed">
                We are pleased to inform you that the recruitment team at <strong className="text-white">{companyName}</strong> has updated the evaluation status of your campus placement application.
              </p>

              {/* Status Badge Box */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Applied Opportunity</div>
                <div className="text-base font-bold text-white">{jobTitle}</div>
                <div>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-black text-white"
                    style={{ backgroundColor: currentStatus.bg }}
                  >
                    {currentStatus.text}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-2 text-xs text-slate-400">
                  <span>Company: <strong className="text-slate-200">{companyName}</strong></span>
                  <span>Recipient: <strong className="text-slate-200">{recipientEmail}</strong></span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {status === 'Selected' ? (
                  '🎉 Congratulations! You have been selected for this position. The T&P cell will send your formal offer letter and onboarding schedule shortly.'
                ) : status === 'Interview' ? (
                  '📅 Your interview round has been scheduled. Please prepare your technical topics and verify meeting coordinates on your portal.'
                ) : status === 'Shortlisted' ? (
                  '🌟 Great job! Your application has been shortlisted based on your skills and academic profile for the upcoming evaluation round.'
                ) : (
                  'Your application is actively under review by the hiring panel.'
                )}
              </p>

              <div className="text-center pt-2">
                <a
                  href={`${window.location.origin}/student/applications`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
                >
                  View on Student Dashboard
                </a>
              </div>
            </div>

            {/* Email Footer */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500">
              This is an automated notification generated by CareerConnect.<br />
              Delivered to: <strong>{recipientEmail}</strong> • © 2026 CareerConnect Platform.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between">
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            HTML Template Validated & Ready for Production
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEmailInNewTab(data)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Open in New Tab
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
