
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

// Event generators for unlimited events
const generateRandomEvent = (): LifeEvent => {
  // Base random numbers for amount calculations
  const smallAmount = Math.floor(Math.random() * 300) + 100; // $100-$400
  const mediumAmount = Math.floor(Math.random() * 500) + 400; // $400-$900
  const largeAmount = Math.floor(Math.random() * 1000) + 800; // $800-$1800
  
  // Random event types
  const eventTypes = [
    {
      title: "Unexpected Expense",
      description: `You have an unexpected expense of $${mediumAmount}.`,
      options: [
        {
          text: `Pay $${mediumAmount} from savings`,
          effect: {
            cash: -mediumAmount,
            description: `You paid $${mediumAmount} from your savings.`
          }
        },
        {
          text: "Put it on credit card",
          effect: {
            debt: mediumAmount,
            description: `You added $${mediumAmount} to your credit card debt.`
          }
        }
      ]
    },
    {
      title: "Windfall",
      description: `You received an unexpected $${mediumAmount}!`,
      options: [
        {
          text: `Save the $${mediumAmount}`,
          effect: {
            cash: mediumAmount,
            description: `You saved the $${mediumAmount}.`
          }
        },
        {
          text: `Pay down debt with $${mediumAmount}`,
          effect: {
            cash: mediumAmount,
            description: `You got $${mediumAmount} to pay toward your debt.`
          }
        }
      ]
    },
    {
      title: "Friend's Birthday",
      description: "It's your friend's birthday. How much will you spend on a gift?",
      options: [
        {
          text: `Buy a small gift for $${smallAmount}`,
          effect: {
            cash: -smallAmount,
            description: `You spent $${smallAmount} on a birthday gift.`
          }
        },
        {
          text: "Make a homemade gift",
          effect: {
            cash: -Math.floor(smallAmount/4),
            description: `You made a thoughtful gift for just $${Math.floor(smallAmount/4)}.`
          }
        }
      ]
    },
    {
      title: "Car Issues",
      description: `Your car is having problems. Repairs will cost $${mediumAmount}.`,
      options: [
        {
          text: `Pay $${mediumAmount} for repairs`,
          effect: {
            cash: -mediumAmount,
            description: `You paid $${mediumAmount} to fix your car.`
          }
        },
        {
          text: "Use public transport for a while",
          effect: {
            cash: -Math.floor(smallAmount/2),
            description: `You're spending $${Math.floor(smallAmount/2)} on public transport this month.`
          }
        }
      ]
    },
    {
      title: "Home Repair",
      description: `Your home needs a repair costing $${largeAmount}.`,
      options: [
        {
          text: `Pay $${largeAmount} for repairs`,
          effect: {
            cash: -largeAmount,
            description: `You paid $${largeAmount} for home repairs.`
          }
        },
        {
          text: "Take out a home improvement loan",
          effect: {
            debt: largeAmount,
            description: `You took out a $${largeAmount} loan for home repairs.`
          }
        }
      ]
    }
  ];
  
  const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  
  return {
    id: 'random-' + Date.now(),
    title: randomEvent.title,
    description: randomEvent.description,
    options: randomEvent.options
  };
};

// Function to get a life event - either from base events or generate a random one
export const getLifeEvent = (): LifeEvent => {
  // Use base events first, then start generating random events
  const useBaseEvent = Math.random() < 0.7; // 70% chance to use base event
  
  if (useBaseEvent) {
    const randomIndex = Math.floor(Math.random() * baseLifeEvents.length);
    return baseLifeEvents[randomIndex];
  } else {
    return generateRandomEvent();
  }
};
