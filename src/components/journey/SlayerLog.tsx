
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameContext } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Swords, Shield, Flame, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface SlayerLogEntry {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'victory' | 'defeat' | 'insight' | 'growth';
  impact?: string;
}

interface SlayerLogProps {
  onClose?: () => void;
}

const SlayerLog: React.FC<SlayerLogProps> = ({ onClose }) => {
  const { 
    eventHistory, 
    playerTraits, 
    monthsPassed, 
    debts, 
    paymentStreak,
    characterBackground
  } = useGameContext();
  
  const [activeTab, setActiveTab] = useState('victories');
  
  // Generate log entries based on game state
  const logEntries: SlayerLogEntry[] = [
    // Starting entry
    {
      id: 'beginning',
      title: 'Journey Begins',
      description: 'You take your first step on the path to freedom from your demons.',
      date: new Date(Date.now() - monthsPassed * 30 * 24 * 60 * 60 * 1000),
      type: 'insight',
      impact: 'Your journey of a thousand miles begins with a single step.'
    },
    // Sample victory entries based on game state
    ...(paymentStreak >= 3 ? [{
      id: 'streak-3',
      title: 'Consistent Technique',
      description: `You've maintained a ${paymentStreak}-month streak of consistent attacks against your demons.`,
      date: new Date(),
      type: 'victory',
      impact: 'Your consistency is becoming your greatest weapon.'
    }] : []),
    ...(playerTraits.financialKnowledge > 5 ? [{
      id: 'knowledge-growth',
      title: 'Growing Wisdom',
      description: 'Your understanding of demon weaknesses has grown significantly.',
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      type: 'growth',
      impact: 'Knowledge is a weapon that never dulls.'
    }] : []),
    ...(playerTraits.determination > 6 ? [{
      id: 'determination-peak',
      title: 'Unwavering Spirit',
      description: 'Your determination has reached new heights, empowering your attacks.',
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      type: 'growth',
      impact: 'A determined heart finds no obstacle too great.'
    }] : []),
  ];
  
  // Generate insights based on player traits
  const insights = [
    {
      id: 'insight-1',
      title: 'Path Reflection',
      content: playerTraits.discipline > 6 
        ? "Your disciplined approach is creating a foundation of stability." 
        : "Finding balance between aggression and caution will serve you well."
    },
    {
      id: 'insight-2',
      title: 'Future Vision',
      content: playerTraits.riskTolerance > 7
        ? "Your boldness opens paths others might never see, but watch for pitfalls."
        : "Your careful approach provides security in uncertain times."
    },
    {
      id: 'insight-3',
      title: 'Spirit Assessment',
      content: monthsPassed > 6
        ? "The journey has hardened your resolve. What once seemed impossible now feels within reach."
        : "Every challenge faced brings clarity to your purpose."
    }
  ];
  
  const getIconForEntryType = (type: string) => {
    switch (type) {
      case 'victory': return <Trophy className="h-5 w-5 text-amber-400" />;
      case 'defeat': return <Shield className="h-5 w-5 text-red-400" />;
      case 'insight': return <Lightbulb className="h-5 w-5 text-blue-400" />;
      case 'growth': return <Flame className="h-5 w-5 text-green-400" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="bg-slate-950/95 border border-slate-800 rounded-lg overflow-hidden shadow-xl">
      <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
          <BookOpen className="h-5 w-5 text-amber-400" />
          Book of the Slayer
        </h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="victories" className="w-full" onValueChange={setActiveTab}>
        <div className="px-4 pt-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="victories" className="data-[state=active]:bg-amber-900/30">
              <Trophy className="h-4 w-4 mr-1.5" /> Victories
            </TabsTrigger>
            <TabsTrigger value="character" className="data-[state=active]:bg-blue-900/30">
              <BookOpen className="h-4 w-4 mr-1.5" /> Character
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-emerald-900/30">
              <Lightbulb className="h-4 w-4 mr-1.5" /> Insights
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="victories" className="p-0 mt-2">
          <ScrollArea className="h-[350px]">
            <div className="p-4 space-y-3">
              {logEntries.filter(entry => entry.type === 'victory' || entry.type === 'growth').map(entry => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="py-3 px-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base flex items-center gap-2">
                          {getIconForEntryType(entry.type)}
                          {entry.title}
                        </CardTitle>
                        <CardDescription className="text-xs opacity-70">
                          {formatDistanceToNow(entry.date, { addSuffix: true })}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 px-4 text-sm text-slate-300">
                      {entry.description}
                    </CardContent>
                    {entry.impact && (
                      <CardFooter className="py-2 px-4 text-xs italic text-amber-300 border-t border-slate-800 bg-amber-950/10">
                        "{entry.impact}"
                      </CardFooter>
                    )}
                  </Card>
                </motion.div>
              ))}
              
              {logEntries.filter(entry => entry.type === 'victory' || entry.type === 'growth').length === 0 && (
                <div className="text-center py-8 text-slate-400 italic">
                  Your victories will be recorded here as you progress on your journey.
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="character" className="p-0 mt-2">
          <ScrollArea className="h-[350px]">
            <div className="p-4">
              <div className="mb-4 p-4 bg-slate-900/60 border border-slate-800 rounded-lg">
                <h3 className="font-medium mb-2 text-slate-200">Character Background</h3>
                <p className="text-sm text-slate-300">{characterBackground}</p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-slate-200 px-1">Attributes</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Discipline</div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 flex-grow bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500" 
                          style={{ width: `${(playerTraits.discipline || 5) * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-300">{playerTraits.discipline || 5}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Resilience</div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 flex-grow bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500" 
                          style={{ width: `${(playerTraits.determination || 5) * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-300">{playerTraits.determination || 5}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Focus</div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 flex-grow bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${(playerTraits.financialKnowledge || 5) * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-300">{playerTraits.financialKnowledge || 5}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Adaptability</div>
                    <div className="flex items-center gap-1">
                      <div className="h-2 flex-grow bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500" 
                          style={{ width: `${(playerTraits.riskTolerance || 5) * 10}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-300">{playerTraits.riskTolerance || 5}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2 text-slate-200 px-1">Journey Progress</h3>
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <div className="text-xs text-slate-400">Months on Path</div>
                      <div className="text-lg font-medium text-slate-200">{monthsPassed}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Demons Remaining</div>
                      <div className="text-lg font-medium text-slate-200">{debts.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="insights" className="p-0 mt-2">
          <ScrollArea className="h-[350px]">
            <div className="p-4 space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="bg-slate-900 border-slate-800">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-blue-400" />
                      {insight.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4 text-sm text-slate-300 italic">
                    "{insight.content}"
                  </CardContent>
                </Card>
              ))}
              
              {/* Add log entries that are insights */}
              {logEntries.filter(entry => entry.type === 'insight').map(entry => (
                <Card key={entry.id} className="bg-slate-900 border-slate-800">
                  <CardHeader className="py-3 px-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base flex items-center gap-2">
                        {getIconForEntryType(entry.type)}
                        {entry.title}
                      </CardTitle>
                      <CardDescription className="text-xs opacity-70">
                        {formatDistanceToNow(entry.date, { addSuffix: true })}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2 px-4 text-sm text-slate-300">
                    {entry.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SlayerLog;
