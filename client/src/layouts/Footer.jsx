import React from 'react';
import { Briefcase, Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-extrabold text-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              CareerConnect
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Smart Student Placement & Skill Management Platform empowering students to discover ideal career opportunities, analyze skill gaps, and streamline recruitment workflows.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/jobs" className="hover:text-white transition-colors">Job Board</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Student Login</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Recruiter Registration</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Academic Project</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              5th-Semester Full Stack Development Practical Project built with React, Express, MongoDB, Socket.IO & Docker.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-800/40">
              <Github className="w-4 h-4" />
              <span>Production Ready Code</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CareerConnect Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Full Stack Practicals
          </p>
        </div>
      </div>
    </footer>
  );
}
