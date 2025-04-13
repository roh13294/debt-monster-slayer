
import React from 'react';

interface BattleEvent {
  name: string;
  description: string;
  effect: string;
  type: 'positive' | 'negative';
}

interface BattleEventsProps {
  events: BattleEvent[];
}

const BattleEvents: React.FC<BattleEventsProps> = ({ events }) => {
  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-sm font-medium text-slate-400">Recent Events</h3>
      <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
        {events.length > 0 ? (
          <div className="space-y-2">
            {events.map((event, index) => (
              <div 
                key={index} 
                className={`text-xs p-2 rounded border ${
                  event.type === 'positive' 
                    ? 'bg-green-950/30 border-green-800/30 text-green-400' 
                    : 'bg-red-950/30 border-red-800/30 text-red-400'
                }`}
              >
                <p className="font-bold">{event.name}</p>
                <p>{event.effect}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-1">No active events</p>
        )}
      </div>
    </div>
  );
};

export default BattleEvents;
