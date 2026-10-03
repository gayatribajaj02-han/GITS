import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Briefcase, MapPin, Users, Calendar, Trash2, Edit3, Eye, CheckCircle2, Clock } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';

const MyJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const loadMyJobs = async () => {
    try {
      const res = await api.get('/recruiter/jobs');
      if (res.success) {
        setJobs(res.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyJobs();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedJobId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedJobId) return;
    try {
      await api.delete(`/jobs/${selectedJobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== selectedJobId));
      setDeleteModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to delete job');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Manage Job Listings</h1>
            <p className="text-slate-400 text-sm mt-1">Review active postings, track applicants, and manage hiring requirements</p>
          </div>
          <Link
            to="/recruiter/jobs/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> Post New Job
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <Skeleton type="card" count={3} />
        ) : error ? (
          <div className="bg-red-950/30 border border-red-500/30 text-red-300 p-6 rounded-2xl text-center">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">No Jobs Posted Yet</h3>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              Create your first placement job posting to start receiving student applications with automated skill match scoring.
            </p>
            <Link
              to="/recruiter/jobs/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-sm transition"
            >
              Post Job Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 rounded-2xl p-6 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-white hover:text-blue-400 transition cursor-pointer" onClick={() => navigate(`/jobs/${job._id}`)}>
                      {job.title}
                    </h3>
                    <Badge status={job.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" /> {job.location} ({job.workMode})
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> {job.jobType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" /> Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requiredSkills?.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded-md text-xs font-mono border border-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions & Applicant Counter */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                  <Link
                    to={`/recruiter/jobs/${job._id}/applicants`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-blue-400 border border-slate-700 hover:border-blue-500/50 text-xs font-semibold rounded-xl transition"
                  >
                    <Users className="w-4 h-4" />
                    View Applicants
                    <span className="px-2 py-0.5 bg-blue-600/30 text-blue-300 rounded-full font-extrabold text-[11px]">
                      {job.applicantCount || 0}
                    </span>
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/recruiter/jobs/edit/${job._id}`}
                      className="p-2 bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
                      title="Edit Job"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(job._id)}
                      className="p-2 bg-slate-900 hover:bg-red-950/50 text-slate-400 hover:text-red-400 rounded-xl border border-slate-700 hover:border-red-500/40 transition"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Job Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete this job posting? All associated candidate applications will also be permanently deleted.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold"
            >
              Delete Job
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyJobs;
