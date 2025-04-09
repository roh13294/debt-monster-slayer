
import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGameContext } from '@/context/GameContext';
import { calculatePlayerLevel, getPlayerRank } from '@/utils/gameTerms';
import { motion } from 'framer-motion';
import { Book, Medal, Scroll, Milestone, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface JourneyMilestone {
  id: string;
  title: string;
  description: string;
  month: number;
  type: 'victory' | 'rank' | 'challenge' | 'decision';
  reward?: string;
  choices?: {
    text: string;
    reflection: string;
  }[];
  selectedChoice?: number;
}

interface JourneyTimelineProps {
  onClose?: () => void;
}

const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ onClose }) => {
  const { monthsPassed, job, lifeStage, debts, eventHistory } = useGameContext();
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [reflections, setReflections] = useState<Record<string, number>>({});
  
  // Generate milestones based on game progress
  const milestones: JourneyMilestone[] = [
    {
      id: 'start',
      title: 'The Journey Begins',
      description: `You begin your journey as a ${lifeStage.name} ${job.title}, facing ${debts.length} demons that bind your spirit.`,
      month: 0,
      type: 'rank',
      choices: [
        { text: "I will face these demons head-on", reflection: "Your determined spirit will be your greatest weapon." },
        { text: "I must be strategic and careful", reflection: "Wisdom before action - a path of balance." },
        { text: "This challenge will make me stronger", reflection: "Growth comes from overcoming what once seemed impossible." }
      ]
    },
    // Dynamic milestones based on game progress
    ...(monthsPassed >= 3 ? [{
      id: 'rank-up-1',
      title: 'First Milestone',
      description: `You've advanced to the rank of ${getPlayerRank(calculatePlayerLevel(3))}, showing promise in your journey.`,
      month: 3,
      type: 'rank' as const,
      reward: '+1 Discipline'
    }] : []),
    ...(monthsPassed >= 6 ? [{
      id: 'halfway',
      title: 'Finding Your Path',
      description: `Six months into your journey, you've learned the ways of spirit energy management and demon weaknesses.`,
      month: 6,
      type: 'challenge' as const,
      choices: [
        { text: "The patterns of these demons are becoming clear", reflection: "Understanding brings power - your insight grows." },
        { text: "Each victory brings me closer to freedom", reflection: "The path to liberation becomes visible with each step forward." },
        { text: "I'm developing my own technique", reflection: "Your unique approach sets you apart from others." }
      ]
    }] : []),
    ...(monthsPassed >= 9 ? [{
      id: 'rank-up-2',
      title: 'Rising Through the Ranks',
      description: `Your consistent efforts have earned you the rank of ${getPlayerRank(calculatePlayerLevel(9))}.`,
      month: 9,
      type: 'rank' as const,
      reward: '+1 Focus'
    }] : []),
    ...(monthsPassed >= 12 ? [{
      id: 'anniversary',
      title: 'One Year Mark',
      description: `A full cycle of seasons has passed since you began your journey to slay your demons.`,
      month: 12,
      type: 'decision' as const,
      choices: [
        { text: "I've grown stronger than I ever imagined", reflection: "Your spirit burns brighter with each challenge faced." },
        { text: "This journey has taught me patience", reflection: "Steady progress over time reveals the path to victory." },
        { text: "I see the patterns that once controlled me", reflection: "Awareness is the first step toward mastery." }
      ]
    }] : []),
  ];

  const handleChoiceSelect = (milestoneId: string, choiceIndex: number) => {
    setReflections({...reflections, [milestoneId]: choiceIndex});
  };
  
  const getMilestoneIcon = (type: string) => {
    switch (type) {
      case 'victory': return <Medal className="h-5 w-5 text-amber-400" />;
      case 'rank': return <Book className="h-5 w-5 text-blue-400" />;
      case 'challenge': return <Milestone className="h-5 w-5 text-purple-400" />;
      case 'decision': return <Scroll className="h-5 w-5 text-emerald-400" />;
      default: return <ChevronRight className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="bg-slate-950/95 border border-slate-800 rounded-lg overflow-hidden shadow-xl">
      <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
          <Scroll className="h-5 w-5 text-amber-400" />
          Journey Timeline
        </h2>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[350px] p-4">
        <div className="space-y-4 relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-slate-800 z-0"></div>
          
          {milestones.map((milestone) => (
            <div key={milestone.id} className="relative z-10">
              <div 
                className="flex gap-3 items-start cursor-pointer" 
                onClick={() => setSelectedMilestone(selectedMilestone === milestone.id ? null : milestone.id)}
              >
                <div className={`p-2 rounded-full flex-shrink-0 ${
                  milestone.month <= monthsPassed ? 'bg-blue-600 shadow-glow-blue' : 'bg-slate-800'
                }`}>
                  {getMilestoneIcon(milestone.type)}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium text-lg ${
                      milestone.month <= monthsPassed ? 'text-slate-100' : 'text-slate-400'
                    }`}>
                      {milestone.title}
                    </h3>
                    <span className="text-sm text-slate-500">
                      Month {milestone.month}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${
                    milestone.month <= monthsPassed ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    {milestone.description}
                  </p>
                  
                  {selectedMilestone === milestone.id && milestone.month <= monthsPassed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="mt-3"
                    >
                      {milestone.reward && (
                        <div className="bg-blue-900/20 border border-blue-800 p-3 rounded-md mb-3 text-sm text-blue-300">
                          <strong>Reward:</strong> {milestone.reward}
                        </div>
                      )}
                      
                      {milestone.choices && (
                        <div className="space-y-3 mt-2">
                          <p className="text-sm text-slate-400">How do you reflect on this moment?</p>
                          
                          {milestone.choices.map((choice, idx) => (
                            <div 
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChoiceSelect(milestone.id, idx);
                              }}
                              className={`p-3 border rounded-md text-sm cursor-pointer transition-all ${
                                reflections[milestone.id] === idx 
                                  ? 'border-amber-500 bg-amber-900/20 text-amber-100' 
                                  : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                              }`}
                            >
                              {choice.text}
                              
                              {reflections[milestone.id] === idx && (
                                <div className="mt-2 text-amber-300 italic">
                                  "{choice.reflection}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
                
                <div className="pt-1">
                  {selectedMilestone === milestone.id ? (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </div>
              
              {/* Only show separator if not the last item */}
              {milestones.indexOf(milestone) < milestones.length - 1 && (
                <div className="ml-12 my-2">
                  <Separator className="bg-slate-800" />
                </div>
              )}
            </div>
          ))}
          
          {/* Future journey marker */}
          {monthsPassed < 12 && (
            <div className="flex gap-3 items-start opacity-60">
              <div className="p-2 rounded-full bg-slate-800 flex-shrink-0">
                <Milestone className="h-5 w-5 text-slate-400" />
              </div>
              <div className="pt-1 italic text-slate-400 text-sm">
                Your journey continues...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default JourneyTimeline;
