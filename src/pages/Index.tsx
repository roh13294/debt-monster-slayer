
import React, { useState, useEffect } from 'react';
import { GameProvider } from '../context/GameContext';
import Dashboard from '../components/Dashboard';
import StrategySelector from '../components/StrategySelector';
import BudgetAllocator from '../components/BudgetAllocator';
import MonsterBattle from '../components/MonsterBattle';
import LifeEvent from '../components/LifeEvent';
import Challenge from '../components/Challenge';
import StatsDashboard from '../components/StatsDashboard';
import { useGameContext } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Sparkles, BarChart4, Brain, Bookmark, Coins, Briefcase, PiggyBank, Zap } from 'lucide-react';
import { Trophy, Sword } from '@/components/ui/icons';

const Index = () => {
  return (
    <GameProvider>
      <GameInterface />
    </GameProvider>
  );
};

const GameInterface = () => {
  const { challenges, gameStarted, initializeGame, playerName, setPlayerName, playerTraits } = useGameContext();
  const { user, signOut } = useAuth();
  const [showStats, setShowStats] = useState(false);
  const [showTraits, setShowTraits] = useState(false);
  
  if (!gameStarted) {
    return <StartScreen onStart={initializeGame} playerName={playerName} setPlayerName={setPlayerName} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-indigo-50 to-white pb-20 overflow-x-hidden">
      <LifeEvent />
      
      <div className="absolute top-20 right-10 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
      <div className="absolute top-40 left-10 w-36 h-36 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 relative">
        <header className="flex justify-between items-center mb-12">
          <div className="text-center flex-grow">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mb-2">
              <Sparkles size={14} className="animate-pulse-subtle" />
              Debt Monster Slayer
              <Sparkles size={14} className="animate-pulse-subtle" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-primary to-indigo-600 text-transparent bg-clip-text">Your Financial Journey</h1>
            <p className="text-gray-600 mt-2">Fight your debt monsters and achieve financial freedom</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
              <User size={16} className="text-primary" />
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={signOut} className="rounded-full hover:bg-red-50 hover:text-red-600 transition-all">
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </header>
        
        <div className="flex justify-center mb-6 space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setShowStats(!showStats)}
            className="animate-bounce-subtle rounded-full flex items-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            <BarChart4 size={16} />
            {showStats ? 'Show Dashboard' : 'Show Analytics'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowTraits(!showTraits)}
            className="rounded-full flex items-center gap-2 hover:bg-purple-50 hover:text-purple-600 transition-all"
          >
            <Brain size={16} />
            {showTraits ? 'Hide Player Profile' : 'Show Player Profile'}
          </Button>
        </div>
        
        {showTraits && (
          <section className="mb-8 animate-fade-in">
            <div className="card-elegant">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-purple-100 text-purple-700 p-1 rounded-md mr-2">
                  <Bookmark size={18} />
                </span>
                Your Unique Player Profile
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Your gameplay choices shape your financial character. These traits influence the events you encounter and options available to you.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Brain size={16} className="text-blue-600" />
                    <span className="font-medium text-sm">Financial Knowledge</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${playerTraits.financialKnowledge * 10}%` }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={16} className="text-red-600" />
                    <span className="font-medium text-sm">Risk Tolerance</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${playerTraits.riskTolerance * 10}%` }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Coins size={16} className="text-green-600" />
                    <span className="font-medium text-sm">Spending Habits</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${playerTraits.spendingHabits * 10}%` }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase size={16} className="text-yellow-600" />
                    <span className="font-medium text-sm">Career Focus</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${playerTraits.careerFocus * 10}%` }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <PiggyBank size={16} className="text-purple-600" />
                    <span className="font-medium text-sm">Saving Ability</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${playerTraits.savingAbility * 10}%` }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={16} className="text-orange-600" />
                    <span className="font-medium text-sm">Lucky Streak</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${playerTraits.luckyStreak * 10}%` }}></div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500 italic">Your profile evolves as you make financial decisions.</p>
            </div>
          </section>
        )}
        
        <section className="mb-12 animate-fade-in transform hover:scale-[1.01] transition-transform duration-300">
          {showStats ? <StatsDashboard /> : <Dashboard />}
        </section>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section className="animate-fade-in transform hover:translate-y-[-4px] transition-all duration-300" style={{ animationDelay: '100ms' }}>
              <MonsterBattle />
            </section>
            
            <section className="animate-fade-in transform hover:translate-y-[-4px] transition-all duration-300" style={{ animationDelay: '200ms' }}>
              <StrategySelector />
            </section>
          </div>
          
          <div className="space-y-8">
            <section className="animate-fade-in transform hover:translate-y-[-4px] transition-all duration-300" style={{ animationDelay: '300ms' }}>
              <BudgetAllocator />
            </section>
            
            <section className="animate-fade-in transform hover:translate-y-[-4px] transition-all duration-300" style={{ animationDelay: '400ms' }}>
              <div className="card-elegant">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <span className="bg-yellow-100 text-yellow-700 p-1 rounded-md mr-2">
                    <Trophy size={18} />
                  </span>
                  Challenges
                </h2>
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

const StartScreen = ({ 
  onStart, 
  playerName, 
  setPlayerName 
}: { 
  onStart: () => void, 
  playerName: string, 
  setPlayerName: (name: string) => void 
}) => {
  const { user } = useAuth();
  const [animationComplete, setAnimationComplete] = useState(false);
  
  useEffect(() => {
    if (user && user.email && playerName === 'Player') {
      const emailName = user.email.split('@')[0];
      setPlayerName(emailName);
    }
    
    const timer = setTimeout(() => setAnimationComplete(true), 500);
    return () => clearTimeout(timer);
  }, [user, playerName, setPlayerName]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-50 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute top-20 right-20 w-60 h-60 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2.5s' }}></div>
      <div className="absolute top-40 left-40 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1.2s' }}></div>
      
      <div className={`max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 transition-all duration-700 ${
        animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Sparkles size={22} className="text-yellow-500 animate-pulse-subtle" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-primary to-indigo-600 text-transparent bg-clip-text">Debt Monster Slayer</h1>
            <Sparkles size={22} className="text-yellow-500 animate-pulse-subtle" />
          </div>
          <p className="text-gray-600">Your journey to financial freedom begins here</p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Monster Slayer Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-primary focus:border-primary transition-all hover:border-primary/50"
            placeholder="Enter your name"
          />
        </div>
        
        <div className="p-4 bg-blue-50 rounded-xl mb-6 border border-blue-100">
          <p className="text-sm text-blue-800">
            Ready to fight your debt monsters? Your financial adventure awaits.
            Make strategic decisions, overcome life events, and slay your debt to achieve financial freedom.
          </p>
          <p className="text-sm text-blue-800 mt-2">
            <strong>Every journey is unique!</strong> Your choices will shape your experience and determine your path to financial success.
          </p>
        </div>
        
        <button
          onClick={onStart}
          className="w-full btn-elegant group relative overflow-hidden rounded-full"
        >
          <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          <span className="relative z-10 flex items-center justify-center gap-2">
            Start Your Journey 
            <Sword size={18} className="inline-block animate-pulse-subtle" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Index;
