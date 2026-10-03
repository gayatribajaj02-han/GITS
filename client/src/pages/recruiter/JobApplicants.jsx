import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Sparkles, CheckCircle2, ArrowLeft, ExternalLink } from 'lucide-react';
import { fetchJobApplicantsApi } from '../../services/recruiterService';
import { updateApplicationStatusApi } from '../../services/applicationService';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const STATUS_OPTIONS = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

export default function JobApplicants() {
  const { id } = useParams();
  const [jobInfo, setJobInfo] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadApplicants = async () => {
    setLoading(true);
    try {
      const res = await fetchJobApplicantsApi(id);
      if (res.success) {
        setJobInfo(res.data.job);
        setApplicants(res.data.applicants || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, [id]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const res = await updateApplicationStatusApi(appId, newStatus);
      if (res.success) {
        setApplicants((prev) =>
          prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
        );
      }
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading applicants...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/recruiter/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600">
        <ArrowLeft className="w-4 h-4" /> Back to Recruiter Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{jobInfo?.title || 'Job Applicants'}</h1>
          <p className="text-slate-500 text-sm mt-1">
            Review applicant skill match percentages and update recruitment pipeline statuses.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          Total Candidates: <span className="text-blue-600 font-black">{applicants.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm overflow-hidden">
        {applicants.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No candidates have applied for this job opening yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Candidate</th>
                  <th className="pb-3">Academic Dept & CGPA</th>
                  <th className="pb-3">Skill Match Score</th>
                  <th className="pb-3">Applied Date</th>
                  <th className="pb-3">Current Status</th>
                  <th className="pb-3">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          {app.student?.name ? app.student.name.charAt(0) : 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{app.student?.name}</p>
                          <p className="text-[10px] text-slate-500">{app.student?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-medium text-slate-700">
                      {app.studentProfile?.department || 'IT'} • CGPA: {app.studentProfile?.cgpa || '8.0'}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                          app.matchScore >= 75
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" /> {app.matchScore}% Match
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td className="py-4">
                      <select
                        value={app.status}
                        disabled={updatingId === app._id}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4">
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          View Resume <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
