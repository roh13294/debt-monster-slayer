
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sword, Shield, Zap, Target, Timer, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/context/GameContext';
import { Debt } from '@/types/gameTypes';
import DebtMonster from '../DebtMonster';
import { toast } from "@/hooks/use-toast";

export interface RaidResult {
  debtId: string;
  damageDealt: number;
  success: boolean;
  criticalHit: boolean;
}

interface TacticalRaidScreenProps {
  debts: Debt[];
  onComplete: (results: RaidResult[]) => void;
  onCancel: () => void;
}

const TacticalRaidScreen: React.FC<TacticalRaidScreenProps> = ({
  debts,
  onComplete,
  onCancel
}) => {
  const { playerTraits, playerLevel, specialMoves, cash } = useGameContext();
  const [selectedDebts, setSelectedDebts] = useState<string[]>([]);
  const [raidInProgress, setRaidInProgress] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<number>(0);
  const [results, setResults] = useState<RaidResult[]>([]);

  const maxTargets = Math.min(3, debts.length);
  const raidCost = selectedDebts.length * 100;
  
  const handleDebtSelection = (debtId: string) => {
    if (selectedDebts.includes(debtId)) {
      setSelectedDebts(prev => prev.filter(id => id !== debtId));
    } else if (selectedDebts.length < maxTargets) {
      setSelectedDebts(prev => [...prev, debtId]);
    }
  };

  const calculateDamage = (debt: Debt): number => {
    const baseDamage = Math.floor(Math.random() * 500) + 300;
    const levelBonus = playerLevel * 50;
    const traitBonus = (playerTraits.financialKnowledge + playerTraits.determination) * 20;
    return baseDamage + levelBonus + traitBonus;
  };

  const executeRaid = async () => {
    if (selectedDebts.length === 0) {
      toast({
        title: "No Targets Selected",
        description: "Please select at least one debt demon to target in the raid.",
        variant: "destructive",
      });
      return;
    }

    if (cash < raidCost) {
      toast({
        title: "Insufficient DemonCoins",
        description: `You need ${raidCost} DemonCoins to execute this raid.`,
        variant: "destructive",
      });
      return;
    }

    setRaidInProgress(true);
    const raidResults: RaidResult[] = [];

    for (let i = 0; i < selectedDebts.length; i++) {
      setCurrentTarget(i);
      const debt = debts.find(d => d.id === selectedDebts[i]);
      
      if (debt) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const damage = calculateDamage(debt);
        const criticalHit = Math.random() < 0.25;
        const finalDamage = criticalHit ? Math.floor(damage * 1.5) : damage;
        
        raidResults.push({
          debtId: debt.id,
          damageDealt: finalDamage,
          success: true,
          criticalHit
        });
      }
    }

    setResults(raidResults);
    setRaidInProgress(false);
    
    setTimeout(() => {
      onComplete(raidResults);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-900 to-red-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Tactical Raid Mode
          </h1>
          <p className="text-purple-200">
            Coordinate simultaneous strikes against multiple debt demons
          </p>
        </div>

        {!raidInProgress ? (
          <>
            {/* Raid Setup */}
            <div className="bg-slate-800/80 rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Select Targets ({selectedDebts.length}/{maxTargets})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {debts.map(debt => (
                  <div
                    key={debt.id}
                    className={`cursor-pointer transition-all ${
                      selectedDebts.includes(debt.id)
                        ? 'ring-2 ring-purple-400 scale-105'
                        : selectedDebts.length >= maxTargets
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:scale-102'
                    }`}
                    onClick={() => handleDebtSelection(debt.id)}
                  >
                    <DebtMonster debt={debt} />
                  </div>
                ))}
              </div>

              {/* Raid Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">Raid Cost</h3>
                  <p className="text-2xl text-purple-400">{raidCost} DemonCoins</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">Your Cash</h3>
                  <p className={`text-2xl ${cash >= raidCost ? 'text-green-400' : 'text-red-400'}`}>
                    {cash} DemonCoins
                  </p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h3 className="text-white font-bold mb-2">Special Moves</h3>
                  <p className="text-2xl text-amber-400">{specialMoves}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={executeRaid}
                  disabled={selectedDebts.length === 0 || cash < raidCost}
                  className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white px-8 py-3"
                >
                  <Sword className="w-5 h-5 mr-2" />
                  Execute Raid
                </Button>
                <Button
                  onClick={onCancel}
                  variant="outline"
                  className="px-8 py-3"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Raid in Progress */}
            <div className="bg-slate-800/80 rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Raid in Progress...
              </h2>
              
              <div className="mb-8">
                <div className="text-lg text-purple-200 mb-2">
                  Targeting: {selectedDebts[currentTarget] && debts.find(d => d.id === selectedDebts[currentTarget])?.name}
                </div>
                <div className="text-4xl font-bold text-white">
                  {currentTarget + 1} / {selectedDebts.length}
                </div>
              </div>

              <motion.div
                className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </>
        )}

        {/* Results Preview */}
        {results.length > 0 && (
          <div className="bg-slate-800/80 rounded-xl p-6 mt-6">
            <h3 className="text-2xl font-bold text-white mb-4">Raid Results</h3>
            <div className="space-y-2">
              {results.map((result, index) => {
                const debt = debts.find(d => d.id === result.debtId);
                return (
                  <div key={index} className="flex justify-between items-center bg-slate-700/50 rounded-lg p-3">
                    <span className="text-white">{debt?.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 font-bold">
                        {result.damageDealt} damage
                      </span>
                      {result.criticalHit && (
                        <span className="text-amber-400 text-sm">CRITICAL!</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TacticalRaidScreen;
