
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Sparkles, Sword, Scroll } from "lucide-react";
import AnimeAvatar from "@/components/AnimeAvatar";
import MonthEngine from "@/components/MonthEngine";
import { motion } from "framer-motion";

const Index = () => {
  const { gameStarted, initializeGame } = useGameContext();

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
          >
            <Button 
              onClick={initializeGame} 
              className="w-full bg-demon-gradient hover:bg-demon-gradient hover:opacity-90 flex items-center justify-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sword className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Begin Your Slayer Journey</span>
              <Sparkles className="w-4 h-4 animate-pulse-subtle" />
            </Button>
          </motion.div>
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
