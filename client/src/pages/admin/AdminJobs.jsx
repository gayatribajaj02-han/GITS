import React, { useEffect, useState } from 'react';
import { Briefcase, Building2, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';
import { fetchAdminJobs, updateJobStatusAdmin } from '../../services/adminService';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      const res = await fetchAdminJobs();
      if (res.success) {
        setJobs(res.data || []);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJobStatusAdmin(jobId, newStatus);
      setJobs((prev) => prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j)));
    } catch (err) {
      alert(err.message || 'Failed to update job status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Job Approval & Management</h1>
          <p className="text-slate-400 text-sm mt-1">Review recruiter job postings, approve active status, or close postings</p>
        </div>

        {loading ? (
          <Skeleton type="card" count={3} />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-white">{job.title}</h3>
                    <Badge status={job.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-blue-400 font-semibold">
                      <Building2 className="w-3.5 h-3.5" /> {job.company?.name || 'Company'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location} ({job.workMode})
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> {job.jobType} - {job.salary}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requiredSkills?.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded text-xs font-mono border border-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status Toggle buttons */}
                <div className="flex items-center gap-2">
                  {job.status !== 'active' && (
                    <button
                      onClick={() => handleStatusChange(job._id, 'active')}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve & Activate
                    </button>
                  )}
                  {job.status !== 'closed' && (
                    <button
                      onClick={() => handleStatusChange(job._id, 'closed')}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
                    >
                      <Clock className="w-4 h-4" /> Close Listing
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobs;
