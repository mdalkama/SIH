import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const CountdownTimer = ({ 
  targetDate, 
  title, 
  description, 
  type = 'deadline',
  className = '' 
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatTime = (time) => {
    if (time === undefined || time === null) return '00';
    return time.toString().padStart(2, '0');
  };

  const getTimerColor = () => {
    if (isExpired) return 'text-red-600';
    if (timeLeft.days === 0 && (timeLeft.hours || 0) < 24) return 'text-orange-600';
    return 'text-blue-600';
  };

  const getBgColor = () => {
    if (isExpired) return 'bg-red-50 border-red-200';
    if (timeLeft.days === 0 && (timeLeft.hours || 0) < 24) return 'bg-orange-50 border-orange-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getStatusIcon = () => {
    if (isExpired) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (type === 'completed') return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <Clock className="w-5 h-5 text-blue-600" />;
  };

  const getStatusText = () => {
    if (isExpired) return 'Expired';
    if (type === 'completed') return 'Completed';
    return 'Active';
  };

  return (
    <div className={`p-4 rounded-lg border ${getBgColor()} ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          isExpired ? 'bg-red-100 text-red-700' : 
          type === 'completed' ? 'bg-green-100 text-green-700' : 
          'bg-blue-100 text-blue-700'
        }`}>
          {getStatusText()}
        </span>
      </div>
      
      {description && (
        <p className="text-sm text-gray-600 mb-3">{description}</p>
      )}
      
      {!isExpired && (
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className={`text-2xl font-bold ${getTimerColor()}`}>
              {formatTime(timeLeft.days)}
            </div>
            <div className="text-xs text-gray-500">Days</div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className={`text-2xl font-bold ${getTimerColor()}`}>
              {formatTime(timeLeft.hours)}
            </div>
            <div className="text-xs text-gray-500">Hours</div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className={`text-2xl font-bold ${getTimerColor()}`}>
              {formatTime(timeLeft.minutes)}
            </div>
            <div className="text-xs text-gray-500">Minutes</div>
          </div>
          <div className="bg-white rounded-lg p-2 shadow-sm">
            <div className={`text-2xl font-bold ${getTimerColor()}`}>
              {formatTime(timeLeft.seconds)}
            </div>
            <div className="text-xs text-gray-500">Seconds</div>
          </div>
        </div>
      )}
      
      {isExpired && (
        <div className="text-center py-4">
          <p className="text-red-600 font-medium">This deadline has passed</p>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Target Date: {new Date(targetDate).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  );
};

export default CountdownTimer;
