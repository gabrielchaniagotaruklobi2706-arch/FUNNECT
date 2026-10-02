import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FunnectProject } from '../../types';
import { FunnectCanvas3D } from '../3d/FunnectCanvas3D';
import { 
  PlusCircle, 
  Search, 
  Copy, 
  Trash2, 
  Edit3, 
  Play, 
  Box, 
  BookOpen, 
  Clock,
  Sparkles,
  Zap,
  X,
  Sliders,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const MyProjectsPage: React.FC = () => {
  const { 
    projects, 
    selectedProject, 
    setSelectedProject, 
    setCurrentView, 
    createNewProject, 
    duplicateProject, 
    deleteProject, 
    saveProject,
    resetProjectPorts,
    simulation,
    toggleSimulation,
    setSensorValue,
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Quick Simulation Modal state
  const [simModalProject, setSimModalProject] = useState<FunnectProject | null>(null);
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
    setSimPartVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenStudio = (proj: FunnectProject) => {
    setSelectedProject(proj);
    resetProjectPorts(proj);
    setCurrentView('build-studio');
  };

  const handleOpenSimulator = (proj: FunnectProject) => {
    setSelectedProject(proj);
    resetProjectPorts(proj);
    setCurrentView('simulator');
  };

  const handleOpenGuide = (proj: FunnectProject) => {
    setSelectedProject(proj);
    resetProjectPorts(proj);
    setCurrentView('project-guide');
  };

  const handleOpenQuickSim = (proj: FunnectProject) => {
    setSelectedProject(proj);
    resetProjectPorts(proj);
    setSimModalProject(proj);
    setSimStage(4);
    setSimPartVisibility({
      sticks: true,
      connectors: true,
      mechanisms: true,
      electronics: true,
      wires: true,
    });
  };

  const startRename = (proj: FunnectProject) => {
    setEditingProjectId(proj.id);
    setEditingTitle(proj.title);
  };

  const submitRename = (proj: FunnectProject) => {
    if (editingTitle.trim()) {
      saveProject({ ...proj, title: editingTitle.trim() });
    }
    setEditingProjectId(null);
  };

  // Helper to extract sticks and connector counts from materials
  const getPartsSummary = (proj: FunnectProject) => {
    const mats = proj.materials || proj.requiredMaterials || [];
    const stickMat = mats.find(m => m.name.toLowerCase().includes('stick') || m.name.toLowerCase().includes('stik'));
    const connMat = mats.find(m => m.name.toLowerCase().includes('connector') || m.name.toLowerCase().includes('konektor'));
    const elecMat = mats.filter(m => m.category === 'electronic' || m.category === 'core');

    return {
      sticks: stickMat ? stickMat.quantity : '14-18 pcs',
      connectors: connMat ? connMat.quantity : '8 pcs',
      electronicsCount: elecMat.length || 3
    };
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-blue-600 mb-1">
              Perpustakaan Proyek FUNNECT
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Proyek Saya (My Projects)</span>
              <span className="text-2xl">🚀</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Kelola rakitan 3D, simulasi kode interaktif, dan kustomisasi bagian fisik tanpa harus membuat semua stik sekaligus.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('create-project')}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md flex items-center gap-2 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Buat Proyek Baru</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Search Bar & Info Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari proyek berdasarkan judul..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors shadow-xs"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Proyek' : 'Proyek Tersedia'}
            </span>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(proj => {
            const isSelected = selectedProject.id === proj.id;
            const isEditing = editingProjectId === proj.id;
            const stepCount = (proj.buildSteps || proj.physicalBuildSteps || []).length;
            const summary = getPartsSummary(proj);

            return (
              <div
                key={proj.id}
                onClick={() => {
                  if (!isEditing) handleOpenStudio(proj);
                }}
                className={`p-6 rounded-3xl bg-white border-2 transition-all flex flex-col justify-between hover:shadow-lg cursor-pointer ${
                  isSelected ? 'border-blue-500 ring-4 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Badges & Actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-3xl shadow-xs">
                        {proj.badgeEmoji}
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 block w-fit mb-0.5">
                          {proj.category}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">
                          {proj.difficulty}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          proj.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {proj.status}
                      </span>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          duplicateProject(proj.id);
                        }}
                        title="Gandakan proyek"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteProject(proj.id);
                        }}
                        title="Hapus proyek"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Rename */}
                  {isEditing ? (
                    <div className="flex items-center gap-2 mb-2" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        className="w-full px-2 py-1 text-sm font-bold border border-blue-500 rounded-lg"
                        autoFocus
                      />
                      <button
                        onClick={() => submitRename(proj)}
                        className="px-2 py-1 text-xs font-bold bg-blue-600 text-white rounded-lg"
                      >
                        Simpan
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mb-1 group/title">
                      <h3 className="font-black text-slate-900 text-lg">{proj.title}</h3>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          startRename(proj);
                        }}
                        className="opacity-0 group-hover/title:opacity-100 text-slate-400 hover:text-blue-600 p-1"
                        title="Ganti nama"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">{proj.description || proj.subtitle}</p>

                  {/* Specific Parts & Materials Badge Breakdown */}
                  <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between font-extrabold text-slate-700">
                      <span>Bagian Fisik yang Dibutuhkan:</span>
                      <span className="text-blue-600">{proj.physicalBuildType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 font-bold">
                        🪵 {summary.sticks} Stik
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100/80 text-blue-900 font-bold">
                        🔷 {summary.connectors} Konektor
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-100/80 text-purple-900 font-bold">
                        ⚙️ {summary.electronicsCount} Modul
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>Progress Perakitan</span>
                      <span>{proj.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${proj.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="space-y-2 pt-4 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Diedit {proj.lastEdited}
                    </span>
                    <span className="font-bold text-slate-600">
                      {stepCount} Langkah Panduan
                    </span>
                  </div>

                  {/* Action Row */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleOpenQuickSim(proj)}
                      className="py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center gap-1 transition-all shadow-xs"
                      title="Uji simulasi 3D instan di halaman ini"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current text-emerald-600" />
                      <span>Quick Sim</span>
                    </button>

                    <button
                      onClick={() => handleOpenSimulator(proj)}
                      className="py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                      title="Buka simulator koding penuh"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-amber-600" />
                      <span>Simulator</span>
                    </button>

                    <button
                      onClick={() => handleOpenStudio(proj)}
                      className="py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                      title="Buka studio rancang bangun 3D"
                    >
                      <Box className="w-3.5 h-3.5 text-blue-600" />
                      <span>3D Studio</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          QUICK SIMULATION MODAL (Instant 3D Simulation with Part/Stage Control)
          ======================================================== */}
      {simModalProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-1 bg-white rounded-xl shadow-xs border border-slate-200">
                  {simModalProject.badgeEmoji}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">
                      Simulasi Cepat: {simModalProject.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                      {simModalProject.physicalBuildType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Uji coba reaksi gerak fisik dan sensor tanpa harus memuat seluruh proyek.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenSimulator(simModalProject);
                    setSimModalProject(null);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm"
                >
                  <span>Buka Simulator Penuh</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setSimModalProject(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stage Selector & Part Isolation Bar (Prevents forced all-parts) */}
            <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-700">Tahap Perakitan:</span>
                <div className="flex items-center gap-1">
                  {[
                    { num: 1, label: '1. Sasis Dasar' },
                    { num: 2, label: '2. Rangka' },
                    { num: 3, label: '3. Penggerak' },
                    { num: 4, label: '4. Lengkap' },
                  ].map(stg => (
                    <button
                      key={stg.num}
                      type="button"
                      onClick={() => setSimStage(stg.num)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
                        simStage === stg.num
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {stg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Part Visibility Toggles */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <span className="text-slate-500 mr-1 hidden md:inline">Tampilkan:</span>
                <button
                  type="button"
                  onClick={() => toggleSimPart('sticks')}
                  className={`px-2 py-0.5 rounded-md ${simPartVisibility.sticks ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-200 text-slate-400 line-through'}`}
                >
                  🪵 Stik
                </button>
                <button
                  type="button"
                  onClick={() => toggleSimPart('connectors')}
                  className={`px-2 py-0.5 rounded-md ${simPartVisibility.connectors ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-slate-200 text-slate-400 line-through'}`}
                >
                  🔷 Konektor
                </button>
                <button
                  type="button"
                  onClick={() => toggleSimPart('mechanisms')}
                  className={`px-2 py-0.5 rounded-md ${simPartVisibility.mechanisms ? 'bg-orange-100 text-orange-900 border border-orange-300' : 'bg-slate-200 text-slate-400 line-through'}`}
                >
                  ⚙️ Penggerak
                </button>
                <button
                  type="button"
                  onClick={() => toggleSimPart('electronics')}
                  className={`px-2 py-0.5 rounded-md ${simPartVisibility.electronics ? 'bg-cyan-100 text-cyan-900 border border-cyan-300' : 'bg-slate-200 text-slate-400 line-through'}`}
                >
                  📡 Sensor & Core
                </button>
                <button
                  type="button"
                  onClick={() => toggleSimPart('wires')}
                  className={`px-2 py-0.5 rounded-md ${simPartVisibility.wires ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-200 text-slate-400 line-through'}`}
                >
                  🔌 Kabel
                </button>
              </div>
            </div>

            {/* Main Modal Body */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[460px]">
              {/* Left Column: 3D Canvas Viewport */}
              <div className="lg:col-span-7 bg-slate-900 relative min-h-[360px] h-full">
                <FunnectCanvas3D 
                  className="w-full h-full"
                  overrideProject={simModalProject}
                  assemblyStage={simStage}
                  partVisibility={simPartVisibility}
                />

                <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 shadow">
                  <span className={`w-2 h-2 rounded-full ${simulation.isRunning ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                  <span>{simulation.isRunning ? 'Simulasi Aktif' : 'Simulasi Berhenti'}</span>
                </div>
              </div>

              {/* Right Column: Dynamic Sensors & Live Telemetry Controls */}
              <div className="lg:col-span-5 p-5 bg-white flex flex-col justify-between overflow-y-auto space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                      🎛️ Masukan Sensor Virtual
                    </h4>
                    <button
                      type="button"
                      onClick={toggleSimulation}
                      className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-sm transition-all ${
                        simulation.isRunning
                          ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{simulation.isRunning ? 'Jeda Simulasi' : 'Jalankan Simulasi'}</span>
                    </button>
                  </div>

                  {/* Project specific inputs */}
                  {(simModalProject.physicalBuildType === 'robot-car' ||
                    simModalProject.physicalBuildType === 'automatic-barrier') && (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Jarak Sensor Ultrasonik (S1)</span>
                        <span className="text-blue-600 font-extrabold">{simulation.sensorValues.distance} cm</span>
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
                        <span>5 cm (Bahaya / Tabrakan)</span>
                        <span>80 cm (Jalan Bebas)</span>
                      </div>
                    </div>
                  )}

                  {(simModalProject.physicalBuildType === 'windmill' ||
                    simModalProject.physicalBuildType === 'streetlight' ||
                    simModalProject.physicalBuildType === 'solar-tracker') && (
                    <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                        <span>Sensor Cahaya / Angin (S1)</span>
                        <span className="text-amber-700 font-extrabold">{simulation.sensorValues.light}%</span>
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
                        <span>Malam / Tenang (0%)</span>
                        <span>Matahari Penuh (100%)</span>
                      </div>
                    </div>
                  )}

                  {simModalProject.physicalBuildType === 'irrigation' && (
                    <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                        <span>Kelembapan Tanah (S1)</span>
                        <span className="text-blue-700 font-extrabold">{simulation.sensorValues.moisture}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={simulation.sensorValues.moisture}
                        onChange={e => setSensorValue('moisture', Number(e.target.value))}
                        className="w-full accent-cyan-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px]">
                        <span className={simulation.sensorValues.moisture < 30 ? 'text-red-600 font-bold' : 'text-slate-400'}>
                          Kering (&lt; 30%)
                        </span>
                        <span className="text-slate-400">Basah (100%)</span>
                      </div>
                    </div>
                  )}

                  {simModalProject.physicalBuildType === 'earthquake-detector' && (
                    <div className="p-3 bg-red-50/80 rounded-2xl border border-red-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-red-900">
                        <span>Simulasi Getaran Seismik</span>
                        <span className="text-red-700 font-extrabold">
                          {simulation.sensorValues.button ? '💥 Getaran Terdeteksi!' : 'Normal'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onMouseDown={() => setSensorValue('button', true)}
                        onMouseUp={() => setSensorValue('button', false)}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow-sm"
                      >
                        ⚡ Tekan untuk Guncang Meja
                      </button>
                    </div>
                  )}

                  {/* Telemetry Output */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="font-extrabold text-slate-900 flex items-center justify-between">
                      <span>Respon Fisik Aktuator:</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                        Live Data
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Motor DC (M1/M2):</span>
                      <span className="font-bold text-slate-800">
                        {simulation.actuatorStates.motorSpeed}% ({simulation.actuatorStates.motorDirection})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Servo Motor (M1):</span>
                      <span className="font-bold text-blue-600">
                        {simulation.actuatorStates.servoAngle}°
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Status Lampu LED:</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: simulation.actuatorStates.ledState ? simulation.actuatorStates.ledColor : '#94A3B8' }}
                        />
                        <span className="font-bold" style={{ color: simulation.actuatorStates.ledColor }}>
                          {simulation.actuatorStates.ledState ? 'MENYALA' : 'PADAM'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Buzzer Suara:</span>
                      <span className={`font-bold ${simulation.actuatorStates.buzzerActive ? 'text-red-600' : 'text-slate-400'}`}>
                        {simulation.actuatorStates.buzzerActive ? `AKTIF (${simulation.actuatorStates.buzzerTone}Hz)` : 'SENYAP'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenSimulator(simModalProject);
                      setSimModalProject(null);
                    }}
                    className="flex-1 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Buka Editor MicroPython Penuh</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimModalProject(null)}
                    className="py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
