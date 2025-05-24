
export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'attack' | 'defense' | 'utility' | 'buff';
  effects: PowerUpEffect[];
  cooldown?: number;
  duration?: number;
  stackable?: boolean;
  maxStacks?: number;
}

export interface PowerUpEffect {
  type: 'damage_boost' | 'interest_reduction' | 'cooldown_reduction' | 'xp_boost' | 'coin_boost';
  value: number;
  duration?: number;
  target?: 'self' | 'all_debts' | 'single_debt';
}

export interface ActivePowerUp {
  powerUpId: string;
  activatedAt: number;
  expiresAt?: number;
  stacks: number;
}

export interface PowerUpInventory {
  owned: string[];
  active: ActivePowerUp[];
  cooldowns: Record<string, number>;
}
