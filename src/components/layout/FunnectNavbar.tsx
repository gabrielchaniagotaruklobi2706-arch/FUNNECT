import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ViewType, UserRole, FunnectModule } from '../../types';
import { FunnectLogo } from '../common/FunnectLogo';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Boxes, 
  Box, 
  PlayCircle, 
  Users, 
  Sparkles, 
  Radio, 
  Menu, 
  X, 
  Cpu, 
  ChevronRight,
  GraduationCap,
  School,
  CheckCircle2,
  AlertCircle,
  Palette
} from 'lucide-react';
import { playKidPop } from '../../utils/kidSounds';

export const FunnectNavbar: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    userRole, 
    setUserRole, 
    coreDevice, 
    connectCore, 
    disconnectCore,
    showToast
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [connectModalOpen, setConnectModalOpen] = useState(false);

  // Student Nav Items
  const studentNavItems: { id: ViewType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'create-project', label: 'Create Project', icon: PlusCircle },
    { id: 'my-projects', label: 'My Projects', icon: Boxes },
    { id: 'build-studio', label: 'Build Studio', icon: Box },
    { id: 'simulator', label: 'Simulator', icon: PlayCircle },
  ];

  // Teacher Nav Items
  const teacherNavItems: { id: ViewType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'classes', label: 'Classes', icon: Users },
    { id: 'activities', label: 'Activities', icon: Sparkles },
    { id: 'my-projects', label: 'Projects', icon: Boxes },
    { id: 'progress', label: 'Classroom Progress', icon: Radio },
  ];

  const currentNavItems = userRole === 'teacher' ? teacherNavItems : studentNavItems;

  const handleNavClick = (view: ViewType) => {
    playKidPop();
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  const toggleRole = () => {
    const nextRole: UserRole = userRole === 'student' ? 'teacher' : 'student';
    setUserRole(nextRole);
    showToast(`Switched view to ${nextRole === 'teacher' ? 'Teacher Mode 👩‍🏫' : 'Student Mode 👨‍🎓'}!`, 'info');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo: user uploaded exact FUNNECT logo */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center group transition-transform active:scale-95 text-left focus:outline-none"
          >
            <FunnectLogo size="md" showTagline={true} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2">
            {currentNavItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            {/* Galeri Karya Flagship Link */}
            <button
              onClick={() => {
                handleNavClick('landing');
                setTimeout(() => {
                  const el = document.getElementById('showcase-gallery');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-3 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs transition-all transform hover:scale-105 active:scale-95"
            >
              <span>🎨</span>
              <span>Galeri Karya</span>
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-[9px] text-slate-900 font-black">
                SERU
              </span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Core Device Connection Status Pill */}
            <div className="relative">
              {coreDevice.connected ? (
                <button
                  onClick={() => setConnectModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-full text-xs font-bold text-emerald-800 transition-colors shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Core Connected</span>
                  <span className="bg-emerald-200/80 text-emerald-800 px-1.5 py-0.5 rounded-full text-[10px]">
                    {coreDevice.batteryPercent}%
                  </span>
                </button>
              ) : coreDevice.searchState === 'searching' ? (
                <button
                  onClick={() => setConnectModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-bold text-amber-800 animate-pulse"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Searching Core...</span>
                </button>
              ) : (
                <button
                  onClick={connectCore}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-xs font-bold text-slate-700 transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5 text-slate-500" />
                  <span>Connect Core</span>
                </button>
              )}
            </div>

            {/* Role Switcher Pill */}
            <button
              onClick={toggleRole}
              title={`Currently viewing as ${userRole}. Click to switch!`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 shadow-sm text-xs font-bold text-slate-700 transition-all active:scale-95"
            >
              {userRole === 'student' ? (
                <>
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Student</span>
                </>
              ) : (
                <>
                  <School className="w-4 h-4 text-amber-500" />
                  <span>Teacher</span>
                </>
              )}
              <span className="text-[10px] text-slate-400 font-normal">Switch</span>
            </button>

            {/* Quick Login / Profile Link */}
            <button
              onClick={() => handleNavClick('login')}
              className="px-3.5 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
            >
              {userRole === 'student' ? 'Builder Profile' : 'Teacher Portal'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleRole}
              className="p-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700"
            >
              {userRole === 'student' ? '👨‍🎓' : '👩‍🏫'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
            Navigation ({userRole === 'student' ? 'Student' : 'Teacher'})
          </div>
          {currentNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>
            );
          })}

          {/* Mobile Galeri Karya Button */}
          <button
            onClick={() => {
              handleNavClick('landing');
              setTimeout(() => {
                const el = document.getElementById('showcase-gallery');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-black bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 border border-amber-300 shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🎨</span>
              <span>Galeri Hasil Karya Cilik</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[10px] text-slate-900 font-black">
              LIHAT
            </span>
          </button>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={toggleRole}
              className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-700"
            >
              <span>Current Role: {userRole === 'student' ? '👨‍🎓 Student' : '👩‍🏫 Teacher'}</span>
              <span className="text-blue-600">Switch to {userRole === 'student' ? 'Teacher' : 'Student'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Connect Core Modal / Status Sheet */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">FUNNECT Core Status</h3>
                  <p className="text-xs text-slate-500">Physical Hardware Bridge</p>
                </div>
              </div>
              <button
                onClick={() => setConnectModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Connection:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {coreDevice.name} (Active)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Battery Level:</span>
                <span className="font-bold text-slate-800">{coreDevice.batteryPercent}% (Healthy)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Firmware:</span>
                <span className="font-mono text-slate-600">{coreDevice.firmwareVersion}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-xs font-bold text-slate-700 mb-2">Connected Modules on Core:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(coreDevice.ports).map(([portId, mod]) => {
                  const m = mod as FunnectModule | null;
                  return (
                    <div
                      key={portId}
                      className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between"
                    >
                      <span className="font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {portId}
                      </span>
                      <span className="truncate max-w-[120px] text-slate-700 font-medium">
                        {m ? m.name : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  disconnectCore();
                  setConnectModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
              >
                Disconnect
              </button>
              <button
                onClick={() => setConnectModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold shadow-sm transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
