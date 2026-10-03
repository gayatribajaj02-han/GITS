import React, { useEffect, useState } from 'react';
import { Search, Trash2, Mail, Phone, ExternalLink, GraduationCap } from 'lucide-react';
import { fetchAdminStudents, deleteUserAdmin } from '../../services/adminService';
import Skeleton from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const loadStudents = async () => {
    try {
      const res = await fetchAdminStudents();
      if (res.success) {
        setStudents(res.data || []);
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async () => {
    if (!selectedUserId) return;
    try {
      await deleteUserAdmin(selectedUserId);
      setStudents((prev) => prev.filter((s) => s.user?._id !== selectedUserId));
      setDeleteModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to delete student');
    }
  };

  const filteredStudents = students.filter((s) => {
    const term = search.toLowerCase();
    return (
      s.user?.name?.toLowerCase().includes(term) ||
      s.user?.email?.toLowerCase().includes(term) ||
      s.department?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Student Directory</h1>
          <p className="text-slate-400 text-sm mt-1">Manage registered student profiles, academic CGPA, and skill sets</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, email, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Table */}
        {loading ? (
          <Skeleton type="card" count={3} />
        ) : (
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/60 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Department & Batch</th>
                    <th className="px-6 py-4">CGPA</th>
                    <th className="px-6 py-4">Skills</th>
                    <th className="px-6 py-4">Resume</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                        No students found matching search.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s._id} className="hover:bg-slate-700/30 transition">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{s.user?.name || 'N/A'}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" /> {s.user?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-200">{s.department}</div>
                          <div className="text-xs text-slate-400">Graduation Year: {s.graduationYear}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-blue-600/20 text-blue-300 font-bold rounded-lg text-xs border border-blue-500/30">
                            {s.cgpa}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {s.skills?.slice(0, 4).map((sk, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-slate-900 text-slate-300 text-[11px] rounded border border-slate-700">
                                {sk}
                              </span>
                            ))}
                            {s.skills?.length > 4 && (
                              <span className="text-[11px] text-slate-500">+{s.skills.length - 4} more</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {s.resumeUrl ? (
                            <a
                              href={s.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
                            >
                              Resume <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-500">No Resume</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedUserId(s.user?._id);
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

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Student Account">
        <p className="text-sm text-slate-300">Are you sure you want to delete this student account and remove all their application history?</p>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs">
            Cancel
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold">
            Delete Student
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminStudents;
