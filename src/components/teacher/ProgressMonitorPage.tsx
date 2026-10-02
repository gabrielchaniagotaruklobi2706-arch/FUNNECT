import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentTeam, SchoolClass } from '../../types';
import { 
  Radio, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Volume2, 
  X, 
  Send, 
  Eye,
  Check,
  RotateCcw
} from 'lucide-react';

export const ProgressMonitorPage: React.FC = () => {
  const { 
    classes, 
    activeClass, 
    setActiveClass, 
    resolveTeamIssue, 
    broadcastToClass, 
    lastBroadcast,
    showToast 
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedTeamModal, setSelectedTeamModal] = useState<StudentTeam | null>(null);
  const [broadcastInput, setBroadcastInput] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const filteredTeams = activeClass.teams.filter(team => {
    if (filterStatus === 'All') return true;
    if (filterStatus === 'Need Help') return team.status === 'Need Help';
    if (filterStatus === 'Testing') return team.status === 'Testing';
    if (filterStatus === 'Coding') return team.status === 'Coding';
    if (filterStatus === 'Building') return team.status === 'Building';
    return true;
  });

  const handleSendBroadcast = () => {
    if (!broadcastInput.trim()) return;
    broadcastToClass(broadcastInput.trim());
    setBroadcastInput('');
    setShowBroadcastModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-600 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Classroom Monitor</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeClass.name} — Hardware & Build Live Grid
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Live telemetry streamed from classroom FUNNECT Cores and web editors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Class Selector Dropdown */}
            <select
              value={activeClass.id}
              onChange={e => {
                const found = classes.find(c => c.id === e.target.value);
                if (found) setActiveClass(found);
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white shadow-xs"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Broadcast Message Button */}
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>Broadcast Announcement</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Last broadcast pill if sent */}
        {lastBroadcast && (
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs text-blue-900 font-medium">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Active Broadcast on Kit Screens: <strong>"{lastBroadcast}"</strong>
              </span>
            </div>
            <span className="text-[10px] text-blue-500">Live</span>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { label: 'All Teams', val: 'All', count: activeClass.teams.length },
            {
              label: 'Need Help',
              val: 'Need Help',
              count: activeClass.teams.filter(t => t.status === 'Need Help').length,
              color: 'text-red-700 bg-red-50 border-red-200',
            },
            {
              label: 'Testing',
              val: 'Testing',
              count: activeClass.teams.filter(t => t.status === 'Testing').length,
              color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
            },
            {
              label: 'Coding',
              val: 'Coding',
              count: activeClass.teams.filter(t => t.status === 'Coding').length,
              color: 'text-blue-700 bg-blue-50 border-blue-200',
            },
            {
              label: 'Building',
              val: 'Building',
              count: activeClass.teams.filter(t => t.status === 'Building').length,
              color: 'text-amber-700 bg-amber-50 border-amber-200',
            },
          ].map(f => (
            <button
              key={f.val}
              onClick={() => setFilterStatus(f.val)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
                filterStatus === f.val
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>{f.label}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-800 text-[10px]">
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Live Teams Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTeams.map(team => (
            <div
              key={team.id}
              onClick={() => setSelectedTeamModal(team)}
              className={`p-5 rounded-3xl bg-white border-2 cursor-pointer transition-all flex flex-col justify-between hover:shadow-md ${
                team.status === 'Need Help'
                  ? 'border-red-400 ring-2 ring-red-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-slate-900 text-base">{team.name}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
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

                <div className="text-xs text-slate-500 mb-4">
                  {team.students.join(', ')}
                </div>

                {/* Active issue alert box */}
                {team.activeIssue && (
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold mb-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{team.activeIssue}</span>
                  </div>
                )}

                {/* Build Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>Project Progress</span>
                    <span>{team.progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        team.statusColor === 'green'
                          ? 'bg-emerald-500'
                          : team.statusColor === 'red'
                          ? 'bg-red-500'
                          : team.statusColor === 'blue'
                          ? 'bg-blue-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${team.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Card Telemetry */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  🔋 {team.batteryPercent}%
                </span>
                {team.activeIssue ? (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      resolveTeamIssue(team.id);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-extrabold text-[11px] hover:bg-red-700 transition-colors"
                  >
                    Resolve Issue
                  </button>
                ) : (
                  <span className="text-blue-600 font-bold flex items-center gap-1">
                    Details →
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Detail Drawer Modal */}
      {selectedTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Team Diagnostics
                </span>
                <h2 className="text-xl font-black text-slate-900">{selectedTeamModal.name}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Members: {selectedTeamModal.students.join(', ')}
                </p>
              </div>
              <button
                onClick={() => setSelectedTeamModal(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hardware Status */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="font-extrabold text-slate-900">Physical Hardware & Ports:</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400">Core Battery:</span>{' '}
                  <strong className="text-emerald-600">{selectedTeamModal.batteryPercent}%</strong>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400">Firmware:</span>{' '}
                  <strong className="font-mono text-slate-700">v2.4.1</strong>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400">Port S1:</span>{' '}
                  <strong>Distance Sensor</strong>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-400">Port M1/M2:</span>{' '}
                  <strong>Dual DC Motors</strong>
                </div>
              </div>
            </div>

            {/* If Issue present */}
            {selectedTeamModal.activeIssue && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-2">
                <div className="font-extrabold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>Reported Snag:</span>
                </div>
                <p>{selectedTeamModal.activeIssue}</p>
                <button
                  onClick={() => {
                    resolveTeamIssue(selectedTeamModal.id);
                    setSelectedTeamModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs"
                >
                  Mark Issue as Resolved
                </button>
              </div>
            )}

            {/* Time spent & Activity Submission */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Active Session Time:</span>
                <strong className="text-slate-800">38 minutes</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Simulator Iterations:</span>
                <strong className="text-slate-800">14 runs</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Physical Deploys:</span>
                <strong className="text-slate-800">3 flashes to Core</strong>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setSelectedTeamModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Announcement Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Broadcast to Class Kits</h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              This message pops up on all student computer screens and connected FUNNECT kit LCDs.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. 5 minutes left! Remember to test obstacle distance in the 3D simulator."
              value={broadcastInput}
              onChange={e => setBroadcastInput(e.target.value)}
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendBroadcast}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Broadcast</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
