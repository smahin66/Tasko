import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFocusStore } from '../stores/focusStore';

interface TimerContextType {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  startTime: number | null;
  setDuration: (duration: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  adjustTime: (minutes: number) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [duration, setDuration] = useState(() => {
    const saved = localStorage.getItem('timer_duration');
    return saved ? parseInt(saved, 10) : 25 * 60;
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('timer_timeLeft');
    return saved ? parseInt(saved, 10) : duration;
  });
  const [isRunning, setIsRunning] = useState(() => {
    return localStorage.getItem('timer_isRunning') === 'true';
  });
  const [startTime, setStartTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('timer_startTime');
    return saved ? parseInt(saved, 10) : null;
  });

  const { addFocusMinutes } = useFocusStore();

  useEffect(() => {
    let interval: number;

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        const newTimeLeft = Math.max(0, timeLeft - 1);
        setTimeLeft(newTimeLeft);
        localStorage.setItem('timer_timeLeft', newTimeLeft.toString());

        // Si le timer atteint 0, ajouter les minutes au total
        if (newTimeLeft === 0) {
          const minutesCompleted = Math.floor(duration / 60);
          addFocusMinutes(minutesCompleted);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      localStorage.setItem('timer_isRunning', 'false');
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, duration, addFocusMinutes]);

  const startTimer = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    localStorage.setItem('timer_isRunning', 'true');
    localStorage.setItem('timer_startTime', Date.now().toString());
  };

  const pauseTimer = () => {
    setIsRunning(false);
    localStorage.setItem('timer_isRunning', 'false');
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
    setStartTime(null);
    localStorage.setItem('timer_isRunning', 'false');
    localStorage.setItem('timer_timeLeft', duration.toString());
    localStorage.setItem('timer_startTime', '');
  };

  const adjustTime = (minutes: number) => {
    const newTime = Math.max(0, timeLeft + (minutes * 60));
    setTimeLeft(newTime);
    if (!isRunning) {
      setDuration(newTime);
      localStorage.setItem('timer_duration', newTime.toString());
    }
    localStorage.setItem('timer_timeLeft', newTime.toString());
  };

  const handleSetDuration = (newDuration: number) => {
    setDuration(newDuration);
    setTimeLeft(newDuration);
    localStorage.setItem('timer_duration', newDuration.toString());
    localStorage.setItem('timer_timeLeft', newDuration.toString());
  };

  return (
    <TimerContext.Provider
      value={{
        duration,
        timeLeft,
        isRunning,
        startTime,
        setDuration: handleSetDuration,
        startTimer,
        pauseTimer,
        resetTimer,
        adjustTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};