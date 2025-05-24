
import { useState, useCallback } from 'react';
import { PowerUp, PowerUpInventory, ActivePowerUp } from '@/types/powerUpTypes';
import { POWER_UPS } from '@/data/powerUpsData';
import { toast } from "@/hooks/use-toast";

export const usePowerUps = () => {
  const [inventory, setInventory] = useState<PowerUpInventory>({
    owned: [],
    active: [],
    cooldowns: {}
  });

  const purchasePowerUp = useCallback((powerUpId: string, spendCoins: (amount: number, desc: string) => boolean) => {
    const powerUp = POWER_UPS.find(p => p.id === powerUpId);
    if (!powerUp) return false;

    if (spendCoins(powerUp.cost, `Purchased ${powerUp.name}`)) {
      setInventory(prev => ({
        ...prev,
        owned: [...prev.owned, powerUpId]
      }));
      
      toast({
        title: "Power-Up Acquired!",
        description: `You've purchased ${powerUp.name}`,
        variant: "default",
      });
      
      return true;
    }
    return false;
  }, []);

  const activatePowerUp = useCallback((powerUpId: string) => {
    const powerUp = POWER_UPS.find(p => p.id === powerUpId);
    if (!powerUp || !inventory.owned.includes(powerUpId)) return false;

    // Check cooldown
    const cooldownEnd = inventory.cooldowns[powerUpId] || 0;
    if (Date.now() < cooldownEnd) {
      toast({
        title: "Power-Up on Cooldown",
        description: `${powerUp.name} is still cooling down`,
        variant: "destructive",
      });
      return false;
    }

    const now = Date.now();
    const activePowerUp: ActivePowerUp = {
      powerUpId,
      activatedAt: now,
      expiresAt: powerUp.duration ? now + (powerUp.duration * 1000) : undefined,
      stacks: 1
    };

    setInventory(prev => ({
      ...prev,
      active: [...prev.active, activePowerUp],
      cooldowns: powerUp.cooldown ? {
        ...prev.cooldowns,
        [powerUpId]: now + (powerUp.cooldown * 1000)
      } : prev.cooldowns
    }));

    toast({
      title: "Power-Up Activated!",
      description: `${powerUp.name} is now active`,
      variant: "default",
    });

    return true;
  }, [inventory]);

  const getActivePowerUps = useCallback(() => {
    const now = Date.now();
    const active = inventory.active.filter(ap => 
      !ap.expiresAt || ap.expiresAt > now
    );
    
    // Clean up expired power-ups
    if (active.length !== inventory.active.length) {
      setInventory(prev => ({
        ...prev,
        active
      }));
    }
    
    return active.map(ap => ({
      ...ap,
      powerUp: POWER_UPS.find(p => p.id === ap.powerUpId)!
    }));
  }, [inventory.active]);

  const getPowerUpMultiplier = useCallback((type: string) => {
    const activePowerUps = getActivePowerUps();
    let multiplier = 1;
    
    activePowerUps.forEach(({ powerUp }) => {
      powerUp.effects.forEach(effect => {
        if (effect.type === type) {
          multiplier += effect.value / 100;
        }
      });
    });
    
    return multiplier;
  }, [getActivePowerUps]);

  return {
    inventory,
    purchasePowerUp,
    activatePowerUp,
    getActivePowerUps,
    getPowerUpMultiplier,
    availablePowerUps: POWER_UPS
  };
};
