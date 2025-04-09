
import { Debt } from './gameTypes';

export interface BattleState {
  inBattle: boolean;
  currentDebtId: string | null;
  ragePhase: boolean;
  frenzyPhase: boolean;
  lastAttackTime: number;
  comboCounter: number;
  battleLog: BattleLogEntry[];
}

export interface BattleLogEntry {
  id: string;
  message: string;
  timestamp: number;
  type: 'attack' | 'special' | 'phase-change' | 'system';
}

export interface SpecialTechnique {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  effectType: 'interest' | 'damage' | 'defense';
  effectValue: number;
  unlocked: boolean;
}

export interface LootItem {
  type: 'Demon Seal' | 'Spirit Fragment' | 'Skill Scroll';
  rarity: 'Common' | 'Rare' | 'Epic';
  name: string;
  description: string;
  value: number;
  effect?: string;
}

export interface BattleContext {
  debt: Debt;
  stance: string | null;
  ragePhase?: boolean;
  frenzyPhase?: boolean;
}

// Add a global window interface extension
declare global {
  interface Window {
    hitMonster?: () => void;
  }
}
