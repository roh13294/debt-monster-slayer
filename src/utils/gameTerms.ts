
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

// Player level progression system
export const calculatePlayerLevel = (monthsPassed: number): number => {
  return Math.max(1, Math.floor(monthsPassed / 3) + 1);
};

// Player rank based on level
export const getPlayerRank = (level: number): string => {
  if (level >= 10) return 'Hashira';
  if (level >= 7) return 'Kinoe';
  if (level >= 5) return 'Kanoe';
  if (level >= 3) return 'Kanoto';
  if (level >= 2) return 'Mizunoto';
  return 'Initiate';
};
