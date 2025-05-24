
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Shield, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePowerUps } from '@/hooks/usePowerUps';
import { useDemonCoins } from '@/hooks/useDemonCoins';
import { PowerUp } from '@/types/powerUpTypes';
import DemonCoin from '@/components/ui/DemonCoin';

interface PowerUpShopProps {
  balance: number;
  spendCoins: (amount: number, description: string) => boolean;
}

const PowerUpShop: React.FC<PowerUpShopProps> = ({ balance, spendCoins }) => {
  const { availablePowerUps, inventory, purchasePowerUp, activatePowerUp, getActivePowerUps } = usePowerUps();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const activePowerUps = getActivePowerUps();
  
  const categories = [
    { id: 'all', name: 'All', icon: Star },
    { id: 'attack', name: 'Attack', icon: Zap },
    { id: 'defense', name: 'Defense', icon: Shield },
    { id: 'utility', name: 'Utility', icon: Clock },
    { id: 'buff', name: 'Buffs', icon: Star }
  ];
  
  const filteredPowerUps = selectedCategory === 'all' 
    ? availablePowerUps 
    : availablePowerUps.filter(powerUp => powerUp.category === selectedCategory);
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };
  
  const handlePurchase = (powerUp: PowerUp) => {
    purchasePowerUp(powerUp.id, spendCoins);
  };
  
  const handleActivate = (powerUpId: string) => {
    activatePowerUp(powerUpId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
          <ShoppingCart className="w-8 h-8 mr-3" />
          Power-Up Arsenal
        </h1>
        <p className="text-gray-300">Enhance your debt-slaying abilities</p>
        <div className="mt-4">
          <DemonCoin amount={balance} size="lg" />
        </div>
      </div>

      {/* Active Power-Ups */}
      {activePowerUps.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Active Power-Ups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePowerUps.map(({ powerUp, expiresAt }) => (
              <motion.div
                key={powerUp.id}
                className="bg-green-900/50 border border-green-500 rounded-lg p-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{powerUp.icon}</span>
                  <Badge className={getRarityColor(powerUp.rarity)}>
                    {powerUp.rarity}
                  </Badge>
                </div>
                <h3 className="font-bold text-white">{powerUp.name}</h3>
                <p className="text-sm text-gray-300">{powerUp.description}</p>
                {expiresAt && (
                  <div className="mt-2 text-xs text-green-400">
                    Expires: {new Date(expiresAt).toLocaleTimeString()}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <Icon className="w-4 h-4" />
              {category.name}
            </Button>
          );
        })}
      </div>

      {/* Power-Up Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPowerUps.map(powerUp => {
          const isOwned = inventory.owned.includes(powerUp.id);
          const canAfford = balance >= powerUp.cost;
          
          return (
            <motion.div
              key={powerUp.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className={`h-full bg-slate-800 border-slate-700 ${isOwned ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{powerUp.icon}</span>
                    <Badge className={getRarityColor(powerUp.rarity)}>
                      {powerUp.rarity}
                    </Badge>
                  </div>
                  <CardTitle className="text-white">{powerUp.name}</CardTitle>
                  <CardDescription>{powerUp.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Cost:</span>
                      <DemonCoin amount={powerUp.cost} size="sm" />
                    </div>
                    
                    {powerUp.cooldown && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Cooldown:</span>
                        <span className="text-sm text-white">{powerUp.cooldown}s</span>
                      </div>
                    )}
                    
                    {powerUp.duration && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Duration:</span>
                        <span className="text-sm text-white">
                          {powerUp.duration < 60 ? `${powerUp.duration}s` : `${Math.floor(powerUp.duration / 60)}m`}
                        </span>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      {!isOwned ? (
                        <Button
                          onClick={() => handlePurchase(powerUp)}
                          disabled={!canAfford}
                          className="w-full"
                          variant={canAfford ? "default" : "outline"}
                        >
                          {canAfford ? "Purchase" : "Cannot Afford"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleActivate(powerUp.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700"
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PowerUpShop;
