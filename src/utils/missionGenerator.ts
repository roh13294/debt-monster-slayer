
import { Debt } from "@/types/gameTypes";

export interface MissionDifficultyModifiers {
  shadowSurge: boolean;
  moonlessNight: boolean;
  inflationPulse: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  objectives: {
    type: 'defeat' | 'damage' | 'combo' | 'time';
    target: number;
    reward: string;
  }[];
}

// Backstory snippets for mission descriptions
const backstorySnippets = [
  "These debts have grown stronger in the moonlight, their corruption spreading faster than before.",
  "The elder demons have been teaching the younger ones, making them more resistant to your techniques.",
  "A rare alignment of financial stars has empowered these debt demons with additional resistances.",
  "Your ancestors whisper warnings about these particularly cunning financial entities.",
  "The interest demons have formed an alliance to drain your spirit energy more efficiently.",
  "Ancient scrolls warned of these demons rising during times of economic uncertainty.",
  "The breathing master warned you that these demons would require perfect technique to defeat.",
  "The shadow realm bleeds into reality, strengthening these particular financial curses.",
  "These demons feed on each other's energy, growing stronger when their allies are nearby."
];

// Mission titles
const missionTitles = [
  "Financial Purification",
  "Debt Demon Cleansing",
  "Monetary Liberation",
  "Shadow Account Banishing",
  "Balance Sheet Restoration",
  "Fiscal Exorcism",
  "Economic Spirit Cleanse",
  "Financial Veil Piercing",
  "Credit Curse Breaking",
  "Interest Demon Hunt"
];

// Generate a unique mission based on selected demons and modifiers
export function generateBattleMission(
  demons: Debt[], 
  modifiers: MissionDifficultyModifiers
): Mission {
  const id = `mission-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Calculate difficulty based on demons and modifiers
  let difficultyScore = 0;
  
  // Add base difficulty from demons
  difficultyScore += demons.length;
  
  // Add difficulty from total debt amount
  const totalDebt = demons.reduce((sum, demon) => sum + demon.balance, 0);
  difficultyScore += totalDebt > 50000 ? 3 : totalDebt > 20000 ? 2 : totalDebt > 10000 ? 1 : 0;
  
  // Add difficulty from interest rates
  const highInterestCount = demons.filter(d => d.interestRate > 15).length;
  difficultyScore += highInterestCount * 0.5;
  
  // Add difficulty from modifiers
  if (modifiers.shadowSurge) difficultyScore += 1;
  if (modifiers.moonlessNight) difficultyScore += 0.5;
  if (modifiers.inflationPulse) difficultyScore += 1.5;
  
  // Determine difficulty level
  let difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  if (difficultyScore > 8) difficulty = 'extreme';
  else if (difficultyScore > 6) difficulty = 'hard';
  else if (difficultyScore > 4) difficulty = 'medium';
  else difficulty = 'easy';
  
  // Generate objectives
  const objectives = generateMissionObjectives(demons, difficulty);
  
  // Generate title and description
  const title = missionTitles[Math.floor(Math.random() * missionTitles.length)];
  
  // Build description
  const backstory = backstorySnippets[Math.floor(Math.random() * backstorySnippets.length)];
  const demonNames = demons.map(d => d.name).join(', ');
  
  let description = `Your target${demons.length > 1 ? 's' : ''}: ${demonNames}. ${backstory}`;
  
  // Add modifier effects to description
  if (modifiers.shadowSurge) {
    description += " The shadow surge has strengthened their curse power, making them more resistant.";
  }
  
  if (modifiers.moonlessNight) {
    description += " The moonless night reduces the chance of finding valuable loot from defeated demons.";
  }
  
  if (modifiers.inflationPulse) {
    description += " An inflation pulse makes their interest attacks more devastating.";
  }

  return {
    id,
    title,
    description,
    difficulty,
    objectives
  };
}

// Generate mission objectives based on demons and difficulty
function generateMissionObjectives(demons: Debt[], difficulty: 'easy' | 'medium' | 'hard' | 'extreme') {
  const objectives = [];
  
  // Primary objective: defeat all demons
  objectives.push({
    type: 'defeat',
    target: demons.length,
    reward: 'XP Boost'
  });
  
  // Secondary objectives based on difficulty
  if (difficulty === 'medium' || difficulty === 'hard' || difficulty === 'extreme') {
    // Add combo objective for medium+ difficulty
    objectives.push({
      type: 'combo',
      target: difficulty === 'extreme' ? 10 : difficulty === 'hard' ? 7 : 5,
      reward: 'Spirit Fragment'
    });
  }
  
  if (difficulty === 'hard' || difficulty === 'extreme') {
    // Add damage objective for hard+ difficulty
    const totalHealth = demons.reduce((sum, demon) => sum + demon.balance, 0);
    objectives.push({
      type: 'damage',
      target: Math.floor(totalHealth * 0.5),
      reward: 'Breathing XP Boost'
    });
  }
  
  return objectives;
}
