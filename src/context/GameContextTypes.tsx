
import { createContext, useContext } from 'react';
import { GameContextType } from '../types/gameTypes';

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Hook to use the game context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

export { GameContext };
