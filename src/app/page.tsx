'use client';

import React, { useState } from 'react';
import ParticleBackground from '@/components/ParticleBackground';
import HomeBar from '@/components/HomeBar';
import Lobby from '@/components/Lobby';
import ImposterSetup from '@/components/imposter/ImposterSetup';
import CardReveal from '@/components/imposter/CardReveal';
import GameArena from '@/components/imposter/GameArena';
import MafiaSetup from '@/components/mafia/MafiaSetup';
import MafiaCardReveal from '@/components/mafia/MafiaCardReveal';
import MafiaArena from '@/components/mafia/MafiaArena';
import RulesModal from '@/components/RulesModal';
import SettingsModal from '@/components/SettingsModal';
import { GameType, NavigationTab, Player, ImposterGameState, MafiaPlayer, MafiaGameState } from '@/types';
import { sounds } from '@/utils/audio';

export default function HomePage() {
  // Əsas Naviqasiya Vəziyyəti
  const [activeTab, setActiveTab] = useState<NavigationTab>('lobby');
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // İmposter Oyunu Vəziyyətləri
  const [imposterState, setImposterState] = useState<ImposterGameState>('setup');
  const [players, setPlayers] = useState<Player[]>([]);
  const [activeWordPair, setActiveWordPair] = useState<{
    civilian: string;
    imposter: string;
    category: string;
    icon: string;
  }>({
    civilian: 'Çay',
    imposter: 'Qəhvə',
    category: 'Qida & İçki',
    icon: '🍕',
  });

  // Mafia Oyunu Vəziyyətləri
  const [mafiaState, setMafiaState] = useState<MafiaGameState>('setup');
  const [mafiaPlayers, setMafiaPlayers] = useState<MafiaPlayer[]>([]);

  // Səs idarəsi
  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    sounds.setMuted(nextMute);
  };

  // Naviqasiya Seçimi
  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    if (tab === 'rules') {
      setIsRulesOpen(true);
    } else if (tab === 'settings') {
      setIsSettingsOpen(true);
    }
  };

  // Oyun Seçimi (Lobi -> Oyun)
  const handleSelectGame = (game: GameType) => {
    if (game === 'imposter') {
      setSelectedGame('imposter');
      setImposterState('setup');
    } else if (game === 'mafia') {
      setSelectedGame('mafia');
      setMafiaState('setup');
    }
  };

  // Lobiyə qayıdış
  const handleGoHome = () => {
    setSelectedGame(null);
    setImposterState('setup');
    setMafiaState('setup');
    setActiveTab('lobby');
  };

  // İmposter Oyunu Başladı (Quraşdırma bitdi -> Kart baxışı)
  const handleStartImposterGame = (
    newPlayers: Player[],
    categoryId: string,
    wordPair: { civilian: string; imposter: string; category: string; icon: string }
  ) => {
    setPlayers(newPlayers);
    setActiveWordPair(wordPair);
    setImposterState('reveal');
  };

  // Bütün İmposter kartlarına baxıldı -> Arena
  const handleAllCardsRevealed = () => {
    setImposterState('arena');
  };

  // Mafia Oyunu Başladı (Quraşdırma bitdi -> Kart baxışı)
  const handleStartMafiaGame = (newMafiaPlayers: MafiaPlayer[]) => {
    setMafiaPlayers(newMafiaPlayers);
    setMafiaState('reveal');
  };

  // Bütün Mafia kartlarına baxıldı -> Arena
  const handleAllMafiaCardsRevealed = () => {
    setMafiaState('arena');
  };

  return (
    <main className="relative min-h-screen flex flex-col justify-between pt-14 md:pt-20 pb-16 md:pb-6 overflow-x-hidden">
      {/* İşıqlı Partikıl Arxa Fonu */}
      <ParticleBackground />

      {/* Əsas Oyun Məzmunu */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
        {/* 1. LOBİ (Oyun Seçilməyibsə) */}
        {!selectedGame && (
          <Lobby
            onSelectGame={handleSelectGame}
            onOpenRules={() => setIsRulesOpen(true)}
          />
        )}

        {/* 2. İMPOSTER OYUN SƏHNƏLƏRİ */}
        {selectedGame === 'imposter' && (
          <>
            {/* 2.1 Quraşdırma Mərhələsi */}
            {imposterState === 'setup' && (
              <ImposterSetup
                onStartGame={handleStartImposterGame}
                onBackToLobby={handleGoHome}
              />
            )}

            {/* 2.2 Kart Baxışı (Hold to Reveal) */}
            {imposterState === 'reveal' && (
              <CardReveal
                players={players}
                wordPairCategory={activeWordPair.category}
                wordPairIcon={activeWordPair.icon}
                onAllCardsRevealed={handleAllCardsRevealed}
                onResetGame={handleGoHome}
              />
            )}

            {/* 2.3 Oyun Arenası (İlk Başlayan Seçimi və İmposterləri Aç) */}
            {imposterState === 'arena' && (
              <GameArena
                players={players}
                wordPair={activeWordPair}
                onPlayAgain={() => setImposterState('setup')}
                onNewGameSetup={handleGoHome}
              />
            )}
          </>
        )}

        {/* 3. MAFIA OYUN SƏHNƏLƏRİ */}
        {selectedGame === 'mafia' && (
          <>
            {/* 3.1 Mafia Quraşdırma */}
            {mafiaState === 'setup' && (
              <MafiaSetup
                onStartGame={handleStartMafiaGame}
                onBackToLobby={handleGoHome}
              />
            )}

            {/* 3.2 Mafia Kart Baxışı (Hold to Reveal) */}
            {mafiaState === 'reveal' && (
              <MafiaCardReveal
                players={mafiaPlayers}
                onAllCardsRevealed={handleAllMafiaCardsRevealed}
                onResetGame={handleGoHome}
              />
            )}

            {/* 3.3 Mafia Arena / Gecə-Gündüz Aparıcı və Rolları Aç */}
            {mafiaState === 'arena' && (
              <MafiaArena
                players={mafiaPlayers}
                onPlayAgain={() => setMafiaState('setup')}
                onNewGameSetup={handleGoHome}
              />
            )}
          </>
        )}
      </div>

      {/* Naviqasiya Paneli (Masaüstü & Mobil Home Bar) */}
      <HomeBar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onGoHome={handleGoHome}
      />

      {/* Qaydalar Modalı */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => {
          setIsRulesOpen(false);
          if (activeTab === 'rules') setActiveTab('lobby');
        }}
      />

      {/* Ayarlar / Haqqında Modalı */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          if (activeTab === 'settings') setActiveTab('lobby');
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />
    </main>
  );
}
