export type GameType = 'imposter' | 'spy' | 'mafia' | 'truth-dare';

export type NavigationTab = 'lobby' | 'rules' | 'settings';

export interface Player {
  id: string;
  name: string;
  avatarColor: string;
  avatarEmoji: string;
  isImposter: boolean;
  word: string;
  isEliminated?: boolean;
}

export interface WordPair {
  category: string;
  icon: string;
  civilian: string;
  imposter: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type ImposterGameState = 'setup' | 'reveal' | 'roulette' | 'arena' | 'finished';

// Mafia Types
export type MafiaRoleType = 'don' | 'mafia' | 'doctor' | 'sheriff' | 'maniac' | 'civilian';

export interface MafiaRoleConfig {
  id: MafiaRoleType;
  name: string;
  team: 'black' | 'red' | 'neutral';
  icon: string;
  description: string;
  orderNight: number;
  mission?: string;
  nightAction?: string;
  dayAction?: string;
}

export interface MafiaPlayer {
  id: string;
  name: string;
  avatarColor: string;
  avatarEmoji: string;
  role: MafiaRoleConfig;
  allies?: string[]; // Digər mafiya yoldaşlarının adları
}

export type MafiaGameState = 'setup' | 'reveal' | 'arena';
