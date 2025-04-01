
// Map debt types to their corresponding image paths
type MonsterImageMap = {
  [key: string]: string;
};

export const monsterImages: MonsterImageMap = {
  'Credit Card Debt': '/images/credit-card-monster.png', // Red monster with credit cards
  'Student Loan': '/images/student-loan-monster.png', // Green monster with documents
  'Car Loan': '/images/car-loan-monster.png', // Yellow/gold lion monster
  'Mortgage': '/images/mortgage-monster.png', // Stone golem with hourglass
  'Personal Loan': '/images/personal-loan-monster.png', // Purple snake in suit
  // Default fallback image if no specific one is found
  'default': '/images/default-monster.png'
};

// Helper function to get the right monster image based on debt name
export const getMonsterImage = (debtName: string): string => {
  // Check for direct matches first
  if (monsterImages[debtName]) {
    return monsterImages[debtName];
  }
  
  // If no direct match, check for partial matches
  for (const [key, imagePath] of Object.entries(monsterImages)) {
    if (debtName.toLowerCase().includes(key.toLowerCase()) && key !== 'default') {
      return imagePath;
    }
  }
  
  // Return default if no match
  return monsterImages['default'];
};
