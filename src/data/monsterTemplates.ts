
import { MonsterTemplate } from '@/types/monsterTypes';

export const MONSTER_TEMPLATES: MonsterTemplate[] = [
  {
    id: 'credit_kraken',
    name: 'Credit Kraken',
    debtCategory: 'Credit Card Debt',
    baseHp: 1000,
    attackPattern: {
      id: 'interest_charge',
      name: 'Interest Charge',
      description: 'Charges compound interest every 2 turns',
      damage: 150,
      frequency: 2,
      specialEffect: {
        type: 'interest_surge',
        value: 25,
        duration: 3
      }
    },
    weaknesses: ['consistent_payments', 'balance_transfer'],
    resistances: ['minimum_payments'],
    dialogue: {
      intro: [
        "You thought ignoring me would make me disappear?",
        "Every swipe made me stronger!",
        "Your impulses feed my power!"
      ],
      taunts: [
        "Just pay the minimum, it's easier...",
        "One more purchase won't hurt...",
        "You'll never escape my compound grip!"
      ],
      weakened: [
        "How... how are you resisting my temptations?",
        "This isn't possible!",
        "My interest rates... they're not working!"
      ],
      defeated: "No! My plastic empire crumbles! You've learned... discipline...",
      critical_hit_received: [
        "That payment actually hurt!",
        "You're getting serious about this!",
        "I feel my power waning!"
      ]
    },
    animations: {
      idle: 'tentacle_sway',
      attack: 'interest_surge',
      hurt: 'shrink_back',
      death: 'dissolve',
      special: 'compound_growth'
    },
    lootTable: [
      { itemId: 'demon_seal_interest', dropRate: 0.8, quantity: { min: 1, max: 1 } },
      { itemId: 'spirit_fragment', dropRate: 1.0, quantity: { min: 50, max: 150 } },
      { itemId: 'credit_wisdom_scroll', dropRate: 0.3, quantity: { min: 1, max: 1 } }
    ]
  },
  {
    id: 'motor_wyrm',
    name: 'MotorWyrm',
    debtCategory: 'Car Loan',
    baseHp: 1500,
    attackPattern: {
      id: 'depreciation_breath',
      name: 'Depreciation Breath',
      description: 'Reduces asset value while maintaining payment demands',
      damage: 200,
      frequency: 3,
      specialEffect: {
        type: 'hp_drain',
        value: 10,
        duration: 5
      }
    },
    weaknesses: ['extra_payments', 'refinancing'],
    resistances: ['extended_terms'],
    dialogue: {
      intro: [
        "Vroom vroom! Your value's going down!",
        "I'll drain your wealth mile by mile!",
        "You wanted status? This is the price!"
      ],
      taunts: [
        "Look how shiny I made you appear!",
        "Everyone sees your success... for now",
        "Your payments feed my engine!"
      ],
      weakened: [
        "My engine... sputtering...",
        "You're paying more than required!",
        "This isn't how depreciation works!"
      ],
      defeated: "My chrome is fading... the engine dies... you've earned true ownership...",
      critical_hit_received: [
        "That payment hit my engine!",
        "You're accelerating past my terms!",
        "My depreciation magic is failing!"
      ]
    },
    animations: {
      idle: 'engine_rev',
      attack: 'fire_breath',
      hurt: 'engine_sputter',
      death: 'breakdown',
      special: 'turbo_boost'
    },
    lootTable: [
      { itemId: 'demon_seal_depreciation', dropRate: 0.7, quantity: { min: 1, max: 1 } },
      { itemId: 'spirit_fragment', dropRate: 1.0, quantity: { min: 75, max: 200 } },
      { itemId: 'auto_wisdom_scroll', dropRate: 0.25, quantity: { min: 1, max: 1 } }
    ]
  },
  {
    id: 'education_specter',
    name: 'Education Specter',
    debtCategory: 'Student Loan',
    baseHp: 2000,
    attackPattern: {
      id: 'future_drain',
      name: 'Future Drain',
      description: 'Haunts your career prospects with payment demands',
      damage: 100,
      frequency: 1,
      specialEffect: {
        type: 'payment_block',
        value: 30,
        duration: 2
      }
    },
    weaknesses: ['income_increase', 'forgiveness_programs'],
    resistances: ['deferment', 'forbearance'],
    dialogue: {
      intro: [
        "I'll follow you for decades!",
        "Your dreams have a price!",
        "Knowledge isn't free, and neither am I!"
      ],
      taunts: [
        "Defer me again, I'll just grow stronger",
        "Every promotion just means higher payments",
        "I am the ghost of your education!"
      ],
      weakened: [
        "But... but I gave you knowledge!",
        "This debt was supposed to help you!",
        "How dare you pay me off early!"
      ],
      defeated: "Your education... is finally... truly yours... use it well...",
      critical_hit_received: [
        "That knowledge is being used against me!",
        "You're earning more than I calculated!",
        "My perpetual grip is loosening!"
      ]
    },
    animations: {
      idle: 'float_ominously',
      attack: 'ghostly_reach',
      hurt: 'fade_flicker',
      death: 'dissolve_light',
      special: 'knowledge_drain'
    },
    lootTable: [
      { itemId: 'demon_seal_education', dropRate: 0.9, quantity: { min: 1, max: 1 } },
      { itemId: 'spirit_fragment', dropRate: 1.0, quantity: { min: 100, max: 300 } },
      { itemId: 'wisdom_scroll_advanced', dropRate: 0.4, quantity: { min: 1, max: 1 } }
    ]
  }
];

export const getMonsterTemplate = (debtCategory: string): MonsterTemplate => {
  return MONSTER_TEMPLATES.find(template => 
    template.debtCategory.toLowerCase().includes(debtCategory.toLowerCase())
  ) || MONSTER_TEMPLATES[0]; // Default to Credit Kraken
};
