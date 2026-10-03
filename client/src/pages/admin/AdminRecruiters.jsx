import React, { useEffect, useState } from 'react';
import { Search, Building2, Globe, MapPin, Mail, Trash2 } from 'lucide-react';
import { fetchAdminRecruiters, deleteUserAdmin } from '../../services/adminService';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';

const AdminRecruiters = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState(null);

  const loadRecruiters = async () => {
    try {
      const res = await fetchAdminRecruiters();
      if (res.success) {
        setCompanies(res.data || []);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecruiters();
  }, []);

  const handleDelete = async () => {
    if (!selectedRecruiterId) return;
    try {
      await deleteUserAdmin(selectedRecruiterId);
      setCompanies((prev) => prev.filter((c) => c.recruiter?._id !== selectedRecruiterId));
      setDeleteModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to delete recruiter');
    }
  };

  const filteredCompanies = companies.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.recruiter?.name?.toLowerCase().includes(term) ||
      c.industry?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Recruiters & Companies</h1>
          <p className="text-slate-400 text-sm mt-1">Manage corporate partner accounts and recruitment leads</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by company name, recruiter, industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {loading ? (
          <Skeleton type="card" count={3} />
        ) : (
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Recruiter Lead</th>
                    <th className="px-6 py-4">Industry</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                        No recruiters found.
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((c) => (
                      <tr key={c._id} className="hover:bg-slate-700/30 transition">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-indigo-400" /> {c.name}
                          </div>
                          {c.website && (
                            <a href={c.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:underline flex items-center gap-1 mt-0.5">
                              <Globe className="w-3 h-3" /> {c.website}
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-200">{c.recruiter?.name || 'N/A'}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {c.recruiter?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{c.industry}</td>
                        <td className="px-6 py-4 text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" /> {c.location}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedRecruiterId(c.recruiter?._id);
                              setDeleteModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Recruiter Account">
        <p className="text-sm text-slate-300">Are you sure you want to delete this recruiter account and all their posted job listings?</p>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs">
            Cancel
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold">
            Delete Recruiter
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminRecruiters;
