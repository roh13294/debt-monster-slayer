
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../context/GameContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Home, PiggyBank, CrownIcon, Sparkles, Coins, Star, Shield } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import DemonCoin from '@/components/ui/DemonCoin';
import { motion, AnimatePresence } from 'framer-motion';

interface WealthTempleScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Relic {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'legendary';
  effect: string;
  bonus: number;
  icon: React.ReactNode;
}

const WealthTempleScreen: React.FC<WealthTempleScreenProps> = ({ isOpen, onClose }) => {
  const { cash, shadowForm, isCorruptionUnstable, templeLevel, upgradeTemple } = useGameContext();
  const [showRelicDetails, setShowRelicDetails] = useState<string | null>(null);
  const [showGamblingShrineModal, setShowGamblingShrineModal] = useState(false);
  const [pullAnimation, setPullAnimation] = useState(false);
  const [lastRelic, setLastRelic] = useState<Relic | null>(null);
  
  // Temple is blocked for players in unstable corruption mode
  const isTempleBlocked = isCorruptionUnstable;
  
  // Temple has corruption penalty for shadow form users
  const hasCorruptionPenalty = shadowForm !== null && !isTempleBlocked;

  // Demo collection of relics (in a real implementation, this would be in the game state)
  const availableRelics: Relic[] = [
    {
      id: 'sage_coin',
      name: 'Sage Coin',
      description: 'An ancient coin believed to bring financial wisdom.',
      rarity: 'common',
      effect: '+2% savings yield',
      bonus: 0.02,
      icon: <Coins className="h-10 w-10 text-yellow-400" />
    },
    {
      id: 'aura_prism',
      name: 'Aura Prism',
      description: 'A crystal that radiates healing energy.',
      rarity: 'rare',
      effect: 'Monthly auto-heal 5% mental damage',
      bonus: 0.05,
      icon: <Shield className="h-10 w-10 text-blue-400" />
    }
  ];
  
  const [equippedRelics, setEquippedRelics] = useState<Relic[]>([]);
  
  const getTempleTierInfo = () => {
    switch(templeLevel) {
      case 1:
        return {
          name: "Shrine Ruins",
          description: "The remnants of an ancient financial temple. You sense dormant power within these walls.",
          passiveReturn: "3%",
          relicSlots: 0,
          nextUpgrade: "5,000",
          imagePath: "/images/temple-tier-1.png"
        };
      case 2:
        return {
          name: "Inner Grove",
          description: "The temple grounds have been partially restored, allowing basic financial blessings.",
          passiveReturn: "3.5%",
          relicSlots: 1,
          nextUpgrade: "15,000",
          imagePath: "/images/temple-tier-2.png"
        };
      case 3:
        return {
          name: "Sky Altar",
          description: "The temple rises toward the heavens, channeling greater financial energy.",
          passiveReturn: "4%",
          relicSlots: 3,
          nextUpgrade: "40,000",
          imagePath: "/images/temple-tier-3.png"
        };
      case 4:
        return {
          name: "Spirit Chamber",
          description: "The inner sanctum is accessible, providing protection against financial corruption.",
          passiveReturn: "5%",
          relicSlots: 5,
          nextUpgrade: "100,000",
          imagePath: "/images/temple-tier-4.png"
        };
      case 5:
        return {
          name: "Celestial Gate",
          description: "The temple has reached its ultimate form, offering the greatest financial blessings.",
          passiveReturn: "6%",
          relicSlots: 8,
          nextUpgrade: "MAX",
          imagePath: "/images/temple-tier-5.png"
        };
      default:
        return {
          name: "Undiscovered",
          description: "Unlock the power of the Wealth Temple first",
          passiveReturn: "0%",
          relicSlots: 0,
          nextUpgrade: "1,000",
          imagePath: "/images/temple-ruins.png"
        };
    }
  };
  
  const tierInfo = getTempleTierInfo();

  const playUpgradeSound = () => {
    const audio = new Audio('/sounds/temple-upgrade.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio playback error:", e));
  };
  
  const handleOpenGamblersShrine = () => {
    setShowGamblingShrineModal(true);
  };
  
  const handleUpgradeTemple = () => {
    // This would call the function from context in a real implementation
    const upgradeCost = parseInt(tierInfo.nextUpgrade.replace(/,/g, ''));
    
    if (upgradeTemple(upgradeCost)) {
      playUpgradeSound();
      
      toast({
        title: "Temple Upgraded!",
        description: `Your Wealth Temple has ascended to the next tier!`,
        variant: "default",
      });
    }
  };

  const handleEquipRelic = (relic: Relic) => {
    if (equippedRelics.length >= tierInfo.relicSlots) {
      toast({
        title: "No Available Slots",
        description: "Upgrade your temple to unlock more relic slots.",
        variant: "destructive",
      });
      return;
    }
    
    setEquippedRelics(prev => [...prev, relic]);
    
    toast({
      title: "Relic Equipped",
      description: `${relic.name} has been placed in your temple.`,
      variant: "default",
    });
  };
  
  const handleUnequipRelic = (relicId: string) => {
    setEquippedRelics(prev => prev.filter(r => r.id !== relicId));
  };
  
  const handlePullRelic = () => {
    if (cash < 500) {
      toast({
        title: "Not Enough DemonCoins",
        description: "You need at least 500 DemonCoins to use the Gambler's Shrine.",
        variant: "destructive",
      });
      return;
    }
    
    setPullAnimation(true);
    
    // Simulate a pull with a random relic
    setTimeout(() => {
      const randomRelic = availableRelics[Math.floor(Math.random() * availableRelics.length)];
      setLastRelic(randomRelic);
      setPullAnimation(false);
      
      toast({
        title: `${randomRelic.rarity.charAt(0).toUpperCase() + randomRelic.rarity.slice(1)} Relic Found!`,
        description: `You obtained: ${randomRelic.name}`,
        variant: "default",
      });
    }, 2000);
  };
  
  const handleViewRelicDetails = (relicId: string) => {
    setShowRelicDetails(relicId === showRelicDetails ? null : relicId);
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-0 overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-950 to-blue-900 rounded-lg border border-blue-500/30 shadow-xl shadow-blue-500/20">
            <DialogHeader className="p-6 border-b border-blue-500/20">
              <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                <Home className="h-6 w-6 text-amber-400" />
                <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Wealth Temple</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="p-6">
              {isTempleBlocked ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-10 space-y-4"
                >
                  <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                    <Home className="h-10 w-10 text-red-400 opacity-50" />
                  </div>
                  <h3 className="text-xl font-bold text-red-400">Temple Blocked</h3>
                  <p className="text-gray-400">
                    Your corruption is too unstable to access the Wealth Temple.
                    Reduce your corruption level below 100 to regain access.
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column - Temple Description */}
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-blue-950/50 p-4 rounded-lg border border-blue-500/30"
                    >
                      <h3 className="text-lg font-bold text-blue-300 mb-2 flex items-center gap-2">
                        <Home className="h-5 w-5 text-blue-400" />
                        {tierInfo.name}
                      </h3>
                      <p className="text-sm text-gray-300">{tierInfo.description}</p>
                      
                      {hasCorruptionPenalty && (
                        <div className="mt-3 p-2 bg-red-900/30 rounded border border-red-500/30 text-xs text-red-300">
                          <span className="font-semibold">Shadow Penalty:</span> Temple powers reduced by 30% due to corruption.
                        </div>
                      )}
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-blue-950/50 p-4 rounded-lg border border-blue-500/30"
                    >
                      <h3 className="text-sm font-bold text-blue-300 mb-2">Temple Stats</h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Passive Return:</span>
                          <span className="text-amber-300">
                            {hasCorruptionPenalty 
                              ? `${parseFloat(tierInfo.passiveReturn) * 0.7}%` 
                              : tierInfo.passiveReturn}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">Relic Slots:</span>
                          <span className="text-amber-300">{tierInfo.relicSlots}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-400">Next Upgrade:</span>
                          <span className="text-amber-300">
                            <DemonCoin amount={parseInt(tierInfo.nextUpgrade.replace(/,/g, ''))} size="sm" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex flex-col gap-2"
                    >
                      <Button
                        onClick={handleUpgradeTemple}
                        disabled={cash < parseInt(tierInfo.nextUpgrade.replace(/,/g, '')) || tierInfo.nextUpgrade === "MAX"}
                        className={`w-full ${tierInfo.nextUpgrade === "MAX" ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"}`}
                      >
                        {tierInfo.nextUpgrade === "MAX" ? "Maximum Level" : `Upgrade Temple (${tierInfo.nextUpgrade} DemonCoins)`}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={handleOpenGamblersShrine}
                        className="w-full border-amber-500/50 text-amber-300 hover:bg-amber-900/30"
                      >
                        <Sparkles className="h-4 w-4 mr-2 text-amber-400" />
                        Gambler's Shrine
                      </Button>
                    </motion.div>
                  </div>
                  
                  {/* Center Column - Temple Visualization */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-blue-950/50 rounded-lg border border-blue-500/30 flex items-center justify-center"
                  >
                    <div className="text-center p-6">
                      <div className="w-40 h-40 mx-auto flex items-center justify-center">
                        <div className="relative">
                          {/* Temple illustration */}
                          <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse-slow"></div>
                          
                          {/* Use an actual temple image if available, otherwise use the icon */}
                          {tierInfo.imagePath ? (
                            <img 
                              src={tierInfo.imagePath} 
                              alt={tierInfo.name}
                              className="h-32 w-32 object-contain relative z-10"
                            />
                          ) : (
                            <Home className="h-16 w-16 text-blue-300 relative z-10" />
                          )}
                          
                          {/* Particle effects for higher tiers */}
                          {templeLevel >= 3 && (
                            <div className="absolute inset-0 z-20">
                              <div className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-float-particle-1"></div>
                              <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-float-particle-2"></div>
                              <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-float-particle-3"></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-xs text-gray-400">Temple Level</span>
                        <div className="flex justify-center items-center gap-2 mt-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div 
                              key={level} 
                              className={`w-3 h-3 rounded-full ${
                                level <= templeLevel 
                                  ? 'bg-blue-400' 
                                  : 'bg-gray-700'
                              } ${level === templeLevel ? 'animate-pulse' : ''}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-6 text-xs text-gray-400 italic">
                        "Wealth flows to those who nurture its temple."
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Right Column - Relics */}
                  <div className="space-y-4">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-blue-950/50 p-4 rounded-lg border border-blue-500/30"
                    >
                      <h3 className="text-lg font-bold text-blue-300 mb-2 flex items-center gap-2">
                        <CrownIcon className="h-5 w-5 text-amber-400" />
                        Holy Relics
                      </h3>
                      
                      {tierInfo.relicSlots === 0 ? (
                        <p className="text-sm text-gray-300">
                          Upgrade your temple to unlock relic slots.
                        </p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {/* Available relic slots */}
                          {Array(tierInfo.relicSlots).fill(0).map((_, index) => {
                            const relicForSlot = equippedRelics[index];
                            
                            return (
                              <motion.div 
                                key={index} 
                                className={`h-16 border ${relicForSlot ? 'border-amber-500/50' : 'border-dashed border-gray-600'} rounded-lg flex items-center justify-center bg-gray-800/30 relative overflow-hidden cursor-pointer`}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => relicForSlot ? handleViewRelicDetails(relicForSlot.id) : {}}
                              >
                                {relicForSlot ? (
                                  <>
                                    {/* Relic glow effect based on rarity */}
                                    <div className={`absolute inset-0 blur-md opacity-20 ${
                                      relicForSlot.rarity === 'legendary' ? 'bg-amber-500' : 
                                      relicForSlot.rarity === 'rare' ? 'bg-purple-500' : 
                                      'bg-blue-500'
                                    }`}></div>
                                    
                                    {/* Relic icon */}
                                    <div className="p-2">
                                      {relicForSlot.icon || <Star className="h-6 w-6 text-amber-400" />}
                                    </div>
                                    
                                    {/* Relic name */}
                                    <div className="absolute bottom-0 inset-x-0 bg-black/50 px-1 py-0.5">
                                      <p className="text-xs text-center truncate">{relicForSlot.name}</p>
                                    </div>
                                    
                                    {/* Remove button */}
                                    <button 
                                      className="absolute top-0 right-0 bg-red-900/80 text-white rounded-bl text-xs p-0.5 opacity-0 group-hover:opacity-100"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleUnequipRelic(relicForSlot.id);
                                      }}
                                    >
                                      ✕
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-gray-500 text-xs">Empty Slot</span>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Relic details popup */}
                      <AnimatePresence>
                        {showRelicDetails && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-4 p-3 bg-blue-950/80 border border-blue-500/40 rounded-lg"
                          >
                            {equippedRelics.find(r => r.id === showRelicDetails) && (
                              <div>
                                <h4 className="font-semibold text-amber-300 mb-1">
                                  {equippedRelics.find(r => r.id === showRelicDetails)?.name}
                                </h4>
                                <p className="text-xs text-gray-300 mb-2">
                                  {equippedRelics.find(r => r.id === showRelicDetails)?.description}
                                </p>
                                <div className="flex justify-between text-xs">
                                  <span className="text-blue-300">Effect:</span>
                                  <span className="text-green-400">
                                    {equippedRelics.find(r => r.id === showRelicDetails)?.effect}
                                  </span>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-blue-950/50 p-4 rounded-lg border border-blue-500/30"
                    >
                      <h3 className="text-sm font-bold text-blue-300 mb-2 flex items-center gap-2">
                        <Coins className="h-4 w-4 text-green-400" />
                        Passive Income
                      </h3>
                      
                      <p className="text-sm text-gray-300 mb-2">
                        Your temple generates {hasCorruptionPenalty 
                          ? parseFloat(tierInfo.passiveReturn) * 0.7
                          : tierInfo.passiveReturn}% interest on unspent DemonCoins.
                      </p>
                      
                      <div className="p-2 bg-green-900/20 rounded border border-green-500/30 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Current DemonCoins:</span>
                          <span className="text-green-400">{cash.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-gray-300">Monthly Yield:</span>
                          <span className="text-green-400">
                            +{Math.floor(cash * (parseFloat(tierInfo.passiveReturn.replace('%', '')) / 100) * (hasCorruptionPenalty ? 0.7 : 1)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Gambler's Shrine Modal */}
      <Dialog open={showGamblingShrineModal} onOpenChange={setShowGamblingShrineModal}>
        <DialogContent className="max-w-md p-0 bg-transparent border-0 overflow-hidden">
          <div className="bg-gradient-to-br from-amber-950 to-orange-900 rounded-lg border border-amber-500/30 shadow-xl shadow-amber-500/20">
            <DialogHeader className="p-4 border-b border-amber-500/20">
              <DialogTitle className="text-xl font-bold text-center">
                <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">Gambler's Shrine</span>
              </DialogTitle>
              <DialogDescription className="text-center text-gray-300">
                Test your luck for rare relics and treasures
              </DialogDescription>
            </DialogHeader>
            
            <div className="p-6 relative">
              {/* Luck wheel or gacha animation would go here */}
              <div className="h-64 flex items-center justify-center">
                {pullAnimation ? (
                  <div className="relative">
                    <div className="w-32 h-32 border-4 border-t-amber-400 border-r-amber-400 border-b-purple-500 border-l-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-amber-300 animate-pulse" />
                    </div>
                  </div>
                ) : lastRelic ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="text-center"
                  >
                    <div className={`p-6 rounded-full mb-3 mx-auto inline-block ${
                      lastRelic.rarity === 'legendary' ? 'bg-amber-700/30 border-2 border-amber-500' :
                      lastRelic.rarity === 'rare' ? 'bg-purple-700/30 border-2 border-purple-500' :
                      'bg-blue-700/30 border-2 border-blue-500'
                    }`}>
                      {lastRelic.icon}
                    </div>
                    <h3 className={`text-lg font-bold mb-1 ${
                      lastRelic.rarity === 'legendary' ? 'text-amber-400' :
                      lastRelic.rarity === 'rare' ? 'text-purple-400' :
                      'text-blue-400'
                    }`}>{lastRelic.name}</h3>
                    <p className="text-sm text-gray-300 mb-2">{lastRelic.description}</p>
                    <p className="text-xs text-green-400">{lastRelic.effect}</p>
                    <div className="mt-4">
                      <Button 
                        onClick={() => handleEquipRelic(lastRelic)}
                        className="mr-2"
                      >
                        Equip
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setLastRelic(null)}
                      >
                        Save
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center">
                    <div className="h-32 w-32 mx-auto relative mb-4">
                      <div className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-20 animate-pulse-slow"></div>
                      <Sparkles className="h-24 w-24 text-amber-400 mx-auto" />
                    </div>
                    <p className="text-gray-300 mb-4">Place an offering to receive a blessing from the temple.</p>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center items-center gap-1">
                        <div className="text-xs text-gray-400">Cost:</div>
                        <div className="text-amber-300 font-semibold">500 DemonCoins</div>
                      </div>
                      <Button 
                        onClick={handlePullRelic}
                        className="bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700"
                      >
                        <Sparkles className="mr-2 h-4 w-4" /> 
                        Make Offering
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-amber-300 mb-2">Shrine Rates</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-blue-900/30 p-2 rounded">
                    <div className="font-semibold text-center mb-1">Common</div>
                    <div className="text-center text-blue-300">70%</div>
                  </div>
                  <div className="bg-purple-900/30 p-2 rounded">
                    <div className="font-semibold text-center mb-1">Rare</div>
                    <div className="text-center text-purple-300">25%</div>
                  </div>
                  <div className="bg-amber-900/30 p-2 rounded">
                    <div className="font-semibold text-center mb-1">Legendary</div>
                    <div className="text-center text-amber-300">5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WealthTempleScreen;
