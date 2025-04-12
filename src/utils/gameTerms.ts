
// Game terminology mapping to replace financial terms with RPG terms
type GameTermsType = {
  [key: string]: string | ((term: string) => string);
}

// Define the base terms object first
const baseTerms = {
  // Financial concepts
  income: 'Spirit Flow',
  expenses: 'Corruption Drain',
  debt: 'Curse Bind',
  cash: 'Spirit Energy',
  budget: 'Soul Alignment',
  payment: 'Spirit Strike',
  savings: 'Power Seal',
  interest: 'Corruption Aura',
  streak: 'Flame Aura Combo',
  'total debt': 'Demon HP',
  'mental damage': 'Willpower Strain',
  'experience points': 'Soul Resonance',
  'xp': 'Soul Resonance',
  'level': 'Slayer Rank',
  'level up': 'Rank Ascension',
  
  // Actions
  pay: 'strike',
  save: 'seal',
  invest: 'channel',
  
  // Statuses
  low: 'weakened',
  high: 'empowered',
  overdue: 'enraged',
  paid: 'purified',
};

// Helper function to translate finance terms to game terms
const translateTerm = (term: string): string => {
  const lowerTerm = term.toLowerCase();
  
  // Check if we have a direct match in baseTerms
  for (const [key, value] of Object.entries(baseTerms)) {
    if (key === lowerTerm) {
      return value as string; // We know it's a string from baseTerms
    }
  }
  
  // Check for partial matches in longer phrases
  if (lowerTerm.includes('payment')) return lowerTerm.replace('payment', 'Spirit Strike');
  if (lowerTerm.includes('budget')) return lowerTerm.replace('budget', 'Soul Alignment');
  if (lowerTerm.includes('debt')) return lowerTerm.replace('debt', 'Curse Bind');
  if (lowerTerm.includes('save')) return lowerTerm.replace('save', 'seal');
  if (lowerTerm.includes('cash')) return lowerTerm.replace('cash', 'Spirit Energy');
  if (lowerTerm.includes('mental damage')) return lowerTerm.replace('mental damage', 'Willpower Strain');
  if (lowerTerm.includes('total debt')) return lowerTerm.replace('total debt', 'Demon HP');
  if (lowerTerm.includes('xp')) return lowerTerm.replace('xp', 'Soul Resonance');
  if (lowerTerm.includes('level up')) return lowerTerm.replace('level up', 'Rank Ascension');
  
  // Return original if no match
  return term;
};

// Now create the gameTerms object with properly typed translate function
export const gameTerms: GameTermsType = {
  ...baseTerms,
  // Add the translate function separately
  translate: translateTerm
};

// Different battle stances (replacing financial strategies)
export const battleStances = [
  {
    id: 'aggressive',
    name: 'Flame Breathing',
    description: 'Channel more energy into attacks, dealing greater damage to demons',
    effect: 'Increases damage dealt to curses by 15%',
    icon: 'Flame',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'defensive',
    name: 'Water Breathing',
    description: 'Focus on defensive techniques to protect your spirit energy',
    effect: 'Increases your Power Seal (savings) by 5%',
    icon: 'Shield',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'risky',
    name: 'Thunder Breathing',
    description: 'Unpredictable attacks that can deal massive damage or leave you exposed',
    effect: 'Chance for critical hits or missed attacks',
    icon: 'Zap',
    color: 'from-purple-500 to-indigo-500'
  }
];

// Player level progression system - updated to use the new XP-based system
export const calculatePlayerLevel = (xp: number): number => {
  if (xp < 100) return 1;
  
  let level = 1;
  let threshold = 100;
  let totalXP = 0;
  
  while (totalXP <= xp) {
    level++;
    totalXP += threshold;
    threshold = 100 + (level - 1) * 50;
  }
  
  return Math.max(1, level - 1);
};

// Player rank based on level - preserved for backward compatibility
export const getPlayerRank = (level: number): string => {
  if (level >= 30) return 'Ascendant';
  if (level >= 20) return 'Bladelord Magnate';
  if (level >= 15) return 'Demon Slayer';
  if (level >= 12) return 'Relic Hunter';
  if (level >= 8) return 'Breathing Adept';
  if (level >= 5) return 'Shadow Initiate';
  if (level >= 3) return 'Debt Brawler';
  return 'Wandering Soul';
};
