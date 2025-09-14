import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, LogOut } from 'lucide-react';

const SessionTimer = ({ 
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

  const getBackgroundColor = () => {
    if (timeLeft <= 300) return 'bg-red-50 border-red-200'; // 5 minutes
    if (timeLeft <= 600) return 'bg-orange-50 border-orange-200'; // 10 minutes
    return 'bg-green-50 border-green-200';
  };

  if (!isActive) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 ${getBackgroundColor()} border-2 rounded-lg p-3 shadow-lg`}>
      <div className="flex items-center space-x-2">
        <Clock size={20} className={getTimerColor()} />
        <div className="text-sm">
          <div className="font-medium text-gray-700">Session Time</div>
          <div className={`text-lg font-bold ${getTimerColor()}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        {showWarning && (
          <AlertTriangle size={20} className="text-red-500 animate-pulse" />
        )}
      </div>
      
      {showWarning && (
        <div className="mt-2 text-xs text-red-600 font-medium">
          ⚠️ Session expiring soon!
        </div>
      )}
    </div>
  );
};

export default SessionTimer;
