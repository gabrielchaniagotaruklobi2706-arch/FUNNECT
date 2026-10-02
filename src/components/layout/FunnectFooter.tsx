import React from 'react';
import { useApp } from '../../context/AppContext';
import { FunnectLogo } from '../common/FunnectLogo';
import { Sparkles, Heart, Recycle, ArrowUpRight } from 'lucide-react';

export const FunnectFooter: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-14 pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-100">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <FunnectLogo size="md" showTagline={true} />
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Modular STEAM learning platform that connects physical recyclable creations with digital computing.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-xs font-semibold">
              <Recycle className="w-3.5 h-3.5 text-amber-600" />
              <span>Build with what you have</span>
            </div>
          </div>

          {/* Pillars */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4">
              FUNNECT Pillars
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li className="flex items-center gap-2 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span><strong>Core:</strong> Smart Project Brain</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span><strong>Connector:</strong> Reusable Joints</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <span><strong>Module:</strong> Sensors & Motors</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span><strong>Web App:</strong> 3D Studio & Code</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button
                  onClick={() => setCurrentView('create-project')}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>Create Project Wizard</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('build-studio')}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>3D Build Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('simulator')}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>Interactive Simulator</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('learn')}
                  className="hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <span>Learn Curriculum</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </li>
            </ul>
          </div>

          {/* Education & Community */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 mb-4">
              Educators & Schools
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <button
                  onClick={() => setCurrentView('classes')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Classroom Management
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('progress')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Live Student Progress
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('activities')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Curriculum Alignment
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('login')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Role Switcher
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 FUNNECT. Connect. Build. Have Fun. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Reusable • Accessible • Sustainable</span>
            <span>•</span>
            <span>Empowering Young Builders Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
