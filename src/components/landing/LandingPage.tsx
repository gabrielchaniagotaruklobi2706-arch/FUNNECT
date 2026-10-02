import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FunnectLogo } from '../common/FunnectLogo';
import { FunnectMascot } from '../common/FunnectMascot';
import { FunnectCanvas3D } from '../3d/FunnectCanvas3D';
import { CreationShowcaseGallery } from './CreationShowcaseGallery';
import { 
  playKidPop, 
  playKidFanfare, 
  playRobotChirp 
} from '../../utils/kidSounds';
import { 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Link as LinkIcon, 
  Boxes, 
  Laptop, 
  Play, 
  RotateCw, 
  Recycle, 
  Coins, 
  Compass, 
  Palette, 
  Leaf, 
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Heart,
  Smile,
  Zap,
  Rocket,
  ShieldCheck,
  Award,
  BookOpen
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setSelectedProject, selectedProject, projects, showToast } = useApp();
  const [mascotTipIndex, setMascotTipIndex] = useState(0);

  const mascotTips = [
    'Hai! Aku FUNNECT Bot! Klik aku untuk salam ceria! 🤖✨',
    'Tahukah kamu? Kamu bisa rakit robot dari stik es krim bekas! 🍦',
    'Coba putar mobil robot 3D di sebelah kanan! Keren kan? 🚗',
    'Semua konektor FUNNECT aman dan bisa dipakai berulang kali! ♻️',
    'Ayo pilih proyek pertamamu di galeri karya di bawah! 👇'
  ];

  const heroFeaturedBuilds = [
    { id: 'proj-robot-car', label: '🚗 Mobil Robot', name: 'Robot Car', color: 'hover:border-blue-400 bg-blue-50/80 text-blue-900 border-blue-200' },
    { id: 'proj-windmill', label: '🌬️ Kincir Angin', name: 'Windmill', color: 'hover:border-amber-400 bg-amber-50/80 text-amber-900 border-amber-200' },
    { id: 'proj-automatic-barrier', label: '🚧 Palang Otomatis', name: 'Barrier Gate', color: 'hover:border-purple-400 bg-purple-50/80 text-purple-900 border-purple-200' },
    { id: 'proj-solar-tracker', label: '🌻 Bunga Matahari', name: 'Sunflower', color: 'hover:border-yellow-400 bg-yellow-50/80 text-yellow-900 border-yellow-200' },
  ];

  const handleStartBuilding = () => {
    playKidFanfare();
    setCurrentView('create-project');
  };

  const handleGoToCreateProject = (projId?: string) => {
    playKidFanfare();
    if (projId) {
      const found = projects.find(p => p.id === projId);
      if (found) {
        setSelectedProject(found);
        showToast(`Membuka proyek ${found.title} di Create Project! 🚀`, 'success');
      }
    } else if (selectedProject) {
      showToast(`Membuka proyek ${selectedProject.title} di Create Project! 🚀`, 'success');
    }
    setCurrentView('create-project');
  };

  const handleExploreGallery = () => {
    playKidPop();
    const el = document.getElementById('showcase-gallery');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMascotClick = () => {
    playRobotChirp();
    setMascotTipIndex(prev => (prev + 1) % mascotTips.length);
  };

  const handleSwitchHeroModel = (projId: string) => {
    playKidPop();
    const found = projects.find(p => p.id === projId);
    if (found) {
      setSelectedProject(found);
    }
  };

  const handleSelectProjectFromGallery = (projId: string) => {
    const found = projects.find(p => p.id === projId);
    if (found) {
      setSelectedProject(found);
      const canvasEl = document.getElementById('hero-3d-stage');
      if (canvasEl) {
        canvasEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* 1. HERO SECTION: COLORFUL, FRIENDLY & PLAYFUL */}
      <section className="relative overflow-hidden pt-6 pb-12 lg:pt-10 lg:pb-16 bg-gradient-to-b from-sky-50/70 via-amber-50/40 to-[#FAF9F6]">
        {/* Soft background ambient gradient bubbles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/4 left-5 w-80 h-80 bg-amber-200/35 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-10 right-10 w-80 h-80 bg-pink-200/25 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Interactive Mascot Speech Bubble */}
              <div 
                onClick={handleMascotClick}
                className="inline-flex items-center gap-3 px-4 py-2.5 bg-white/95 border-2 border-amber-300 hover:border-amber-400 rounded-3xl shadow-md cursor-pointer transition-all transform hover:scale-102 group active:scale-98"
                title="Klik FUNNECT Bot!"
              >
                <div className="relative">
                  <FunnectMascot size="sm" expression="excited" className="shrink-0 group-hover:rotate-6 transition-transform" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-ping" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-black text-amber-900 tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    FUNNECT BOT MENYAPA:
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 transition-all">
                    "{mascotTips[mascotTipIndex]}"
                  </span>
                </div>
              </div>

              {/* Main Headline (Playful & Energetic) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Bangun Robot Impianmu.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                  Gerakkan Sesukamu.
                </span>{' '}
                <br />
                <span className="text-amber-500">Belajar Sambil Bermain! 🎨🚀</span>
              </h1>

              {/* Subheadline with warm, friendly tone */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl font-medium">
                Platform belajar <strong>STEAM & Robotika seru</strong> untuk anak-anak! Rangkai stik es krim dan bambu dengan konektor snap cerdas, pasang sensor pintar, dan coding blok semudah menyusun puzzle.
              </p>

              {/* Call To Actions Buttons (Bright & Bouncy) */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={handleStartBuilding}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 group"
                >
                  <Rocket className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                  <span>Mulai Rakit Sekarang!</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </button>

                <button
                  onClick={handleExploreGallery}
                  className="px-6 py-4 rounded-2xl bg-white hover:bg-amber-50/50 text-slate-800 border-2 border-amber-300 hover:border-amber-400 font-black text-base shadow-md transition-all flex items-center gap-2 transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Lihat Galeri Hasil Karya 👇</span>
                </button>
              </div>

              {/* Quick Kid-Safe & Friendly Badges */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-bold text-slate-600">
                <div className="px-3 py-1.5 rounded-xl bg-amber-100/90 text-amber-900 border border-amber-200 flex items-center gap-1.5 shadow-2xs">
                  <span>🍦</span>
                  <span>Stik Es Krim & Bambu</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-blue-100/90 text-blue-900 border border-blue-200 flex items-center gap-1.5 shadow-2xs">
                  <span>🔗</span>
                  <span>Konektor Reusable</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-100/90 text-emerald-900 border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>100% Bebas Lem Panas</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-purple-100/90 text-purple-900 border border-purple-200 flex items-center gap-1.5 shadow-2xs">
                  <span>🎮</span>
                  <span>Simulator 3D Interaktif</span>
                </div>
              </div>

            </div>

            {/* Right Hero Column: Interactive 3D Canvas Assembly */}
            <div id="hero-3d-stage" className="lg:col-span-5 relative">
              
              {/* Mascot Floating Invite: Direct link to Create Project */}
              <button 
                onClick={() => handleGoToCreateProject(selectedProject?.id)}
                className="flex absolute -top-4 -right-2 z-20 bg-white/95 hover:bg-amber-50 border-2 border-amber-300 hover:border-amber-400 backdrop-blur-md shadow-lg hover:shadow-xl px-3.5 py-1.5 rounded-2xl items-center gap-2 text-xs font-black text-slate-800 cursor-pointer hover:scale-105 active:scale-95 transition-all group focus:outline-none"
                title="Klik untuk langsung membuat proyek robot ini di Create Project!"
              >
                <FunnectMascot size="sm" expression="happy" className="group-hover:rotate-6 transition-transform" />
                <span>Pilih & putar robot 3D-mu! 🚗✨</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span>Rakit</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>

              {/* Quick Model Selector Pills */}
              <div className="mb-3 p-2.5 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-slate-200 shadow-md flex items-center justify-between gap-1.5 overflow-x-auto">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider pl-1 shrink-0">
                  Model 3D:
                </span>
                <div className="flex items-center gap-1">
                  {heroFeaturedBuilds.map(b => {
                    const isSelected = selectedProject?.id === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => handleSwitchHeroModel(b.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap shadow-2xs ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-sm scale-105'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {b.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live 3D Canvas Card with Playful Border */}
              <div className="h-[400px] sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-blue-100 relative bg-slate-900 group">
                <FunnectCanvas3D className="h-full" />

                {/* Direct CTA Overlay to Create Project */}
                <button
                  onClick={() => handleGoToCreateProject(selectedProject?.id)}
                  className="absolute bottom-3 right-3 z-10 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-xl backdrop-blur-md flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-white/20 group/btn"
                  title="Mulai rakit proyek ini di Create Project"
                >
                  <Rocket className="w-4 h-4 text-yellow-300 group-hover/btn:rotate-12 transition-transform" />
                  <span>Rakit di Create Project</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Bottom Quick Trigger Bar */}
              <div className="mt-3.5 flex items-center justify-between text-xs text-slate-600 px-1">
                <span className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                  Putar bebas dengan klik & seret mouse/jari
                </span>
                <button
                  onClick={() => handleGoToCreateProject(selectedProject?.id)}
                  className="font-black text-blue-700 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:border-blue-600 transition-all shadow-2xs group"
                >
                  <Rocket className="w-3.5 h-3.5 text-blue-600 group-hover:text-white transition-colors" />
                  <span>Buka di Create Project</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. FLAGSHIP SHOWCASE DISPLAY: GALERI HASIL KARYA CILIK & DISPLAY AWAL */}
      <div id="showcase-gallery">
        <CreationShowcaseGallery onSelectProjectFor3D={handleSelectProjectFromGallery} />
      </div>

      {/* 3. SECTION: CARA KERJA FUNNECT (4 PILAR RAMAH ANAK) */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-white border-y border-slate-200/70 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 border border-amber-300 rounded-full text-xs font-black text-amber-900 shadow-sm">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>4 RAHASIA RAKITAN PINTAR FUNNECT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Bagaimana Cara Kerja FUNNECT? 🛠️
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              Menggabungkan prakarya fisik yang ramah anak dengan teknologi komputer modern. Semua anak bisa jadi penemu cilik!
            </p>
          </div>

          {/* 4 Big Cheerful Playful Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 01 - CORE */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-blue-50/80 via-white to-blue-50/40 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all group flex flex-col justify-between transform hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xl font-black text-blue-600 bg-blue-100/80 px-3 py-1 rounded-2xl">01</span>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-110 transition-transform">
                    🧠
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">FUNNECT Core</h3>
                <p className="text-xs font-black text-blue-700 mb-3 uppercase tracking-wider">Otak Pintar Robot</p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Modul pengendali utama dengan baterai isi ulang. Membaca sensor, memerintah motor berputar, menyalakan lampu, dan terhubung nirkabel ke laptop atau tabletmu!
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-blue-100 flex items-center gap-1.5 text-xs font-black text-blue-700">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Microcontroller Cilik + Port Snap</span>
              </div>
            </div>

            {/* Card 02 - CONNECTOR */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-amber-50/80 via-white to-amber-50/40 border-2 border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all group flex flex-col justify-between transform hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xl font-black text-amber-600 bg-amber-100/80 px-3 py-1 rounded-2xl">02</span>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-110 transition-transform">
                    🔗
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Snap Connector</h3>
                <p className="text-xs font-black text-amber-700 mb-3 uppercase tracking-wider">Kancing Penghubung</p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Konektor presisi berbentuk sambungan siku 90°, lurus, engsel putar, dan roda. Cukup "klik" untuk menyambung stik es krim tanpa perlu lem panas berbahaya!
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-amber-100 flex items-center gap-1.5 text-xs font-black text-amber-700">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>100% Reusable & Ramah Lingkungan</span>
              </div>
            </div>

            {/* Card 03 - MODULE */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-pink-50/80 via-white to-pink-50/40 border-2 border-pink-200 hover:border-pink-400 hover:shadow-xl transition-all group flex flex-col justify-between transform hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xl font-black text-pink-600 bg-pink-100/80 px-3 py-1 rounded-2xl">03</span>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-110 transition-transform">
                    ⚙️
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Smart Modules</h3>
                <p className="text-xs font-black text-pink-700 mb-3 uppercase tracking-wider">Mata, Tangan & Suara</p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Sensor Jarak (mata), Sensor Cahaya, Sensor Tanah, Motor DC (kaki roda), Motor Servo (lengan), Lampu LED warna-warni, dan Buzzer musik ceria.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-pink-100 flex items-center gap-1.5 text-xs font-black text-pink-700">
                <CheckCircle2 className="w-4 h-4 text-pink-500" />
                <span>Kabel Anti Terbalik (Foolproof)</span>
              </div>
            </div>

            {/* Card 04 - WEB APP */}
            <div className="p-7 rounded-3xl bg-gradient-to-b from-emerald-50/80 via-white to-emerald-50/40 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-xl transition-all group flex flex-col justify-between transform hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xl font-black text-emerald-600 bg-emerald-100/80 px-3 py-1 rounded-2xl">04</span>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-110 transition-transform">
                    💻
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Studio & Coding 3D</h3>
                <p className="text-xs font-black text-emerald-700 mb-3 uppercase tracking-wider">Rancang & Simulasi</p>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Aplikasi web interaktif dengan tampilan 3D nyata, coding visual seret-dan-lepas (block coding), dan simulator fisika untuk menguji gerakan sebelum merakit!
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-emerald-100 flex items-center gap-1.5 text-xs font-black text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Belajar Coding Sambil Bersenang-senang</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SECTION: BUILD MORE WASTE LESS (SUSTAINABLE & PLAYFUL) */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-emerald-50/40 via-white to-sky-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100/90 border border-emerald-300 rounded-full text-xs font-black text-emerald-900 shadow-sm">
                <Recycle className="w-4 h-4 text-emerald-700" />
                <span>RAMAH LINGKUNGAN & AMAN UNTUK ANAK</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Rakit Lebih Banyak.{' '}
                <span className="text-emerald-600">Bebas Sampah Plastik! 🌍</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
                FUNNECT mengajarkan anak-anak mencintai lingkungan sejak dini. Gunakan stik es krim bekas, bambu tusuk sate, kardus kotak sereal, lalu hubungkan dengan konektor modular kami.
              </p>

              {/* 5 Playful Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white border-2 border-blue-100 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 text-lg">
                    ♻️
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Reusable</div>
                    <div className="text-[11px] text-slate-500 font-bold">Bongkar pasang bebas</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-100 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 text-lg">
                    💰
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Hemat Biaya</div>
                    <div className="text-[11px] text-slate-500 font-bold">Bahan murah meriah</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-100 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 text-lg">
                    🍦
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Mudah Dicari</div>
                    <div className="text-[11px] text-slate-500 font-bold">Ada di sekitar rumah</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border-2 border-pink-100 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shrink-0 text-lg">
                    🎨
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Kreatif Bebas</div>
                    <div className="text-[11px] text-slate-500 font-bold">Bentuk apa saja</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-100 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 text-lg">
                    🛡️
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Bebas Bahaya Lem Panas</div>
                    <div className="text-[11px] text-slate-500 font-bold">Aman untuk jari-jari anak kecil</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Visual Recipe Box */}
            <div className="lg:col-span-6 bg-white p-7 sm:p-8 rounded-3xl border-2 border-emerald-200 shadow-xl relative overflow-hidden">
              <div className="text-center mb-6">
                <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                  Resep Merakit Robot FUNNECT 🧪
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-2">
                  Campuran Seru Menghasilkan Robot Hidup!
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🪵</span>
                    <span className="text-sm font-black text-slate-800">Stik Es Krim Bekas</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-800 bg-amber-200/90 px-2.5 py-0.5 rounded-full">Rangka Dasar</span>
                </div>

                <div className="flex justify-center text-amber-500 font-black text-lg">+</div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎋</span>
                    <span className="text-sm font-black text-slate-800">Bambu / Tusuk Sate Tumpul</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-800 bg-amber-200/90 px-2.5 py-0.5 rounded-full">Poros Roda & Tiang</span>
                </div>

                <div className="flex justify-center text-blue-500 font-black text-lg">+</div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔗</span>
                    <span className="text-sm font-black text-blue-900">Konektor Snap FUNNECT</span>
                  </div>
                  <span className="text-xs font-extrabold text-blue-800 bg-blue-200/90 px-2.5 py-0.5 rounded-full">Jepitan Kuat Reusable</span>
                </div>

                <div className="flex justify-center text-purple-500 font-black text-lg">+</div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50 border border-purple-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧠</span>
                    <span className="text-sm font-black text-purple-900">FUNNECT Core + Sensor</span>
                  </div>
                  <span className="text-xs font-extrabold text-purple-800 bg-purple-200/90 px-2.5 py-0.5 rounded-full">Otak Pintar</span>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleStartBuilding}
                    className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 text-white font-black text-sm shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform active:scale-98 transition-all"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span>= HASIL KARYA ROBOT STEAM MILIKMU SENDIRI! 🚀</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION FOOTER BANNER */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 text-white relative overflow-hidden">
        {/* Playful Floating Circles */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-black text-yellow-200 shadow">
            <Rocket className="w-4 h-4" />
            <span>AYO MULAI PETUALANGAN SAINSMU HARI INI!</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Siap Menjadi Penemu Cilik Berikutnya? 🌟
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto font-medium">
            Ambil segenggam stik es krim, pasang FUNNECT Core, dan ciptakan berbagai robot keren yang bisa bergerak, melihat, dan bersuara!
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleStartBuilding}
              className="px-8 py-4 rounded-2xl bg-white text-blue-700 hover:bg-yellow-300 hover:text-slate-900 font-black text-base shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Mulai Rancang Proyek 🚀</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                playKidPop();
                setCurrentView('login');
              }}
              className="px-6 py-4 rounded-2xl bg-blue-900/40 hover:bg-blue-900/60 border-2 border-white/30 text-white font-black text-base transition-all"
            >
              Masuk (Siswa / Guru)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
