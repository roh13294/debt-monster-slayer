
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/context/GameContext';
import { Coins, Home, Star, Book } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WealthTempleInterfaceProps {
  onClose: () => void;
}

const WealthTempleInterface: React.FC<WealthTempleInterfaceProps> = ({ onClose }) => {
  const { 
    templeLevel, 
    upgradeTemple, 
    calculateTempleReturn, 
    cash, 
    shadowForm, 
    corruptionLevel 
  } = useGameContext();
  
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  
  // Define room data
  const rooms = [
    {
      id: 'spirit-mine',
      name: 'Spirit Mine',
      description: 'Passively generates DemonCoins over time.',
      upgradeCost: 500 * (templeLevel || 1),
      effect: `+${(3 + (templeLevel || 1) * 2)}% passive income per hour`,
      level: templeLevel || 1,
      icon: <Coins className="w-5 h-5 text-amber-400" />
    },
    {
      id: 'relic-vault',
      name: 'Relic Vault',
      description: 'Increases chances of finding rare relics.',
      upgradeCost: 750 * (templeLevel || 1),
      effect: `+${(2 + (templeLevel || 1))}% relic drop rate`,
      level: Math.max(1, (templeLevel || 1) - 1),
      icon: <Star className="w-5 h-5 text-purple-400" />
    },
    {
      id: 'meditation-hall',
      name: 'Meditation Hall',
      description: 'Amplifies XP gained from all sources.',
      upgradeCost: 1000 * (templeLevel || 1),
      effect: `+${(5 + (templeLevel || 1) * 3)}% XP from all sources`,
      level: Math.max(1, (templeLevel || 1) - 1),
      icon: <Book className="w-5 h-5 text-blue-400" />
    }
  ];
  
  // Calculate current temple stats
  const currentPassiveReturn = calculateTempleReturn();
  const hasShadowPenalty = shadowForm !== null;
  
  // Handle room upgrade
  const handleUpgradeRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    
    setIsUpgrading(true);
    
    // Animation delay for upgrade effect
    setTimeout(() => {
      const success = upgradeTemple(room.upgradeCost);
      
      if (success) {
        toast({
          title: "Room Upgraded!",
          description: `Your ${room.name} has been upgraded to level ${room.level + 1}.`,
          variant: "default",
        });
        
        // Play upgrade sound
        const audio = new Audio('/sounds/temple-upgrade.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.error("Audio playback error:", e));
      }
      
      setIsUpgrading(false);
    }, 1000);
  };
  
  return (
    <div className="bg-slate-900/95 backdrop-blur-xl p-5 rounded-xl border border-slate-700 shadow-lg text-center max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Wealth Temple</h2>
        <div>
          <span className="text-sm text-slate-400">Level </span>
          <span className="text-xl font-bold text-amber-400">{templeLevel}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center p-4 mb-6 bg-gradient-to-b from-indigo-900/30 to-slate-900/30 rounded-lg border border-indigo-900/50">
        <Home className="h-10 w-10 text-indigo-400 mr-4" />
        <div className="text-left">
          <h3 className="text-lg font-medium text-indigo-300">Temple Status</h3>
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 mt-2">
            <div>
              <p className="text-sm text-slate-400">Passive Return Rate</p>
              <p className="font-mono text-amber-400">
                {(currentPassiveReturn / cash * 100).toFixed(1)}%/month
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Monthly Income</p>
              <p className="font-mono text-amber-400">
                +{currentPassiveReturn} DC/month
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Temple Efficiency</p>
              <p className={`font-mono ${hasShadowPenalty ? 'text-red-400' : 'text-green-400'}`}>
                {hasShadowPenalty ? `${100 - Math.floor(corruptionLevel / 3)}%` : '100%'}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Next Upgrade</p>
              <p className="font-mono text-purple-400">
                {1000 * templeLevel} DC
              </p>
            </div>
          </div>
          
          {hasShadowPenalty && (
            <div className="mt-3 py-1 px-3 bg-red-900/30 border border-red-700/30 rounded-md">
              <p className="text-xs text-red-300">
                Shadow corruption is reducing your temple efficiency by {Math.floor(corruptionLevel / 3)}%
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            whileHover={{ scale: 1.02 }}
            className={`p-4 bg-slate-800/70 rounded-lg border ${
              selectedRoom === room.id 
              ? 'border-indigo-500'
              : 'border-slate-700'
            } cursor-pointer transition-all`}
            onClick={() => setSelectedRoom(room.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {room.icon}
                <h3 className="text-white font-medium ml-2">{room.name}</h3>
              </div>
              <div className="bg-slate-700/50 rounded-full px-2 py-0.5">
                <span className="text-xs text-amber-300">Lv.{room.level}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-2 text-left">{room.description}</p>
            <div className="flex justify-between items-center">
              <div className="text-xs font-medium text-green-400">{room.effect}</div>
              <div className="flex items-center text-xs text-amber-400">
                <Coins className="h-3 w-3 mr-1" />
                {room.upgradeCost}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {selectedRoom && (
        <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700 mb-6">
          <h3 className="text-lg font-medium text-white mb-2">
            {rooms.find(r => r.id === selectedRoom)?.name} Details
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-700/50 rounded p-3 text-left">
              <p className="text-xs text-slate-400 mb-1">Current Level</p>
              <p className="text-amber-300 font-medium">
                {rooms.find(r => r.id === selectedRoom)?.level}
              </p>
            </div>
            <div className="bg-slate-700/50 rounded p-3 text-left">
              <p className="text-xs text-slate-400 mb-1">Upgrade Cost</p>
              <p className="text-amber-300 font-medium">
                {rooms.find(r => r.id === selectedRoom)?.upgradeCost} DC
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              disabled={isUpgrading || cash < (rooms.find(r => r.id === selectedRoom)?.upgradeCost || 0)}
              onClick={() => handleUpgradeRoom(selectedRoom)}
              className="bg-gradient-to-r from-indigo-600 to-purple-800 hover:from-indigo-500 hover:to-purple-700"
            >
              {isUpgrading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2 h-4 w-4 border-2 border-t-transparent border-indigo-200 rounded-full"
                  />
                  Upgrading...
                </>
              ) : (
                <>
                  Upgrade Room
                </>
              )}
            </Button>
          </div>
        </div>
      )}
      
      <Button onClick={onClose} variant="outline" className="border-slate-700 hover:bg-slate-800">
        Return to Dashboard
      </Button>
    </div>
  );
};

export default WealthTempleInterface;
