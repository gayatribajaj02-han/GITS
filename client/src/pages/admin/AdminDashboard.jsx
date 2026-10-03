import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, Briefcase, FileCheck, TrendingUp, ShieldAlert, ChevronRight, BarChart2 } from 'lucide-react';
import { fetchAdminAnalytics } from '../../services/adminService';
import Card from '../../components/common/Card';
import Skeleton from '../../components/common/Skeleton';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchAdminAnalytics();
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin analytics:', err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 text-white space-y-6">
        <Skeleton type="card" count={4} />
      </div>
    );
  }

  const metrics = data?.metrics || {};

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Placement Admin Control Center</h1>
            <p className="text-slate-400 text-sm mt-1">Platform overview, student management, job approvals, and analytics</p>
          </div>
          <Link
            to="/admin/analytics"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition"
          >
            <BarChart2 className="w-4 h-4" /> View Detailed Visual Analytics
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-slate-800/80 border-slate-700/60">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Students</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{metrics.totalStudents || 0}</h3>
              </div>
              <span className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
                <Users className="w-6 h-6" />
              </span>
            </div>
            <Link to="/admin/students" className="mt-4 inline-flex items-center text-xs text-blue-400 hover:underline gap-1">
              Manage Students <ChevronRight className="w-3 h-3" />
            </Link>
          </Card>

          <Card className="p-6 bg-slate-800/80 border-slate-700/60">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Recruiters & Companies</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{metrics.totalRecruiters || 0}</h3>
              </div>
              <span className="p-3 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <Building2 className="w-6 h-6" />
              </span>
            </div>
            <Link to="/admin/recruiters" className="mt-4 inline-flex items-center text-xs text-indigo-400 hover:underline gap-1">
              Manage Companies <ChevronRight className="w-3 h-3" />
            </Link>
          </Card>

          <Card className="p-6 bg-slate-800/80 border-slate-700/60">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Job Postings</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{metrics.activeJobs || 0}</h3>
              </div>
              <span className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                <Briefcase className="w-6 h-6" />
              </span>
            </div>
            <Link to="/admin/jobs" className="mt-4 inline-flex items-center text-xs text-emerald-400 hover:underline gap-1">
              Review Job Postings <ChevronRight className="w-3 h-3" />
            </Link>
          </Card>

          <Card className="p-6 bg-slate-800/80 border-slate-700/60">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Campus Placement Rate</p>
                <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{metrics.placementRate || 0}%</h3>
              </div>
              <span className="p-3 bg-amber-600/20 text-amber-400 rounded-xl border border-amber-500/30">
                <TrendingUp className="w-6 h-6" />
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-400">{metrics.selectedCandidates || 0} candidates hired</p>
          </Card>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/jobs"
            className="p-6 bg-slate-800/60 border border-slate-700/60 hover:border-blue-500/50 rounded-2xl transition group"
          >
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" /> Approve / Reject Jobs
            </h3>
            <p className="text-xs text-slate-400 mt-2">Verify recruiter job postings and check eligibility criteria</p>
          </Link>

          <Link
            to="/admin/applications"
            className="p-6 bg-slate-800/60 border border-slate-700/60 hover:border-indigo-500/50 rounded-2xl transition group"
          >
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-indigo-400" /> Platform Applications
            </h3>
            <p className="text-xs text-slate-400 mt-2">Monitor application workflow states across all departments</p>
          </Link>

          <Link
            to="/admin/analytics"
            className="p-6 bg-slate-800/60 border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl transition group"
          >
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-400" /> Skill Match Analytics
            </h3>
            <p className="text-xs text-slate-400 mt-2">Inspect high-demand skills, placement trends, and department metrics</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
