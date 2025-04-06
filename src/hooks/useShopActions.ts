
import { ShopItem, PlayerTraits, Debt } from "@/types/gameTypes";

type ShopActionsProps = {
  cash: number;
  setCash: (value: number | ((prev: number) => number)) => void;
  setSpecialMoves: (value: number | ((prev: number) => number)) => void;
  setDebts: (value: Debt[] | ((prev: Debt[]) => Debt[])) => void;
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
  debts,
}: ShopActionsProps) => {
  // Handle shop item purchases
  const purchaseItem = (item: ShopItem) => {
    // Check if player has enough cash
    if (cash < item.cost) {
      return;
    }
    
    // Deduct cost
    setCash(prev => prev - item.cost);
    
    // Apply effects based on item type
    switch (item.effect.type) {
      case 'special_move':
        setSpecialMoves(prev => prev + item.effect.value);
        break;
        
      case 'interest_reduction':
        // Apply interest reduction to all debts
        setDebts(prevDebts => prevDebts.map(debt => ({
          ...debt,
          interest: Math.max(1, debt.interest - item.effect.value)
        })));
        break;
        
      case 'cash_boost':
        setCash(prev => prev + item.effect.value);
        break;
        
      case 'debt_reduction':
        // Find highest interest debt
        if (debts.length > 0) {
          const highestInterestDebt = [...debts].sort((a, b) => b.interest - a.interest)[0];
          const reductionAmount = Math.min(item.effect.value, highestInterestDebt.amount);
          const healthReduction = (reductionAmount / highestInterestDebt.amount) * 100;
          
          updateDebt(highestInterestDebt.id, {
            amount: Math.max(0, highestInterestDebt.amount - reductionAmount),
            health: Math.max(0, highestInterestDebt.health - healthReduction)
          });
        }
        break;
        
      case 'trait_boost':
        if (item.effect.trait) {
          updatePlayerTrait(
            item.effect.trait, 
            Math.min(10, playerTraits[item.effect.trait] as number + item.effect.value)
          );
        }
        break;
    }
  };

  return {
    purchaseItem
  };
};
