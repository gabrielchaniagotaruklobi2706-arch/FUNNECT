import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FunnectCanvas3D } from '../3d/FunnectCanvas3D';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Cpu, 
  Play, 
  Share2, 
  ThumbsUp, 
  Printer, 
  HelpCircle,
  Lightbulb,
  ExternalLink
} from 'lucide-react';

export const ProjectGuidePage: React.FC = () => {
  const { selectedProject, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'build-steps' | 'materials' | 'coding' | 'challenges'>('build-steps');
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const toggleStepCompleted = (stepNum: number) => {
    setCompletedSteps(prev =>
      prev.includes(stepNum) ? prev.filter(n => n !== stepNum) : [...prev, stepNum]
    );
  };

  const stages = [
    { id: 1, name: "What You'll Need", icon: '📦' },
    { id: 2, name: 'Build Frame', icon: '🪵' },
    { id: 3, name: 'Connect to Core', icon: '🧠' },
    { id: 4, name: 'Code Logic', icon: '💻' },
    { id: 5, name: 'Test & Calibrate', icon: '🚀' },
    { id: 6, name: 'Improve & Hack', icon: '⚡' },
    { id: 7, name: 'Share Project', icon: '🌟' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/80 pb-20">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-blue-600 mb-1">
                Step-by-Step Physical Guide
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>{selectedProject.badgeEmoji}</span>
                <span>{selectedProject.title}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('build-studio')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs flex items-center gap-1.5"
            >
              <span>View in 3D Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentView('simulator')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate & Code</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* 7 Curriculum Stages Banner */}
        <div className="mb-8 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between overflow-x-auto gap-2">
          {stages.map(stage => (
            <div
              key={stage.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 text-xs font-bold text-slate-700 shrink-0"
            >
              <span>{stage.icon}</span>
              <span>0{stage.id} {stage.name}</span>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Build Steps (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Physical Crafting Steps</h2>
                  <p className="text-xs text-slate-500">
                    Follow each step carefully. Check off steps as you complete them!
                  </p>
                </div>
                <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {completedSteps.length} / {(selectedProject.buildSteps || selectedProject.physicalBuildSteps || []).length} Done
                </div>
              </div>

              {/* Step Cards List */}
              <div className="space-y-4">
                {(selectedProject.buildSteps || selectedProject.physicalBuildSteps || []).map(step => {
                  const isDone = completedSteps.includes(step.stepNumber);
                  return (
                    <div
                      key={step.stepNumber}
                      onClick={() => toggleStepCompleted(step.stepNumber)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                        isDone
                          ? 'bg-emerald-50/40 border-emerald-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                              isDone
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isDone ? '✓' : `0${step.stepNumber}`}
                          </div>

                          <div className="space-y-1">
                            <h3 className="text-base font-extrabold text-slate-900">
                              {step.title}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {step.instruction || step.description}
                            </p>

                            {step.tip && (
                              <div className="mt-2 text-[11px] font-semibold text-amber-700 bg-amber-50 p-2 rounded-xl flex items-center gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                                <span>Tip: {step.tip}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => {}}
                          className="w-5 h-5 accent-emerald-600 rounded mt-1 shrink-0"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Extension Challenges */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-slate-900">Builder Challenges</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-extrabold text-slate-900">Challenge 1: Speed Tuning</div>
                  <p className="text-slate-500 leading-relaxed">
                    Can you adjust the motor speed code so the car reverses faster when the obstacle is under 10 cm?
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-extrabold text-slate-900">Challenge 2: Headlight Horn</div>
                  <p className="text-slate-500 leading-relaxed">
                    Add the Buzzer to Port O1 and beep in rhythmic pulses whenever an obstacle appears.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Preview & Bill of Materials (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* 3D Assembly Preview Box */}
            <div className="h-[360px] rounded-3xl overflow-hidden shadow-xs border border-slate-200">
              <FunnectCanvas3D className="h-full" />
            </div>

            {/* What You Need Bill of Materials */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Bill of Materials</h3>
                  <p className="text-xs text-slate-500">Items required for this build</p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {(selectedProject.materials || selectedProject.requiredMaterials || []).length} items
                </span>
              </div>

              <div className="space-y-2">
                {(selectedProject.materials || selectedProject.requiredMaterials || []).map((mat, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{mat.emoji || '📦'}</span>
                      <span className="font-bold text-slate-800">{mat.name}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-black">
                      {mat.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                <span className="font-bold">Eco-Tip:</span> Use discarded cardboard from delivery boxes and clean craft sticks. All FUNNECT electronic modules and connectors can be dismantled and reused immediately!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
