
import GameDashboard from "@/components/GameDashboard";
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import AnimeAvatar from "@/components/AnimeAvatar";

const Index = () => {
  const { gameStarted, initializeGame } = useGameContext();

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night-sky">
        <div className="max-w-md w-full p-8 demon-card relative overflow-hidden">
          <div className="absolute inset-0 kanji-bg opacity-10"></div>
          
          <div className="flex items-center justify-center mb-6">
            <AnimeAvatar size="lg" showAura={true} />
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2 bg-demon-gradient bg-clip-text text-transparent">
            Debt Demon Slayer
          </h1>
          
          <p className="text-center text-white/70 mb-8">
            Begin your journey to slay debt demons and master the art of financial breathing
          </p>
          
          <Button 
            onClick={initializeGame} 
            className="w-full bg-demon-gradient hover:bg-demon-gradient hover:opacity-90 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 animate-pulse-subtle" />
            Begin Your Journey
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <GameDashboard />
    </div>
  );
};

export default Index;
