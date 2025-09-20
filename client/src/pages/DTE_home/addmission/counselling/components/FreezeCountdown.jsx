import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

const AnimatedNumber = ({ value, label }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const [isDecreasing, setIsDecreasing] = useState(false);

  useEffect(() => {
    if (parseInt(prevValueRef.current) !== parseInt(value)) {
      setIsDecreasing(parseInt(value) < parseInt(prevValueRef.current));
      prevValueRef.current = value;
      
      // Add animation class and remove it after animation completes
      const element = document.getElementById(`time-${label}`);
      if (element) {
        element.classList.add('animate-countdown');
        setTimeout(() => {
          element.classList.remove('animate-countdown');
          setDisplayValue(value);
        }, 300);
      }
    }
  }, [value, label]);

  return (
    <span className="inline-flex flex-col items-center mx-1">
      <span 
        id={`time-${label}`}
        className={`inline-block min-w-[24px] text-center transition-all duration-300 ${isDecreasing ? 'text-red-600' : 'text-current'}`}
      >
        {displayValue}
      </span>
      <span className="text-[10px] text-gray-500 -mt-1">{label}</span>
    </span>
  );
};

const FreezeCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ 
    days: '02', 
    hours: '00', 
    minutes: '00',
    seconds: '00' 
  });

  useEffect(() => {
    // Set the target time to exactly 48 hours from now
    const targetTime = Date.now() + (48 * 60 * 60 * 1000);
    
    const updateTimer = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      // Calculate time components
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    };

    // Initial call
    updateTimer();
    
    // Update every second
    const timerId = setInterval(updateTimer, 1000);

    // Cleanup
    return () => clearInterval(timerId);
  }, []);

  const isUrgent = timeLeft.days === '00' && timeLeft.hours < '24';

  return (
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-600' : 'text-blue-600'}`} />
          <p className={`text-sm font-medium ${isUrgent ? 'text-red-800' : 'text-blue-800'}`}>
            Freeze Window
          </p>
        </div>
        <div 
          className={`flex items-center justify-center text-xl font-bold font-mono ${
            isUrgent ? 'text-red-700' : 'text-blue-900'
          }`}
        >
          {timeLeft.days !== '00' && (
            <>
              <AnimatedNumber value={timeLeft.days} label="days" />
              <span className="text-gray-400">:</span>
            </>
          )}
          <AnimatedNumber value={timeLeft.hours} label="hours" />
          <span className="text-gray-400">:</span>
          <AnimatedNumber value={timeLeft.minutes} label="min" />
          <span className="text-gray-400">:</span>
          <AnimatedNumber value={timeLeft.seconds} label="sec" />
        </div>
        {isUrgent && (
          <p className="text-xs text-red-600 mt-2 font-medium">
            Hurry! Time is running out
          </p>
        )}
      </div>
      <style>{`
        @keyframes countdown {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-5px); opacity: 0.5; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-countdown {
          animation: countdown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FreezeCountdown;
