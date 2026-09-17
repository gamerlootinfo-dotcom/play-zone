'use client';

import React from 'react';
import { Gamepad2, BookOpen, Settings, Volume2, VolumeX } from 'lucide-react';
import { NavigationTab } from '@/types';
import { sounds, triggerHaptic } from '@/utils/audio';

interface HomeBarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onGoHome?: () => void;
}

export default function HomeBar({
  activeTab,
  onSelectTab,
  isMuted,
  onToggleMute,
  onGoHome,
}: HomeBarProps) {
  const handleTabClick = (tab: NavigationTab) => {
    sounds.playClick();
    triggerHaptic(20);
    if (tab === 'lobby' && onGoHome) {
      onGoHome();
    }
    onSelectTab(tab);
  };

  return (
    <>
      {/* Desktop Header Navigation */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 bg-game-dark/80 backdrop-blur-xl border-b border-game-border/60 px-6 py-3.5 items-center justify-between">
        <button
          onClick={() => handleTabClick('lobby')}
          className="flex items-center gap-3 group text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
            <div className="w-full h-full bg-game-dark rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              PLAYZONE
            </h1>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase font-semibold">
              Partiya Oyunları Platforması
            </p>
          </div>
        </button>

        <nav className="flex items-center gap-2">
          <button
            onClick={() => handleTabClick('lobby')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'lobby'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/20'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Oyunlar</span>
          </button>

          <button
            onClick={() => handleTabClick('rules')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'rules'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Qaydalar</span>
          </button>

          <button
            onClick={() => handleTabClick('settings')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Haqqında</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            title={isMuted ? 'Səsi Aç' : 'Səsi Bağla'}
            className="p-2 ml-2 rounded-xl text-gray-400 hover:text-purple-300 hover:bg-white/5 transition-all"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-cyan-400" />}
          </button>
        </nav>
      </header>

      {/* Mobile Top Mini Bar (Sound button & Title) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-game-dark/85 backdrop-blur-lg border-b border-game-border/50 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => handleTabClick('lobby')}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1.5px]">
            <div className="w-full h-full bg-game-dark rounded-[6px] flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <span className="font-extrabold text-sm tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            PLAYZONE
          </span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onToggleMute();
          }}
          className="p-1.5 rounded-lg bg-game-card/80 border border-game-border/80 text-gray-300 active:scale-95 transition-transform"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>

      {/* Mobile Bottom Home Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-game-dark/95 backdrop-blur-2xl border-t border-game-border/80 px-4 py-2 safe-area-pb">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Oyunlar / Lobi */}
          <button
            onClick={() => handleTabClick('lobby')}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all ${
              activeTab === 'lobby'
                ? 'text-purple-400 scale-105'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'lobby' ? 'bg-purple-500/20 shadow-lg shadow-purple-500/30' : ''}`}>
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold mt-1">Oyunlar</span>
            {activeTab === 'lobby' && (
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-0.5 shadow-sm shadow-purple-400 animate-pulse" />
            )}
          </button>

          {/* Qaydalar */}
          <button
            onClick={() => handleTabClick('rules')}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all ${
              activeTab === 'rules'
                ? 'text-cyan-400 scale-105'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'rules' ? 'bg-cyan-500/20 shadow-lg shadow-cyan-500/30' : ''}`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold mt-1">Qaydalar</span>
            {activeTab === 'rules' && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-0.5 shadow-sm shadow-cyan-400 animate-pulse" />
            )}
          </button>

          {/* Haqqında */}
          <button
            onClick={() => handleTabClick('settings')}
            className={`flex flex-col items-center justify-center py-1 px-4 rounded-2xl transition-all ${
              activeTab === 'settings'
                ? 'text-pink-400 scale-105'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-pink-500/20 shadow-lg shadow-pink-500/30' : ''}`}>
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold mt-1">Haqqında</span>
            {activeTab === 'settings' && (
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-0.5 shadow-sm shadow-pink-400 animate-pulse" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
