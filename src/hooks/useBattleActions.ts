
import { toast } from "@/hooks/use-toast";
import { Debt } from "@/types/gameTypes";

type BattleActionsProps = {
  cash: number;
  setCash: (value: number) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  removeDebt: (id: string) => void;
  updateChallenge: (id: string, progress: number) => void;
  updatePlayerTrait: (trait: string, value: number) => void;
  playerTraits: any;
  debts: Debt[];
  specialMoves: number;
  setSpecialMoves: (value: number | ((prev: number) => number)) => void;
};

export const useBattleActions = ({
  cash,
  setCash,
  updateDebt,
  removeDebt,
  updateChallenge,
  updatePlayerTrait,
  playerTraits,
  debts,
  specialMoves,
  setSpecialMoves
}: BattleActionsProps) => {
  // Damage monster function
  const damageMonster = (debtId: string, amount: number) => {
    // Find the debt
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    // Ensure player has enough cash
    if (cash < amount) {
      toast({
        title: "Not Enough Cash",
        description: "You don't have enough cash to make this payment.",
        variant: "default",
      });
      return;
    }
    
    // Calculate health reduction (percentage of current debt)
    const healthReduction = (amount / debt.amount) * 100;
    const newAmount = Math.max(0, debt.amount - amount);
    const newHealth = Math.max(0, debt.health - healthReduction);
    
    // Update the debt
    updateDebt(debtId, {
      amount: newAmount,
      health: newHealth
    });
    
    // Deduct payment from cash
    setCash(prev => prev - amount);
    
    // Update challenge progress for making a payment
    updateChallenge('1', 1);
    
    // If debt is paid off, remove it
    if (newAmount === 0) {
      removeDebt(debtId);
      
      // Improve financial knowledge
      updatePlayerTrait('financialKnowledge', playerTraits.financialKnowledge + 0.5);
    }
    
    toast({
      title: "Payment Made!",
      description: `You made a $${amount} payment on your ${debt.name}!`,
      variant: "default",
    });
  };

  // Special move function
  const useSpecialMove = (debtId: string) => {
    // Check if player has special moves available
    if (specialMoves <= 0) {
      toast({
        title: "No Special Moves",
        description: "You don't have any special moves available.",
        variant: "default",
      });
      return;
    }
    
    // Find the debt
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;
    
    // Apply special move effects (reduce interest by 20%)
    const newInterest = Math.max(1, debt.interest * 0.8);
    
    // Update the debt
    updateDebt(debtId, {
      interest: newInterest
    });
    
    // Consume special move
    setSpecialMoves(prev => prev - 1);
    
    toast({
      title: "Special Move Used!",
      description: `You negotiated a lower interest rate on your ${debt.name}!`,
      variant: "default",
    });
  };

  return {
    damageMonster,
    useSpecialMove
  };
};
