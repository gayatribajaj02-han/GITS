import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, Sparkles, CheckCircle2, Trash2, ArrowRight } from 'lucide-react';
import { fetchMyApplications, withdrawApplicationApi } from '../../services/applicationService';
import ApplicationProgress from '../../components/dashboard/ApplicationProgress';
import Button from '../../components/common/Button';

export default function StudentApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await fetchMyApplications();
      if (res.success) {
        setApplications(res.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      const res = await withdrawApplicationApi(appId);
      if (res.success) {
        await loadApplications();
      }
    } catch (err) {
      alert(`Withdrawal failed: ${err.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Submitted Applications</h1>
          <p className="text-slate-500 text-sm mt-1">Track status updates and recruitment stages in real-time.</p>
        </div>
        <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
          Total Applications: {applications.length}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Applications Submitted</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            You haven't applied to any placement opportunities yet. Explore available jobs and submit your profile.
          </p>
          <Link to="/jobs">
            <Button variant="primary">Browse Job Board</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-xl text-slate-900">{app.job?.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{app.job?.company?.name} • {app.job?.location}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-full border border-blue-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> {app.matchScore}% Match
                  </span>
                  {app.status === 'Applied' && (
                    <button
                      onClick={() => handleWithdraw(app._id)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Withdraw
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar Timeline */}
              <ApplicationProgress status={app.status} />

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <span>Applied on: {new Date(app.appliedAt).toLocaleDateString()}</span>
                <Link to={`/jobs/${app.job?._id}`} className="text-blue-600 font-bold flex items-center gap-1 hover:underline">
                  View Job Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
