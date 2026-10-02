import React from 'react';
import { useApp } from '../../context/AppContext';
import { FunnectProject, PortId, FunnectModule } from '../../types';
import { FUNNECT_PROJECTS } from '../../data/funnectData';
import { 
  PlusCircle, 
  ArrowRight, 
  Play, 
  BookOpen, 
  Boxes, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Users, 
  BarChart3, 
  Layers,
  ChevronRight,
  HelpCircle,
  Radio
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    userRole, 
    projects, 
    selectedProject, 
    setSelectedProject, 
    setCurrentView, 
    allModules, 
    coreDevice,
    classes,
    resolveTeamIssue,
    createNewProject
  } = useApp();

  const currentProj = selectedProject || projects[0] || FUNNECT_PROJECTS[0];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Top Welcome Bar */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-1">
              <span>{userRole === 'student' ? 'Student Workspace' : 'Educator Portal'}</span>
              <span>•</span>
              <span className="text-slate-400">FUNNECT Studio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {userRole === 'student' ? 'Hi, Builder! 👋' : 'Good morning, Teacher! 👩‍🏫'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {userRole === 'student'
                ? "Let's connect some sticks and code something awesome today."
                : 'Monitor student build progress, assign activities, and resolve hardware snags.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {userRole === 'student' ? (
              <button
                onClick={() => createNewProject()}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Create New Project</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('activities')}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Create Activity</span>
                </button>
                <button
                  onClick={() => setCurrentView('progress')}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Radio className="w-4 h-4 text-emerald-600" />
                  <span>Classroom Live</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {userRole === 'student' ? (
          /* ========================================================
             STUDENT DASHBOARD
             ======================================================== */
          <>
            {/* 1. Continue Learning Hero Card */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white shadow-lg relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 text-9xl font-black pointer-events-none">
                FUNNECT
              </div>

              <div className="relative z-10 max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-extrabold text-white">
                  <span>⚡ Continue Learning</span>
                  <span>•</span>
                  <span>{currentProj.badgeEmoji} {currentProj.title}</span>
                </div>

                {(() => {
                  const steps = currentProj.buildSteps || currentProj.physicalBuildSteps || [];
                  const step = steps[2] || steps[0];
                  const title = step?.title || 'Assemble Core & Modules';
                  const instruction = step?.instruction || step?.description || 'Connect the modules to ports and test the loop in 3D simulator.';
                  return (
                    <>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Next Step: {title}
                      </h2>
                      <p className="text-sm text-blue-100 leading-relaxed">
                        {instruction}
                      </p>
                    </>
                  );
                })()}

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-200">
                    <span>Project Progress</span>
                    <span>{currentProj.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-blue-900/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${currentProj.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setCurrentView('project-guide')}
                    className="px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-xs shadow-md flex items-center gap-2 transition-all"
                  >
                    <span>Open Physical Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setCurrentView('build-studio')}
                    className="px-5 py-3 rounded-xl bg-blue-500/30 hover:bg-blue-500/50 border border-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <span>3D Build Studio</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('simulator')}
                    className="px-5 py-3 rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300 font-extrabold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Simulator</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Three Main Columns: My Projects, Module Inventory, Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Projects Overview */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-black text-slate-900">My Projects</h2>
                  </div>
                  <button
                    onClick={() => setCurrentView('my-projects')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    View all ({projects.length}) →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.slice(0, 4).map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProject(p);
                        setCurrentView('build-studio');
                      }}
                      className={`p-5 rounded-3xl bg-white border transition-all cursor-pointer hover:shadow-md ${
                        selectedProject.id === p.id
                          ? 'border-blue-500 ring-2 ring-blue-100'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{p.badgeEmoji}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                            p.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base mb-1">{p.title}</h3>
                      <p className="text-xs text-slate-500 mb-4 line-clamp-2">{p.subtitle}</p>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                          <span>Progress</span>
                          <span>{p.progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${p.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Edited {p.lastEdited}</span>
                        <span className="font-bold text-blue-600 flex items-center gap-1">
                          Resume <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Tutorial Callout */}
                <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-200/80 flex items-center justify-center text-2xl shrink-0">
                      💡
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        New Tutorial: Ultrasonic Obstacle Avoidance
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Learn how to read distance values from S1 and steer DC Motors to navigate mazes.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentView('learn')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-sm shrink-0"
                  >
                    Start Lesson
                  </button>
                </div>
              </div>

              {/* Right Column: Hardware Status & Recent Activity */}
              <div className="lg:col-span-4 space-y-6">
                {/* FUNNECT Core & Component Ports */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-blue-600" />
                      <h3 className="font-black text-slate-900 text-sm">Hardware Components</h3>
                    </div>
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        coreDevice.connected ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                    />
                  </div>

                  <p className="text-xs text-slate-500">
                    Ports mapped for <strong>{currentProj.title}</strong>:
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(coreDevice.ports).map(([portKey, mod]) => {
                      const m = mod as FunnectModule | null;
                      return (
                        <div
                          key={portKey}
                          className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                            m
                              ? 'bg-blue-50/40 border-blue-200'
                              : 'bg-slate-50 border-slate-200/60'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-slate-800 text-[11px]">{portKey}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              {portKey.startsWith('S') ? 'Sensor' : portKey.startsWith('M') ? 'Motor' : 'Output'}
                            </span>
                          </div>
                          <div className="truncate font-bold text-slate-700 text-xs">
                            {m ? m.name : '— Empty —'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentView('build-studio')}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors text-center"
                  >
                    Configure in 3D Studio →
                  </button>
                </div>

                {/* Recent Activity Timeline */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <h3 className="font-black text-slate-900 text-sm">Recent Activity</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-3">
                      <span className="text-base">🚗</span>
                      <div>
                        <div className="font-bold text-slate-800">Robot Car edited</div>
                        <div className="text-[11px] text-slate-400">2 hours ago • Added distance sensor loop</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-base">🌱</span>
                      <div>
                        <div className="font-bold text-slate-800">Smart Irrigation completed</div>
                        <div className="text-[11px] text-slate-400">Yesterday • 100% test passed in simulator</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-base">💡</span>
                      <div>
                        <div className="font-bold text-slate-800">Smart Street Light created</div>
                        <div className="text-[11px] text-slate-400">3 days ago • Bamboo post assembled</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ========================================================
             TEACHER DASHBOARD
             ======================================================== */
          <>
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Active Classes
                </div>
                <div className="text-3xl font-black text-slate-900">{classes.length} Classes</div>
                <div className="text-xs text-slate-500">42 Students Registered</div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
                  Active Kits Online
                </div>
                <div className="text-3xl font-black text-emerald-700">12 / 12 Cores</div>
                <div className="text-xs text-slate-500">All hardware functioning</div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                  Current Project
                </div>
                <div className="text-3xl font-black text-blue-700">Robot Car</div>
                <div className="text-xs text-slate-500">Curriculum Module 01</div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
                  Need Attention
                </div>
                <div className="text-3xl font-black text-amber-700">1 Team</div>
                <div className="text-xs text-slate-500">Motor wiring check needed</div>
              </div>
            </div>

            {/* Live Classroom Overview */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-xl font-black text-slate-900">
                      Classroom Overview: {classes[0]?.name || 'FUNNECT Class'}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Live team progress and diagnostic monitoring
                  </p>
                </div>

                <button
                  onClick={() => setCurrentView('progress')}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold text-xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Open Full Classroom Monitor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Student Teams Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(classes[0]?.teams || []).map(team => (
                  <div
                    key={team.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-slate-900 text-sm">{team.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            team.statusColor === 'green'
                              ? 'bg-emerald-100 text-emerald-800'
                              : team.statusColor === 'red'
                              ? 'bg-red-100 text-red-800 animate-pulse'
                              : team.statusColor === 'blue'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {team.status}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 mb-3">
                        {(team.students || team.studentNames || []).join(', ')}
                      </div>

                      {team.activeIssue && (
                        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium mb-2 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{team.activeIssue}</span>
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                          <span>Build Progress</span>
                          <span>{team.progressPercent ?? team.buildProgress ?? 0}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${team.progressPercent ?? team.buildProgress ?? 0}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Core: {team.batteryPercent ?? team.batteryLevel ?? 100}%</span>
                      {team.activeIssue ? (
                        <button
                          onClick={() => resolveTeamIssue(team.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[11px] hover:bg-red-700 transition-colors"
                        >
                          Assist Team
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentView('progress')}
                          className="text-blue-600 font-bold hover:underline"
                        >
                          View Details →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
