import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolClass, StudentTeam } from '../../types';
import { 
  Users, 
  PlusCircle, 
  Cpu, 
  Radio, 
  BookOpen, 
  ChevronRight, 
  ArrowRight,
  Battery,
  AlertCircle
} from 'lucide-react';

export const ClassesPage: React.FC = () => {
  const { classes, activeClass, setActiveClass, setCurrentView, showToast } = useApp();
  const [newClassName, setNewClassName] = useState('');
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  const handleCreateClass = () => {
    if (!newClassName.trim()) return;
    showToast(`Class "${newClassName}" registered!`, 'success');
    setShowAddClassModal(false);
    setNewClassName('');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-amber-600 mb-1">
              Educator Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Classroom & Hardware Kits
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage student cohorts, assign active projects, and link physical FUNNECT kits.
            </p>
          </div>

          <button
            onClick={() => setShowAddClassModal(true)}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add New Class</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Classes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map(cls => (
            <div
              key={cls.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    {cls.grade}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-2">{cls.name}</h2>
                  <p className="text-xs text-slate-500">
                    {cls.totalStudents} Students • {cls.teams.length} Active Hardware Teams
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveClass(cls);
                    setCurrentView('progress');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-xs flex items-center gap-1.5"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Live Monitor</span>
                </button>
              </div>

              {/* Teams & Kit Battery Telemetry */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700">Team Hardware Kits:</div>
                <div className="grid grid-cols-2 gap-2">
                  {cls.teams.map(team => (
                    <div
                      key={team.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-800">{team.name}</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            team.statusColor === 'green'
                              ? 'bg-emerald-500'
                              : team.statusColor === 'red'
                              ? 'bg-red-500'
                              : 'bg-amber-400'
                          }`}
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {team.students.join(', ')}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Core Kit #{team.id.replace('t', '')}</span>
                        <span className="font-mono text-slate-700 font-bold">
                          🔋 {team.batteryPercent}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Assigned: <strong>Robot Car (Curriculum 01)</strong>
                </span>
                <button
                  onClick={() => setCurrentView('activities')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Change Project Assignment →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-black text-slate-900">Add New Classroom</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Classroom Title</label>
              <input
                type="text"
                placeholder="e.g. 8th Grade STEM & Automation"
                value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddClassModal(false)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClass}
                className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold"
              >
                Save Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
