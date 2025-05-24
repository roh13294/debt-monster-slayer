
import { Debt } from './gameTypes';

export interface MonsterTemplate {
  id: string;
  name: string;
  debtCategory: string;
  baseHp: number;
  attackPattern: AttackPattern;
  weaknesses: string[];
  resistances: string[];
  dialogue: MonsterDialogue;
  animations: MonsterAnimations;
  lootTable: LootDrop[];
}

export interface AttackPattern {
  id: string;
  name: string;
  description: string;
  damage: number;
  frequency: number;
  specialEffect?: SpecialEffect;
}

export interface SpecialEffect {
  type: 'interest_surge' | 'payment_block' | 'fear_inducement' | 'hp_drain';
  value: number;
  duration?: number;
}

export interface MonsterDialogue {
  intro: string[];
  taunts: string[];
  weakened: string[];
  defeated: string;
  critical_hit_received: string[];
}

export interface MonsterAnimations {
  idle: string;
  attack: string;
  hurt: string;
  death: string;
  special: string;
}

export interface LootDrop {
  itemId: string;
  dropRate: number;
  quantity: { min: number; max: number };
}

export interface BattleMonster extends Debt {
  template: MonsterTemplate;
  currentHp: number;
  maxHp: number;
  lastAttack: number;
  statusEffects: StatusEffect[];
  customName?: string;
}

export interface StatusEffect {
  type: string;
  value: number;
  duration: number;
  appliedAt: number;
}
