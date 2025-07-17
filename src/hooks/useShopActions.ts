
import { toast } from "@/hooks/use-toast";
import { Debt, ShopItem, PlayerTraits, SpecialMove } from "@/types/gameTypes";
import { Dispatch, SetStateAction } from "react";

type ShopActionsProps = {
  cash: number;
  setCash: Dispatch<SetStateAction<number>>;
  setSpecialMoves: Dispatch<SetStateAction<SpecialMove[]>>;
  setDebts: Dispatch<SetStateAction<Debt[]>>;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  updatePlayerTrait: (trait: keyof PlayerTraits, value: number) => void;
  playerTraits: PlayerTraits;
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
  const purchaseItem = (item: ShopItem) => {
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
    switch (item.effect.type) {
      case "specialMove":
        for (let i = 0; i < item.effect.value; i++) {
          setSpecialMoves(prev => [...prev, { id: `shop-${Date.now()}-${i}`, name: 'Shop Move', description: 'Purchased from shop', damage: 110, cooldown: 0, currentCooldown: 0 }]);
        }
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
        const newInterestRate = highestInterestDebt.interest * (1 - item.effect.value / 100);
        
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
      case "cash_boost":
        setCash(prev => prev + item.effect.value);
        
        toast({
          title: "Cash Boost Applied!",
          description: `You received a cash boost of $${item.effect.value}!`,
          variant: "default",
        });
        break;
      case "debt_reduction":
        if (debts.length === 0) {
          toast({
            title: "No Debts Available",
            description: "You don't have any debts to reduce.",
            variant: "default",
          });
          return;
        }
        
        const highestDebt = [...debts].sort((a, b) => b.amount - a.amount)[0];
        const newAmount = Math.max(0, highestDebt.amount - item.effect.value);
        const healthReduction = (item.effect.value / highestDebt.amount) * 100;
        
        updateDebt(highestDebt.id, {
          amount: newAmount,
          balance: newAmount,
          health: Math.max(0, highestDebt.health - healthReduction)
        });
        
        toast({
          title: "Debt Reduced!",
          description: `You reduced your ${highestDebt.name} by $${item.effect.value}!`,
          variant: "default",
        });
        break;
      case "trait_boost":
        if (item.effect.trait) {
          updatePlayerTrait(item.effect.trait, playerTraits[item.effect.trait] + item.effect.value);
          
          toast({
            title: "Trait Improved!",
            description: `You improved your ${item.effect.trait} trait by ${item.effect.value} point(s)!`,
            variant: "default",
          });
        }
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
