
import React from 'react';
import { useEffect, useState } from 'react';

interface ParticleProps {
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

export const Particle = ({ x, y, size, color, duration, delay }: ParticleProps) => {
  return (
    <div 
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        opacity: 0,
        animation: `fadeInOut ${duration}s ease-in-out ${delay}s forwards`
      }}
    />
  );
};

interface ParticleEffectProps {
  count?: number;
  colors?: string[];
}

export const ParticleEffect = ({ count = 20, colors = ['#FCD34D', '#F59E0B', '#D97706'] }: ParticleEffectProps) => {
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 2 + 1,
        delay: Math.random() * 2
      });
    }
    setParticles(newParticles);
  }, [count, colors]);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => (
        <Particle key={index} {...particle} />
      ))}
    </div>
  );
};

interface EncounterBackdropProps {
  stance: string;
}

export const EncounterBackdrop = ({ stance }: EncounterBackdropProps) => {
  const getBackdropStyles = () => {
    switch (stance) {
      case 'aggressive':
        return {
          bgFrom: 'from-red-900/30',
          bgTo: 'to-orange-900/10',
          colors: ['#FCA5A5', '#FECACA', '#FEE2E2']
        };
      case 'defensive':
        return {
          bgFrom: 'from-blue-900/30',
          bgTo: 'to-cyan-900/10',
          colors: ['#93C5FD', '#BFDBFE', '#DBEAFE']
        };
      case 'risky':
        return {
          bgFrom: 'from-purple-900/30',
          bgTo: 'to-fuchsia-900/10',
          colors: ['#C4B5FD', '#DDD6FE', '#EDE9FE']
        };
      default:
        return {
          bgFrom: 'from-yellow-900/30',
          bgTo: 'to-amber-900/10',
          colors: ['#FCD34D', '#FBBF24', '#F59E0B']
        };
    }
  };
  
  const { bgFrom, bgTo, colors } = getBackdropStyles();
  
  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${bgFrom} ${bgTo}`}></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/5 via-transparent to-transparent"></div>
      <ParticleEffect colors={colors} />
    </>
  );
};
