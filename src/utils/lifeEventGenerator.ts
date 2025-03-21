
import { LifeEvent } from "../context/GameContext";

// Base life events
const baseLifeEvents: LifeEvent[] = [
  {
    id: '1',
    title: 'Car Trouble',
    description: 'Your car needs urgent repairs. What will you do?',
    options: [
      {
        text: 'Pay $500 for repairs',
        effect: {
          cash: -500,
          description: 'You paid $500 for car repairs.'
        }
      },
      {
        text: 'Take a loan for repairs',
        effect: {
          debt: 500,
          description: 'You took a $500 loan for repairs, added to your credit card debt.'
        }
      }
    ]
  },
  {
    id: '2',
    title: 'Unexpected Bonus',
    description: 'You received a surprise bonus at work!',
    options: [
      {
        text: 'Save the entire $1000',
        effect: {
          cash: 1000,
          description: 'You saved the entire $1000 bonus.'
        }
      },
      {
        text: 'Pay off some debt with $1000',
        effect: {
          cash: 1000,
          description: 'You got $1000 to pay toward your debt.'
        }
      }
    ]
  },
  {
    id: '3',
    title: 'Medical Expense',
    description: 'You have an unexpected medical bill.',
    options: [
      {
        text: 'Pay $800 from savings',
        effect: {
          cash: -800,
          description: 'You paid $800 for medical expenses.'
        }
      },
      {
        text: 'Pay with credit card',
        effect: {
          debt: 800,
          description: 'You added $800 to your credit card debt.'
        }
      }
    ]
  },
  {
    id: '4',
    title: 'Friend in Need',
    description: 'A close friend asks to borrow money for an emergency.',
    options: [
      {
        text: 'Lend $300',
        effect: {
          cash: -300,
          description: 'You lent $300 to your friend.'
        }
      },
      {
        text: 'Politely decline',
        effect: {
          description: 'You explained your financial situation and couldn\'t help.'
        }
      }
    ]
  },
  {
    id: '5',
    title: 'Leaky Roof',
    description: 'Your roof has started leaking and needs fixing.',
    options: [
      {
        text: 'DIY repair for $200',
        effect: {
          cash: -200,
          description: 'You fixed the roof yourself for $200 in materials.'
        }
      },
      {
        text: 'Hire professionals for $700',
        effect: {
          cash: -700,
          description: 'You hired professionals to fix your roof for $700.'
        }
      }
    ]
  },
  {
    id: '6',
    title: 'Job Opportunity',
    description: 'You\'ve been offered a better-paying job, but it requires new work clothes.',
    options: [
      {
        text: 'Invest $400 in new attire',
        effect: {
          cash: -400,
          income: 300,
          description: 'You spent $400 on professional clothes and increased your monthly income by $300.'
        }
      },
      {
        text: 'Decline the opportunity',
        effect: {
          description: 'You stayed at your current job.'
        }
      }
    ]
  },
  {
    id: '7',
    title: 'Family Emergency',
    description: 'A family member needs financial assistance.',
    options: [
      {
        text: 'Send $600',
        effect: {
          cash: -600,
          description: 'You sent $600 to help your family.'
        }
      },
      {
        text: 'Send $300',
        effect: {
          cash: -300,
          description: 'You sent $300 to help your family.'
        }
      }
    ]
  },
  {
    id: '8',
    title: 'Unexpected Inheritance',
    description: 'A distant relative left you a small inheritance.',
    options: [
      {
        text: 'Put all $1500 toward debt',
        effect: {
          cash: 1500,
          description: 'You received $1500 to help pay off debt.'
        }
      },
      {
        text: 'Save $1500 for emergencies',
        effect: {
          cash: 1500,
          description: 'You saved $1500 for future emergencies.'
        }
      }
    ]
  },
  {
    id: '9',
    title: 'Appliance Breakdown',
    description: 'Your refrigerator has stopped working.',
    options: [
      {
        text: 'Buy a budget replacement for $800',
        effect: {
          cash: -800,
          description: 'You bought a budget refrigerator for $800.'
        }
      },
      {
        text: 'Finance a new one for $1200',
        effect: {
          debt: 1200,
          description: 'You financed a new refrigerator for $1200, adding to your debt.'
        }
      }
    ]
  },
  {
    id: '10',
    title: 'Side Hustle Opportunity',
    description: 'You have a chance to start a weekend side business.',
    options: [
      {
        text: 'Invest $500 to get started',
        effect: {
          cash: -500,
          income: 200,
          description: 'You invested $500 and now earn an extra $200 monthly.'
        }
      },
      {
        text: 'Focus on current job',
        effect: {
          description: 'You decided to focus on your main job.'
        }
      }
    ]
  },
  {
    id: '11',
    title: 'Tax Refund',
    description: 'You received an unexpected tax refund!',
    options: [
      {
        text: 'Use $700 for debt repayment',
        effect: {
          cash: 700,
          description: 'You received $700 to use toward your debt.'
        }
      },
      {
        text: 'Treat yourself with $700',
        effect: {
          cash: 700,
          description: 'You received $700 and decided to enjoy it.'
        }
      }
    ]
  },
  {
    id: '12',
    title: 'Home Repairs',
    description: 'Your home needs some essential maintenance.',
    options: [
      {
        text: 'Pay $450 for repairs',
        effect: {
          cash: -450,
          description: 'You spent $450 on necessary home repairs.'
        }
      },
      {
        text: 'Postpone repairs',
        effect: {
          description: 'You decided to postpone the repairs for now.'
        }
      }
    ]
  }
];

// Event categories for varied experience
const eventCategories = {
  financial: [
    {
      title: "Unexpected Expense",
      descriptionTemplates: [
        "You have an unexpected expense of $AMOUNT.",
        "A surprise bill of $AMOUNT arrived today.",
        "You need to pay $AMOUNT for an emergency expense."
      ],
      optionTemplates: [
        {
          text: "Pay $AMOUNT from savings",
          effect: (amount: number) => ({
            cash: -amount,
            description: `You paid $${amount} from your savings.`
          })
        },
        {
          text: "Put it on credit card",
          effect: (amount: number) => ({
            debt: amount,
            description: `You added $${amount} to your credit card debt.`
          })
        },
        {
          text: "Ask family for help",
          effect: (amount: number) => ({
            cash: -Math.floor(amount/2),
            description: `Your family helped with half the expense. You paid $${Math.floor(amount/2)}.`
          })
        }
      ]
    },
    {
      title: "Windfall",
      descriptionTemplates: [
        "You received an unexpected $AMOUNT!",
        "You found $AMOUNT in an old account!",
        "A relative gifted you $AMOUNT!"
      ],
      optionTemplates: [
        {
          text: "Save the $AMOUNT",
          effect: (amount: number) => ({
            cash: amount,
            description: `You saved the $${amount}.`
          })
        },
        {
          text: "Pay down debt with $AMOUNT",
          effect: (amount: number) => ({
            cash: amount,
            description: `You got $${amount} to pay toward your debt.`
          })
        },
        {
          text: "Invest $AMOUNT",
          effect: (amount: number) => ({
            cash: amount,
            description: `You received $${amount} to invest.`
          })
        }
      ]
    }
  ],
  career: [
    {
      title: "Job Opportunity",
      descriptionTemplates: [
        "You've been offered a better-paying position that requires some initial investment.",
        "A career advancement opportunity has come up, but it requires preparation.",
        "You can take a new role with higher pay, but need to prepare first."
      ],
      optionTemplates: [
        {
          text: "Invest in professional development",
          effect: (amount: number) => ({
            cash: -amount,
            income: Math.floor(amount/3),
            description: `You spent $${amount} on professional development and increased your monthly income by $${Math.floor(amount/3)}.`
          })
        },
        {
          text: "Stay at current position",
          effect: () => ({
            description: "You decided to stay at your current position for now."
          })
        },
        {
          text: "Take a career risk",
          effect: (amount: number) => ({
            cash: -Math.floor(amount/2),
            income: Math.random() < 0.7 ? Math.floor(amount/2) : -Math.floor(amount/4),
            description: Math.random() < 0.7 ? 
              `Your career risk paid off! You spent $${Math.floor(amount/2)} and increased your income by $${Math.floor(amount/2)}.` : 
              `Your career risk didn't work out. You spent $${Math.floor(amount/2)} and your income decreased by $${Math.floor(amount/4)}.`
          })
        }
      ]
    }
  ],
  health: [
    {
      title: "Medical Situation",
      descriptionTemplates: [
        "You're facing a medical expense of $AMOUNT.",
        "A health issue has come up costing $AMOUNT.",
        "You need medical attention that will cost $AMOUNT."
      ],
      optionTemplates: [
        {
          text: "Pay out of pocket",
          effect: (amount: number) => ({
            cash: -amount,
            description: `You paid $${amount} for medical care.`
          })
        },
        {
          text: "Use insurance (partial coverage)",
          effect: (amount: number) => ({
            cash: -Math.floor(amount * 0.3),
            description: `Insurance covered 70%. You paid $${Math.floor(amount * 0.3)}.`
          })
        },
        {
          text: "Negotiate a payment plan",
          effect: (amount: number) => ({
            debt: Math.floor(amount * 0.8),
            description: `You negotiated a payment plan for $${Math.floor(amount * 0.8)}, added to your debt.`
          })
        }
      ]
    }
  ],
  housing: [
    {
      title: "Housing Issue",
      descriptionTemplates: [
        "Your home needs repairs costing $AMOUNT.",
        "Your living situation requires a $AMOUNT investment.",
        "Home maintenance issues will cost $AMOUNT to fix."
      ],
      optionTemplates: [
        {
          text: "Complete repairs now",
          effect: (amount: number) => ({
            cash: -amount,
            description: `You spent $${amount} on home repairs.`
          })
        },
        {
          text: "DIY approach",
          effect: (amount: number) => ({
            cash: -Math.floor(amount * 0.6),
            description: `You saved money with DIY repairs, spending only $${Math.floor(amount * 0.6)}.`
          })
        },
        {
          text: "Ignore for now",
          effect: (amount: number) => ({
            description: `You postponed the repairs. (Warning: This might cost more later.)`
          })
        }
      ]
    }
  ],
  transportation: [
    {
      title: "Transportation Dilemma",
      descriptionTemplates: [
        "Your vehicle needs $AMOUNT in repairs.",
        "Transportation issues will cost you $AMOUNT.",
        "You're facing a $AMOUNT transportation expense."
      ],
      optionTemplates: [
        {
          text: "Pay for repairs/expenses",
          effect: (amount: number) => ({
            cash: -amount,
            description: `You paid $${amount} for transportation needs.`
          })
        },
        {
          text: "Use alternative transportation",
          effect: (amount: number) => ({
            cash: -Math.floor(amount * 0.4),
            description: `You found alternatives, spending only $${Math.floor(amount * 0.4)}.`
          })
        },
        {
          text: "Finance the expense",
          effect: (amount: number) => ({
            debt: amount,
            description: `You financed the $${amount} transportation expense.`
          })
        }
      ]
    }
  ],
  social: [
    {
      title: "Social Opportunity",
      descriptionTemplates: [
        "A friend invited you to an event costing $AMOUNT.",
        "There's a social gathering with a $AMOUNT cost to attend.",
        "An important social occasion will cost $AMOUNT to participate in."
      ],
      optionTemplates: [
        {
          text: "Attend and network",
          effect: (amount: number) => ({
            cash: -amount,
            description: `You spent $${amount} on the social event.`,
            // Hidden chance for future opportunities
          })
        },
        {
          text: "Politely decline",
          effect: () => ({
            description: "You saved money by not attending the event."
          })
        },
        {
          text: "Find a budget-friendly way to attend",
          effect: (amount: number) => ({
            cash: -Math.floor(amount * 0.5),
            description: `You found a budget-friendly way to attend, spending only $${Math.floor(amount * 0.5)}.`
          })
        }
      ]
    }
  ],
  education: [
    {
      title: "Educational Opportunity",
      descriptionTemplates: [
        "You can take a course costing $AMOUNT that might advance your career.",
        "A learning opportunity for $AMOUNT has presented itself.",
        "You can invest $AMOUNT in your education for potential future gains."
      ],
      optionTemplates: [
        {
          text: "Invest in education",
          effect: (amount: number) => ({
            cash: -amount,
            income: Math.floor(amount * 0.2),
            description: `You invested $${amount} in education and increased your monthly income by $${Math.floor(amount * 0.2)}.`
          })
        },
        {
          text: "Find a free alternative",
          effect: () => ({
            description: "You found free educational resources instead."
          })
        },
        {
          text: "Finance the education",
          effect: (amount: number) => ({
            debt: amount,
            income: Math.floor(amount * 0.15),
            description: `You financed $${amount} for education and increased your monthly income by $${Math.floor(amount * 0.15)}.`
          })
        }
      ]
    }
  ],
  investment: [
    {
      title: "Investment Opportunity",
      descriptionTemplates: [
        "You have a chance to invest $AMOUNT with potential returns.",
        "An investment opportunity requiring $AMOUNT has come up.",
        "You can put $AMOUNT into an investment with variable outcomes."
      ],
      optionTemplates: [
        {
          text: "Make the investment",
          effect: (amount: number) => {
            const success = Math.random() < 0.65; // 65% chance of success
            return {
              cash: success ? -amount : Math.floor(-amount * 0.8),
              description: success ? 
                `Your $${amount} investment paid off! (Future returns coming)` : 
                `Your investment didn't perform well. You lost $${Math.floor(amount * 0.8)}.`
            };
          }
        },
        {
          text: "Research more first",
          effect: () => ({
            description: "You decided to research more before investing."
          })
        },
        {
          text: "Make a smaller investment",
          effect: (amount: number) => {
            const smallerAmount = Math.floor(amount * 0.5);
            const success = Math.random() < 0.7; // 70% chance of success
            return {
              cash: success ? -smallerAmount : Math.floor(-smallerAmount * 0.7),
              description: success ? 
                `Your smaller $${smallerAmount} investment was successful! (Future returns coming)` : 
                `Your smaller investment didn't work out. You lost $${Math.floor(smallerAmount * 0.7)}.`
            };
          }
        }
      ]
    }
  ]
};

// Function to generate a personalized life event
const generateRandomEvent = (): LifeEvent => {
  // Get random amounts for financial calculations
  const smallAmount = Math.floor(Math.random() * 300) + 100; // $100-$400
  const mediumAmount = Math.floor(Math.random() * 500) + 400; // $400-$900
  const largeAmount = Math.floor(Math.random() * 1000) + 800; // $800-$1800
  
  // Randomly select a category
  const categories = Object.keys(eventCategories) as Array<keyof typeof eventCategories>;
  const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
  
  // Get events for the selected category
  const categoryEvents = eventCategories[selectedCategory];
  
  // Randomly select an event from the category
  const selectedEvent = categoryEvents[Math.floor(Math.random() * categoryEvents.length)];
  
  // Select a random description template
  const descriptionTemplate = selectedEvent.descriptionTemplates[
    Math.floor(Math.random() * selectedEvent.descriptionTemplates.length)
  ];
  
  // Determine amount based on event type
  let amount;
  if (selectedCategory === 'investment' || selectedCategory === 'career') {
    amount = largeAmount;
  } else if (selectedCategory === 'health' || selectedCategory === 'housing') {
    amount = mediumAmount;
  } else {
    amount = smallAmount;
  }
  
  // Replace AMOUNT placeholder in description
  const description = descriptionTemplate.replace(/AMOUNT/g, amount.toString());
  
  // Generate options (up to 3)
  const numOptions = Math.min(3, selectedEvent.optionTemplates.length);
  const shuffledOptions = [...selectedEvent.optionTemplates]
    .sort(() => Math.random() - 0.5)
    .slice(0, numOptions);
  
  const options = shuffledOptions.map(optionTemplate => {
    const optionText = optionTemplate.text.replace(/AMOUNT/g, amount.toString());
    const effect = optionTemplate.effect(amount);
    
    return {
      text: optionText,
      effect: effect
    };
  });
  
  return {
    id: 'random-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    title: selectedEvent.title,
    description,
    options
  };
};

// Player experience record to ensure variety
let playerExperienceRecord: {
  eventCategoriesUsed: Record<string, number>;
  recentEventIds: string[];
} = {
  eventCategoriesUsed: {},
  recentEventIds: []
};

// Reset player experience after certain number of events
const resetExperienceRecordIfNeeded = () => {
  const totalEvents = Object.values(playerExperienceRecord.eventCategoriesUsed).reduce((a, b) => a + b, 0);
  if (totalEvents > 20) {
    playerExperienceRecord = {
      eventCategoriesUsed: {},
      recentEventIds: []
    };
  }
};

// Track event for variety
const trackEvent = (event: LifeEvent) => {
  // Track event ID to avoid immediate repetition
  playerExperienceRecord.recentEventIds = 
    [event.id, ...playerExperienceRecord.recentEventIds].slice(0, 5);
  
  // Track categories to ensure variety
  const category = determineCategoryFromEvent(event);
  playerExperienceRecord.eventCategoriesUsed[category] = 
    (playerExperienceRecord.eventCategoriesUsed[category] || 0) + 1;
  
  resetExperienceRecordIfNeeded();
};

// Determine category from event
const determineCategoryFromEvent = (event: LifeEvent): string => {
  const title = event.title.toLowerCase();
  
  if (title.includes('job') || title.includes('career')) return 'career';
  if (title.includes('medical') || title.includes('health')) return 'health';
  if (title.includes('home') || title.includes('roof') || title.includes('repair') || title.includes('house')) return 'housing';
  if (title.includes('car') || title.includes('vehicle') || title.includes('transport')) return 'transportation';
  if (title.includes('friend') || title.includes('social') || title.includes('family')) return 'social';
  if (title.includes('education') || title.includes('course') || title.includes('learn')) return 'education';
  if (title.includes('invest') || title.includes('stock') || title.includes('return')) return 'investment';
  
  // Default to financial
  return 'financial';
};

// Get least used category to ensure variety
const getLeastUsedCategory = (): string => {
  const categories = Object.keys(eventCategories);
  let leastUsedCategory = categories[0];
  let leastUseCount = playerExperienceRecord.eventCategoriesUsed[leastUsedCategory] || 0;
  
  categories.forEach(category => {
    const useCount = playerExperienceRecord.eventCategoriesUsed[category] || 0;
    if (useCount < leastUseCount) {
      leastUsedCategory = category;
      leastUseCount = useCount;
    }
  });
  
  return leastUsedCategory;
};

// Generate a personalized event based on player history
const generatePersonalizedEvent = (): LifeEvent => {
  // Avoid recently seen events
  let event: LifeEvent;
  let attempts = 0;
  const maxAttempts = 3;
  
  do {
    // Occasionally force variety by using least used category
    const forceVariety = Math.random() < 0.3; // 30% chance
    
    if (forceVariety) {
      const leastUsedCategory = getLeastUsedCategory();
      const categoryEvents = eventCategories[leastUsedCategory as keyof typeof eventCategories];
      const selectedEvent = categoryEvents[Math.floor(Math.random() * categoryEvents.length)];
      event = generateEventFromTemplate(selectedEvent);
    } else {
      event = generateRandomEvent();
    }
    
    attempts++;
  } while (
    playerExperienceRecord.recentEventIds.includes(event.id) && 
    attempts < maxAttempts
  );
  
  // Track this event
  trackEvent(event);
  
  return event;
};

// Helper to generate event from template
const generateEventFromTemplate = (template: any): LifeEvent => {
  // Logic similar to generateRandomEvent but for a specific template
  const smallAmount = Math.floor(Math.random() * 300) + 100;
  const mediumAmount = Math.floor(Math.random() * 500) + 400;
  const largeAmount = Math.floor(Math.random() * 1000) + 800;
  
  // Determine appropriate amount based on template title
  let amount;
  if (template.title.includes('Investment') || template.title.includes('Career')) {
    amount = largeAmount;
  } else if (template.title.includes('Medical') || template.title.includes('Housing')) {
    amount = mediumAmount;
  } else {
    amount = smallAmount;
  }
  
  // Select random description
  const descriptionTemplate = template.descriptionTemplates[
    Math.floor(Math.random() * template.descriptionTemplates.length)
  ];
  const description = descriptionTemplate.replace(/AMOUNT/g, amount.toString());
  
  // Generate options
  const numOptions = Math.min(3, template.optionTemplates.length);
  const shuffledOptions = [...template.optionTemplates]
    .sort(() => Math.random() - 0.5)
    .slice(0, numOptions);
  
  const options = shuffledOptions.map(optionTemplate => {
    const optionText = optionTemplate.text.replace(/AMOUNT/g, amount.toString());
    const effect = optionTemplate.effect(amount);
    
    return {
      text: optionText,
      effect: effect
    };
  });
  
  return {
    id: 'random-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    title: template.title,
    description,
    options
  };
};

// Function to get a life event - either from base events or generate a random one
export const getLifeEvent = (): LifeEvent => {
  // Initially, use base events more frequently, then transition to personalized events
  const numEventsExperienced = Object.values(playerExperienceRecord.eventCategoriesUsed)
    .reduce((sum, count) => sum + count, 0);
  
  // As player experiences more events, reduce chance of base events
  const baseEventChance = Math.max(0.2, 0.7 - (numEventsExperienced * 0.05));
  const useBaseEvent = Math.random() < baseEventChance;
  
  if (useBaseEvent) {
    // Get a random base event
    const randomIndex = Math.floor(Math.random() * baseLifeEvents.length);
    const event = baseLifeEvents[randomIndex];
    trackEvent(event);
    return event;
  } else {
    // Generate a personalized event
    return generatePersonalizedEvent();
  }
};
