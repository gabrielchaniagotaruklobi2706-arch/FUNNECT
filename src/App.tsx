/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { FunnectNavbar } from './components/layout/FunnectNavbar';
import { FunnectFooter } from './components/layout/FunnectFooter';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { CreateProjectWizard } from './components/wizard/CreateProjectWizard';
import { BuildStudioPage } from './components/studio/BuildStudioPage';
import { SimulatorPage } from './components/simulator/SimulatorPage';
import { ProjectGuidePage } from './components/guide/ProjectGuidePage';
import { LearnPage } from './components/learn/LearnPage';
import { MyProjectsPage } from './components/projects/MyProjectsPage';
import { ClassesPage } from './components/teacher/ClassesPage';
import { ActivitiesPage } from './components/teacher/ActivitiesPage';
import { ProgressMonitorPage } from './components/teacher/ProgressMonitorPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView, toast } = useApp();

  const isFullscreenStudio = currentView === 'build-studio' || currentView === '3d-builder' || currentView === 'simulator';
  const isAuthPage = currentView === 'login';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-200 selection:text-blue-900">
      {/* Primary Brand Navbar (unless on dedicated clean auth view) */}
      {!isAuthPage && <FunnectNavbar />}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        <ErrorBoundary fallbackTitle="Halaman Projek Terkendala" onReset={() => setCurrentView('dashboard')}>
          {currentView === 'landing' && <LandingPage />}
          {currentView === 'login' && <LoginPage />}
          {currentView === 'dashboard' && <DashboardPage />}
          {currentView === 'create-project' && <CreateProjectWizard />}
          {(currentView === 'build-studio' || currentView === '3d-builder') && <BuildStudioPage />}
          {currentView === 'simulator' && <SimulatorPage />}
          {currentView === 'project-guide' && <ProjectGuidePage />}
          {currentView === 'learn' && <LearnPage />}
          {currentView === 'my-projects' && <MyProjectsPage />}
          {currentView === 'classes' && <ClassesPage />}
          {currentView === 'activities' && <ActivitiesPage />}
          {currentView === 'progress' && <ProgressMonitorPage />}
        </ErrorBoundary>
      </main>

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-red-900 text-white border-red-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Brand Footer (Hidden on 3D workspace studio and auth to maximize viewport) */}
      {!isFullscreenStudio && !isAuthPage && <FunnectFooter />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
