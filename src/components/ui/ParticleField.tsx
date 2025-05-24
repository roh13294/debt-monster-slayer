
import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
  color: string;
}

interface ParticleFieldProps {
  count?: number;
  colors?: string[];
  className?: string;
}

const ParticleField: React.FC<ParticleFieldProps> = ({ 
  count = 15, 
  colors = ['#ff2d55', '#ff9500', '#6366f1'],
  className = ''
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 6,
        size: 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    
    setParticles(newParticles);
  }, [count, colors]);

  return (
    <div className={`particle-container ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle absolute rounded-full opacity-70"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${particle.color}80, transparent)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${6 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );
};

export default ParticleField;
