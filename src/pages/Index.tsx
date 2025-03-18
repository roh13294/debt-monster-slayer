
import React, { useState } from 'react';
import { GameProvider } from '../context/GameContext';
import Dashboard from '../components/Dashboard';
import StrategySelector from '../components/StrategySelector';
import BudgetAllocator from '../components/BudgetAllocator';
import MonsterBattle from '../components/MonsterBattle';
import LifeEvent from '../components/LifeEvent';
import Challenge from '../components/Challenge';
import { useGameContext } from '../context/GameContext';

// Main game component wrapped with provider
const Index = () => {
  return (
    <GameProvider>
      <GameInterface />
    </GameProvider>
  );
};

// Game interface component with access to context
const GameInterface = () => {
  const { challenges, gameStarted, initializeGame, playerName, setPlayerName } = useGameContext();
  
  if (!gameStarted) {
    return <StartScreen onStart={initializeGame} playerName={playerName} setPlayerName={setPlayerName} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white pb-20">
      {/* Life event modal (shown conditionally) */}
      <LifeEvent />
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <header className="text-center mb-12">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mb-2">Debt Monster Slayer</div>
          <h1 className="text-4xl font-bold">Your Financial Journey</h1>
          <p className="text-gray-600 mt-2">Fight your debt monsters and achieve financial freedom</p>
        </header>
        
        <section className="mb-12 animate-fade-in">
          <Dashboard />
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <MonsterBattle />
            </section>
            
            <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <StrategySelector />
            </section>
          </div>
          
          <div className="space-y-8">
            <section className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <BudgetAllocator />
            </section>
            
            <section className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="card-elegant">
                <h2 className="text-xl font-bold mb-4">Challenges</h2>
                <div className="space-y-3">
                  {challenges.map((challenge) => (
                    <Challenge
                      key={challenge.id}
                      title={challenge.title}
                      description={challenge.description}
                      progress={challenge.progress}
                      target={challenge.target}
                      reward={challenge.reward}
                      completed={challenge.completed}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// Start screen component
const StartScreen = ({ 
  onStart, 
  playerName, 
  setPlayerName 
}: { 
  onStart: () => void, 
  playerName: string, 
  setPlayerName: (name: string) => void 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-scale-in">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Debt Monster Slayer</h1>
          <p className="text-gray-600">Your journey to financial freedom begins here</p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            placeholder="Enter your name"
          />
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Ready to fight your debt monsters? Your financial adventure awaits.
          Make strategic decisions, overcome life events, and slay your debt to achieve financial freedom.
        </p>
        
        <button
          onClick={onStart}
          className="w-full btn-elegant"
        >
          Start Your Journey
        </button>
      </div>
    </div>
  );
};

export default Index;
