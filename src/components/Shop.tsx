import React, { useState } from 'react';
import { useGameContext } from '../context/GameContext';
import { ShoppingCart, Coins, Tag, ShieldPlus, Sword, Zap, Shield, Battery, Briefcase, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";
import { ShopItem, PlayerTraits } from '../types/gameTypes';

const shopItems: ShopItem[] = [
  {
    id: 'special_move',
    name: 'Special Attack',
    description: 'Add one special move to your arsenal to reduce debt interest',
    cost: 500,
    effect: {
      type: 'special_move',
      value: 1
    },
    icon: <Zap className="h-10 w-10 text-yellow-500" />
  },
  {
    id: 'interest_reducer',
    name: 'Interest Reducer',
    description: 'Reduce the interest rate on all your debts by 0.5%',
    cost: 1000,
    effect: {
      type: 'interest_reduction',
      value: 0.5
    },
    icon: <Shield className="h-10 w-10 text-blue-500" />
  },
  {
    id: 'cash_boost',
    name: 'Cash Boost',
    description: 'Get an immediate cash injection of $1000',
    cost: 800,
    effect: {
      type: 'cash_boost',
      value: 1000
    },
    icon: <Coins className="h-10 w-10 text-green-500" />
  },
  {
    id: 'debt_reducer',
    name: 'Debt Reducer',
    description: 'Reduce your highest interest debt by $500',
    cost: 700,
    effect: {
      type: 'debt_reduction',
      value: 500
    },
    icon: <ShieldPlus className="h-10 w-10 text-purple-500" />
  },
  {
    id: 'financial_knowledge',
    name: 'Financial Education',
    description: 'Improve your financial knowledge trait',
    cost: 600,
    effect: {
      type: 'trait_boost',
      value: 1,
      trait: 'financialKnowledge' as keyof PlayerTraits
    },
    icon: <Briefcase className="h-10 w-10 text-indigo-500" />
  },
  {
    id: 'saving_ability',
    name: 'Saving Workshop',
    description: 'Improve your saving ability trait',
    cost: 600,
    effect: {
      type: 'trait_boost',
      value: 1,
      trait: 'savingAbility' as keyof PlayerTraits
    },
    icon: <PiggyBank className="h-10 w-10 text-pink-500" />
  }
];

const Shop: React.FC = () => {
  const { cash, purchaseItem } = useGameContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handlePurchase = (item: ShopItem) => {
    if (cash < item.cost) {
      toast({
        title: "Not Enough Cash",
        description: "You don't have enough cash to purchase this item.",
        variant: "destructive",
      });
      return;
    }

    purchaseItem(item);

    toast({
      title: "Purchase Successful!",
      description: `You purchased ${item.name}!`,
      variant: "default",
    });
  };

  const categories = [
    { id: 'all', name: 'All Items' },
    { id: 'special_move', name: 'Special Moves' },
    { id: 'interest_reduction', name: 'Interest Reducers' },
    { id: 'trait_boost', name: 'Trait Boosts' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.effect.type.includes(selectedCategory));

  return (
    <div className="card-fun">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <span className="p-1.5 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-md mr-2">
            <ShoppingCart size={18} className="animate-pulse-subtle" />
          </span>
          <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Financial Power-Ups Shop
          </span>
        </h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full">
          <Coins size={16} />
          <span className="font-medium">${cash.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button 
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={selectedCategory === category.id 
              ? "bg-gradient-to-r from-green-600 to-teal-600" 
              : ""}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            className="border border-green-100 bg-gradient-to-br from-white to-green-50 rounded-xl p-4 flex flex-col hover:shadow-md transition-all hover:translate-y-[-2px]"
          >
            <div className="flex items-start gap-3">
              <div className="p-3 bg-green-50 rounded-lg">
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <Tag size={12} />
                    ${item.cost}
                  </div>
                  <Button 
                    onClick={() => handlePurchase(item)} 
                    variant="default" 
                    size="sm"
                    disabled={cash < item.cost}
                    className={cash >= item.cost 
                      ? "bg-gradient-to-r from-green-600 to-teal-600" 
                      : "opacity-50"}
                  >
                    Purchase
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
