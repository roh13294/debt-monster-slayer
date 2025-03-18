
import React, { useEffect, useRef } from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
  label?: string;
  showValue?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-primary',
  label,
  showValue = true,
  className = '',
}) => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.setProperty('--progress-width', `${progress}%`);
    }
  }, [progress]);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-foreground/80">{label}</span>
          {showValue && <span className="text-sm font-medium text-foreground/60">{progress.toFixed(0)}%</span>}
        </div>
      )}
      <div className="progress-container">
        <div
          ref={progressRef}
          className={`progress-bar ${color}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
