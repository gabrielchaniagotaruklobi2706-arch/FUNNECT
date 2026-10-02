import React from 'react';
import { useApp } from '../../context/AppContext';
import { FunnectLogo } from '../common/FunnectLogo';
import { GraduationCap, School, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setUserRole, setCurrentView, showToast } = useApp();

  const handleSelectRole = (role: 'student' | 'teacher') => {
    setUserRole(role);
    setCurrentView('dashboard');
    showToast(`Welcome! Logged in as ${role === 'student' ? 'Student' : 'Teacher'}.`, 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/20 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center px-4">
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <FunnectLogo size="lg" showTagline={true} />
        </div>

        {/* Headlines */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Welcome to FUNNECT
        </h1>
        <p className="text-base text-slate-600 max-w-md mx-auto">
          Ready to build something amazing? Choose how you want to explore the platform.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-3xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Card */}
          <div className="relative p-8 bg-white rounded-3xl border-2 border-slate-200/80 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">Student</h3>
                <p className="text-xs font-bold text-blue-600 mt-1">Builder & Maker</p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Learn, build and create your own projects. Follow step-by-step guides, code behaviors, and test in 3D simulator.
              </p>

              <div className="space-y-2 pt-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Interactive 3D Build Studio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Beginner-friendly Block Coding</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <span>Real-time FUNNECT Core sync</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectRole('student')}
              className="mt-8 w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg"
            >
              <span>Continue as Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Teacher Card */}
          <div className="relative p-8 bg-white rounded-3xl border-2 border-slate-200/80 hover:border-amber-500 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                <School className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-slate-900">Teacher</h3>
                <p className="text-xs font-bold text-amber-600 mt-1">Educator & Mentor</p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Create activities, assign projects and track student progress. Monitor live hardware statuses across student groups in real time.
              </p>

              <div className="space-y-2 pt-2 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>Classroom Live Kit Monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>Curriculum & Activity Builder</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>Hardware & Battery Diagnostics</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSelectRole('teacher')}
              className="mt-8 w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg"
            >
              <span>Continue as Teacher</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Back to Home link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setCurrentView('landing')}
            className="text-xs font-bold text-slate-500 hover:text-slate-700"
          >
            ← Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};
