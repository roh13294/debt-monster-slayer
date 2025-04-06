
import { PlayerTraits } from "@/types/gameTypes";

type EventResolverProps = {
  updatePlayerTrait: (trait: keyof PlayerTraits, value: number) => void;
  playerTraits: PlayerTraits;
};

export const useEventResolver = ({
  updatePlayerTrait,
  playerTraits
}: EventResolverProps) => {
  // Handle resolving life events
  const resolveLifeEvent = (
    optionIndex: number,
    originalResolveLifeEvent: (optionIndex: number) => void
  ) => {
    // Call the original resolver
    originalResolveLifeEvent(optionIndex);
    
    // Apply trait updates based on the decision
    // This is a simplified example - real implementation would be based on the event type
    // and the option chosen
    if (optionIndex === 0) {
      // Brave choice
      updatePlayerTrait('courage', Math.min(10, playerTraits.courage + 0.2));
    } else if (optionIndex === 1) {
      // Cautious choice  
      updatePlayerTrait('wisdom', Math.min(10, playerTraits.wisdom + 0.2));
    }
  };

  return {
    resolveLifeEvent
  };
};
