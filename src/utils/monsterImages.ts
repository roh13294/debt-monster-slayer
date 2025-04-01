
// Map debt types to their corresponding image paths
type MonsterImageMap = {
  [key: string]: string;
};

export const monsterImages: MonsterImageMap = {
  'Credit Card Debt': '/lovable-uploads/aac1901c-69b5-4be1-ab49-f4d376bd1caa.png', // Red monster with credit cards
  'Student Loan': '/lovable-uploads/1ec47d45-e603-47dc-bdb4-655382af260c.png', // Green monster with documents
  'Car Loan': '/lovable-uploads/576d43d4-0e69-4f26-86e4-a7c278ba1bbd.png', // Yellow/gold lion monster
  'Mortgage': '/lovable-uploads/82795244-4974-4b99-acb2-d24ab6e532af.png', // Stone golem with hourglass
  'Personal Loan': '/lovable-uploads/89f2cd89-81c4-4ac1-920c-5c23a8b1c8d6.png', // Purple snake in suit
  // Default fallback image if no specific one is found
  'default': '/lovable-uploads/aac1901c-69b5-4be1-ab49-f4d376bd1caa.png'
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
