import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Sparkles, Target, Zap, ShieldCheck, ArrowRight, CheckCircle2, Key } from 'lucide-react';
import Button from '../components/common/Button';

export default function Home() {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 ring-1 ring-blue-600/20 text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Smart Student Placement & Skill Management Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Bridge the Gap Between <span className="text-blue-600">Student Skills</span> & Recruitment
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              Discover suitable career opportunities, track application pipelines in real-time, identify skill gaps, and streamline campus recruitment workflows.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/jobs">
                <Button size="lg" variant="primary" icon={Briefcase} className="w-full sm:w-auto shadow-lg shadow-blue-500/25">
                  Browse Opportunities
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="secondary" icon={ArrowRight} className="w-full sm:w-auto">
                  Create Profile
                </Button>
              </Link>
            </div>

            {/* Quick Demo Credentials Panel for Viva/Faculty Demonstration */}
            <div className="mt-10 p-5 bg-white rounded-2xl border border-slate-200/90 shadow-md max-w-2xl mx-auto text-left space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2">
                <Key className="w-4 h-4 text-amber-500" />
                Quick Demo Test Credentials (Click to Copy):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-sans font-bold">STUDENT:</span>
                  <span className="text-slate-800 font-bold">student@careerconnect.demo</span>
                  <span className="text-slate-500 block">Pass: password123</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-sans font-bold">RECRUITER:</span>
                  <span className="text-slate-800 font-bold">recruiter@careerconnect.demo</span>
                  <span className="text-slate-500 block">Pass: password123</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] font-sans font-bold">ADMIN:</span>
                  <span className="text-slate-800 font-bold">admin@careerconnect.demo</span>
                  <span className="text-slate-500 block">Pass: password123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Designed for Everyone in Campus Placement</h2>
          <p className="text-slate-500 text-sm">Comprehensive modules for Students, Recruiters, and Placement Administrators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Transparent Skill Matching</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Instant matching score algorithm calculating matched vs missing skills so students know exactly how to improve their readiness.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Real-Time WebSockets Alerts</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Socket.IO push notifications deliver status changes (`Shortlisted`, `Interview`, `Selected`) instantly without refreshing.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Full Placement Analytics</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Interactive Recharts analytics displaying placement rates, application status distribution, and top demanded tech skills.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
