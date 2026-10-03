import React, { useState, useEffect } from 'react';
import { Award, Plus, Trash2, Save, Link as LinkIcon, Code, GraduationCap, FileText, CheckCircle2 } from 'lucide-react';
import { fetchStudentProfile, updateStudentProfileApi, updateStudentSkillsApi, addStudentProjectApi, deleteStudentProjectApi } from '../../services/studentService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import ProfileCompletionBar from '../../components/student/ProfileCompletionBar';

export default function StudentProfile() {
  const { refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newSkill, setNewSkill] = useState('');
  
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
  });

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await fetchStudentProfile();
      if (res.success) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSaveBasic = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await updateStudentProfileApi(profile);
      if (res.success) {
        setProfile(res.data);
        setMessage('Profile details updated successfully!');
        await refreshProfile();
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    const updatedSkills = [...(profile.skills || []), newSkill.trim()];
    try {
      const res = await updateStudentSkillsApi(updatedSkills);
      if (res.success) {
        setProfile((prev) => ({ ...prev, skills: res.data.skills, profileCompletion: res.data.profileCompletion }));
        setNewSkill('');
        await refreshProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const updatedSkills = (profile.skills || []).filter((s) => s !== skillToRemove);
    try {
      const res = await updateStudentSkillsApi(updatedSkills);
      if (res.success) {
        setProfile((prev) => ({ ...prev, skills: res.data.skills, profileCompletion: res.data.profileCompletion }));
        await refreshProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) return;
    try {
      const techArray = newProject.technologies.split(',').map((t) => t.trim()).filter(Boolean);
      const res = await addStudentProjectApi({ ...newProject, technologies: techArray });
      if (res.success) {
        setProfile((prev) => ({ ...prev, projects: res.data }));
        setNewProject({ title: '', description: '', technologies: '', githubUrl: '' });
        await refreshProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const res = await deleteStudentProjectApi(projectId);
      if (res.success) {
        setProfile((prev) => ({ ...prev, projects: res.data }));
        await refreshProfile();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !profile) {
    return <div className="max-w-4xl mx-auto p-12 text-center text-slate-400 font-medium">Loading Student Profile...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Student Profile & Skill Tagging</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your academic credentials, technical skills, and projects.</p>
        </div>
        <ProfileCompletionBar completionPercentage={profile.profileCompletion || 0} />
      </div>

      {message && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {/* Skills Management Section */}
      <div className="bg-slate-800/80 rounded-3xl border border-slate-700/60 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-blue-400" />
          Technical & Soft Skills
        </h3>
        <p className="text-xs text-slate-400">
          Skills added here are normalized and automatically matched against job posting requirements.
        </p>

        {/* Add Skill Input */}
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            placeholder="Add skill (e.g. React, Node.js, Python, Docker)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <Button variant="primary" icon={Plus} onClick={handleAddSkill}>
            Add
          </Button>
        </div>

        {/* Skills Tag Cloud */}
        <div className="flex flex-wrap gap-2 pt-2">
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-xl text-xs font-bold"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-blue-400 hover:text-rose-400 transition-colors"
                >
                  &times;
                </button>
              </span>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No skills added yet.</p>
          )}
        </div>
      </div>

      {/* Basic Academic Profile Form */}
      <div className="bg-slate-800/80 rounded-3xl border border-slate-700/60 p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-400" />
          Academic & Personal Details
        </h3>

        <form onSubmit={handleSaveBasic} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
              <input
                type="text"
                value={profile.department || ''}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Graduation Year</label>
              <input
                type="number"
                value={profile.graduationYear || 2026}
                onChange={(e) => setProfile({ ...profile, graduationYear: parseInt(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current CGPA</label>
              <input
                type="number"
                step="0.01"
                value={profile.cgpa || 8.0}
                onChange={(e) => setProfile({ ...profile, cgpa: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">About Bio</label>
            <textarea
              rows={3}
              value={profile.about || ''}
              onChange={(e) => setProfile({ ...profile, about: e.target.value })}
              placeholder="Tell recruiters about your background and career goals..."
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Resume URL</label>
              <input
                type="text"
                value={profile.resumeUrl || ''}
                onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                placeholder="https://drive.google.com/..."
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub Profile URL</label>
              <input
                type="text"
                value={profile.githubUrl || ''}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile URL</label>
              <input
                type="text"
                value={profile.linkedinUrl || ''}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <Button type="submit" isLoading={saving} variant="primary" icon={Save}>
            Save Profile Details
          </Button>
        </form>
      </div>

      {/* Projects Section */}
      <div className="bg-slate-800/80 rounded-3xl border border-slate-700/60 p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Projects Portfolio ({profile.projects ? profile.projects.length : 0})
        </h3>

        {/* Existing Projects List */}
        <div className="space-y-4">
          {profile.projects && profile.projects.length > 0 ? (
            profile.projects.map((proj) => (
              <div key={proj._id} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/60 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm">{proj.title}</h4>
                  <p className="text-xs text-slate-300 mt-1">{proj.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {proj.technologies && proj.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-semibold border border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteProject(proj._id)}
                  className="text-slate-400 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500 italic">No projects added yet.</p>
          )}
        </div>

        {/* Add Project Form */}
        <form onSubmit={handleAddProject} className="pt-4 border-t border-slate-700/60 space-y-3 max-w-xl">
          <h4 className="text-xs font-bold text-slate-300">Add New Project</h4>
          <input
            type="text"
            required
            placeholder="Project Title"
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <textarea
            rows={2}
            required
            placeholder="Short project description..."
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Technologies used (comma separated, e.g. React, Node.js)"
            value={newProject.technologies}
            onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
            className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <Button type="submit" variant="secondary" size="sm" icon={Plus}>
            Add Project
          </Button>
        </form>
      </div>
    </div>
  );
}
