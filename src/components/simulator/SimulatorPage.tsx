import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FunnectCanvas3D } from '../3d/FunnectCanvas3D';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Code2, 
  Cpu, 
  Zap, 
  Sliders, 
  Sparkles, 
  Radio, 
  CheckCircle2, 
  Copy, 
  Terminal,
  RefreshCw,
  Eye,
  Layers
} from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  const { 
    selectedProject, 
    coreDevice, 
    connectCore, 
    disconnectCore, 
    deployProject, 
    isDeploying, 
    deployProgress,
    simulation, 
    toggleSimulation, 
    setSensorValue,
    setVirtualObstacle,
    setCurrentView,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'blocks' | 'python'>('blocks');
  const [activeCategory, setActiveCategory] = useState<'events' | 'motion' | 'sensors' | 'logic' | 'sound' | 'light'>('sensors');

  // Stage & Part Isolation state for simulation inspection
  const [simStage, setSimStage] = useState<number>(4);
  const [simPartVisibility, setSimPartVisibility] = useState<{
    sticks: boolean;
    connectors: boolean;
    mechanisms: boolean;
    electronics: boolean;
    wires: boolean;
  }>({
    sticks: true,
    connectors: true,
    mechanisms: true,
    electronics: true,
    wires: true,
  });

  const toggleSimPart = (key: keyof typeof simPartVisibility) => {
    setSimPartVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyCode = () => {
    const code = selectedProject.pythonCode || selectedProject.codePreset?.sampleCode || '';
    navigator.clipboard.writeText(code);
    showToast('MicroPython code copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Workspace Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedProject.badgeEmoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900">{selectedProject.title}</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Simulator & Code
              </span>
            </div>
            <p className="text-xs text-slate-500">Live 3D Hardware Simulation & MicroPython</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Run / Stop Simulation Button */}
          <button
            onClick={toggleSimulation}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all ${
              simulation.isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {simulation.isRunning ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Simulation</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Simulation</span>
              </>
            )}
          </button>

          {/* Connect Core / Deploy to Hardware */}
          {coreDevice.connected ? (
            <button
              onClick={deployProject}
              disabled={isDeploying}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Flashing {deployProgress}%</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Deploy to Core</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={connectCore}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-sm flex items-center gap-2"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Connect Core</span>
            </button>
          )}

          <button
            onClick={() => setCurrentView('build-studio')}
            className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs"
          >
            3D Studio
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* ========================================================
            LEFT COLUMN: CODE EDITOR (lg:col-span-6)
            ======================================================== */}
        <div className="lg:col-span-6 bg-white border-r border-slate-200 flex flex-col overflow-hidden max-h-[calc(100vh-65px)]">
          {/* Tab Switcher: Blocks vs Python */}
          <div className="px-4 pt-3 pb-2 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('blocks')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'blocks'
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🧩 Block Coding
              </button>
              <button
                onClick={() => setActiveTab('python')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'python'
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🐍 MicroPython
              </button>
            </div>

            {activeTab === 'python' && (
              <button
                onClick={copyCode}
                className="text-xs font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </button>
            )}
          </div>

          {activeTab === 'blocks' ? (
            /* Scratch / Blockly Style Visual Coding View */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Block Category Toolstrip */}
              <div className="p-2 border-b border-slate-200 bg-white flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
                <button
                  onClick={() => setActiveCategory('events')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeCategory === 'events' ? 'bg-amber-100 text-amber-900' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Events
                </button>
                <button
                  onClick={() => setActiveCategory('motion')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeCategory === 'motion' ? 'bg-orange-100 text-orange-900' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Motion
                </button>
                <button
                  onClick={() => setActiveCategory('sensors')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeCategory === 'sensors' ? 'bg-blue-100 text-blue-900' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Sensors
                </button>
                <button
                  onClick={() => setActiveCategory('logic')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeCategory === 'logic' ? 'bg-purple-100 text-purple-900' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Logic
                </button>
                <button
                  onClick={() => setActiveCategory('sound')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    activeCategory === 'sound' ? 'bg-pink-100 text-pink-900' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Sound & Light
                </button>
              </div>

              {/* Block Coding Workspace Canvas */}
              <div className="flex-1 bg-[#0F172A] p-6 overflow-y-auto font-sans text-xs text-white space-y-3 select-none">
                {/* Visual Block Stack */}
                <div className="inline-block p-3.5 bg-amber-500 rounded-2xl font-bold text-slate-900 shadow-md">
                  🚀 when [FUNNECT Core power ON]
                </div>

                <div className="pl-6 space-y-2 border-l-2 border-slate-700">
                  <div className="inline-block p-3 bg-blue-600 rounded-2xl font-bold shadow-md">
                    🔁 forever:
                  </div>

                  <div className="pl-6 space-y-2 border-l-2 border-blue-500/60">
                    <div className="inline-block p-3 bg-purple-600 rounded-2xl font-bold shadow-md">
                      ❓ if &lt; [Port S1 Distance Sensor] &lt; [20 cm] &gt; then:
                    </div>

                    <div className="pl-6 space-y-2 border-l-2 border-purple-500/50">
                      <div className="inline-block p-2.5 bg-orange-500 rounded-xl font-bold shadow-sm">
                        ⚙️ set [Motor M1, M2] direction: [Reverse] speed: [40%]
                      </div>
                      <br />
                      <div className="inline-block p-2.5 bg-pink-600 rounded-xl font-bold shadow-sm">
                        🔔 set [Buzzer O1] tone: [Warning Beep 880Hz]
                      </div>
                    </div>

                    <div className="inline-block p-3 bg-purple-600 rounded-2xl font-bold shadow-md">
                      else:
                    </div>

                    <div className="pl-6 space-y-2 border-l-2 border-purple-500/50">
                      <div className="inline-block p-2.5 bg-orange-500 rounded-xl font-bold shadow-sm">
                        ⚙️ set [Motor M1, M2] direction: [Forward] speed: [85%]
                      </div>
                      <br />
                      <div className="inline-block p-2.5 bg-pink-600 rounded-xl font-bold shadow-sm">
                        💡 turn [Output O2 LED] color: [Bright Green]
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 text-slate-500 text-[11px] font-mono">
                  Tip: Changes here instantly sync to the 3D physics engine and physical Core.
                </div>
              </div>
            </div>
          ) : (
            /* MicroPython View */
            <div className="flex-1 bg-slate-950 p-6 overflow-y-auto font-mono text-xs text-emerald-400">
              <pre className="leading-relaxed whitespace-pre-wrap">
                {selectedProject.pythonCode || selectedProject.codePreset?.sampleCode || '# MicroPython script'}
              </pre>
            </div>
          )}
        </div>

        {/* ========================================================
            RIGHT COLUMN: 3D SIMULATOR & SENSORS (lg:col-span-6)
            ======================================================== */}
        <div className="lg:col-span-6 bg-slate-100 flex flex-col overflow-hidden max-h-[calc(100vh-65px)]">
          {/* Top Stage & Part Isolation Bar for Simulator */}
          <div className="px-4 py-2 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-700">Tahap Fisik:</span>
              {[
                { num: 1, label: '🪵 Sasis' },
                { num: 2, label: '📐 Rangka' },
                { num: 3, label: '⚙️ Mekanik' },
                { num: 4, label: '✨ Lengkap' },
              ].map(stg => (
                <button
                  key={stg.num}
                  type="button"
                  onClick={() => setSimStage(stg.num)}
                  className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-all ${
                    simStage === stg.num
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {stg.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => toggleSimPart('sticks')}
                className={`px-1.5 py-0.5 rounded ${simPartVisibility.sticks ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-400 line-through'}`}
              >
                Stik
              </button>
              <button
                type="button"
                onClick={() => toggleSimPart('connectors')}
                className={`px-1.5 py-0.5 rounded ${simPartVisibility.connectors ? 'bg-blue-100 text-blue-900' : 'bg-slate-200 text-slate-400 line-through'}`}
              >
                Konektor
              </button>
              <button
                type="button"
                onClick={() => toggleSimPart('mechanisms')}
                className={`px-1.5 py-0.5 rounded ${simPartVisibility.mechanisms ? 'bg-orange-100 text-orange-900' : 'bg-slate-200 text-slate-400 line-through'}`}
              >
                Penggerak
              </button>
              <button
                type="button"
                onClick={() => toggleSimPart('electronics')}
                className={`px-1.5 py-0.5 rounded ${simPartVisibility.electronics ? 'bg-cyan-100 text-cyan-900' : 'bg-slate-200 text-slate-400 line-through'}`}
              >
                Sensor
              </button>
            </div>
          </div>

          {/* Top 3D Canvas Viewport */}
          <div className="flex-1 min-h-[340px] p-3 bg-slate-200/60">
            <div className="w-full h-full rounded-3xl overflow-hidden shadow-sm border border-slate-300">
              <FunnectCanvas3D 
                className="h-full" 
                overrideProject={selectedProject} 
                assemblyStage={simStage}
                partVisibility={simPartVisibility}
              />
            </div>
          </div>

          {/* Bottom Interactive Sensor Controls */}
          <div className="bg-white border-t border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Virtual Sensor Inputs
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                Ubah masukan untuk melihat reaksi aktuator seketika
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Slider 1: Distance */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">Distance (S1)</span>
                  <span className="text-blue-600 font-extrabold">
                    {simulation.sensorValues.distance} cm
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  value={simulation.sensorValues.distance}
                  onChange={e => setSensorValue('distance', Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span className={simulation.sensorValues.distance < 20 ? 'text-red-600 font-black' : ''}>
                    {simulation.sensorValues.distance < 20 ? 'Rintangan Dekat!' : 'Obstacle Close'}
                  </span>
                  <span>Clear</span>
                </div>
              </div>

              {/* Slider 2: Ambient Light / Sun */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-700">Light / Wind (S1)</span>
                  <span className="text-amber-600 font-extrabold">
                    {simulation.sensorValues.light}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simulation.sensorValues.light}
                  onChange={e => setSensorValue('light', Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Dark / Calm (0%)</span>
                  <span>Full Sun (100%)</span>
                </div>
              </div>

              {/* Slider 3: Soil Moisture OR Earthquake Tremor Button */}
              {selectedProject.physicalBuildType === 'earthquake-detector' ? (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 space-y-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-bold text-red-900">
                    <span>Uji Gempa</span>
                    <span className="text-red-700 font-black">{simulation.sensorValues.button ? 'Guncang!' : 'Tenang'}</span>
                  </div>
                  <button
                    type="button"
                    onMouseDown={() => setSensorValue('button', true)}
                    onMouseUp={() => setSensorValue('button', false)}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-black shadow-sm"
                  >
                    ⚡ Tekan untuk Guncangan
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700">Moisture (S1)</span>
                    <span className="text-emerald-600 font-extrabold">
                      {simulation.sensorValues.moisture}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={simulation.sensorValues.moisture}
                    onChange={e => setSensorValue('moisture', Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span className={simulation.sensorValues.moisture < 30 ? 'text-red-500 font-bold' : ''}>
                      {simulation.sensorValues.moisture < 30 ? 'Dry Soil' : 'Optimal'}
                    </span>
                    <span>Wet Soil</span>
                  </div>
                </div>
              )}
            </div>

            {/* Live Actuator Telemetry Pill Bar */}
            <div className="p-3 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Motor M1/M2:</span>
                <span className="text-orange-400 font-bold">
                  {simulation.actuatorStates.motorSpeed}% ({simulation.actuatorStates.motorDirection})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Servo Angle:</span>
                <span className="text-blue-400 font-bold">{simulation.actuatorStates.servoAngle}°</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Output O2 LED:</span>
                <span
                  className="font-bold flex items-center gap-1"
                  style={{ color: simulation.actuatorStates.ledColor }}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  {simulation.actuatorStates.ledState ? 'LIT' : 'OFF'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Buzzer:</span>
                <span className="text-pink-400 font-bold">
                  {simulation.actuatorStates.buzzerActive ? 'BEEPING' : 'MUTED'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
