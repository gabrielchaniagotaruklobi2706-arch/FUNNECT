import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KID_CREATIONS, KidCreation } from '../../data/showcaseCreations';
import { FunnectMascot } from '../common/FunnectMascot';
import { 
  playKidPop, 
  playKidFanfare, 
  playRobotChirp, 
  isSoundEnabled, 
  setSoundEnabled 
} from '../../utils/kidSounds';
import { 
  Sparkles, 
  ArrowRight, 
  Box, 
  Eye, 
  Clock, 
  Trophy, 
  Heart, 
  X, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Palette, 
  Lightbulb, 
  Play, 
  Share2,
  Award
} from 'lucide-react';

interface CreationShowcaseGalleryProps {
  onSelectProjectFor3D?: (projectId: string) => void;
}

export const CreationShowcaseGallery: React.FC<CreationShowcaseGalleryProps> = ({ onSelectProjectFor3D }) => {
  const { setCurrentView, setSelectedProject, projects, showToast } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedCreation, setSelectedCreation] = useState<KidCreation | null>(null);
  const [likedCreations, setLikedCreations] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({
    'creation-robot-car': 128,
    'creation-windmill': 94,
    'creation-plant-waterer': 115,
    'creation-barrier-gate': 88,
    'creation-sunflower': 106,
  });
  const [soundActive, setSoundActive] = useState<boolean>(isSoundEnabled());

  const categories = [
    { id: 'Semua', label: 'Semua Hasil Karya 🌟', icon: Sparkles },
    { id: 'Robot & Mobil', label: 'Robot & Mobil 🚗', icon: Box },
    { id: 'Sains & Energi', label: 'Sains & Energi ⚡', icon: Lightbulb },
    { id: 'Tanaman & Alam', label: 'Tanaman & Alam 🌱', icon: Palette },
    { id: 'Otomasi Seru', label: 'Otomasi Seru 🚦', icon: Trophy },
  ];

  const filteredCreations = activeCategory === 'Semua' 
    ? KID_CREATIONS 
    : KID_CREATIONS.filter(c => c.category === activeCategory);

  const toggleSound = () => {
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
    if (next) playKidPop();
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    playKidPop();
    setLikedCreations(prev => {
      const isLiked = !prev[id];
      setLikeCounts(c => ({
        ...c,
        [id]: (c[id] || 0) + (isLiked ? 1 : -1)
      }));
      return { ...prev, [id]: isLiked };
    });
  };

  const handleOpenDetail = (creation: KidCreation) => {
    playKidPop();
    setSelectedCreation(creation);
  };

  const handleLaunchBuild = (projectId: string) => {
    playKidFanfare();
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      setSelectedProject(proj);
      setCurrentView('create-project');
      showToast(`Mulai rakit ${proj.title}! Yuk ikuti langkahnya! 🚀`, 'success');
    } else {
      setCurrentView('create-project');
    }
  };

  const handleInspect3D = (projectId: string) => {
    playRobotChirp();
    const proj = projects.find(p => p.id === projectId);
    if (proj) {
      setSelectedProject(proj);
      if (onSelectProjectFor3D) {
        onSelectProjectFor3D(projectId);
      } else {
        setCurrentView('build-studio');
      }
      showToast(`Membuka model 3D interaktif ${proj.title}! 🎮`, 'info');
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-amber-50/50 via-sky-50/40 to-white relative overflow-hidden">
      {/* Decorative colorful background floating bubbles */}
      <div className="absolute top-10 left-6 w-28 h-28 bg-yellow-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-44 h-44 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-36 h-36 bg-blue-200/40 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header: Colorful & Child-Friendly */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4 text-left">
            <div className="relative shrink-0 cursor-pointer" onClick={() => playRobotChirp()}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-400 to-yellow-300 p-1 shadow-lg shadow-amber-200/80 flex items-center justify-center transform hover:scale-105 transition-transform">
                <FunnectMascot size="md" expression="excited" />
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow">
                LIVE
              </span>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/80 text-amber-900 text-xs font-black mb-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
                <span>PANGGUNG KARYA TEMAN-TEMAN CILIK 🎨</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                Lihat Hasil Nyata yang Telah Dibuat! 🚀
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mt-1">
                Dibuat nyata dari <strong className="text-amber-800">stik es krim</strong>, <strong className="text-blue-700">konektor snap FUNNECT</strong>, dan <strong className="text-purple-700">modul cerdas</strong> oleh siswa-siswi kreatif. Klik untuk coba di 3D atau rakit sendiri!
              </p>
            </div>
          </div>

          {/* Sound Effect Toggle */}
          <button
            onClick={toggleSound}
            className={`px-3.5 py-2 rounded-2xl border flex items-center gap-2 text-xs font-black shadow-sm transition-all ${
              soundActive
                ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
            title="Efek Suara Ceria"
          >
            {soundActive ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{soundActive ? 'Suara Ceria: Nyala 🔊' : 'Suara: Hening 🔇'}</span>
          </button>
        </div>

        {/* Category Pills (Colorful, Round, Kid-Friendly) */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {categories.map(cat => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playKidPop();
                  setActiveCategory(cat.id);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all transform active:scale-95 shadow-sm flex items-center gap-2 ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/25 shadow-md scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 hover:border-blue-200'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Display Grid of Creations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCreations.map(creation => {
            const isLiked = !!likedCreations[creation.id];
            const currentLikes = likeCounts[creation.id] || 90;

            return (
              <div
                key={creation.id}
                className={`rounded-3xl border ${creation.accentBorder} ${creation.cardBg} shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group transform hover:-translate-y-1`}
              >
                {/* Image Container with Badges */}
                <div 
                  className="relative h-56 sm:h-64 overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => handleOpenDetail(creation)}
                >
                  <img
                    src={creation.imageUrl}
                    alt={creation.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                  {/* Top Left: Achievement Badge */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                    <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-amber-300 text-slate-900 text-[11px] font-black shadow-md flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{creation.achievementBadge}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-extrabold flex items-center gap-1">
                      <span>{creation.schoolGrade}</span>
                    </span>
                  </div>

                  {/* Top Right: Like Button */}
                  <button
                    onClick={(e) => handleLike(e, creation.id)}
                    className={`absolute top-3 right-3 z-10 w-10 h-10 rounded-2xl backdrop-blur-md flex items-center justify-center transition-all transform active:scale-75 shadow-md ${
                      isLiked
                        ? 'bg-rose-500 text-white shadow-rose-500/40 scale-110'
                        : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-500'
                    }`}
                    title="Keren! Beri Bintang"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current text-white' : 'text-slate-700'}`} />
                  </button>

                  {/* Bottom Image Overlay: Punch Highlight */}
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white">
                    <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-slate-900/75 backdrop-blur-sm truncate max-w-[80%]">
                      ⚡ {creation.highlightPunch}
                    </span>
                    <span className="text-xs font-extrabold px-2 py-1 rounded-xl bg-white/90 text-slate-900 backdrop-blur-sm flex items-center gap-1 shrink-0">
                      ❤️ {currentLikes}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Author Byline */}
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1.5">
                      <span className="text-blue-700 flex items-center gap-1">
                        <span>👤</span> {creation.creatorName}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3.5 h-3.5" /> {creation.buildMinutes} Menit
                      </span>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => handleOpenDetail(creation)}
                      className="text-lg sm:text-xl font-black text-slate-900 hover:text-blue-600 transition-colors cursor-pointer leading-tight mb-1"
                    >
                      {creation.badgeEmoji} {creation.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {creation.description}
                    </p>
                  </div>

                  {/* Modular Components Pills */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                      Komponen Pintar:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {creation.modulesUsed.map((m, idx) => (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-2xs ${m.color}`}
                        >
                          <span>{m.icon}</span>
                          <span>{m.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <button
                      onClick={() => handleInspect3D(creation.projectId)}
                      className="py-2.5 px-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-blue-400 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span>Putar 3D 🎮</span>
                    </button>

                    <button
                      onClick={() => handleLaunchBuild(creation.projectId)}
                      className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
                    >
                      <span>Ayo Rakit!</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fun Quote Banner */}
        <div className="mt-10 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-100/90 via-yellow-100/80 to-sky-100/90 border border-amber-300/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
              💡
            </div>
            <div>
              <div className="text-xs font-black text-amber-900 uppercase tracking-wider">
                Tahukah Teman-teman?
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                Semua model di atas dibuat dari <strong>stik es krim bekas</strong> yang murah & ramah lingkungan. Setelah selesai belajar, konektor FUNNECT bisa dilepas kembali dan dirakit jadi robot baru! ♻️
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playKidFanfare();
              setCurrentView('create-project');
            }}
            className="shrink-0 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md flex items-center gap-2 transition-transform transform hover:scale-105"
          >
            <span>Rancang Idimu Sendiri! 🎨</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* POPUP DETAIL MODAL FOR KID CREATION */}
      {selectedCreation && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedCreation(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-4 border-amber-300 max-h-[92vh] flex flex-col relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                playKidPop();
                setSelectedCreation(null);
              }}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="relative h-64 sm:h-72 bg-slate-100 overflow-hidden shrink-0">
              <img
                src={selectedCreation.imageUrl}
                alt={selectedCreation.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-xs font-black shadow inline-block mb-2">
                  {selectedCreation.achievementBadge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black leading-tight">
                  {selectedCreation.badgeEmoji} {selectedCreation.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                  {selectedCreation.subtitle}
                </p>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Creator Info */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-300 flex items-center justify-center text-xl">
                    🌟
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">{selectedCreation.creatorName}</div>
                    <div className="text-[11px] font-bold text-amber-800">{selectedCreation.schoolGrade}</div>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <span className="font-extrabold text-slate-700">Waktu Rakit:</span>
                  <div className="text-blue-600 font-black">{selectedCreation.buildMinutes} Menit</div>
                </div>
              </div>

              {/* Student Quote */}
              <blockquote className="p-4 rounded-2xl bg-sky-50 border-l-4 border-blue-500 text-xs sm:text-sm italic font-bold text-slate-700">
                {selectedCreation.studentQuote}
              </blockquote>

              {/* Description */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
                  Cara Kerja & Cerita Pembuatan:
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedCreation.description}
                </p>
              </div>

              {/* Craft Materials Required */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                  Bahan Prakarya yang Digunakan:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCreation.craftMaterials.map((mat, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{mat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fun Science Fact */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold flex items-start gap-3">
                <span className="text-xl shrink-0">🔬</span>
                <div>
                  <span className="font-black uppercase tracking-wider block text-[10px] text-emerald-700">Fakta Sains Cilik:</span>
                  <span>{selectedCreation.funFact}</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Sticky Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => {
                  setSelectedCreation(null);
                  handleInspect3D(selectedCreation.projectId);
                }}
                className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-black text-xs flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Lihat Model 3D</span>
              </button>

              <button
                onClick={() => {
                  setSelectedCreation(null);
                  handleLaunchBuild(selectedCreation.projectId);
                }}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-transform transform active:scale-95"
              >
                <span>Ayo Rakit Ini Sekarang! 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
