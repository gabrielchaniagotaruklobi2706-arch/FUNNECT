import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FUNNECT_PROJECTS } from '../../data/funnectData';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  Award,
  PlusCircle
} from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const { classes, setCurrentView, showToast } = useApp();

  const [step, setStep] = useState<number>(1);
  const [selectedGrade, setSelectedGrade] = useState<string>('Grade 7');
  const [selectedSubject, setSelectedSubject] = useState<string>('Robotics & Physical Computing');
  const [selectedObjective, setSelectedObjective] = useState<string>(
    'Understand ultrasonic distance measurement and implement obstacle-avoidance motor steering algorithms'
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>(FUNNECT_PROJECTS[0].id);
  const [assignedClassId, setAssignedClassId] = useState<string>(classes[0].id);
  const [dueDate, setDueDate] = useState<string>('Next Friday');

  const grades = ['Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'High School'];
  const subjects = [
    'Robotics & Physical Computing',
    'Applied Science & Ecology',
    'Mechanical Engineering & Linkages',
    'Mathematics & Computational Thinking',
  ];

  const objectives = [
    'Understand ultrasonic distance measurement and implement obstacle-avoidance motor steering algorithms',
    'Investigate photovoltaic solar energy conversion and variable blade pitch aerodynamics',
    'Build closed-loop soil moisture feedback sensing and automated servo irrigation valves',
    'Explore ambient photoresistors, threshold comparators, and automated public lighting grids',
  ];

  const handleAssign = () => {
    showToast(`Activity assigned successfully to ${classes.find(c => c.id === assignedClassId)?.name}!`, 'success');
    setCurrentView('progress');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-amber-600 mb-1">
              Curriculum Alignment
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create Classroom Activity
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Step-by-step activity builder aligned to NGSS and computational thinking standards.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Step {step} of 5</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
          {/* Step 1: Select Grade */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900">1. Select Target Grade Level</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {grades.map(g => (
                  <div
                    key={g}
                    onClick={() => setSelectedGrade(g)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedGrade === g
                        ? 'border-amber-500 bg-amber-50/40 font-bold text-amber-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-sm">{g}</div>
                    <div className="text-[11px] text-slate-400 font-normal">Ages {g === 'Grade 5' ? '10-11' : g === 'Grade 6' ? '11-12' : g === 'Grade 7' ? '12-13' : '13+'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Subject */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900">2. Select STEAM Subject Domain</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subjects.map(sub => (
                  <div
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedSubject === sub
                        ? 'border-amber-500 bg-amber-50/40 font-bold text-amber-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="text-sm">{sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Learning Objective */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900">3. Select Core Learning Objective</h2>
              <div className="space-y-2.5">
                {objectives.map((obj, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedObjective(obj)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-xs ${
                      selectedObjective === obj
                        ? 'border-amber-500 bg-amber-50/40 font-bold text-amber-900'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {obj}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Select Project */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-slate-900">4. Select Guided Project</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FUNNECT_PROJECTS.map(proj => (
                  <div
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      selectedProjectId === proj.id
                        ? 'border-amber-500 bg-amber-50/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl">{proj.badgeEmoji}</span>
                    <div>
                      <div className="text-xs font-black text-slate-900">{proj.title}</div>
                      <div className="text-[11px] text-slate-500">{proj.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Assign to Class */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-black text-slate-900">5. Assign to Class & Publish</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select Target Class
                  </label>
                  <select
                    value={assignedClassId}
                    onChange={e => setAssignedClassId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.grade})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Due Date / Session
                  </label>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1.5 text-slate-700">
                <div className="font-black text-amber-900 uppercase">Activity Overview:</div>
                <div>Grade: <strong>{selectedGrade}</strong> • Subject: <strong>{selectedSubject}</strong></div>
                <div>Project: <strong>{FUNNECT_PROJECTS.find(p => p.id === selectedProjectId)?.title}</strong></div>
                <div>Class: <strong>{classes.find(c => c.id === assignedClassId)?.name}</strong></div>
              </div>
            </div>
          )}

          {/* Wizard Footer Controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              disabled={step === 1}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>

            {step < 5 ? (
              <button
                onClick={() => setStep(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleAssign}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Publish Activity to Kits</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
