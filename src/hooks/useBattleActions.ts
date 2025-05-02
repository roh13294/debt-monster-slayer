// Since we don't have direct access to the file, we need to create a complete replacement
// that includes XP gains
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { Debt, PlayerTraits, Challenge } from '../types/gameTypes';

interface BattleActionsProps {
  cash: number;
  setCash: (cash: number | ((prev: number) => number)) => void;
  updateDebt: (id: string, updates: Partial<Debt>) => void;
  removeDebt: (id: string) => void;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  updatePlayerTrait: (trait: keyof PlayerTraits, value: number) => void;
  playerTraits: PlayerTraits;
  debts: Debt[];
  specialMoves: number;
  setSpecialMoves: (moves: number | ((prev: number) => number)) => void;
  gainXP?: (amount: number) => void; // Make XP optional to avoid breaking existing code
}

export function useBattleActions({
  cash,
  setCash,
  updateDebt,
  removeDebt,
  updateChallenge,
  updatePlayerTrait,
  playerTraits,
  debts,
  specialMoves,
  setSpecialMoves,
  gainXP
}: BattleActionsProps) {
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});

  const damageMonster = (debtId: string, damage: number) => {
    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;

    if (damage <= 0) {
      toast({
        title: "No Damage",
        description: "Your attack was too weak to damage the demon.",
        variant: "destructive",
      });
      return;
    }

    // Check if the player has enough spirit energy
    if (cash < damage) {
      toast({
        title: "Not Enough Spirit Energy",
        description: "You don't have enough spirit energy for this attack.",
        variant: "destructive",
      });
      return false;
    }

    // Deduct cash for the attack
    setCash((prev: number) => prev - damage);

    // Apply damage to the debt
    const newBalance = Math.max(0, debt.balance - damage);
    
    // Calculate XP gain based on damage dealt relative to debt size
    const xpGained = Math.ceil(damage / debt.amount * 20);
    
    // Apply damage to the debt's health
    const newHealth = Math.max(0, 100 - ((newBalance / debt.amount) * 100));
    
    // Update the debt
    updateDebt(debtId, {
      balance: newBalance,
      health: newHealth
    });
    
    // Handle XP gain
    if (gainXP) {
      gainXP(xpGained);
      toast({
        title: "XP Gained",
        description: `You gained ${xpGained} XP from your attack!`,
        variant: "default",
      });
    }

    // Show damage notification
    toast({
      title: "Attack Successful",
      description: `You dealt ${damage} damage to ${debt.name}!`,
      variant: "default",
    });

    // Check if debt is defeated
    if (newBalance === 0) {
      // Additional XP bonus for defeating a demon
      if (gainXP) {
        const defeatBonus = Math.ceil(debt.amount / 100);
        gainXP(defeatBonus);
      }
      
      // Reward for defeating the monster
      const reward = Math.round(debt.amount * 0.1);
      setCash((prev: number) => prev + reward);
      
      // Update trait based on debt
      if (debt.psychologicalImpact > 7) {
        // For high-impact debts, increase determination
        updatePlayerTrait('determination', playerTraits.determination + 1);
      } else {
        // For regular debts, increase financial knowledge
        updatePlayerTrait('financialKnowledge', playerTraits.financialKnowledge + 1);
      }
      
      // Show victory notification
      toast({
        title: "Demon Defeated!",
        description: `You defeated ${debt.name} and earned ${reward} DemonCoins!`,
        variant: "default",
      });
      
      // Remove the debt after a short delay for animation
      setTimeout(() => {
        removeDebt(debtId);
        
        // Update any challenges related to debt elimination
        const debtChallenges = ['eliminateDebt', 'payDebt', 'defeatDemons'];
        debtChallenges.forEach(challengeType => {
          updateChallenge(challengeType, { progress: 1, completed: true });
        });
      }, 500);
      
      // Award special move for defeating a demon
      setSpecialMoves((prev: number) => prev + 1);
    }
    
    return true;
  };

  const useSpecialMove = (debtId: string) => {
    if (specialMoves <= 0) {
      toast({
        title: "No Special Moves",
        description: "You don't have any special moves remaining.",
        variant: "destructive",
      });
      return;
    }

    const debt = debts.find(d => d.id === debtId);
    if (!debt) return;

    // Check if move is on cooldown
    if (cooldowns[debtId] && cooldowns[debtId] > 0) {
      toast({
        title: "Move on Cooldown",
        description: "This special move is still on cooldown.",
        variant: "destructive",
      });
      return;
    }

    // Apply cooldown
    setCooldowns(prev => ({
      ...prev,
      [debtId]: 3 // 3 rounds cooldown
    }));

    // Calculate damage based on debt type and player traits
    const baseDamage = debt.minimumPayment * 3;
    const bonusDamage = playerTraits.determination * 20;
    const totalDamage = baseDamage + bonusDamage;

    // Deduct a special move
    setSpecialMoves(prev => prev - 1);

    // Apply damage
    const newBalance = Math.max(0, debt.balance - totalDamage);
    
    // Calculate XP gain for special move (more than regular attacks)
    if (gainXP) {
      const specialMoveXP = Math.ceil(totalDamage / debt.amount * 30);
      gainXP(specialMoveXP);
    }
    
    // Update the debt's health
    const newHealth = Math.max(0, 100 - ((newBalance / debt.amount) * 100));
    
    // Update the debt
    updateDebt(debtId, {
      balance: newBalance,
      health: newHealth
    });

    // Show special move notification
    toast({
      title: "Special Move Used",
      description: `You unleashed a special technique for ${totalDamage} damage!`,
      variant: "default",
    });

    // Check if debt is defeated
    if (newBalance === 0) {
      // Additional XP bonus for defeating with a special move
      if (gainXP) {
        const specialDefeatBonus = Math.ceil(debt.amount / 80);
        gainXP(specialDefeatBonus);
      }
      
      // Reward for defeating the monster
      const reward = Math.round(debt.amount * 0.15); // Higher reward for special move kill
      setCash((prev: number) => prev + reward);
      
      // Increase determination for defeating with special move
      updatePlayerTrait('determination', playerTraits.determination + 1);
      
      // Show victory notification
      toast({
        title: "Demon Obliterated!",
        description: `Your special technique defeated ${debt.name} and earned ${reward} DemonCoins!`,
        variant: "default",
      });
      
      // Remove the debt after a short delay for animation
      setTimeout(() => {
        removeDebt(debtId);
        
        // Update any challenges related to debt elimination
        const debtChallenges = ['eliminateDebt', 'payDebt', 'defeatDemons'];
        debtChallenges.forEach(challengeType => {
          updateChallenge(challengeType, { progress: 1, completed: true });
        });
      }, 500);
    }
  };

  return { damageMonster, useSpecialMove };
}
