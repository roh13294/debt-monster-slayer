
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../context/GameContext';
import Dashboard from './Dashboard';
import CutsceneEventScreen from './cutscene/CutsceneEventScreen';
import BattleArena from './battle/BattleArena';
import MonthSummary from './summary/MonthSummary';
import ShadowCallingModal from './shadow/ShadowCallingModal';

type GamePhase = 'dashboard' | 'cutscene' | 'battle' | 'summary';

const MonthEngine: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('dashboard');
  const [selectedStance, setSelectedStance] = useState<string | null>(null);
  const [showShadowModal, setShowShadowModal] = useState(false);
  
  const { 
    processMonthlyFinancials, 
    updatePlayerTrait, 
    monthsPassed, 
    totalDebt,
    paymentStreak,
    shadowForm
  } = useGameContext();
  
  // Check if shadow form should be triggered
  useEffect(() => {
    const shouldTriggerShadowForm = 
      (shadowForm === null) && 
      ((monthsPassed >= 3) || 
      (totalDebt > 15000 && Math.max(0, 3 - paymentStreak) >= 2));
    
    if (shouldTriggerShadowForm && currentPhase === 'dashboard') {
      setShowShadowModal(true);
    }
  }, [monthsPassed, totalDebt, paymentStreak, shadowForm, currentPhase]);
  
  const handleAdvanceMonth = () => {
    setCurrentPhase('cutscene');
  };
  
  const handleCutsceneChoice = (choice: string) => {
    setSelectedStance(choice);
    
    // Apply initial effects based on stance
    switch (choice) {
      case 'aggressive':
        updatePlayerTrait('determination', 5);
        break;
      case 'defensive':
        updatePlayerTrait('financialKnowledge', 3);
        break;
      case 'risky':
        // Risk effects will be applied during the battle phase
        break;
    }
    
    setCurrentPhase('battle');
  };
  
  const handleBattleComplete = () => {
    // Process monthly financials after battle phase
    processMonthlyFinancials(selectedStance);
    setCurrentPhase('summary');
  };
  
  const handleSummaryFinish = () => {
    setCurrentPhase('dashboard');
    setSelectedStance(null);
  };
  
  return (
    <>
      {currentPhase === 'dashboard' && (
        <Dashboard onAdvanceMonth={handleAdvanceMonth} />
      )}
      
      {currentPhase === 'cutscene' && (
        <CutsceneEventScreen 
          isOpen={true}
          onClose={() => {}} // Not used in this flow
          onSelectStance={handleCutsceneChoice}
        />
      )}
      
      {currentPhase === 'battle' && (
        <BattleArena 
          stance={selectedStance}
          onComplete={handleBattleComplete}
        />
      )}
      
      {currentPhase === 'summary' && (
        <MonthSummary
          stance={selectedStance}
          onFinish={handleSummaryFinish}
        />
      )}
      
      {/* Shadow Form Modal */}
      <ShadowCallingModal 
        isOpen={showShadowModal}
        onClose={() => setShowShadowModal(false)}
      />
    </>
  );
};

export default MonthEngine;
