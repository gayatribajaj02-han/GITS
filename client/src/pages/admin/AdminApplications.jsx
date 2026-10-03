import React, { useEffect, useState } from 'react';
import { FileCheck, Mail, Building2, ExternalLink } from 'lucide-react';
import { fetchAdminApplications } from '../../services/adminService';
import Badge from '../../components/common/Badge';
import Skeleton from '../../components/common/Skeleton';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const res = await fetchAdminApplications();
        if (res.success) {
          setApplications(res.data || []);
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadApps();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Applications Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Audit all student applications, match scores, and hiring progression</p>
        </div>

        {loading ? (
          <Skeleton type="card" count={3} />
        ) : (
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Applied Job</th>
                    <th className="px-6 py-4">Match Score</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Applied Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                        No applications submitted yet.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-700/30 transition">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{app.student?.name || 'N/A'}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {app.student?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-blue-400">{app.job?.title}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" /> {app.job?.company?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                              app.matchScore >= 80
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : app.matchScore >= 50
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {app.matchScore}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Badge status={app.status} />
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;
