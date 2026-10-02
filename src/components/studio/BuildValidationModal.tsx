import React from 'react';
import { PlacedComponent, WireConnection, BuildValidationIssue } from '../../types/builder';
import { CheckCircle2, AlertTriangle, XCircle, Wrench, ArrowRight, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BuildValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: PlacedComponent[];
  connections: WireConnection[];
  onAutoFix: (fixType: string) => void;
  onProceedToSimulate: () => void;
}

export const BuildValidationModal: React.FC<BuildValidationModalProps> = ({
  isOpen,
  onClose,
  components,
  connections,
  onAutoFix,
  onProceedToSimulate
}) => {
  if (!isOpen) return null;

  // Run validation checks on the current build
  const issues: BuildValidationIssue[] = [];

  // Check 1: FUNNECT Core
  const hasCore = components.some(c => c.isCore || c.type === 'funnect-core');
  if (!hasCore) {
    issues.push({
      id: 'no-core',
      severity: 'error',
      title: 'Missing FUNNECT Core Brain',
      message: 'Your robot has no controller installed to run code and power components.',
      suggestion: 'Add a FUNNECT Core to your workspace.',
      autoFixType: 'add-core'
    });
  }

  // Check 2: Structural components
  const sticks = components.filter(c => c.category === 'STRUCTURE');
  if (sticks.length < 2) {
    issues.push({
      id: 'weak-chassis',
      severity: 'warning',
      title: 'Structural Foundation is Minimal',
      message: 'Physical builds need craft sticks and connectors to hold components together securely.',
      suggestion: 'Add craft sticks or a cardboard base to strengthen the frame.',
      autoFixType: 'add-connectors'
    });
  }

  // Check 3: Motors & Wheels
  const motors = components.filter(c => c.type === 'dc-motor');
  const wheels = components.filter(c => c.type === 'wheel');
  if (motors.length > 0 && wheels.length < motors.length) {
    issues.push({
      id: 'missing-wheels',
      severity: 'warning',
      title: 'Motors Have No Wheels Attached',
      message: `${motors.length} motor(s) detected, but only ${wheels.length} wheel(s) found.`,
      suggestion: 'Snap rubber wheels onto the motor output shafts.',
      autoFixType: 'add-wheels'
    });
  }

  // Check 4: Motor wiring
  const unwiredMotors = motors.filter(m => !m.connectedPort);
  if (unwiredMotors.length > 0) {
    issues.push({
      id: 'unwired-motors',
      severity: 'warning',
      title: 'Motor Not Wired to Port M1/M2',
      message: `${unwiredMotors.length} motor(s) have no electrical cable connecting them to the Core.`,
      suggestion: 'Plug the motor cable into Port M1 or M2.',
      autoFixType: 'connect-motors'
    });
  }

  // Check 5: Sensors
  const sensors = components.filter(c => c.category === 'ELECTRONICS' && !c.isCore);
  const unwiredSensors = sensors.filter(s => !s.connectedPort);
  if (unwiredSensors.length > 0) {
    issues.push({
      id: 'unwired-sensors',
      severity: 'warning',
      title: 'Sensors Need Port Connection',
      message: `${unwiredSensors.map(s => s.name).join(', ')} is not wired to a sensor port.`,
      suggestion: 'Connect sensor cables to Port S1 or S2 on your FUNNECT Core.',
      autoFixType: 'wire-sensor'
    });
  }

  const isBuildReady = issues.filter(i => i.severity === 'error').length === 0;

  // Trigger celebration if 100% clean build
  if (isBuildReady && issues.length === 0) {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if unavailable
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-xs ${
                isBuildReady && issues.length === 0
                  ? 'bg-emerald-100 text-emerald-700'
                  : isBuildReady
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {isBuildReady && issues.length === 0 ? '✨' : isBuildReady ? '⚡' : '⚠️'}
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">3D Build Health Check</h2>
              <p className="text-xs text-slate-500">STEM Educational Engineering Review</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isBuildReady && issues.length === 0
                    ? 'bg-emerald-500 text-white'
                    : isBuildReady
                    ? 'bg-amber-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {isBuildReady && issues.length === 0
                  ? 'BUILD READY ✓'
                  : isBuildReady
                  ? 'BUILD OPERATIONAL ⚡'
                  : 'NEEDS ATTENTION ⚠️'}
              </span>
              <span className="text-xs text-slate-600 font-bold">
                {components.length} components · {connections.length} wires
              </span>
            </div>
          </div>
        </div>

        {/* Validation Issues & Checks List */}
        <div className="p-6 max-h-80 overflow-y-auto space-y-3">
          {issues.length === 0 ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Engineering Build is Flawless!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Core controller is in place, ports are cleanly wired, and mechanical structures are properly aligned.
                You are ready to simulate motions and physical assembly.
              </p>
            </div>
          ) : (
            issues.map(issue => (
              <div
                key={issue.id}
                className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  issue.severity === 'error'
                    ? 'bg-red-50/80 border-red-200 text-red-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {issue.severity === 'error' ? (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-extrabold text-xs">{issue.title}</div>
                      <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed">
                        {issue.message}
                      </p>
                      <div className="text-[10px] font-bold mt-1.5 opacity-75">
                        💡 Tip: {issue.suggestion}
                      </div>
                    </div>
                  </div>

                  {issue.autoFixType && (
                    <button
                      onClick={() => onAutoFix(issue.autoFixType!)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:bg-slate-50 text-slate-800 text-[11px] font-extrabold flex items-center gap-1 shrink-0 transition-all hover:scale-105"
                    >
                      <Wrench className="w-3 h-3 text-blue-600" />
                      <span>FIX IT</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
          >
            Back to Editor
          </button>

          <button
            onClick={() => {
              onClose();
              onProceedToSimulate();
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Proceed to Simulation & Code</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
