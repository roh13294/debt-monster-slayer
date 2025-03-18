
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useGameContext } from '../context/GameContext';

const LifeEvent: React.FC = () => {
  const { currentLifeEvent, resolveLifeEvent } = useGameContext();

  if (!currentLifeEvent) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-scale-in">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-yellow-100 rounded-full mr-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold">{currentLifeEvent.title}</h2>
        </div>
        
        <p className="mb-6 text-gray-700">{currentLifeEvent.description}</p>
        
        <div className="space-y-3">
          {currentLifeEvent.options.map((option, index) => (
            <button
              key={index}
              onClick={() => resolveLifeEvent(index)}
              className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <div className="font-medium">{option.text}</div>
              <div className="text-sm text-gray-500 mt-1">{option.effect.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LifeEvent;
