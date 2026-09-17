import React from 'react';
import { BookOpen, ShieldCheck, HeartHandshake, FolderKanban, HelpCircle, AlertTriangle, Sparkles, Layers } from 'lucide-react';
import { MainView } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentView: MainView;
  setCurrentView: (view: MainView) => void;
  seniorMode: boolean;
  setSeniorMode: (enabled: boolean) => void;
  contactCount: number;
  isDemoData: boolean;
  onClearData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  seniorMode,
  setSeniorMode,
  contactCount,
  isDemoData,
  onClearData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#EEF2F6]/95 backdrop-blur-md border-b border-[#D8E1E8] shadow-[0_4px_12px_rgba(166,178,195,0.25)]">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Logo & App Name with tactile badge */}
        <div 
          onClick={() => setCurrentView('workflow')}
          className="flex items-center gap-3 cursor-pointer group"
          id="app-header-logo"
        >
          <div className="w-10 h-10 rounded-xl neu-raised flex items-center justify-center text-[#087F8C] group-hover:text-[#0994a3] transition-all transform group-active:scale-95 border border-white/60">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-bold tracking-tight text-[#17212B] font-['Plus_Jakarta_Sans'] ${seniorMode ? 'text-xl' : 'text-lg'}`}>
                Pocket Directory
              </span>
              <span className="hidden sm:inline-flex text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#087F8C]/10 text-[#087F8C] border border-[#087F8C]/20">
                100% Offline
              </span>
            </div>
            <p className="text-[11px] text-[#55697D] hidden xs:block">Private Local Address Book & Print</p>
          </div>
        </div>

        {/* Demo Data Banner if active */}
        {isDemoData && (
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg neu-inset text-xs text-[#B98A3D] font-medium border border-[#B98A3D]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demo Directory</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onClearData(); }}
              className="ml-1 text-[11px] underline hover:text-[#9A702E] font-semibold"
            >
              Clear
            </button>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* In-app PWA Install Button */}
          <PWAInstallButton />

          {/* Senior Mode Toggle */}
          <button
            onClick={() => setSeniorMode(!seniorMode)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              seniorMode
                ? 'neu-inset text-[#087F8C] font-semibold bg-[#DDF3F2]/50 border border-[#087F8C]/30'
                : 'neu-btn text-[#55697D] hover:text-[#17212B]'
            }`}
            title="Toggle Senior-Friendly large interface mode"
            id="toggle-senior-mode"
          >
            <HeartHandshake className="w-4 h-4 text-[#087F8C]" />
            <span className="hidden sm:inline">{seniorMode ? 'Senior Mode: On' : 'Senior Mode'}</span>
          </button>

          {/* Projects Button */}
          <button
            onClick={() => setCurrentView(currentView === 'projects' ? 'workflow' : 'projects')}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              currentView === 'projects'
                ? 'neu-inset text-[#087F8C] font-semibold'
                : 'neu-btn text-[#55697D] hover:text-[#17212B]'
            }`}
            title="Saved Directory Projects"
            id="nav-projects-btn"
          >
            <FolderKanban className="w-4 h-4" />
            <span className="hidden md:inline">Projects</span>
          </button>

          {/* Privacy Center Button */}
          <button
            onClick={() => setCurrentView(currentView === 'privacy' ? 'workflow' : 'privacy')}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              currentView === 'privacy'
                ? 'neu-inset text-[#267A4A] font-semibold'
                : 'neu-btn text-[#55697D] hover:text-[#17212B]'
            }`}
            title="Privacy Dashboard & Security Audit"
            id="nav-privacy-btn"
          >
            <ShieldCheck className="w-4 h-4 text-[#267A4A]" />
            <span className="hidden lg:inline">Privacy</span>
          </button>

          {/* Help Button */}
          <button
            onClick={() => setCurrentView(currentView === 'help' ? 'workflow' : 'help')}
            className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
              currentView === 'help'
                ? 'neu-inset text-[#087F8C] font-semibold'
                : 'neu-btn text-[#55697D] hover:text-[#17212B]'
            }`}
            title="Help Guides & Export Instructions"
            id="nav-help-btn"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden lg:inline">Help</span>
          </button>
        </div>
      </div>
    </header>
  );
};
