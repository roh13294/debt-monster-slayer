export type Element = 'none'|'fire'|'ice'|'storm'|'shadow'|'radiant';

export interface Stats {
  hp: number;
  resolve: number;
  atk: number;
  def: number;
  speed: number;
  critChance: number;
  critMult: number;
  element: Element;
}

export type SkillTag = 'single'|'multi'|'buff'|'debuff'|'dot'|'heal';

export interface SkillDef {
  id: string;
  name: string;
  desc: string;
  cost: number;
  cooldown: number;
  tags: SkillTag[];
  effectKey: string; // looked up in engine
}

export interface DemonDef extends Stats {
  id: string;
  name: string;
  level: number;
  affinity: Partial<Record<Element, number>>; // e.g., {fire:1.25, ice:0.9}
  aiProfile: 'aggressive'|'defensive'|'tricky';
  moveset: string[]; // skill ids
  phases?: Array<{
    threshold: number; // 0..1
    addMoves?: string[];
    removeMoves?: string[];
    statMods?: Partial<Stats>;
    intentHint?: string;
  }>;
  lootTableId?: string;
}

export interface Rewards {
  xp: number;
  gold: number;
  shards?: number;
  relics?: string[];
}

export interface BattleOutcome {
  outcome: 'win'|'lose'|'flee';
  rewards?: Rewards;
}
