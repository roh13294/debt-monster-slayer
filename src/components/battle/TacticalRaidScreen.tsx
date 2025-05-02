
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Debt } from '@/types/gameTypes';
import { useGameContext } from '@/context/GameContext';
import { Flame, Shield, Sword } from 'lucide-react';
import CorruptionMeter from '@/components/ui/CorruptionMeter';
import { toast } from '@/hooks/use-toast';

interface TacticalRaidScreenProps {
  debts: Debt[];
  onComplete: (results: RaidResult[]) => void;
  onCancel: () => void;
}

export interface RaidResult {
  debtId: string;
  damageDealt: number;
  rewards: {
    xp: number;
    coins: number;
    relicChance: number;
  };
}

const TacticalRaidScreen: React.FC<TacticalRaidScreenProps> = ({ 
  debts,
  onComplete,
  onCancel
}) => {
  const { 
    cash, 
    playerTraits, 
    shadowForm, 
    corruptionLevel,
    increaseCorruption 
  } = useGameContext();
  
  const [energyAllocations, setEnergyAllocations] = useState<Record<string, number>>(
    Object.fromEntries(debts.map(debt => [debt.id, 0]))
  );
  
  const [totalEnergy, setTotalEnergy] = useState<number>(100);
  const [remainingEnergy, setRemainingEnergy] = useState<number>(100);
  const [isRaiding, setIsRaiding] = useState<boolean>(false);
  
  // Calculate damage forecast based on energy allocation
  const calculateDamage = (debt: Debt, energy: number): number => {
    const baseMultiplier = 5; 
    let damage = energy * baseMultiplier;
    
    // Apply player trait modifiers
    damage *= (1 + playerTraits.determination / 20);
    
    // Apply shadow form modifiers
    if (shadowForm === 'cursedBlade') {
      damage *= 1.5;
    }
    
    return Math.floor(damage);
  };
  
  // Calculate total rewards forecast
  const calculateRewards = (debt: Debt, damage: number): {
    xp: number;
    coins: number;
    relicChance: number;
  } => {
    const percentDamage = Math.min(100, (damage / debt.health) * 100);
    
    // Base rewards scaled by damage percentage
    let xp = Math.floor((debt.amount / 1000) * (percentDamage / 100));
    let coins = Math.floor((debt.amount / 100) * (percentDamage / 100));
    let relicChance = percentDamage >= 50 ? (percentDamage / 400) : 0;
    
    // Apply shadow form modifiers
    if (shadowForm === 'whisperer') {
      xp *= 0.5;
      relicChance *= 1.2;
    } else if (shadowForm === 'leecher') {
      coins *= 1.3;
      xp = 0;
    }
    
    return {
      xp: Math.floor(xp),
      coins: Math.floor(coins),
      relicChance: parseFloat(relicChance.toFixed(2))
    };
  };
  
  // Handle allocation for a specific debt
  const handleAllocation = (debtId: string, value: number) => {
    const newAllocations = { ...energyAllocations };
    const oldValue = newAllocations[debtId] || 0;
    
    // Calculate new remaining energy
    const energyDelta = value - oldValue;
    const newRemaining = remainingEnergy - energyDelta;
    
    // Check if we have enough energy
    if (newRemaining < 0) {
      toast({
        title: "Not Enough Energy",
        description: "You don't have enough spirit energy for this allocation.",
        variant: "destructive",
      });
      return;
    }
    
    // Update allocations and remaining energy
    newAllocations[debtId] = value;
    setEnergyAllocations(newAllocations);
    setRemainingEnergy(newRemaining);
  };
  
  // Launch the raid with current allocations
  const handleLaunchRaid = () => {
    // Check if any energy is allocated
    const totalAllocated = Object.values(energyAllocations).reduce((sum, val) => sum + val, 0);
    if (totalAllocated === 0) {
      toast({
        title: "No Energy Allocated",
        description: "You need to allocate some spirit energy to attack.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRaiding(true);
    
    // Calculate raid results
    setTimeout(() => {
      const results: RaidResult[] = debts.map(debt => {
        const energy = energyAllocations[debt.id] || 0;
        const damageDealt = calculateDamage(debt, energy);
        const rewards = calculateRewards(debt, damageDealt);
        
        return {
          debtId: debt.id,
          damageDealt,
          rewards
        };
      });
      
      // Apply corruption increase based on ignored demons
      const ignoredDemons = debts.filter(debt => 
        (energyAllocations[debt.id] || 0) === 0
      ).length;
      
      if (ignoredDemons > 0 && shadowForm) {
        increaseCorruption(ignoredDemons * 5);
        
        toast({
          title: "Corruption Increases",
          description: `Ignoring ${ignoredDemons} demon${ignoredDemons > 1 ? 's' : ''} has increased your corruption.`,
          variant: "destructive",
        });
      }
      
      // Complete the raid
      onComplete(results);
    }, 2000);
  };
  
  return (
    <div className="bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-lg">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-amber-400 mb-2">Tactical Raid</h2>
        <p className="text-slate-300">
          Allocate your spirit energy to attack multiple demons simultaneously
        </p>
        
        <div className="flex items-center justify-center mt-4 mb-6 space-x-3">
          <div className="bg-indigo-900/60 rounded-lg px-4 py-2 border border-indigo-700/50">
            <p className="text-xs text-indigo-300 mb-1">Energy Pool</p>
            <p className="text-xl font-bold text-indigo-200">
              {remainingEnergy}/{totalEnergy}
            </p>
          </div>
          
          {shadowForm && (
            <div className="bg-red-900/30 rounded-lg py-2 px-4">
              <CorruptionMeter size="sm" />
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {debts.map(debt => {
          const allocation = energyAllocations[debt.id] || 0;
          const damageForcast = calculateDamage(debt, allocation);
          const rewards = calculateRewards(debt, damageForcast);
          const damagePercent = Math.min(100, Math.floor((damageForcast / debt.health) * 100));
          
          return (
            <div 
              key={debt.id} 
              className="bg-slate-800/70 rounded-lg p-4 border border-slate-700"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-white">{debt.name}</h3>
                <span className="text-sm text-green-400">
                  {damageForcast} dmg ({damagePercent}%)
                </span>
              </div>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-1">
                  <Slider
                    value={[allocation]}
                    max={100}
                    step={5}
                    onValueChange={(values) => handleAllocation(debt.id, values[0])}
                    className="my-2"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>0%</span>
                    <span>{allocation}%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="bg-slate-700/60 rounded px-3 py-1">
                  <span className="font-mono text-md text-yellow-300">{allocation}</span>
                </div>
              </div>
              
              {allocation > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3 bg-slate-900/50 rounded p-2 text-center text-xs">
                  <div>
                    <p className="text-slate-400">XP</p>
                    <p className="text-indigo-300 font-medium">{rewards.xp}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Coins</p>
                    <p className="text-amber-300 font-medium">{rewards.coins}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Relic</p>
                    <p className="text-emerald-300 font-medium">{rewards.relicChance}%</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-center space-x-3 mt-6">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-slate-600"
        >
          Cancel
        </Button>
        
        <Button
          disabled={isRaiding}
          onClick={handleLaunchRaid}
          className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 flex items-center gap-2"
        >
          <Sword className="w-4 h-4" />
          Launch Raid
          {isRaiding && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="ml-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"
            />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TacticalRaidScreen;
