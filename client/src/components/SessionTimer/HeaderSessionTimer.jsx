import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

const HeaderSessionTimer = ({ 
  initialTime = 1800, // 30 minutes in seconds
  onSessionExpire, 
  isActive = true,
  showWarningAt = 300 // Show warning when 5 minutes left
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        
        // Show warning when time is running low
        if (newTime <= showWarningAt && !showWarning) {
          setShowWarning(true);
        }
        
        // Session expired
        if (newTime <= 0) {
          clearInterval(interval);
          onSessionExpire();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onSessionExpire, showWarningAt, showWarning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 300) return 'text-red-600'; // 5 minutes
    if (timeLeft <= 600) return 'text-orange-600'; // 10 minutes
    return 'text-green-600';
  };

  if (!isActive) return null;

  return (
    <div className="text-center">
      <div className="flex items-center justify-center space-x-1 mb-1">
        <Clock size={14} className={getTimerColor()} />
        <span className="text-xs font-medium text-gray-600">Session Time</span>
        {showWarning && (
          <AlertTriangle size={12} className="text-red-500 animate-pulse" />
        )}
      </div>
      <div className={`text-lg font-bold ${getTimerColor()}`}>
        {formatTime(timeLeft)}
      </div>
      {showWarning && (
        <div className="text-xs text-red-600 font-medium mt-1">
          ⚠️ Expiring soon!
        </div>
      )}
    </div>
  );
};

export default HeaderSessionTimer;
