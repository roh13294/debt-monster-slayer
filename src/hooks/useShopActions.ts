
import { toast } from "@/hooks/use-toast";
import { Debt, ShopItem } from "@/types/gameTypes";
import { Dispatch, SetStateAction } from "react";

type ShopActionsProps = {
  cash: number;
  setCash: Dispatch<SetStateAction<number>>;
  setSpecialMoves: Dispatch<SetStateAction<number>>;
  setDebts: Dispatch<SetStateAction<Debt[]>>;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  updatePlayerTrait: (trait: string, value: number) => void;
  playerTraits: any;
  debts: Debt[];
};

export const useShopActions = ({
  cash,
  setCash,
  setSpecialMoves,
  setDebts,
  updateDebt,
  updatePlayerTrait,
  playerTraits,
  debts
}: ShopActionsProps) => {
  const purchaseItem = (itemId: string) => {
    // Mock shop items (these would normally be imported from a data file)
    const shopItems: ShopItem[] = [
      {
        id: "special_move",
        name: "Special Move Token",
        description: "Grants one special move that can be used in battle.",
        cost: 300,
        effect: "specialMove",
        category: "battle"
      },
      {
        id: "interest_reducer",
        name: "Interest Rate Negotiation",
        description: "Reduces the interest rate on a selected debt by 10%.",
        cost: 500,
        effect: "reduceInterest",
        category: "debt"
      },
      {
        id: "debt_damage",
        name: "Debt Damage Boost",
        description: "Makes your next debt payment 20% more effective.",
        cost: 400,
        effect: "damageBoost",
        category: "battle"
      }
    ];
    
    const item = shopItems.find(item => item.id === itemId);
    if (!item) return;
    
    // Check if player has enough cash
    if (cash < item.cost) {
      toast({
        title: "Not Enough Cash",
        description: `You need ${item.cost} to purchase ${item.name}.`,
        variant: "default",
      });
      return;
    }
    
    // Apply item effect
    switch (item.effect) {
      case "specialMove":
        setSpecialMoves(prev => prev + 1);
        break;
      case "reduceInterest":
        // Find debt with highest interest
        if (debts.length === 0) {
          toast({
            title: "No Debts Available",
            description: "You don't have any debts to reduce interest on.",
            variant: "default",
          });
          return;
        }
        
        const highestInterestDebt = [...debts].sort((a, b) => b.interest - a.interest)[0];
        const newInterestRate = highestInterestDebt.interest * 0.9;
        
        updateDebt(highestInterestDebt.id, {
          interest: newInterestRate,
          interestRate: newInterestRate
        });
        
        toast({
          title: "Interest Rate Reduced!",
          description: `You reduced the interest rate on your ${highestInterestDebt.name} to ${newInterestRate.toFixed(2)}%.`,
          variant: "default",
        });
        break;
      case "damageBoost":
        setDebts(prevDebts => 
          prevDebts.map(debt => ({
            ...debt,
            // Apply temporary damage boost flag
            damageBoost: true
          }))
        );
        
        toast({
          title: "Damage Boost Applied!",
          description: "Your next debt payment will be 20% more effective.",
          variant: "default",
        });
        break;
      default:
        break;
    }
    
    // Deduct cost
    setCash(prev => prev - item.cost);
    
    // Improve financial knowledge slightly with each purchase
    updatePlayerTrait('financialKnowledge', playerTraits.financialKnowledge + 0.2);
  };

  return { purchaseItem };
};
