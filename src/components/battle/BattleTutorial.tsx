
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sword, Target } from 'lucide-react';

interface BattleTutorialProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BattleTutorial: React.FC<BattleTutorialProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Sword className="w-5 h-5 inline-block text-fun-purple mr-2" />
            Debt Monster Battle Guide
          </DialogTitle>
          <DialogDescription>
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Battle Mode</h4>
                <p className="text-sm text-gray-700">Activate Battle Mode to directly target and attack your debt monsters one at a time.</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Making Payments</h4>
                <p className="text-sm text-gray-700">Use the slider to adjust your payment amount, then click "Attack" to reduce your debt.</p>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Combo Attacks</h4>
                <p className="text-sm text-gray-700">Attack quickly in succession to build a combo that increases damage.</p>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Special Moves</h4>
                <p className="text-sm text-gray-700">Use Special Moves to reduce a debt's interest rate, making it easier to pay off.</p>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Battle Streaks</h4>
                <p className="text-sm text-gray-700">Battle multiple monsters in a row to earn streak bonuses, including special moves.</p>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg">
                <h4 className="font-medium mb-1">Monster Reactions</h4>
                <p className="text-sm text-gray-700">Monsters will react to your attacks and occasionally taunt you or counter-attack.</p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BattleTutorial;
