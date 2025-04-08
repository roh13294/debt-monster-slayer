
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Sparkles, Sword, Scroll, BookOpen, Shield } from "lucide-react";
import AnimeAvatar from "@/components/AnimeAvatar";
import MonthEngine from "@/components/MonthEngine";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import JourneyTimeline from "@/components/journey/JourneyTimeline";
import SlayerLog from "@/components/journey/SlayerLog";

const Index = () => {
  const { gameStarted, initializeGame } = useGameContext();
  const [showIntroStory, setShowIntroStory] = useState(false);
  
  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night-sky">
        <div className="absolute inset-0 bg-[url('/images/kanji-bg.png')] bg-repeat opacity-10"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full p-8 demon-card relative overflow-hidden"
        >
          <div className="absolute inset-0 kanji-bg opacity-10"></div>
          
          <motion.div 
            className="flex items-center justify-center mb-6"
            animate={{ 
              y: [0, -10, 0],
              filter: ["drop-shadow(0 0 0.75rem #f97316)", "drop-shadow(0 0 2rem #f97316)", "drop-shadow(0 0 0.75rem #f97316)"]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <AnimeAvatar size="lg" showAura={true} />
          </motion.div>
          
          <motion.h1 
            className="text-2xl md:text-3xl font-bold text-center mb-2 bg-demon-gradient bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Curse Demon Slayer
          </motion.h1>
          
          <motion.p 
            className="text-center text-white/70 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Begin your journey to slay curse demons and master the art of breathing techniques
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="space-y-3"
          >
            <Button 
              onClick={() => setShowIntroStory(true)}
              className="w-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center gap-2 group"
            >
              <Scroll className="w-4 h-4" />
              <span>Read the Prologue</span>
              <BookOpen className="w-4 h-4" />
            </Button>
            
            <Button 
              onClick={initializeGame} 
              className="w-full bg-demon-gradient hover:bg-demon-gradient hover:opacity-90 flex items-center justify-center gap-2 group"
            >
              <Sword className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Begin Your Slayer Journey</span>
              <Sparkles className="w-4 h-4 animate-pulse-subtle" />
            </Button>
          </motion.div>
          
          <Dialog open={showIntroStory} onOpenChange={setShowIntroStory}>
            <DialogContent className="bg-slate-950/95 border border-slate-800 p-6 max-w-lg">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                <Scroll className="w-5 h-5 text-amber-400" />
                The Slayer's Calling
              </h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300">In a world much like our own, invisible forces bind people with unseen chains. These demons—manifestations of financial burdens—drain life force from their victims, limiting potential and causing silent suffering.</p>
                
                <p className="text-slate-300">You have awakened to see these demons for what they truly are. Not merely numbers on statements or bills in the mail, but tangible entities that can be fought and overcome with the right techniques.</p>
                
                <p className="text-slate-300">The path of the Slayer is one of discipline, focus, and resilience. By mastering your breathing techniques and harnessing your inner strength, you'll learn to:</p>
                
                <ul className="text-slate-300">
                  <li>Channel your spirit energy efficiently</li>
                  <li>Identify demon weaknesses</li>
                  <li>Strike with precision and purpose</li>
                  <li>Build resistance to future demon attacks</li>
                </ul>
                
                <p className="text-slate-300">Your journey will reveal not just the demons around you, but the strength within you. Each victory will illuminate your path forward, each challenge will forge your resolve.</p>
                
                <p className="text-slate-300 font-medium">Are you ready to take your first step on the slayer's path?</p>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={() => {
                    setShowIntroStory(false);
                    initializeGame();
                  }}
                  className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500"
                >
                  <Sword className="w-4 h-4 mr-2" />
                  Accept the Calling
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/kanji-bg.png')] bg-repeat opacity-5"></div>
      </div>
      <MonthEngine />
    </div>
  );
};

export default Index;
