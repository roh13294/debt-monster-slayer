
import React from 'react';
import { Coins } from 'lucide-react';

interface DemonCoinProps {
  amount?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const DemonCoin: React.FC<DemonCoinProps> = ({ 
  amount, 
  size = 'md', 
  showIcon = true 
}) => {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };

  // Format the amount properly, ensuring it's a number
  const formattedAmount = amount !== undefined && !isNaN(amount) 
    ? amount.toLocaleString() 
    : '';

  return (
    <div className="inline-flex items-center gap-1 font-medium">
      {showIcon && (
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500 rounded-full blur-sm opacity-30"></div>
          <div className="relative bg-gradient-to-br from-amber-500 to-red-600 rounded-full p-0.5 flex items-center justify-center">
            <Coins size={iconSizes[size]} className="text-yellow-100" />
            <div className="absolute inset-0 bg-black/10 rounded-full mix-blend-overlay"></div>
          </div>
        </div>
      )}
      <span className={`${sizeClasses[size]} bg-gradient-to-br from-yellow-400 to-amber-500 bg-clip-text text-transparent font-bold`}>
        {formattedAmount && `${formattedAmount} DemonCoins`}
      </span>
    </div>
  );
};

export default DemonCoin;
