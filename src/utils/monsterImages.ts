
// Map debt types to their corresponding image paths and lore
type MonsterImageMap = {
  [key: string]: string;
};

export const monsterImages: MonsterImageMap = {
  'Credit Card Debt': '/images/credit-demon.png', // Red demon with credit cards
  'Student Loan': '/images/brain-demon.png', // Brain demon with scrolls
  'Car Loan': '/images/lion-demon.png', // Yellow/gold lion demon
  'Mortgage': '/images/stone-golem.png', // Stone golem with binding chains
  'Personal Loan': '/images/snake-demon.png', // Purple serpent in dark robes
  // Default fallback image if no specific one is found
  'default': '/images/default-monster.png'
};

// Helper function to get the right demon image based on curse type
export const getMonsterImage = (curseType: string): string => {
  // Check for direct matches first
  if (monsterImages[curseType]) {
    console.log(`Direct match found for "${curseType}": ${monsterImages[curseType]}`);
    return monsterImages[curseType];
  }
  
  // If no direct match, check for partial matches
  for (const [key, imagePath] of Object.entries(monsterImages)) {
    if (curseType.toLowerCase().includes(key.toLowerCase()) && key !== 'default') {
      console.log(`Partial match found for "${curseType}" with key "${key}": ${imagePath}`);
      return imagePath;
    }
  }
  
  // Return default if no match
  console.log(`No match found for "${curseType}", using default: ${monsterImages['default']}`);
  return monsterImages['default'];
};

// New helper function to get demon element type based on curse (debt) type
export const getDemonElementType = (curseType: string): string => {
  if (curseType.toLowerCase().includes('credit card')) return 'fire';
  if (curseType.toLowerCase().includes('student')) return 'spirit';
  if (curseType.toLowerCase().includes('car')) return 'lightning';
  if (curseType.toLowerCase().includes('mortgage')) return 'earth';
  if (curseType.toLowerCase().includes('personal')) return 'shadow';
  
  // Default element if no match
  return 'chaos';
};

// Get demon rank based on curse (debt) amount
export const getDemonRank = (curseAmount: number): string => {
  if (curseAmount >= 50000) return 'S-Rank Overlord';
  if (curseAmount >= 20000) return 'A-Rank Greater Demon';
  if (curseAmount >= 10000) return 'B-Rank Demon';
  if (curseAmount >= 5000) return 'C-Rank Lesser Demon';
  return 'D-Rank Imp';
};
