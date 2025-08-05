import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGameContext } from '@/context/GameContext';
import { User, Crown, Shield, Sword, Zap, Star, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AvatarOption {
  id: string;
  name: string;
  cost: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: React.ReactNode;
  description: string;
}

const AvatarCustomizer: React.FC = () => {
  const { demonCoinBalance, spendDemonCoins, avatar, setAvatar } = useGameContext();
  const [selectedAvatar, setSelectedAvatar] = useState<string>(avatar || 'default');
  const [unlockedAvatars, setUnlockedAvatars] = useState<Set<string>>(new Set(['default']));

  const avatarOptions: AvatarOption[] = [
    {
      id: 'default',
      name: 'Novice Slayer',
      cost: 0,
      unlocked: true,
      rarity: 'common',
      icon: <User className="w-8 h-8" />,
      description: 'The starting avatar for all demon slayers'
    },
    {
      id: 'warrior',
      name: 'Battle Warrior',
      cost: 500,
      unlocked: unlockedAvatars.has('warrior'),
      rarity: 'common',
      icon: <Sword className="w-8 h-8" />,
      description: 'A seasoned fighter with combat experience'
    },
    {
      id: 'guardian',
      name: 'Temple Guardian',
      cost: 1000,
      unlocked: unlockedAvatars.has('guardian'),
      rarity: 'rare',
      icon: <Shield className="w-8 h-8" />,
      description: 'Protector of the sacred wealth temples'
    },
    {
      id: 'lightning',
      name: 'Lightning Sage',
      cost: 2000,
      unlocked: unlockedAvatars.has('lightning'),
      rarity: 'epic',
      icon: <Zap className="w-8 h-8" />,
      description: 'Master of elemental breathing techniques'
    },
    {
      id: 'royal',
      name: 'Demon Lord',
      cost: 5000,
      unlocked: unlockedAvatars.has('royal'),
      rarity: 'legendary',
      icon: <Crown className="w-8 h-8" />,
      description: 'Ruler of both light and shadow realms'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-muted-foreground border-muted';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-muted-foreground border-muted';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-muted/20';
      case 'rare': return 'bg-blue-500/20';
      case 'epic': return 'bg-purple-500/20';
      case 'legendary': return 'bg-yellow-500/20';
      default: return 'bg-muted/20';
    }
  };

  const handleUnlockAvatar = (avatarOption: AvatarOption) => {
    if (demonCoinBalance < avatarOption.cost) {
      toast({
        title: "Insufficient DemonCoins",
        description: `You need ${avatarOption.cost} DemonCoins to unlock this avatar.`,
        variant: "destructive",
      });
      return;
    }

    if (spendDemonCoins(avatarOption.cost, `Unlocked ${avatarOption.name} avatar`)) {
      setUnlockedAvatars(prev => new Set([...prev, avatarOption.id]));
      toast({
        title: "Avatar Unlocked!",
        description: `You've unlocked the ${avatarOption.name} avatar!`,
        variant: "default",
      });
    }
  };

  const handleSelectAvatar = (avatarId: string) => {
    setSelectedAvatar(avatarId);
    setAvatar(avatarId);
    toast({
      title: "Avatar Updated",
      description: "Your avatar has been changed successfully!",
      variant: "default",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <User className="w-4 h-4" />
          Customize Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Star className="w-5 h-5 text-primary" />
            Avatar Customization
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {avatarOptions.map((option) => (
            <Card 
              key={option.id}
              className={`relative border-2 transition-all duration-200 hover:scale-105 ${
                selectedAvatar === option.id 
                  ? `${getRarityColor(option.rarity)} bg-primary/10` 
                  : `border-border ${getRarityBg(option.rarity)}`
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={getRarityColor(option.rarity)}>
                    {option.rarity}
                  </Badge>
                  {!option.unlocked && (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex justify-center">
                  <div className={`p-4 rounded-full ${getRarityBg(option.rarity)} ${getRarityColor(option.rarity)}`}>
                    {option.icon}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 text-center space-y-2">
                <CardTitle className="text-sm text-foreground">{option.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{option.description}</p>
                
                {option.unlocked ? (
                  <Button
                    variant={selectedAvatar === option.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSelectAvatar(option.id)}
                    className="w-full"
                  >
                    {selectedAvatar === option.id ? 'Selected' : 'Select'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnlockAvatar(option)}
                    className="w-full gap-1"
                    disabled={demonCoinBalance < option.cost}
                  >
                    <span className="text-yellow-400">⬟</span>
                    {option.cost}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">DemonCoins:</span>
            <span className="text-yellow-400 font-bold">⬟ {demonCoinBalance}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Unlock more avatars by earning DemonCoins
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarCustomizer;