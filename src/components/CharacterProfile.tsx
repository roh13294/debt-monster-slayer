import React from 'react';
import { useGameContext } from '../context/GameContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import XPBar from '@/components/ui/XPBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { User, Briefcase, Home, Star, Target, Trophy } from 'lucide-react';

const CharacterProfile: React.FC = () => {
  const { 
    playerName, 
    avatar, 
    playerTraits, 
    job, 
    lifeStage, 
    circumstances, 
    characterBackground,
    playerXP,
    playerLevel,
    getXPThreshold
  } = useGameContext();

  const currentXP = playerXP;
  const xpToNext = getXPThreshold(playerLevel + 1);
  const level = playerLevel;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Character Header */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20 border-2 border-blue-500">
              <AvatarImage src={avatar} alt={playerName} />
              <AvatarFallback className="bg-blue-900 text-blue-100 text-2xl">
                {playerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <CardTitle className="text-2xl text-white">{playerName}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {job?.title || 'Unemployed'}
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  <Home className="w-3 h-3 mr-1" />
                  {lifeStage?.name || 'Unknown'}
                </Badge>
              </div>
              
              <XPBar 
                currentXP={currentXP}
                xpToNext={xpToNext}
                level={level}
                size="md" 
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Character Background */}
          {characterBackground && (
            <div className="mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <p className="text-sm text-slate-300 italic">{characterBackground}</p>
            </div>
          )}
          
          {/* Circumstances */}
          {circumstances.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {circumstances.map((circumstance, index) => (
                <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-300">
                  {circumstance}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Player Traits */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Character Traits
          </CardTitle>
          <CardDescription>Your character's strengths and areas for growth</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(playerTraits).map(([trait, value]) => {
              const percentage = (value / 10) * 100;
              const traitLabel = trait.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              
              return (
                <div key={trait} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-300">{traitLabel}</span>
                    <span className="text-sm text-slate-400">{value}/10</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${
                      value >= 8 ? 'bg-green-900' : 
                      value >= 6 ? 'bg-yellow-900' : 
                      'bg-red-900'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-slate-400">Financial Focus</p>
                <p className="text-lg font-semibold text-white">
                  {playerTraits.financialKnowledge >= 7 ? 'Expert' : 
                   playerTraits.financialKnowledge >= 5 ? 'Intermediate' : 'Beginner'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-slate-400">Discipline Level</p>
                <p className="text-lg font-semibold text-white">
                  {playerTraits.discipline >= 7 ? 'High' : 
                   playerTraits.discipline >= 5 ? 'Moderate' : 'Developing'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-slate-400">Overall Rating</p>
                <p className="text-lg font-semibold text-white">
                  {Math.round(Object.values(playerTraits).reduce((a, b) => a + b, 0) / Object.keys(playerTraits).length)}/10
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CharacterProfile;
