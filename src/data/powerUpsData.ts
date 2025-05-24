
import { PowerUp } from '@/types/powerUpTypes';

export const POWER_UPS: PowerUp[] = [
  {
    id: 'budget_buff',
    name: 'Budget Buff',
    description: 'Increases payment efficiency by 25% for 3 battles',
    icon: '💰',
    cost: 150,
    rarity: 'common',
    category: 'buff',
    effects: [
      { type: 'damage_boost', value: 25, duration: 3, target: 'self' }
    ],
    duration: 3
  },
  {
    id: 'snowball_slash',
    name: 'Snowball Slash',
    description: 'Deal extra damage based on debt amount difference',
    icon: '⚔️',
    cost: 200,
    rarity: 'rare',
    category: 'attack',
    effects: [
      { type: 'damage_boost', value: 50, target: 'single_debt' }
    ]
  },
  {
    id: 'interest_immunity',
    name: 'Interest Immunity',
    description: 'Reduces interest accumulation by 50% for 5 turns',
    icon: '🛡️',
    cost: 300,
    rarity: 'epic',
    category: 'defense',
    effects: [
      { type: 'interest_reduction', value: 50, duration: 5, target: 'all_debts' }
    ],
    duration: 5
  },
  {
    id: 'avalanche_assault',
    name: 'Avalanche Assault',
    description: 'Massive damage to highest interest debt',
    icon: '🏔️',
    cost: 500,
    rarity: 'legendary',
    category: 'attack',
    effects: [
      { type: 'damage_boost', value: 100, target: 'single_debt' }
    ],
    cooldown: 5
  },
  {
    id: 'wisdom_well',
    name: 'Wisdom Well',
    description: 'Double XP gain for next 3 battles',
    icon: '🧠',
    cost: 100,
    rarity: 'common',
    category: 'utility',
    effects: [
      { type: 'xp_boost', value: 100, duration: 3, target: 'self' }
    ],
    duration: 3
  },
  {
    id: 'coin_magnet',
    name: 'Coin Magnet',
    description: 'Increase DemonCoin rewards by 50% for 10 minutes',
    icon: '🧲',
    cost: 250,
    rarity: 'rare',
    category: 'utility',
    effects: [
      { type: 'coin_boost', value: 50, duration: 600, target: 'self' }
    ],
    duration: 600
  }
];
