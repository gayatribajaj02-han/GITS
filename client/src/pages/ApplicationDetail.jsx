import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Award,
  BookOpen
} from 'lucide-react';
import api from '../services/api';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
import ApplicationProgress from '../components/dashboard/ApplicationProgress';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const res = await api.get(`/applications/${id}`);
        if (res.success) {
          setApplication(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton type="line" count={2} />
          <Skeleton type="card" count={2} />
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-slate-900 py-16 px-4 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Application Not Found</h2>
        <p className="text-slate-400 mb-6">{error || "The application you are looking for does not exist."}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { job, student, matchScore, matchedSkills, missingSkills, status, appliedAt, resumeUrl } = application;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </button>

        {/* Application Header Card */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700/60 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
                  <Building2 className="w-6 h-6" />
                </span>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{job?.title}</h1>
                  <p className="text-blue-400 font-medium">{job?.company?.name}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <Badge status={status} size="lg" />
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Applied on {new Date(appliedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Job Overview Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 text-sm">
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">Location</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blue-400" /> {job?.location}
              </span>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">Work Mode</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <Briefcase className="w-4 h-4 text-emerald-400" /> {job?.workMode}
              </span>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">Job Type</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-400" /> {job?.jobType}
              </span>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-xs block mb-1">Salary / Stipend</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-violet-400" /> {job?.salary}
              </span>
            </div>
          </div>

          {/* Progress Tracker Component */}
          <div className="pt-4">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Application Workflow State</h3>
            <ApplicationProgress currentStatus={status} />
          </div>
        </div>

        {/* Skill Match Breakdown Card */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-700/60 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Skill Alignment Analysis</h2>
              <p className="text-sm text-slate-400">Automated match calculation based on required job skills vs candidate profile</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-blue-400">{matchScore}%</span>
              <span className="text-xs text-slate-400 block">Compatibility</span>
            </div>
          </div>

          {/* Match Score Bar */}
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                matchScore >= 80 ? 'bg-emerald-500' : matchScore >= 50 ? 'bg-blue-500' : 'bg-amber-500'
              }`}
              style={{ width: `${matchScore}%` }}
            />
          </div>

          {/* Matched & Missing Skills Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Matched Required Skills ({matchedSkills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchedSkills && matchedSkills.length > 0 ? (
                  matchedSkills.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium">
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No matched skills</span>
                )}
              </div>
            </div>

            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 space-y-3">
              <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Missing / Recommended Skills ({missingSkills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingSkills && missingSkills.length > 0 ? (
                  missingSkills.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-medium">
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Perfect Match! No missing skills.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Resume Link */}
        {resumeUrl && (
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <div>
                <h4 className="text-sm font-semibold text-white">Submitted Resume</h4>
                <p className="text-xs text-slate-400">PDF document attached with application</p>
              </div>
            </div>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition"
            >
              View Document <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;
