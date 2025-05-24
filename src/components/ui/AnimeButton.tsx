
import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';

interface AnimeButtonProps extends ButtonProps {
  variant?: 'demon' | 'flame' | 'spirit' | 'lightning' | 'shadow';
  glowing?: boolean;
  dramatic?: boolean;
}

const AnimeButton: React.FC<AnimeButtonProps> = ({
  children,
  variant = 'demon',
  glowing = false,
  dramatic = false,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'demon':
        return 'demon-button';
      case 'flame':
        return 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600';
      case 'spirit':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600';
      case 'lightning':
        return 'bg-gradient-to-r from-yellow-500 to-purple-500 hover:from-yellow-600 hover:to-purple-600';
      case 'shadow':
        return 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600';
      default:
        return 'demon-button';
    }
  };

  if (dramatic) {
    return (
      <motion.button
        className={`${getVariantClasses()} text-white font-bold px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 ${className}`}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {glowing && (
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-50"
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 45, 85, 0.4)',
                '0 0 40px rgba(255, 45, 85, 0.6)',
                '0 0 20px rgba(255, 45, 85, 0.4)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    );
  }

  return (
    <Button
      className={`${getVariantClasses()} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default AnimeButton;
