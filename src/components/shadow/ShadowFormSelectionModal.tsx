
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sword, Droplets, Brain } from 'lucide-react';
import { ShadowFormType } from '@/types/gameTypes';
import { useGameContext } from '@/context/GameContext';

interface ShadowFormSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShadowFormSelectionModal: React.FC<ShadowFormSelectionModalProps> = ({ 
  isOpen, 
  onClose
}) => {
  const { updateShadowForm } = useGameContext();
  
  const shadowOptions: { 
    type: ShadowFormType; 
    title: string;
    description: string;
    perks: string[];
    drawbacks: string[];
    aura: string;
    icon: JSX.Element;
  }[] = [
    {
      type: 'cursedBlade',
      title: 'Cursed Blade',
      description: 'Channel corruption into your blade for devastating damage.',
      perks: [
        '+50% damage against all demons',
        '-50% interest rate on debts',
        'Critical hits apply bleeding effect'
      ],
      drawbacks: [
        '-10% savings each month',
        'Cannot heal during battle',
        'Corruption increases with each battle'
      ],
      aura: 'from-red-600/20 to-red-900/50',
      icon: <Sword className="h-8 w-8 text-red-500" />
    },
    {
      type: 'leecher',
      title: 'Debt Leecher',
      description: 'Drain the essence of demons to sustain yourself.',
      perks: [
        'Absorb demon essence for healing',
        '25% chance to double monthly payments',
        'Monthly attacks restore your health'
      ],
      drawbacks: [
        'Cannot save money',
        'Reduced relic drop chances',
        'Corruption slowly builds over time'
      ],
      aura: 'from-purple-600/20 to-purple-900/50',
      icon: <Droplets className="h-8 w-8 text-purple-500" />
    },
    {
      type: 'whisperer',
      title: 'Whisperer',
      description: 'Gain the ability to foresee events and manipulate fate.',
      perks: [
        'Preview upcoming life events',
        '+30% XP from all sources',
        'Foresight during battles'
      ],
      drawbacks: [
        '-50% combat XP',
        'No special move regeneration',
        'Random corruption spikes'
      ],
      aura: 'from-blue-600/20 to-blue-900/50',
      icon: <Brain className="h-8 w-8 text-blue-500" />
    }
  ];
  
  const handleSelectForm = (form: ShadowFormType) => {
    updateShadowForm(form, 30); // Start at 30% corruption
    onClose();
    
    // Play dark embrace sound
    const audio = new Audio('/sounds/shadow-embrace.mp3');
    audio.volume = 0.6;
    audio.play().catch(e => console.error("Audio playback error:", e));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-night-sky p-0 border-slate-700 max-w-5xl">
        <div className="relative overflow-hidden p-6 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"></div>
          
          <h2 className="text-center text-2xl font-bold text-white mb-2">The Shadow Calls</h2>
          <p className="text-center text-slate-300 mb-8">
            Your struggles have awakened dark powers within you. Choose a form of corruption to embrace...
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {shadowOptions.map((option) => (
              <motion.div
                key={option.type}
                whileHover={{ scale: 1.03 }}
                className={`bg-gradient-to-b ${option.aura} backdrop-blur-sm border border-slate-700 rounded-lg p-4 cursor-pointer`}
                onClick={() => handleSelectForm(option.type)}
              >
                <div className="flex flex-col items-center text-center mb-3">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-900/50 mb-3">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{option.title}</h3>
                  <p className="text-sm text-slate-300 mt-1">{option.description}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-green-400 mb-1">PERKS</h4>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {option.perks.map((perk, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-green-500 mr-1">✓</span>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-semibold text-red-400 mb-1">DRAWBACKS</h4>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {option.drawbacks.map((drawback, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-red-500 mr-1">✗</span>
                          <span>{drawback}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-slate-600 bg-slate-800/50"
                >
                  Embrace {option.title}
                </Button>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-slate-400 italic">
              Warning: Once embraced, corruption can only be managed, never fully cleansed.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShadowFormSelectionModal;
