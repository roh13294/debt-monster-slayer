
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Eye, Sword, Droplets, Brain } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { ShadowFormType } from '../../types/gameTypes';
import { motion, AnimatePresence } from 'framer-motion';

interface ShadowCallingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShadowCallingModal: React.FC<ShadowCallingModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { cash, updatePlayerTrait, setCash, setSpecialMoves, updateShadowForm, specialMoves } = useGameContext();
  
  const handleChooseShadowForm = (form: ShadowFormType) => {
    updateShadowForm(form, 15); // Set initial corruption level to 15
    
    switch(form) {
      case 'cursedBlade':
        toast({
          title: "The Cursed Blade Awakens",
          description: "You feel a burning power coursing through your veins, your attacks are stronger but your soul darkens.",
          variant: "destructive",
        });
        break;
      case 'leecher':
        toast({
          title: "The Debt Leecher Emerges",
          description: "The darkness whispers promises of stolen wealth. You can drain others, but saving is no longer possible.",
          variant: "destructive",
        });
        break;
      case 'whisperer':
        toast({
          title: "The Whisperer Takes Hold",
          description: "Your mind opens to financial insights from beyond, but at a cost to your spirit regeneration.",
          variant: "destructive",
        });
        break;
    }
    
    // Add cutscene event to event history
    
    onClose();
  };
  
  const handleRejectDarkness = () => {
    // Player resists for now but will be tempted again
    toast({
      title: "Darkness Resisted... For Now",
      description: "You push back against the shadow's pull, but it will return when your financial burden grows.",
      variant: "default",
    });
    
    // Small reward for resisting
    setCash(cash + 100); // Fix: use direct value instead of callback
    setSpecialMoves(specialMoves + 1); // Fix: use direct value instead of callback
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-b from-slate-900 to-purple-950 border-purple-500/30 shadow-lg shadow-purple-900/30 max-w-2xl overflow-hidden">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Glitch overlay effect */}
            <div className="absolute inset-0 bg-red-500/5 animate-pulse-slow pointer-events-none"></div>
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none">
              <div className="absolute inset-0 bg-[url('/images/shadow-glitch.png')] bg-cover opacity-10 mix-blend-overlay"></div>
            </div>
            
            <DialogHeader>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 via-red-400 to-purple-400 bg-clip-text text-transparent">
                  The Shadow Calls
                </DialogTitle>
                <DialogDescription className="text-center text-gray-300 mt-2">
                  Your financial struggles have drawn the attention of dark forces. 
                  They offer power, but at what cost?
                </DialogDescription>
              </motion.div>
            </DialogHeader>
            
            <div className="mt-6 text-gray-300 space-y-2">
              <p>Your mounting debts have weakened the barriers between realms. The shadows have noticed your struggle and offer a bargain: embrace their power to gain an edge in your financial battles.</p>
              
              <p className="italic text-red-300 mt-4">Choose your path carefully. Once you walk with shadows, the light dims forever...</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <motion.div 
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="bg-red-950/40 p-4 rounded-lg border border-red-500/30 hover:border-red-500/60 transition-all hover:shadow-md hover:shadow-red-900/30 group"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-red-900/50 group-hover:bg-red-800/70 transition-all">
                    <Sword className="h-8 w-8 text-red-400 group-hover:text-red-300" />
                  </div>
                </div>
                <h3 className="text-center font-bold text-red-400 mb-2">The Cursed Blade</h3>
                <p className="text-xs text-gray-300 mb-3">Empower your attacks with dark energy</p>
                <ul className="text-xs text-gray-300 space-y-1 mb-4">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-1">+</span> 50% more effective debt payments
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-1">+</span> 50% reduced passive interest
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-400 mr-1">-</span> Corruption increases with each attack
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-400 mr-1">-</span> Lose 10% DemonCoins per month
                  </li>
                </ul>
                <Button 
                  onClick={() => handleChooseShadowForm('cursedBlade')}
                  className="w-full bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-xs group-hover:shadow-sm group-hover:shadow-red-500/20"
                >
                  Embrace the Blade
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="bg-purple-950/40 p-4 rounded-lg border border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-md hover:shadow-purple-900/30 group"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-purple-900/50 group-hover:bg-purple-800/70 transition-all">
                    <Droplets className="h-8 w-8 text-purple-400 group-hover:text-purple-300" />
                  </div>
                </div>
                <h3 className="text-center font-bold text-purple-400 mb-2">The Debt Leecher</h3>
                <p className="text-xs text-gray-300 mb-3">Drain wealth from your enemies</p>
                <ul className="text-xs text-gray-300 space-y-1 mb-4">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-1">+</span> Earn DemonCoins from debt payments 
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-1">+</span> 25% chance to double payments
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-400 mr-1">-</span> Cannot save DemonCoins
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-400 mr-1">-</span> +10% passive corruption
                  </li>
                </ul>
                <Button 
                  onClick={() => handleChooseShadowForm('leecher')}
                  className="w-full bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 text-xs group-hover:shadow-sm group-hover:shadow-purple-500/20"
                >
                  Become the Leecher
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="bg-blue-950/40 p-4 rounded-lg border border-blue-500/30 hover:border-blue-500/60 transition-all hover:shadow-md hover:shadow-blue-900/30 group"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-blue-900/50 group-hover:bg-blue-800/70 transition-all">
                    <Brain className="h-8 w-8 text-blue-400 group-hover:text-blue-300" />
                  </div>
                </div>
                <h3 className="text-center font-bold text-blue-400 mb-2">The Whisperer</h3>
                <p className="text-xs text-gray-300 mb-3">Gain foresight of financial futures</p>
                <ul className="text-xs text-gray-300 space-y-1 mb-4">
                  <li className="flex items-center">
                    <span className="text-green-400 mr-1">+</span> Preview next 2 month's events
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-400 mr-1">+</span> 30% increased XP gain
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-400 mr-1">-</span> No special move regeneration
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-400 mr-1">-</span> Reduced combat XP
                  </li>
                </ul>
                <Button 
                  onClick={() => handleChooseShadowForm('whisperer')}
                  className="w-full bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-xs group-hover:shadow-sm group-hover:shadow-blue-500/20"
                >
                  Hear the Whispers
                </Button>
              </motion.div>
            </div>
            
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline"
                onClick={handleRejectDarkness}
                className="border-gray-500 text-gray-300 hover:bg-gray-800"
              >
                Resist the Darkness (For Now)
              </Button>
            </div>
            
            {/* Animated shadows at the edges */}
            <div className="absolute -bottom-10 left-0 right-0 h-20 bg-gradient-to-t from-purple-900/30 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-red-900/10 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-purple-900/10 to-transparent pointer-events-none"></div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ShadowCallingModal;
