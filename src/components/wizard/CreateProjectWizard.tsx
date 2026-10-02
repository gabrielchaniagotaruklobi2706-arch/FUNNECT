import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FunnectProject, PortId, FunnectModule } from '../../types';
import { FUNNECT_PROJECTS, FUNNECT_MODULES } from '../../data/funnectData';
import { FunnectCanvas3D, PartLabel3D, getPartLabelsForBuildType } from '../3d/FunnectCanvas3D';
import { FunnectMascot, MascotExpression } from '../common/FunnectMascot';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Cpu, 
  Box, 
  Play, 
  Sliders, 
  CheckCircle2, 
  Save, 
  RefreshCw,
  Code2,
  Boxes,
  Zap,
  Radio,
  Tag,
  Eye,
  Layers,
  Wrench,
  HelpCircle,
  Clock,
  Sparkle
} from 'lucide-react';

export const CreateProjectWizard: React.FC = () => {
  const { 
    selectedProject, 
    setSelectedProject, 
    resetProjectPorts, 
    setCurrentView, 
    allModules, 
    coreDevice, 
    attachModuleToPort, 
    deployProject, 
    isDeploying, 
    deployProgress,
    simulation,
    toggleSimulation,
    setSensorValue,
    showToast 
  } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(selectedProject.id);
  const [chosenModuleIds, setChosenModuleIds] = useState<string[]>(
    Object.values(selectedProject.defaultPortMapping).filter(Boolean) as string[]
  );

  // Step 3 3D Enhancements state
  const [show3DLabels, setShow3DLabels] = useState<boolean>(true);
  const [activeTabStep3, setActiveTabStep3] = useState<'parts' | 'bom' | 'tips'>('parts');
  const [selectedPartFrom3D, setSelectedPartFrom3D] = useState<PartLabel3D | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [checkedMaterials, setCheckedMaterials] = useState<Record<string, boolean>>({});

  // Assembly Stage & Part Isolation Filter
  const [assemblyStage, setAssemblyStage] = useState<number>(4);
  const [partVisibility, setPartVisibility] = useState<{
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

  const togglePartVisibility = (key: keyof typeof partVisibility) => {
    setPartVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const steps = [
    { number: 1, title: 'Choose Project' },
    { number: 2, title: 'Choose Components' },
    { number: 3, title: '3D & Physical Build' },
    { number: 4, title: 'Block Code' },
    { number: 5, title: 'Test in Simulator' },
    { number: 6, title: 'Save & Deploy' },
  ];

  const handleSelectTemplate = (proj: FunnectProject) => {
    setSelectedTemplateId(proj.id);
    setSelectedProject(proj);
    resetProjectPorts(proj);
    const mods = Object.values(proj.defaultPortMapping).filter(Boolean) as string[];
    setChosenModuleIds(mods);
  };

  const getModuleEmoji = (mod: FunnectModule) => {
    if (mod.category === 'INPUT') {
      if (mod.id.includes('distance')) return '📡';
      if (mod.id.includes('light')) return '☀️';
      if (mod.id.includes('temp')) return '🌡️';
      if (mod.id.includes('moisture')) return '💧';
      if (mod.id.includes('button')) return '🔘';
      return '🧭';
    }
    if (mod.category === 'MOVEMENT') {
      if (mod.id.includes('servo')) return '🦾';
      return '⚙️';
    }
    if (mod.id.includes('buzzer')) return '🔔';
    return '💡';
  };

  const toggleModuleSelection = (modId: string) => {
    setChosenModuleIds(prev => 
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinishDeploy = async () => {
    await deployProject();
    setTimeout(() => {
      setCurrentView('simulator');
    }, 1200);
  };

  const getMascotGuidance = (): { 
    expression: MascotExpression; 
    title: string; 
    speech: string; 
    tip: string;
    actionLabel?: string;
  } => {
    switch (currentStep) {
      case 1:
        return {
          expression: 'excited',
          title: 'Si FUNNY — Pemandu Kreatif',
          speech: 'Halo! Pilih salah satu dari 9 proyek robotik & mekanik ramah lingkungan di bawah ini!',
          tip: 'Semua proyek dirancang dari stik es krim, karton daur ulang, dan konektor tanpa lem beracun.',
          actionLabel: 'Pilih Proyek'
        };
      case 2:
        return {
          expression: 'helping',
          title: 'Si FUNNY — Asisten Modul',
          speech: 'Tentukan modul elektronik yang dibutuhkan. Modul otomatis disesuaikan dengan port S1-S2 dan M1-M2!',
          tip: 'S1 & S2 untuk sensor jarak/cahaya, M1 & M2 untuk motor roda/kipas, O1 & O2 untuk lampu LED & buzzer.',
          actionLabel: 'Konfigurasi Port'
        };
      case 3:
        return {
          expression: 'happy',
          title: 'Si FUNNY — Inspektur 3D',
          speech: 'Eksplorasi model 3D rakitan fisik! Klik tombol "Nama Bagian" untuk melihat nama, peran, dan tata letak setiap komponen!',
          tip: 'Kamu bisa memutar model 360°, memperbesar, atau mengklik nama benda di daftar sebelah kanan untuk mempelajari fungsinya.',
          actionLabel: 'Periksa Model 3D'
        };
      case 4:
        return {
          expression: 'thinking',
          title: 'Si FUNNY — Instruktur Koding',
          speech: 'Susun logika algoritma dengan blok visual. Setiap blok mengatur bagaimana Core merespons data sensor!',
          tip: 'Blok oranye untuk gerak motor, blok ungu untuk logika percabangan IF-ELSE.',
          actionLabel: 'Susun Logika'
        };
      case 5:
        return {
          expression: 'excited',
          title: 'Si FUNNY — Teknisi Simulator',
          speech: 'Uji coba logika kodingmu langsung di simulator 3D! Geser slider sensor untuk melihat roda dan motor bergerak real-time!',
          tip: 'Klik tombol "Run Sim" untuk menjalankan simulasi sirkuit virtual.',
          actionLabel: 'Uji Virtual'
        };
      case 6:
      default:
        return {
          expression: 'success',
          title: 'Si FUNNY — Kapten Peluncuran',
          speech: 'Luar biasa! Proyekmu siap disimpan ke perpustakaan atau diunggah langsung ke FUNNECT Core lewat Bluetooth!',
          tip: 'Kamu bisa membuka panduan bergambar langkah demi langkah kapan saja setelah proyek disimpan.',
          actionLabel: 'Deploy Firmware'
        };
    }
  };

  const mascotData = getMascotGuidance();

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Wizard Header Bar */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-blue-600 mb-1">
              Alur Pembuatan Proyek STEM
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Buat Proyek FUNNECT Baru</span>
              <span className="text-xl">✨</span>
            </h1>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 md:pb-0">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex items-center gap-1 sm:gap-2 shrink-0">
                <button
                  onClick={() => setCurrentStep(s.number)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    currentStep === s.number
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                      : currentStep > s.number
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black">
                    {currentStep > s.number ? '✓' : s.number}
                  </span>
                  <span className="hidden sm:inline">{s.title}</span>
                </button>
                {idx < steps.length - 1 && <div className="w-3 h-0.5 bg-slate-200" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* FUNNECT Mascot Guidance Card */}
        <div className="mb-6 bg-gradient-to-r from-blue-50/90 via-sky-50/70 to-amber-50/80 rounded-3xl border border-blue-200/80 p-4 sm:p-5 shadow-sm transition-all">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Mascot Avatar */}
            <div className="shrink-0 flex flex-col items-center">
              <FunnectMascot
                expression={mascotData.expression}
                size="md"
                animated={true}
                className="drop-shadow-sm"
              />
              <span className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/90 px-2 py-0.5 rounded-full border border-blue-200">
                Si FUNNY 🤖
              </span>
            </div>

            {/* Speech Content & Tips */}
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-sm font-extrabold text-slate-900">
                  {mascotData.title}
                </h3>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Langkah {currentStep} dari 6
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                "{mascotData.speech}"
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500 pt-0.5">
                <span className="text-amber-500">💡</span>
                <span className="text-[11px] font-medium text-slate-600">{mascotData.tip}</span>
              </div>
            </div>

            {/* Quick Step Action Badge */}
            <div className="hidden lg:flex flex-col items-end gap-1.5 shrink-0 pl-4 border-l border-blue-200/60">
              <span className="text-[10px] font-bold uppercase text-slate-400">Status Proyek</span>
              <div className="px-3 py-1.5 bg-white rounded-2xl shadow-sm border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="text-base">{selectedProject.badgeEmoji}</span>
                <span>{selectedProject.title}</span>
              </div>
            </div>
          </div>
        </div>
        {/* ========================================================
            STEP 1: CHOOSE PROJECT
            ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-black text-slate-900">What would you like to build?</h2>
              <p className="text-sm text-slate-500">
                Select a guided STEM project or start with an open canvas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {FUNNECT_PROJECTS.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => handleSelectTemplate(proj)}
                  className={`p-5 rounded-3xl bg-white border-2 cursor-pointer transition-all flex flex-col justify-between hover:shadow-md ${
                    selectedTemplateId === proj.id
                      ? 'border-blue-600 ring-4 ring-blue-100'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-4xl mb-3">{proj.badgeEmoji}</div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase">
                      {proj.difficulty}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-base mt-2 mb-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">{proj.durationMinutes} mins</span>
                    <span className={selectedTemplateId === proj.id ? 'text-blue-600' : 'text-slate-400'}>
                      {selectedTemplateId === proj.id ? 'Selected ✓' : 'Select'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 2: CHOOSE COMPONENTS
            ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Choose Components</h2>
              <p className="text-sm text-slate-500">
                Click modules to include in your project build. Recommended modules for{' '}
                <strong>{selectedProject.title}</strong> are pre-selected.
              </p>
            </div>

            {/* Input Modules */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-blue-600">
                INPUT MODULES (Sensors)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {FUNNECT_MODULES.filter(m => m.category === 'INPUT').map(mod => {
                  const isSelected = chosenModuleIds.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleModuleSelection(mod.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/50 border-blue-600 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{getModuleEmoji(mod)}</div>
                      <div className="text-xs font-black text-slate-900">{mod.name}</div>
                      <div className="text-[11px] text-blue-600 font-semibold mt-1">
                        Ports: {mod.compatiblePorts.join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Movement Modules */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                MOVEMENT MODULES (Motors & Servos)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {FUNNECT_MODULES.filter(m => m.category === 'MOVEMENT').map(mod => {
                  const isSelected = chosenModuleIds.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleModuleSelection(mod.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-orange-50/50 border-orange-500 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{getModuleEmoji(mod)}</div>
                      <div className="text-xs font-black text-slate-900">{mod.name}</div>
                      <div className="text-[11px] text-orange-600 font-semibold mt-1">
                        Ports: {mod.compatiblePorts.join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Output Modules */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="text-xs font-extrabold uppercase tracking-wider text-pink-600">
                OUTPUT MODULES (Lights & Sound)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {FUNNECT_MODULES.filter(m => m.category === 'OUTPUT').map(mod => {
                  const isSelected = chosenModuleIds.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => toggleModuleSelection(mod.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-pink-50/50 border-pink-500 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{getModuleEmoji(mod)}</div>
                      <div className="text-xs font-black text-slate-900">{mod.name}</div>
                      <div className="text-[11px] text-pink-600 font-semibold mt-1">
                        Ports: {mod.compatiblePorts.join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: 3D & PHYSICAL BUILD
            ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Step 3 Header & Specification Bar */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-2xl shrink-0">
                  {selectedProject.badgeEmoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Rancang Bangun 3D
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Tipe: {selectedProject.physicalBuildType}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Tingkat: {selectedProject.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    Anatomi & Struktur Fisik 3D: {selectedProject.title}
                  </h3>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setShow3DLabels(prev => !prev)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    show3DLabels
                      ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  <span>{show3DLabels ? 'Sembunyikan Label Benda' : 'Tampilkan Nama Bagian'}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
                    {getPartLabelsForBuildType(selectedProject.physicalBuildType).length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('project-guide')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <Wrench className="w-4 h-4 text-blue-600" />
                  <span>Buku Panduan Rakit →</span>
                </button>
              </div>
            </div>

            {/* Step 3: Assembly Stage & Part Control Bar (Prevents rendering all parts forced at once) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-blue-700 tracking-wider">
                      🛠️ Tahapan Merakit Fisik (Assembly Stage)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
                      Tahap {assemblyStage} dari 4
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Jangan buat semua stik sekaligus! Bangun mulai dari sasis dasar bertahap hingga rakitan selesai.
                  </p>
                </div>

                {/* Stage Selectors */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { num: 1, label: '1. Sasis Dasar', emoji: '🪵' },
                    { num: 2, label: '2. Rangka Penyangga', emoji: '📐' },
                    { num: 3, label: '3. Penggerak/Roda', emoji: '⚙️' },
                    { num: 4, label: '4. Rakitan Lengkap', emoji: '✨' },
                  ].map(stg => (
                    <button
                      key={stg.num}
                      type="button"
                      onClick={() => setAssemblyStage(stg.num)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                        assemblyStage === stg.num
                          ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{stg.emoji}</span>
                      <span>{stg.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Part Visibility Filter Pills */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                <span className="text-[11px] font-bold text-slate-500">
                  Filter Bagian (Klik untuk menyembunyikan/menampilkan):
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => togglePartVisibility('sticks')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 ${
                      partVisibility.sticks
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    <span>🪵 Stik Kayu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => togglePartVisibility('connectors')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 ${
                      partVisibility.connectors
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : 'bg-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    <span>🔷 Konektor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => togglePartVisibility('mechanisms')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 ${
                      partVisibility.mechanisms
                        ? 'bg-orange-100 text-orange-900 border border-orange-300'
                        : 'bg-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    <span>⚙️ Penggerak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => togglePartVisibility('electronics')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 ${
                      partVisibility.electronics
                        ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                        : 'bg-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    <span>📡 Sensor & Core</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => togglePartVisibility('wires')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 ${
                      partVisibility.wires
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-slate-100 text-slate-400 line-through'
                    }`}
                  >
                    <span>🔌 Kabel</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main 3D Studio Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Interactive 3D Canvas */}
              <div className="lg:col-span-8 bg-slate-900 rounded-3xl overflow-hidden shadow-md border border-slate-200/80 relative min-h-[500px] h-[540px]">
                <FunnectCanvas3D 
                  className="h-full w-full"
                  showLabelsProp={show3DLabels}
                  onToggleLabels={() => setShow3DLabels(p => !p)}
                  overrideProject={selectedProject}
                  onSelectPart={part => setSelectedPartFrom3D(part)}
                  assemblyStage={assemblyStage}
                  partVisibility={partVisibility}
                  activeModuleIds={chosenModuleIds}
                />

                {/* Floating Bottom Quick Hint */}
                <div className="absolute top-3 left-3 pointer-events-none z-10 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Mode Inspeksi 3D Interaktif Real-Time</span>
                </div>
              </div>

              {/* Right Column: Tabbed Inspector & Bill of Materials */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[540px]">
                {/* Tabs Header */}
                <div className="p-3 border-b border-slate-200/80 grid grid-cols-3 gap-1 bg-slate-50/70 rounded-t-3xl">
                  <button
                    type="button"
                    onClick={() => setActiveTabStep3('parts')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-extrabold transition-all ${
                      activeTabStep3 === 'parts'
                        ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🏷️ Anatomi ({getPartLabelsForBuildType(selectedProject.physicalBuildType).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTabStep3('bom')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-extrabold transition-all ${
                      activeTabStep3 === 'bom'
                        ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📦 Ceklis BOM
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTabStep3('tips')}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-extrabold transition-all ${
                      activeTabStep3 === 'tips'
                        ? 'bg-white text-blue-700 shadow-sm border border-slate-200/80'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    💡 Tips Rakit
                  </button>
                </div>

                {/* Tab Content Container */}
                <div className="p-4 flex-1 overflow-y-auto space-y-3">
                  {/* TAB 1: 3D PARTS ANATOMY */}
                  {activeTabStep3 === 'parts' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Daftar Komponen Teridentifikasi:
                        </span>
                        <span className="text-[11px] text-blue-600 font-bold">
                          Klik untuk menyorot
                        </span>
                      </div>

                      {/* Parts Item List */}
                      <div className="space-y-2">
                        {getPartLabelsForBuildType(selectedProject.physicalBuildType).map(part => {
                          const isSelected = selectedPartFrom3D?.id === part.id;
                          return (
                            <div
                              key={part.id}
                              onClick={() => setSelectedPartFrom3D(isSelected ? null : part)}
                              className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-300 shadow-sm'
                                  : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span className="text-2xl p-1 bg-slate-100 rounded-xl shrink-0">
                                  {part.emoji}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <h4 className="text-xs font-black text-slate-900 truncate">
                                      {part.name}
                                    </h4>
                                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                                      {part.category}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                    {part.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: BOM CHECKLIST */}
                  {activeTabStep3 === 'bom' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Bahan Siap Pakai:
                        </span>
                        <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {Object.values(checkedMaterials).filter(Boolean).length} / {(selectedProject.materials || selectedProject.requiredMaterials || []).length} Disiapkan
                        </span>
                      </div>

                      <div className="space-y-2">
                        {(selectedProject.materials || selectedProject.requiredMaterials || []).map((mat, i) => {
                          const isChecked = checkedMaterials[mat.name] || false;
                          return (
                            <div
                              key={i}
                              onClick={() => {
                                setCheckedMaterials(prev => ({
                                  ...prev,
                                  [mat.name]: !prev[mat.name]
                                }));
                              }}
                              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                isChecked
                                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs font-bold transition-colors ${
                                  isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isChecked && '✓'}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-base">{mat.emoji || '📦'}</span>
                                    <span className={`text-xs font-bold ${isChecked ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                                      {mat.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg text-xs">
                                {mat.quantity}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-800">
                        <span className="font-bold">🌿 Konsep Daur Ulang:</span>
                        <p className="mt-1 text-[11px] leading-relaxed">
                          Bahan bekas kardus biskuit, stik es krim, dan karet gelang dapat digunakan berulang kali tanpa merusak lingkungan.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CRAFT & ASSEMBLY TIPS */}
                  {activeTabStep3 === 'tips' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
                        <div className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                          <span>🧩</span>
                          <span>Sistem Pengunci Stik FUNNECT</span>
                        </div>
                        <p className="text-[11px] text-blue-800 leading-relaxed">
                          Konektor modular biru dan kuning dirancang khusus agar stik kayu dapat diselipkan erat tanpa menggunakan lem panas kimiawi. Aman untuk anak-anak!
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>📐</span>
                          <span>Keseimbangan Berat Robot</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Pastikan posisi FUNNECT Core diletakkan di titik tengah sasis agar beban seimbang dan motor penggerak tidak miring saat berjalan.
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                        <div className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                          <span>🔋</span>
                          <span>Kerapian Jalur Kabel</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 leading-relaxed">
                          Gunakan kawat pengikat kabel atau selotip kertas agar kabel sensor ultrasonik tidak tersangkut pada putaran roda gearbox TT.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Footer Action */}
                <div className="p-3 border-t border-slate-200/80 bg-slate-50/50 rounded-b-3xl">
                  <button
                    type="button"
                    onClick={() => setCurrentView('project-guide')}
                    className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>Buka Panduan Bergambar Lengkap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 4: BLOCK CODE
            ======================================================== */}
        {currentStep === 4 && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-blue-600 mb-1">
                  Visual Programming
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Block Coding: {selectedProject.title}
                </h3>
              </div>

              {/* Block Palette Categories */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold">
                  Events
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                  Motion
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                  Sensors
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 text-xs font-bold">
                  Logic
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-pink-100 text-pink-800 text-xs font-bold">
                  Sound & Light
                </span>
              </div>
            </div>

            {/* Visual Scratch-style Mock Blocks */}
            <div className="p-6 bg-slate-900 rounded-2xl font-mono text-xs text-white space-y-3">
              <div className="p-3 bg-amber-500 rounded-xl font-bold text-slate-900 w-fit shadow">
                when [FUNNECT Core starts]
              </div>
              <div className="pl-6 space-y-2 border-l-2 border-slate-700">
                <div className="p-3 bg-blue-600 rounded-xl font-bold w-fit shadow">
                  forever:
                </div>
                <div className="pl-6 space-y-2 border-l-2 border-blue-500/50">
                  <div className="p-3 bg-purple-600 rounded-xl font-bold w-fit shadow">
                    if &lt;[Sensor S1 Distance (cm)] &lt; [20]&gt; then:
                  </div>
                  <div className="pl-6 space-y-2 border-l-2 border-purple-500/50">
                    <div className="p-2.5 bg-orange-500 rounded-xl font-bold w-fit shadow">
                      set [Motor M1, M2] direction: [Reverse] speed: [40]%
                    </div>
                    <div className="p-2.5 bg-pink-600 rounded-xl font-bold w-fit shadow">
                      set [Output O1 Buzzer] tone: [Beep]
                    </div>
                  </div>
                  <div className="p-3 bg-purple-600 rounded-xl font-bold w-fit shadow">
                    else:
                  </div>
                  <div className="pl-6 space-y-2 border-l-2 border-purple-500/50">
                    <div className="p-2.5 bg-orange-500 rounded-xl font-bold w-fit shadow">
                      set [Motor M1, M2] direction: [Forward] speed: [80]%
                    </div>
                    <div className="p-2.5 bg-pink-600 rounded-xl font-bold w-fit shadow">
                      turn [Output O2 LED] [Green]
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Code compiled for FUNNECT Core Firmware v2.4</span>
              <button
                onClick={() => setCurrentView('simulator')}
                className="font-bold text-blue-600 hover:underline"
              >
                Open Full Screen Coding Canvas →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 5: TEST IN SIMULATOR
            ======================================================== */}
        {currentStep === 5 && (
          <div className="space-y-4">
            {/* Quick Stage & Filter Control for Simulator */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800">
                  Inspeksi Simulasi ({selectedProject.title}):
                </span>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                  Tahap {assemblyStage}/4
                </span>
              </div>

              {/* Stage switch buttons */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map(sNum => (
                  <button
                    key={sNum}
                    type="button"
                    onClick={() => setAssemblyStage(sNum)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      assemblyStage === sNum
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sNum === 1 ? '🪵 Sasis' : sNum === 2 ? '📐 Rangka' : sNum === 3 ? '⚙️ Mekanik' : '✨ Lengkap'}
                  </button>
                ))}
              </div>

              {/* Parts Toggles */}
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => togglePartVisibility('sticks')}
                  className={`px-2 py-0.5 rounded-md ${partVisibility.sticks ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-400 line-through'}`}
                >
                  Stik
                </button>
                <button
                  type="button"
                  onClick={() => togglePartVisibility('connectors')}
                  className={`px-2 py-0.5 rounded-md ${partVisibility.connectors ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-400 line-through'}`}
                >
                  Konektor
                </button>
                <button
                  type="button"
                  onClick={() => togglePartVisibility('mechanisms')}
                  className={`px-2 py-0.5 rounded-md ${partVisibility.mechanisms ? 'bg-orange-100 text-orange-900' : 'bg-slate-100 text-slate-400 line-through'}`}
                >
                  Penggerak
                </button>
                <button
                  type="button"
                  onClick={() => togglePartVisibility('electronics')}
                  className={`px-2 py-0.5 rounded-md ${partVisibility.electronics ? 'bg-cyan-100 text-cyan-900' : 'bg-slate-100 text-slate-400 line-through'}`}
                >
                  Sensor
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 3D Canvas */}
              <div className="lg:col-span-8 h-[480px] bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-200 relative">
                <FunnectCanvas3D 
                  className="h-full w-full"
                  overrideProject={selectedProject}
                  activeModuleIds={chosenModuleIds}
                  assemblyStage={assemblyStage}
                  partVisibility={partVisibility}
                />

                {/* Floating simulation status badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-800 shadow-sm pointer-events-none">
                  <span className={`w-2 h-2 rounded-full ${simulation.isRunning ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                  <span>{simulation.isRunning ? 'Simulasi Berjalan Real-Time' : 'Simulasi Dijeda'}</span>
                </div>
              </div>

              {/* Dynamic Virtual Sensor Sliders & Live Actuator Feedback */}
              <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 max-h-[480px] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Kontrol Lingkungan Virtual</h3>
                    <p className="text-[11px] text-slate-500">Ubah sensor untuk melihat respon fisik</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleSimulation}
                    className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all ${
                      simulation.isRunning
                        ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{simulation.isRunning ? 'Jeda Sim' : 'Jalankan Sim'}</span>
                  </button>
                </div>

                {/* PROJECT-SPECIFIC SLIDERS */}
                {/* 1. Distance Sensor (for Robot Car, Barrier, etc.) */}
                {(selectedProject.physicalBuildType === 'robot-car' ||
                  selectedProject.physicalBuildType === 'automatic-barrier' ||
                  chosenModuleIds.some(m => m.includes('distance'))) && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Jarak Rintangan (S1)</span>
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
                      <span className={simulation.sensorValues.distance < 20 ? 'text-red-500 font-black' : ''}>
                        {simulation.sensorValues.distance < 20 ? '⚠️ Rintangan Dekat!' : 'Dekat (5cm)'}
                      </span>
                      <span>Jauh (80cm)</span>
                    </div>
                  </div>
                )}

                {/* 2. Light Sensor (for Windmill, Streetlight, Solar Tracker) */}
                {(selectedProject.physicalBuildType === 'windmill' ||
                  selectedProject.physicalBuildType === 'streetlight' ||
                  selectedProject.physicalBuildType === 'solar-tracker' ||
                  chosenModuleIds.some(m => m.includes('light'))) && (
                  <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                      <span>Intensitas Cahaya / Angin</span>
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
                      <span>Gelap / Tenang (0%)</span>
                      <span>Terang Benderang (100%)</span>
                    </div>
                  </div>
                )}

                {/* 3. Moisture Sensor (for Smart Irrigation) */}
                {(selectedProject.physicalBuildType === 'irrigation' ||
                  chosenModuleIds.some(m => m.includes('moisture'))) && (
                  <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-2">
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
                        {simulation.sensorValues.moisture < 30 ? '🥀 Kering (Perlu Air)' : 'Kering (0%)'}
                      </span>
                      <span className={simulation.sensorValues.moisture >= 30 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        Subur (100%)
                      </span>
                    </div>
                  </div>
                )}

                {/* 4. Tremor / Shake (for Earthquake Detector) */}
                {selectedProject.physicalBuildType === 'earthquake-detector' && (
                  <div className="p-3 bg-red-50/70 rounded-2xl border border-red-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-red-900">
                      <span>Sensor Getaran Gempa</span>
                      <span className="text-red-700 font-extrabold">
                        {simulation.sensorValues.button ? '⚡ Guncangan Aktif!' : 'Tenang'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onMouseDown={() => setSensorValue('button', true)}
                      onMouseUp={() => setSensorValue('button', false)}
                      className="w-full py-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-xl text-xs font-black shadow-sm transition-all"
                    >
                      ⚡ Tekan & Tahan untuk Simulasi Guncangan
                    </button>
                  </div>
                )}

                {/* Live Actuator Telemetry Feedback */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="font-extrabold text-slate-900 mb-1 flex items-center justify-between">
                    <span>Status Aktuator & Output</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Port M1-O2
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Putaran Motor:</span>
                    <span className="font-bold text-slate-800">
                      {simulation.actuatorStates.motorSpeed}% ({simulation.actuatorStates.motorDirection})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Sudut Servo:</span>
                    <span className="font-bold text-blue-600">
                      {simulation.actuatorStates.servoAngle}°
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Lampu LED:</span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: simulation.actuatorStates.ledState ? simulation.actuatorStates.ledColor : '#94A3B8' }}
                      />
                      <span className="font-bold" style={{ color: simulation.actuatorStates.ledColor }}>
                        {simulation.actuatorStates.ledState ? 'NYALA' : 'MATI'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Alarm Buzzer:</span>
                    <span className={`font-bold ${simulation.actuatorStates.buzzerActive ? 'text-red-600 animate-pulse' : 'text-slate-400'}`}>
                      {simulation.actuatorStates.buzzerActive ? `BUNYI (${simulation.actuatorStates.buzzerTone}Hz)` : 'SENYAP'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 6: SAVE & DEPLOY
            ======================================================== */}
        {currentStep === 6 && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                <Radio className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Connect to FUNNECT Core</h2>
              <p className="text-sm text-slate-500">
                Deploy your code and port configurations to the physical robot.
              </p>
            </div>

            {/* Core Device Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">{coreDevice.name}</div>
                    <div className="text-xs text-slate-500">
                      Status:{' '}
                      <span className="text-emerald-600 font-bold">
                        {coreDevice.connected ? 'Connected 🟢' : 'Ready to Connect 🟡'}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  Battery: {coreDevice.batteryPercent}%
                </span>
              </div>
            </div>

            {/* Port Verification Checklist */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Port Verification:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(coreDevice.ports).map(([portKey, mod]) => {
                  const m = mod as FunnectModule | null;
                  return (
                    <div
                      key={portKey}
                      className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between"
                    >
                      <span className="font-bold text-blue-600">{portKey}</span>
                      <span className="text-slate-700 font-medium truncate max-w-[130px]">
                        {m ? `${m.name} ✓` : 'Empty'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deploy Progress Bar */}
            {isDeploying && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-blue-600">
                  <span>Deploying to Core...</span>
                  <span>{deployProgress}%</span>
                </div>
                <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${deployProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleFinishDeploy}
              disabled={isDeploying}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Flashing Core Firmware...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Deploy Project to Core</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Wizard Bottom Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-200/80">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            ← Previous Step
          </button>

          <div className="text-xs text-slate-400 font-medium">
            Step {currentStep} of 6
          </div>

          {currentStep < 6 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-extrabold text-xs hover:bg-blue-700 shadow-sm flex items-center gap-2 transition-colors"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('my-projects')}
              className="px-6 py-3 rounded-xl bg-slate-800 text-white font-extrabold text-xs hover:bg-slate-900 transition-colors"
            >
              Finish & View My Projects
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
