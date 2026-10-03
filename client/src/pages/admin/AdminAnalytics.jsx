import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { BarChart2, PieChart as PieIcon, Award, Users, BookOpen } from 'lucide-react';
import { fetchAdminAnalytics } from '../../services/adminService';
import Card from '../../components/common/Card';
import Skeleton from '../../components/common/Skeleton';

const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchAdminAnalytics();
        if (res.success) {
          setAnalytics(res.data);
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8 text-white space-y-6">
        <Skeleton type="card" count={2} />
      </div>
    );
  }

  const { metrics, statusDistribution, topSkills, departmentDistribution } = analytics || {};

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Placement Analytics & Skill Trends</h1>
          <p className="text-slate-400 text-sm mt-1">Data insights on candidate applications, top demanded recruiter skills, and department placements</p>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Breakdown Pie Chart */}
          <Card className="p-6 bg-slate-800/80 border-slate-700/60">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-blue-400" /> Application Workflow Distribution
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution || []}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {statusDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top In-Demand Skills Bar Chart */}
          <Card className="p-6 bg-slate-800/80 border-slate-700/60">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Top Recruiter Required Skills
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSkills || []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="skill" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} name="Job Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Department Distribution Bar Chart */}
          <Card className="p-6 bg-slate-800/80 border-slate-700/60 lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Student Enrollment by Department
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentDistribution || []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="department" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff' }} />
                  <Bar dataKey="students" fill="#6366f1" radius={[6, 6, 0, 0]} name="Students Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
