
export type MonsterProfile = {
  type: 'red' | 'blue' | 'green' | 'purple' | 'yellow';
  name: string;
  personality: string;
  catchphrase: string;
  weakness: string;
  story: string;
  abilities: string[];
  backstory: string; // New field for emotional backstory
  victoryMessage: string; // New field for when player defeats the monster
};

export const monsterProfiles: Record<string, MonsterProfile> = {
  'Credit Card Debt': {
    type: 'red',
    name: 'Credito the Devourer',
    personality: 'Impulsive and tempting',
    catchphrase: "Just swipe now, worry later!",
    weakness: 'Consistent payments',
    story: 'Credito grew powerful by tempting people with instant gratification. He feeds on minimum payments and grows stronger with each new purchase.',
    abilities: ['Interest Bite', 'Fee Explosion', 'Balance Transfer Dodge'],
    backstory: 'Credito was born from impulse - every swipe made him stronger. He lurks in shopping malls and online checkouts, whispering "you deserve this" into the ears of the vulnerable. His victims trade their futures for fleeting moments of joy, never realizing the true cost until they\'re trapped in his web of compound interest.',
    victoryMessage: 'As you make your final payment, Credito shrieks in pain. "How could you resist my temptations?" he moans as he dissolves into a pile of shredded plastic cards. You\'ve broken the cycle of impulse spending!'
  },
  'Student Loan': {
    type: 'blue',
    name: 'Edudebt the Persistent',
    personality: 'Patient and relentless',
    catchphrase: "I'll follow you for decades!",
    weakness: 'Extra payments to principal',
    story: 'Edudebt started as a helpful friend, offering knowledge in exchange for a small commitment. Now he follows you everywhere, demanding regular tributes.',
    abilities: ['Knowledge Tax', 'Capitalized Interest', 'Deferment Illusion'],
    backstory: 'Edudebt began as a well-meaning spirit of opportunity, promising a better future to young dreamers. But over time, he transformed into a burden, watching silently as his victims postponed homes, families, and dreams. "It was all for your own good," he whispers, even as he drains away decades of potential.',
    victoryMessage: 'Edudebt looks at you with grudging respect as you make your final payment. "You\'ve earned your freedom," he admits before fading away. Your education is finally, truly yours.'
  },
  'Car Loan': {
    type: 'green',
    name: 'Autoloan the Depreciator',
    personality: 'Flashy but fading',
    catchphrase: "Vroom vroom! Your value's going down!",
    weakness: 'Accelerated payments',
    story: 'Autoloan lured you with shiny metal and that new car smell. While your car loses value, he keeps demanding the same payment month after month.',
    abilities: ['Depreciation Drain', 'Maintenance Surprise', 'Insurance Requirement'],
    backstory: 'Autoloan was forged in the showrooms of desire, tempting victims with leather seats and engine power they\'ll never use. He feeds on vanity, growing fat as his victims drive away in vehicles worth less with each passing day. "At least you look successful," he chuckles, even as he empties your wallet.',
    victoryMessage: 'Autoloan sputters and stalls as you make your final payment. The keys in your hand feel different now - they represent true ownership, not borrowed status. Your vehicle is finally yours alone.'
  },
  'Mortgage': {
    type: 'purple',
    name: 'Mortgagus the Longhaul',
    personality: 'Slow and steady',
    catchphrase: "I'll be with you for 30 years!",
    weakness: 'Refinancing',
    story: "Mortgagus gave you shelter, but at a steep price. He's the largest of the debt monsters, with the longest lifespan, collecting interest for decades.",
    abilities: ['Equity Absorption', 'Term Extension', 'Property Tax Pass-through'],
    backstory: 'Mortgagus watched his victim stop dreaming after signing a loan they didn\'t understand. He lurks in the walls of homes, whispering "you\'re trapped" during quiet moments of doubt. His victims become prisoners in their sanctuaries, afraid to pursue new opportunities lest they disturb the delicate balance of their housing debt.',
    victoryMessage: 'Mortgagus reluctantly hands over the deed as you make your final payment. "Thirty years of my life," he grumbles as he fades into memory. Your home is truly yours now - a castle, not a cage.'
  },
  'Medical Debt': {
    type: 'yellow',
    name: 'Medicalus the Unexpected',
    personality: 'Surprising and stressful',
    catchphrase: "Surprise! I appeared when you least expected!",
    weakness: 'Payment plans',
    story: "Medicalus strikes when you're already down, adding financial stress to health problems. He sneaks up with confusing bills and unexpected costs.",
    abilities: ['Insurance Denial', 'Code Confusion', 'Billing Surprise'],
    backstory: 'Medicalus was born from the cruelest twist of fate - striking when his victims were already suffering. He arrives uninvited during times of illness and injury, turning moments of healing into years of financial recovery. "You\'d pay anything to feel better," he whispers to the vulnerable, "what\'s your health worth to you?"',
    victoryMessage: 'Medicalus dissolves like a bad fever breaking as you make your final payment. The relief you feel is twice as sweet - healed in both body and finances. You\'ve overcome the unexpected challenge.'
  },
  'Personal Loan': {
    type: 'red',
    name: 'Personus the Tempter',
    personality: 'Friendly but demanding',
    catchphrase: "I'm here to help... for a price!",
    weakness: 'Disciplined budgeting',
    story: 'Personus appeared as a friend in your time of need, offering quick cash. Now he expects regular payments, regardless of your situation.',
    abilities: ['Term Shortener', 'Rate Hike', 'Prepayment Penalty'],
    backstory: 'Personus cultivates false friendship, appearing when you\'re vulnerable with offers of assistance. He masks his hunger for interest behind a veneer of helpfulness. His victims mistake his predatory lending for generosity until it\'s too late, trapped in a cycle of dependency on his "help."',
    victoryMessage: 'Personus looks shocked as you make your final payment. "But I thought we were friends," he protests as he fades away. You\'ve proven that true financial independence doesn\'t require his kind of "assistance."'
  },
  'Payday Loan': {
    type: 'red',
    name: 'Paydus the Predator',
    personality: 'Aggressive and tricky',
    catchphrase: "Need cash now? I'll cost you later!",
    weakness: 'Alternative financing',
    story: 'Paydus preys on the desperate, offering quick relief that turns into a vicious cycle. His small loans carry enormous interest rates.',
    abilities: ['Rollover Trap', 'Hidden Fee Attack', 'Salary Intercept'],
    backstory: 'Paydus was born in moments of desperation, offering a lifeline that becomes a noose. He specifically targets those already struggling, promising quick relief while obscuring the devastating true cost. His victims pay many times the original amount, trapped in a cycle that seems impossible to break. "Just one more rollover," he whispers, "and you\'ll be free."',
    victoryMessage: 'Paydus howls in disbelief as you make your final payment. His power over you breaks completely. You\'ve escaped the rollover trap that has ensnared so many others.'
  },
  'Business Loan': {
    type: 'purple',
    name: 'Bizloan the Gambler',
    personality: 'Risk-taking and opportunistic',
    catchphrase: "Big dreams require big money!",
    weakness: 'Revenue growth',
    story: 'Bizloan tempts entrepreneurs with capital for their dreams, but demands regular tribute regardless of business performance.',
    abilities: ['Collateral Claim', 'Personal Guarantee', 'Cash Flow Drain'],
    backstory: 'Bizloan feeds on ambition and dreams, luring entrepreneurs with visions of success while downplaying the risk. He has witnessed countless dreams crumble under the weight of fixed payments during volatile times. "That\'s just business," he says coldly when collecting from struggling founders, indifferent to their innovation or passion.',
    victoryMessage: 'Bizloan tips his hat respectfully as you make your final payment. "You beat the odds," he acknowledges as he dissolves. Your business is truly yours now, free from external financial influence.'
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
  abilities: ['Interest Charge', 'Late Fee', 'Minimum Payment Trap'],
  backstory: 'Debtimus represents the amalgamation of all financial mistakes and poor decisions. He grows in the shadows of financial illiteracy, feeding on confusion and avoidance. His victims often don\'t even know he exists until he\'s grown too powerful to ignore. "Ignore me at your peril," he warns those who skip reading the fine print.',
  victoryMessage: 'Debtimus shatters into a thousand pieces as you make your final payment. You\'ve conquered the very embodiment of debt itself through persistence and strategy.'
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
