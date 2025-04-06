
import React from 'react';
import { Sword, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EncounterStanceProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export const EncounterStance = ({ title, description, icon, onClick, disabled }: EncounterStanceProps) => (
  <div 
    className={`relative p-6 rounded-lg border border-yellow-500/30 bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 backdrop-blur-sm transition-all 
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:border-yellow-500/70 hover:shadow-lg hover:shadow-yellow-500/20 cursor-pointer'}`}
    onClick={disabled ? undefined : onClick}
  >
    <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500/50 to-yellow-500/0"></div>
    <div className="flex items-center mb-3">
      <div className="p-2 bg-gradient-to-br from-yellow-500/30 to-amber-500/20 rounded-full mr-3">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-yellow-500">{title}</h3>
    </div>
    <p className="text-sm text-gray-300">{description}</p>
  </div>
);

interface EncounterStageOneProps {
  onSelectStance: (stance: string) => void;
  isLoading: boolean;
}

export const EncounterStageOne = ({ onSelectStance, isLoading }: EncounterStageOneProps) => (
  <div className="space-y-6 animate-fade-in">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold mb-2 text-yellow-500">Choose Your Battle Stance</h2>
      <p className="text-gray-400">Your approach to this month's financial journey will determine your rewards</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <EncounterStance
        title="Aggressive Slash"
        description="Focus on paying down extra debt this month. +15% debt payment effectiveness, -10% savings"
        icon={<Sword className="h-5 w-5 text-red-400" />}
        onClick={() => onSelectStance('aggressive')}
        disabled={isLoading}
      />
      
      <EncounterStance
        title="Defense Form"
        description="Build your savings and emergency fund. +20% savings boost, -5% debt payment effectiveness"
        icon={<Shield className="h-5 w-5 text-blue-400" />}
        onClick={() => onSelectStance('defensive')}
        disabled={isLoading}
      />
      
      <EncounterStance
        title="Emotion Surge"
        description="High-risk investment approach. 25% chance for +30% cash, 10% chance for -15% cash"
        icon={<Sparkles className="h-5 w-5 text-purple-400" />}
        onClick={() => onSelectStance('risky')}
        disabled={isLoading}
      />
    </div>
  </div>
);

interface EncounterStageTwoProps {
  stance: string;
  stanceOutcome: {
    title: string;
    description: string;
    cashChange: number;
    debtChange: number;
  };
  onContinue: () => void;
}

export const EncounterStageTwo = ({ stance, stanceOutcome, onContinue }: EncounterStageTwoProps) => {
  const getStanceIcon = () => {
    switch (stance) {
      case 'aggressive': return <Sword className="h-6 w-6 text-red-400" />;
      case 'defensive': return <Shield className="h-6 w-6 text-blue-400" />;
      case 'risky': return <Sparkles className="h-6 w-6 text-purple-400" />;
      default: return <Sword className="h-6 w-6 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-yellow-500/30 to-amber-500/20 rounded-full mb-4">
          {getStanceIcon()}
        </div>
        <h2 className="text-2xl font-bold mb-2 text-yellow-500">{stanceOutcome.title}</h2>
        <p className="text-gray-400">{stanceOutcome.description}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-green-500/30 bg-green-900/20">
          <p className="text-sm text-gray-400 mb-1">Cash Change</p>
          <p className={`text-xl font-bold ${stanceOutcome.cashChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stanceOutcome.cashChange >= 0 ? '+' : ''}{stanceOutcome.cashChange}%
          </p>
        </div>
        
        <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-900/20">
          <p className="text-sm text-gray-400 mb-1">Debt Payment Effectiveness</p>
          <p className={`text-xl font-bold ${stanceOutcome.debtChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stanceOutcome.debtChange >= 0 ? '+' : ''}{stanceOutcome.debtChange}%
          </p>
        </div>
      </div>
      
      <Button 
        onClick={onContinue}
        className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500"
      >
        Continue Your Journey
      </Button>
    </div>
  );
};
