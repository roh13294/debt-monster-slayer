
export type MonsterProfile = {
  type: 'red' | 'blue' | 'green' | 'purple' | 'yellow';
  name: string;
  personality: string;
  catchphrase: string;
  weakness: string;
  story: string;
  abilities: string[];
};

export const monsterProfiles: Record<string, MonsterProfile> = {
  'Credit Card Debt': {
    type: 'red',
    name: 'Credito the Devourer',
    personality: 'Impulsive and tempting',
    catchphrase: "Just swipe now, worry later!",
    weakness: 'Consistent payments',
    story: 'Credito grew powerful by tempting people with instant gratification. He feeds on minimum payments and grows stronger with each new purchase.',
    abilities: ['Interest Bite', 'Fee Explosion', 'Balance Transfer Dodge']
  },
  'Student Loan': {
    type: 'blue',
    name: 'Edudebt the Persistent',
    personality: 'Patient and relentless',
    catchphrase: "I'll follow you for decades!",
    weakness: 'Extra payments to principal',
    story: 'Edudebt started as a helpful friend, offering knowledge in exchange for a small commitment. Now he follows you everywhere, demanding regular tributes.',
    abilities: ['Knowledge Tax', 'Capitalized Interest', 'Deferment Illusion']
  },
  'Car Loan': {
    type: 'green',
    name: 'Autoloan the Depreciator',
    personality: 'Flashy but fading',
    catchphrase: "Vroom vroom! Your value's going down!",
    weakness: 'Accelerated payments',
    story: 'Autoloan lured you with shiny metal and that new car smell. While your car loses value, he keeps demanding the same payment month after month.',
    abilities: ['Depreciation Drain', 'Maintenance Surprise', 'Insurance Requirement']
  },
  'Mortgage': {
    type: 'purple',
    name: 'Mortgagus the Longhaul',
    personality: 'Slow and steady',
    catchphrase: "I'll be with you for 30 years!",
    weakness: 'Refinancing',
    story: "Mortgagus gave you shelter, but at a steep price. He's the largest of the debt monsters, with the longest lifespan, collecting interest for decades.",
    abilities: ['Equity Absorption', 'Term Extension', 'Property Tax Pass-through']
  },
  'Medical Debt': {
    type: 'yellow',
    name: 'Medicalus the Unexpected',
    personality: 'Surprising and stressful',
    catchphrase: "Surprise! I appeared when you least expected!",
    weakness: 'Payment plans',
    story: "Medicalus strikes when you're already down, adding financial stress to health problems. He sneaks up with confusing bills and unexpected costs.",
    abilities: ['Insurance Denial', 'Code Confusion', 'Billing Surprise']
  },
  'Personal Loan': {
    type: 'red',
    name: 'Personus the Tempter',
    personality: 'Friendly but demanding',
    catchphrase: "I'm here to help... for a price!",
    weakness: 'Disciplined budgeting',
    story: 'Personus appeared as a friend in your time of need, offering quick cash. Now he expects regular payments, regardless of your situation.',
    abilities: ['Term Shortener', 'Rate Hike', 'Prepayment Penalty']
  },
  'Payday Loan': {
    type: 'red',
    name: 'Paydus the Predator',
    personality: 'Aggressive and tricky',
    catchphrase: "Need cash now? I'll cost you later!",
    weakness: 'Alternative financing',
    story: 'Paydus preys on the desperate, offering quick relief that turns into a vicious cycle. His small loans carry enormous interest rates.',
    abilities: ['Rollover Trap', 'Hidden Fee Attack', 'Salary Intercept']
  },
  'Business Loan': {
    type: 'purple',
    name: 'Bizloan the Gambler',
    personality: 'Risk-taking and opportunistic',
    catchphrase: "Big dreams require big money!",
    weakness: 'Revenue growth',
    story: 'Bizloan tempts entrepreneurs with capital for their dreams, but demands regular tribute regardless of business performance.',
    abilities: ['Collateral Claim', 'Personal Guarantee', 'Cash Flow Drain']
  }
};

// Default monster profile for any debt type not specifically defined
export const defaultMonsterProfile: MonsterProfile = {
  type: 'red',
  name: 'Debtimus Prime',
  personality: 'Greedy and persistent',
  catchphrase: "Your money is mine!",
  weakness: 'Strategic payments',
  story: 'Debtimus lives to consume your wealth through interest and fees. Every payment weakens him slightly, but only a final payoff will defeat him.',
  abilities: ['Interest Charge', 'Late Fee', 'Minimum Payment Trap']
};

// Function to get monster profile based on debt name
export const getMonsterProfile = (debtName: string): MonsterProfile => {
  for (const [key, profile] of Object.entries(monsterProfiles)) {
    if (debtName.toLowerCase().includes(key.toLowerCase())) {
      return profile;
    }
  }
  return defaultMonsterProfile;
};
