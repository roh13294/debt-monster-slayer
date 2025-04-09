
import React from 'react';
import { motion } from 'framer-motion';

interface EnergyWaveProps {
  color?: string;
  duration?: number;
}

export const EnergyWave: React.FC<EnergyWaveProps> = ({ 
  color = 'rgba(255, 165, 0, 0.5)', 
  duration = 1.5 
}) => {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
    >
      <motion.div
        className="absolute rounded-full"
        initial={{ width: 0, height: 0, opacity: 0.7 }}
        animate={{ 
          width: ["0%", "150%"], 
          height: ["0%", "150%"], 
          opacity: [0.7, 0] 
        }}
        transition={{ duration, ease: "easeOut" }}
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
};

interface AnimatedSlashProps {
  direction?: 'diagonal' | 'horizontal' | 'vertical';
  color?: string;
}

export const AnimatedSlash: React.FC<AnimatedSlashProps> = ({ 
  direction = 'diagonal', 
  color = '#fff' 
}) => {
  const getPathData = () => {
    switch (direction) {
      case 'horizontal':
        return "M10,50 L90,50";
      case 'vertical':
        return "M50,10 L50,90";
      default: // diagonal
        return "M10,10 L90,90";
    }
  };
  
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
      >
        <motion.path
          d={getPathData()}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 0.5, times: [0, 0.2, 0.8, 1] }}
        />
      </svg>
    </div>
  );
};

interface ElementalBurstProps {
  elementType: 'fire' | 'water' | 'thunder' | 'wind';
}

export const ElementalBurst: React.FC<ElementalBurstProps> = ({ elementType }) => {
  const getElementColor = () => {
    switch (elementType) {
      case 'fire': return 'rgba(255, 59, 48, 0.7)';
      case 'water': return 'rgba(0, 122, 255, 0.7)';
      case 'thunder': return 'rgba(255, 204, 0, 0.7)';
      case 'wind': return 'rgba(52, 199, 89, 0.7)';
      default: return 'rgba(255, 255, 255, 0.7)';
    }
  };
  
  const burstVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: [0, 1.5, 0.8, 1.2, 0.9, 1.1, 1],
      opacity: [0, 0.8, 0.4, 0.9, 0.5, 0.7, 0],
      transition: { duration: 1.5, times: [0, 0.2, 0.3, 0.5, 0.7, 0.9, 1] }
    }
  };
  
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
    >
      <motion.div
        className="absolute rounded-full"
        variants={burstVariants}
        initial="hidden"
        animate="visible"
        style={{ 
          backgroundColor: getElementColor(),
          width: "300px", 
          height: "300px",
          boxShadow: `0 0 100px ${getElementColor()}`
        }}
      />
      
      {/* Particles */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, times: [0, 0.3, 1] }}
      >
        {Array.from({ length: 20 }).map((_, i) => {
          const randomX = Math.random() * 200 - 100;
          const randomY = Math.random() * 200 - 100;
          const size = Math.random() * 10 + 5;
          
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                backgroundColor: getElementColor(),
                width: size,
                height: size,
                left: "calc(50% - 5px)",
                top: "calc(50% - 5px)"
              }}
              animate={{
                x: [0, randomX],
                y: [0, randomY],
                opacity: [1, 0]
              }}
              transition={{ duration: Math.random() * 0.5 + 0.5 }}
            />
          );
        })}
      </motion.div>
    </motion.div>
  );
};

interface ScreenShakeProps {
  intensity?: number;
  duration?: number;
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({ 
  intensity = 5, 
  duration = 0.5 
}) => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-10"
      animate={{ 
        x: [0, -intensity, intensity, -intensity, intensity, 0],
        y: [0, intensity, -intensity, intensity, -intensity, 0]
      }}
      transition={{ 
        duration, 
        times: [0, 0.2, 0.4, 0.6, 0.8, 1] 
      }}
    />
  );
};
