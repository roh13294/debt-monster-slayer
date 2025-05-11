
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CircleArrowLeft, ArrowLeft } from 'lucide-react';

interface UnwinnableScenarioModalProps {
  isOpen: boolean;
  onChannelEnergy: () => void;
  onRetreat: () => void;
}

const UnwinnableScenarioModal: React.FC<UnwinnableScenarioModalProps> = ({
  isOpen,
  onChannelEnergy,
  onRetreat
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-400">Insufficient Spirit Energy</DialogTitle>
          <DialogDescription className="text-slate-300">
            You're too weak to continue your assault. Your spirit energy is depleted.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <p className="text-sm text-slate-400">
            Choose your next action carefully. You can channel your energy to recover some spirit, or retreat from battle to recover and plan a new strategy.
          </p>
          
          <div className="bg-slate-800/60 border border-slate-700 rounded-md p-4 flex justify-between">
            <div className="text-blue-300">
              <h4 className="font-medium">Channel Energy</h4>
              <p className="text-xs opacity-80">Recover 10% of your maximum spirit at the cost of a turn.</p>
            </div>
            <div className="text-red-300">
              <h4 className="font-medium">Retreat</h4>
              <p className="text-xs opacity-80">Flee from battle. Your progress will be saved.</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between space-x-2">
          <Button 
            onClick={onChannelEnergy} 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <CircleArrowLeft className="mr-2 h-4 w-4" /> Channel Energy
          </Button>
          
          <Button 
            onClick={onRetreat} 
            variant="outline"
            className="flex-1 border-red-800/50 text-red-400 hover:bg-red-950/30"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Retreat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UnwinnableScenarioModal;
