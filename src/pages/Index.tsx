
import React, { useState, useEffect } from 'react';
import { GameProvider } from '../context/GameContext';
import Dashboard from '../components/Dashboard';
import { useGameContext } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Sparkles, Info, ShoppingCart, Briefcase, Bookmark, Brain, Zap, Coins, PiggyBank, Sword, Flame, Droplets, Zap as ThunderIcon, Wind } from 'lucide-react';
import Shop from '../components/Shop';
import StatsDashboard from '../components/StatsDashboard';

const Index = () => {
  return (
    <GameProvider>
      <GameInterface />
    </GameProvider>
  );
};

const GameInterface = () => {
  const { 
    gameStarted, initializeGame, playerName, setPlayerName, 
    playerTraits, job, lifeStage, circumstances, characterBackground,
    budget
  } = useGameContext();
  const { user, signOut } = useAuth();
  const [showStats, setShowStats] = useState(false);
  const [showTraits, setShowTraits] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);
  const [showShop, setShowShop] = useState(false);
  
  if (!gameStarted) {
    return <StartScreen onStart={initializeGame} playerName={playerName} setPlayerName={setPlayerName} />;
  }
  
  return (
    <div className="min-h-screen bg-night-sky pb-20 overflow-x-hidden relative">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('/images/misty-mountains.jpg')] bg-cover bg-center opacity-20 pointer-events-none"></div>
      <div className="absolute top-20 right-10 w-32 h-32 bg-demon-red/20 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-float"></div>
      <div className="absolute top-40 left-10 w-36 h-36 bg-demon-purple/20 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 right-20 w-40 h-40 bg-demon-orange/20 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Animated flame particles */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div key={i} 
              className="absolute w-4 h-4 rounded-full bg-demon-red/30 animate-float" 
              style={{
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}>
          </div>
        ))}
      </div>
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8 relative">
        <header className="demon-card mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative overflow-hidden">
          <div className="absolute inset-0 kanji-bg" aria-hidden="true"></div>
          
          <div className="text-center md:text-left flex-grow relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-demon-red/10 text-demon-red rounded-full text-xs font-medium mb-2 animate-pulse-subtle">
              <Sparkles className="w-3.5 h-3.5" />
              Debt Demon Slayer
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-3xl font-bold flame-breathing-text">Your Financial Journey</h1>
            <p className="text-gray-400 mt-1 text-sm">Slay your debt demons and achieve financial freedom</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 bg-demon-black/50 shadow-sm px-3 py-1.5 rounded-full border border-demon-red/20">
              <User className="w-4 h-4 text-demon-red" />
              <span className="text-sm font-medium text-gray-200">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={signOut} className="rounded-full hover:bg-demon-red/10 hover:text-demon-red border-demon-red/20 text-gray-200 transition-all">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>
        
        <div className="flex flex-wrap justify-center mb-6 gap-3">
          <Button 
            variant="outline" 
            onClick={() => {
              setShowStats(!showStats);
              setShowShop(false);
            }}
            className="rounded-full flex items-center gap-2 hover:bg-demon-teal/10 hover:text-demon-teal border-demon-teal/20 text-gray-200 transition-all shadow-sm"
          >
            <Info className="w-4 h-4" />
            {showStats ? 'Show Dashboard' : 'Show Vault of Reflection'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setShowTraits(!showTraits);
              setShowShop(false);
            }}
            className="rounded-full flex items-center gap-2 hover:bg-demon-purple/10 hover:text-demon-purple border-demon-purple/20 text-gray-200 transition-all shadow-sm"
          >
            <User className="w-4 h-4" />
            {showTraits ? 'Hide Breathing Style' : 'Show Breathing Style'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setShowCharacter(!showCharacter);
              setShowShop(false);
            }}
            className="rounded-full flex items-center gap-2 hover:bg-demon-orange/10 hover:text-demon-orange border-demon-orange/20 text-gray-200 transition-all shadow-sm"
          >
            <Briefcase className="w-4 h-4" />
            {showCharacter ? 'Hide Character Scroll' : 'Open Character Scroll'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setShowShop(!showShop);
              setShowStats(false);
            }}
            className="rounded-full flex items-center gap-2 hover:bg-demon-gold/10 hover:text-demon-gold border-demon-gold/20 text-gray-200 transition-all shadow-sm animate-pulse-subtle"
          >
            <ShoppingCart className="w-4 h-4" />
            {showShop ? 'Hide Guild Market' : 'Visit Guild Market'}
          </Button>
        </div>
        
        {showCharacter && job && lifeStage && (
          <section className="mb-8 animate-fade-in">
            <div className="demon-card shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute inset-0 kanji-bg" aria-hidden="true"></div>
              
              <h2 className="text-xl font-bold mb-4 flex items-center demon-text-fire">
                <span className="bg-demon-red/10 text-demon-red p-1.5 rounded-md mr-2">
                  <Briefcase className="w-4 h-4" />
                </span>
                Your Character Scroll
              </h2>
              
              <div className="p-4 bg-demon-black/30 rounded-lg border border-demon-red/10 mb-4 relative overflow-hidden">
                <p className="text-sm text-gray-300">
                  {characterBackground || `You are a ${lifeStage.name} working as a ${job.title}.`}
                </p>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-demon-red/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-demon-red/30 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-demon-black/30 rounded-lg p-4 border border-demon-teal/20 shadow-water-breathing hover:border-demon-teal/30 transition-all relative overflow-hidden animate-floating-card" style={{animationDelay: '0.1s'}}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-water-gradient opacity-5 rounded-full blur-lg"></div>
                  
                  <h3 className="font-semibold water-breathing-text mb-2 flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    Career
                  </h3>
                  <p className="text-sm mb-1 text-gray-200">{job.title}</p>
                  <p className="text-xs text-gray-400">{job.description}</p>
                  <p className="text-xs font-medium water-breathing-text mt-2 bg-demon-teal/10 px-2 py-1 rounded inline-block">
                    Base Income: ${job.baseIncome}/month
                  </p>
                </div>
                
                <div className="bg-demon-black/30 rounded-lg p-4 border border-demon-purple/20 shadow-thunder-breathing hover:border-demon-purple/30 transition-all relative overflow-hidden animate-floating-card" style={{animationDelay: '0.2s'}}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-thunder-gradient opacity-5 rounded-full blur-lg"></div>
                  
                  <h3 className="font-semibold thunder-breathing-text mb-2 flex items-center gap-2">
                    <ThunderIcon className="w-4 h-4" />
                    Life Stage
                  </h3>
                  <p className="text-sm mb-1 text-gray-200">{lifeStage.name}</p>
                  <p className="text-xs text-gray-400">{lifeStage.description}</p>
                  <p className="text-xs font-medium thunder-breathing-text mt-2 bg-demon-purple/10 px-2 py-1 rounded inline-block">
                    Age Bracket: {lifeStage.ageBracket}
                  </p>
                </div>
                
                <div className="bg-demon-black/30 rounded-lg p-4 border border-demon-orange/20 shadow-flame-breathing hover:border-demon-orange/30 transition-all relative overflow-hidden animate-floating-card" style={{animationDelay: '0.3s'}}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-flame-gradient opacity-5 rounded-full blur-lg"></div>
                  
                  <h3 className="font-semibold flame-breathing-text mb-2 flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    Financial Information
                  </h3>
                  
                  <div className="text-xs space-y-1 bg-demon-black/20 p-2 rounded-lg border border-demon-orange/10">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Income:</span>
                      <span className="font-medium text-gray-200">${budget.income}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Essential Expenses:</span>
                      <span className="font-medium text-gray-200">${budget.essentials}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Debt Payments:</span>
                      <span className="font-medium text-gray-200">${budget.debt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Savings:</span>
                      <span className="font-medium text-gray-200">${budget.savings}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="katana-divider my-6"></div>
              
              <h3 className="font-semibold text-gray-200 mb-2">Your Circumstances</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {circumstances.map((circumstance, index) => (
                  <div key={index} className="bg-demon-black/30 rounded p-2 text-sm border border-demon-gold/20 shadow-sm hover:border-demon-gold/30 transition-all relative overflow-hidden">
                    <p className="font-medium text-demon-gold">{circumstance.name}</p>
                    <p className="text-xs text-gray-400">{circumstance.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {showTraits && (
          <section className="mb-8 animate-fade-in">
            <div className="demon-card shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
              <div className="absolute inset-0 kanji-bg" aria-hidden="true"></div>
              
              <h2 className="text-xl font-bold mb-4 flex items-center demon-text-fire">
                <span className="bg-demon-red/10 text-demon-red p-1.5 rounded-md mr-2">
                  <Bookmark className="w-4 h-4" />
                </span>
                Your Breathing Style
              </h2>
              
              <p className="text-sm text-gray-300 mb-4 bg-demon-black/30 p-3 rounded-lg border border-demon-red/10">
                Your financial breathing technique evolves as you make decisions. Master your breath and enhance your skills.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3 bg-demon-black/30 rounded-lg border border-demon-teal/20 shadow-water-breathing relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full bg-water-gradient opacity-5"></div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <Brain className="w-4 h-4 text-demon-teal" />
                    <span className="font-medium text-sm water-breathing-text">Financial Knowledge</span>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-water-gradient rounded-full transition-all duration-500 animate-energy-flow" 
                         style={{ width: `${playerTraits.financialKnowledge * 10}%` }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-demon-black/30 rounded-lg border border-demon-red/20 shadow-demon-aura relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full bg-flame-gradient opacity-5"></div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-demon-red" />
                    <span className="font-medium text-sm flame-breathing-text">Risk Tolerance</span>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-flame-gradient rounded-full transition-all duration-500 animate-energy-flow" 
                         style={{ width: `${playerTraits.riskTolerance * 10}%` }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-demon-black/30 rounded-lg border border-[#4ade80]/20 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full bg-wind-gradient opacity-5"></div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="w-4 h-4 text-[#4ade80]" />
                    <span className="font-medium text-sm bg-wind-gradient bg-clip-text text-transparent">Spending Habits</span>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-wind-gradient rounded-full transition-all duration-500 animate-energy-flow" 
                         style={{ width: `${playerTraits.spendingHabits * 10}%` }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-demon-black/30 rounded-lg border border-demon-orange/20 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full bg-demon-gradient opacity-5"></div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <Briefcase className="w-4 h-4 text-demon-orange" />
                    <span className="font-medium text-sm flame-breathing-text">Career Focus</span>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-demon-gradient rounded-full transition-all duration-500 animate-energy-flow" 
                         style={{ width: `${playerTraits.careerFocus * 10}%` }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-demon-black/30 rounded-lg border border-demon-purple/20 shadow-thunder-breathing relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full bg-thunder-gradient opacity-5"></div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <PiggyBank className="w-4 h-4 text-demon-purple" />
                    <span className="font-medium text-sm thunder-breathing-text">Saving Ability</span>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-thunder-gradient rounded-full transition-all duration-500 animate-energy-flow" 
                         style={{ width: `${playerTraits.savingAbility * 10}%` }}></div>
                  </div>
                </div>
                
                <div className="p-3 bg-demon-black/30 rounded-lg border border-demon-gold/20 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(to_right,#FFD700,#FFA500)] opacity-5"></div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-demon-gold" />
                    <span className="font-medium text-sm text-demon-gold">Lucky Streak</span>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-[linear-gradient(to_right,#FFD700,#FFA500)] rounded-full transition-all duration-500 animate-energy-flow" 
                         style={{ width: `${playerTraits.luckyStreak * 10}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center gap-8 relative">
                <div className="text-center opacity-60 hover:opacity-100 transition-opacity group">
                  <div className="w-14 h-14 rounded-full bg-demon-red/10 border border-demon-red/20 flex items-center justify-center mb-2 group-hover:shadow-demon-aura transition-all">
                    <Flame className="w-6 h-6 text-demon-red animate-flame-flicker" />
                  </div>
                  <p className="text-xs text-gray-400">Flame<br/>Breathing</p>
                </div>
                
                <div className="text-center opacity-60 hover:opacity-100 transition-opacity group">
                  <div className="w-14 h-14 rounded-full bg-demon-teal/10 border border-demon-teal/20 flex items-center justify-center mb-2 group-hover:shadow-water-breathing transition-all">
                    <Droplets className="w-6 h-6 text-demon-teal animate-breath-pulse" />
                  </div>
                  <p className="text-xs text-gray-400">Water<br/>Breathing</p>
                </div>
                
                <div className="text-center opacity-60 hover:opacity-100 transition-opacity group">
                  <div className="w-14 h-14 rounded-full bg-demon-purple/10 border border-demon-purple/20 flex items-center justify-center mb-2 group-hover:shadow-thunder-breathing transition-all">
                    <ThunderIcon className="w-6 h-6 text-demon-purple animate-pulse-subtle" />
                  </div>
                  <p className="text-xs text-gray-400">Thunder<br/>Breathing</p>
                </div>
                
                <div className="text-center opacity-60 hover:opacity-100 transition-opacity group">
                  <div className="w-14 h-14 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/20 flex items-center justify-center mb-2 group-hover:shadow-md transition-all">
                    <Wind className="w-6 h-6 text-[#4ade80] animate-breath-pulse" />
                  </div>
                  <p className="text-xs text-gray-400">Wind<br/>Breathing</p>
                </div>
              </div>
              
              <p className="mt-4 text-sm text-gray-500 italic text-center">Unlock new breathing techniques as your financial power grows.</p>
            </div>
          </section>
        )}
        
        {showShop && (
          <section className="mb-8 animate-fade-in">
            <Shop />
          </section>
        )}
        
        <section className="mb-12 animate-fade-in">
          {showStats ? <StatsDashboard /> : <Dashboard />}
        </section>
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
    <div className="min-h-screen bg-night-sky flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/misty-mountains.jpg')] bg-cover bg-center opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-demon-black/40 pointer-events-none"></div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div key={i} 
              className="absolute w-1 h-1 rounded-full bg-demon-red/30 animate-float" 
              style={{
                left: `${Math.random() * 100}%`, 
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}>
          </div>
        ))}
      </div>
      
      <div className={`max-w-md w-full bg-demon-black/60 backdrop-blur-lg rounded-2xl shadow-demon-aura p-8 transition-all duration-700 border border-demon-red/20 ${
        animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        <div className="text-center mb-6 relative">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-24 h-24 opacity-30 pointer-events-none">
            <div className="w-full h-full bg-demon-red rounded-full animate-breath-pulse filter blur-lg"></div>
          </div>
          
          <div className="inline-flex items-center justify-center gap-2 mb-4 relative">
            <Sparkles className="w-5 h-5 text-demon-red animate-pulse-subtle" />
            <h1 className="text-3xl font-bold bg-demon-gradient bg-clip-text text-transparent">Debt Demon Slayer</h1>
            <Sparkles className="w-5 h-5 text-demon-red animate-pulse-subtle" />
          </div>
          
          <p className="text-gray-400">Your journey to financial freedom begins here</p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-1">Your Slayer Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-4 py-2 border border-demon-red/20 bg-demon-black/50 text-white rounded-full focus:ring-demon-red/50 focus:border-demon-red/50 transition-all hover:border-demon-red/40"
            placeholder="Enter your name"
          />
        </div>
        
        <div className="p-4 bg-demon-black/30 rounded-xl mb-6 border border-demon-red/10 relative overflow-hidden">
          <div className="absolute inset-0 kanji-bg kanji-fire opacity-5" aria-hidden="true"></div>
          
          <p className="text-sm text-gray-300">
            Ready to fight debt demons? Your financial adventure awaits.
            Make strategic decisions, overcome life events, and slay your debt to achieve financial freedom.
          </p>
          
          <p className="text-sm text-gray-300 mt-2">
            <strong className="flame-breathing-text">Every journey is unique!</strong> Your choices will shape your experience and determine your path to financial success.
          </p>
        </div>
        
        <button
          onClick={onStart}
          className="w-full breathing-button flame-breathing-button group relative overflow-hidden rounded-full shadow-md hover:shadow-demon-aura transition-all"
        >
          <span className="absolute top-0 left-0 w-full h-full bg-white/10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
          <div className="relative z-10 flex items-center justify-center gap-2 py-3">
            <span>Begin Your Journey</span>
            <Sword className="w-4.5 h-4.5 animate-pulse-subtle" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Index;
