
import React from 'react';
import { AlertCircle, CreditCard, DollarSign, Lightbulb } from 'lucide-react';
import { useGameContext } from '../context/GameContext';

const LifeEvent: React.FC = () => {
  const { currentLifeEvent, resolveLifeEvent } = useGameContext();

  if (!currentLifeEvent) return null;

  // Determine the icon based on event title
  const getEventIcon = () => {
    const title = currentLifeEvent.title.toLowerCase();
    
    if (title.includes('bonus') || title.includes('money') || title.includes('cash') || title.includes('refund') || title.includes('inheritance')) {
      return <DollarSign className="h-6 w-6 text-green-600" />;
    } else if (title.includes('debt') || title.includes('loan') || title.includes('credit')) {
      return <CreditCard className="h-6 w-6 text-red-600" />;
    } else if (title.includes('opportunity') || title.includes('job') || title.includes('career')) {
      return <Lightbulb className="h-6 w-6 text-yellow-600" />;
    } else {
      return <AlertCircle className="h-6 w-6 text-yellow-600" />;
    }
  };

  // Determine option style based on effect
  const getOptionStyle = (option: typeof currentLifeEvent.options[0]) => {
    if (option.effect.cash && option.effect.cash > 0) {
      return "border-green-200 hover:border-green-300 hover:bg-green-50";
    } else if (option.effect.cash && option.effect.cash < 0) {
      return "border-red-200 hover:border-red-300 hover:bg-red-50";
    } else if (option.effect.debt) {
      return "border-purple-200 hover:border-purple-300 hover:bg-purple-50";
    } else if (option.effect.income && option.effect.income > 0) {
      return "border-blue-200 hover:border-blue-300 hover:bg-blue-50";
    } else {
      return "border-gray-200 hover:border-gray-300 hover:bg-gray-50";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-scale-in">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-yellow-100 rounded-full mr-3">
            {getEventIcon()}
          </div>
          <h2 className="text-xl font-bold">{currentLifeEvent.title}</h2>
        </div>
        
        <div className="my-4 p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800">
          <p>{currentLifeEvent.description}</p>
        </div>
        
        <div className="space-y-3">
          {currentLifeEvent.options.map((option, index) => (
            <button
              key={index}
              onClick={() => resolveLifeEvent(index)}
              className={`w-full text-left p-4 border rounded-xl transition-all duration-300 ${getOptionStyle(option)}`}
            >
              <div className="font-medium">{option.text}</div>
              <div className="text-sm text-gray-600 mt-1">{option.effect.description}</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {option.effect.cash && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    option.effect.cash > 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {option.effect.cash > 0 ? '+' : ''}{option.effect.cash} Cash
                  </span>
                )}
                {option.effect.debt && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                    +{option.effect.debt} Debt
                  </span>
                )}
                {option.effect.income && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                    {option.effect.income > 0 ? '+' : ''}{option.effect.income}/mo Income
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LifeEvent;
