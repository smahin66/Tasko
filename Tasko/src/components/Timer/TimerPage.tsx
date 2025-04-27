import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Maximize2, Minimize2, Play, Pause, RotateCcw, Settings, Plus, Minus } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useTimer } from '../../contexts/TimerContext';

interface TimerPageProps {
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const TimerPage: React.FC<TimerPageProps> = ({ 
  isFullscreen = false,
  onToggleFullscreen 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const {
    duration,
    timeLeft,
    isRunning,
    setDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    adjustTime
  } = useTimer();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className={`
      ${isFullscreen ? 'fixed inset-0 z-50 bg-gradient-to-br from-violet-50 via-violet-50/50 to-violet-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900' : ''}
      flex flex-col items-center justify-center p-6
    `}>
      <Card glass className="w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Timer className="w-6 h-6 text-violet-500 mr-2" />
            <h2 className="text-xl font-semibold text-violet-900 dark:text-violet-100">
              Timer
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-5 h-5" />
            </Button>
            {onToggleFullscreen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showSettings ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-violet-700 dark:text-violet-300 mb-2">
                  Durée (minutes)
                </label>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDuration = Math.max(1, Math.floor(duration / 60) - 1) * 60;
                      setDuration(newDuration);
                    }}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <input
                    type="number"
                    value={Math.floor(duration / 60)}
                    onChange={(e) => {
                      const newDuration = Math.max(1, parseInt(e.target.value)) * 60;
                      setDuration(newDuration);
                    }}
                    className="w-24 px-4 py-2 text-center bg-violet-50 dark:bg-violet-900/30 border-2 border-violet-200 dark:border-violet-700 rounded-xl"
                    min="1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newDuration = (Math.floor(duration / 60) + 1) * 60;
                      setDuration(newDuration);
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="relative w-48 h-48 mx-auto mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-violet-200 dark:text-violet-900"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                    className="text-violet-500 dark:text-violet-400 transition-all duration-200"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-2">
                    <span className="text-4xl font-bold text-violet-900 dark:text-violet-100">
                      {formatTime(timeLeft)}
                    </span>
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => adjustTime(-1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => adjustTime(1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                {!isRunning ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={startTimer}
                    leftIcon={<Play className="w-5 h-5" />}
                  >
                    Démarrer
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={pauseTimer}
                    leftIcon={<Pause className="w-5 h-5" />}
                  >
                    Pause
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={resetTimer}
                  leftIcon={<RotateCcw className="w-5 h-5" />}
                >
                  Réinitialiser
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default TimerPage;