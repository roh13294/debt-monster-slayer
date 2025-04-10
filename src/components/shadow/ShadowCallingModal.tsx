
import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Eye, Sword, Droplets, Brain } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { ShadowFormType } from '../../types/gameTypes';

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
      <DialogContent className="bg-gradient-to-b from-slate-900 to-purple-950 border-purple-500/30 shadow-lg shadow-purple-900/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-red-400 bg-clip-text text-transparent">
            The Shadow Calls
          </DialogTitle>
          <DialogDescription className="text-center text-gray-300 mt-2">
            Your financial struggles have drawn the attention of dark forces. 
            They offer power, but at what cost?
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 text-gray-300 space-y-2">
          <p>Your mounting debts have weakened the barriers between realms. The shadows have noticed your struggle and offer a bargain: embrace their power to gain an edge in your financial battles.</p>
          
          <p className="italic text-red-300 mt-4">Choose your path carefully. Once you walk with shadows, the light dims forever...</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-red-950/40 p-4 rounded-lg border border-red-500/30 hover:border-red-500/60 transition-all hover:shadow-md hover:shadow-red-900/30">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-red-900/50">
                <Sword className="h-8 w-8 text-red-400" />
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
            </ul>
            <Button 
              onClick={() => handleChooseShadowForm('cursedBlade')}
              className="w-full bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-xs"
            >
              Embrace the Blade
            </Button>
          </div>
          
          <div className="bg-purple-950/40 p-4 rounded-lg border border-purple-500/30 hover:border-purple-500/60 transition-all hover:shadow-md hover:shadow-purple-900/30">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-purple-900/50">
                <Droplets className="h-8 w-8 text-purple-400" />
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
            </ul>
            <Button 
              onClick={() => handleChooseShadowForm('leecher')}
              className="w-full bg-gradient-to-r from-purple-900 to-purple-700 hover:from-purple-800 hover:to-purple-600 text-xs"
            >
              Become the Leecher
            </Button>
          </div>
          
          <div className="bg-blue-950/40 p-4 rounded-lg border border-blue-500/30 hover:border-blue-500/60 transition-all hover:shadow-md hover:shadow-blue-900/30">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-blue-900/50">
                <Brain className="h-8 w-8 text-blue-400" />
              </div>
            </div>
            <h3 className="text-center font-bold text-blue-400 mb-2">The Whisperer</h3>
            <p className="text-xs text-gray-300 mb-3">Gain foresight of financial futures</p>
            <ul className="text-xs text-gray-300 space-y-1 mb-4">
              <li className="flex items-center">
                <span className="text-green-400 mr-1">+</span> Preview next month's events
              </li>
              <li className="flex items-center">
                <span className="text-green-400 mr-1">+</span> 30% increased financial knowledge
              </li>
              <li className="flex items-center">
                <span className="text-red-400 mr-1">-</span> No special move regeneration
              </li>
            </ul>
            <Button 
              onClick={() => handleChooseShadowForm('whisperer')}
              className="w-full bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-xs"
            >
              Hear the Whispers
            </Button>
          </div>
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
      </DialogContent>
    </Dialog>
  );
};

export default ShadowCallingModal;
