import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Focus, Plane as Planet, Sparkles, Orbit } from 'lucide-react';
import { useFocusStore } from '../stores/focusStore';
import Card from '../components/ui/Card';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

const FocusPage: React.FC = () => {
  const { totalFocusMinutes } = useFocusStore();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [planets, setPlanets] = useState<number>(0);

  // Générer des particules initiales
  useEffect(() => {
    const particleCount = Math.min(50 + Math.floor(totalFocusMinutes / 2), 200);
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setParticles(newParticles);
  }, [totalFocusMinutes]);

  // Mettre à jour le nombre de planètes en fonction du temps
  useEffect(() => {
    const newPlanets = Math.floor(totalFocusMinutes / 15);
    setPlanets(Math.min(newPlanets, 5));
  }, [totalFocusMinutes]);

  // Animation des particules
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          y: (particle.y - particle.speed * 0.1) % 100,
          opacity: Math.sin(Date.now() / 1000 * particle.speed) * 0.3 + 0.5
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-violet-50 via-violet-50/50 to-violet-50 dark:from-violet-950 dark:via-violet-900 dark:to-violet-950">
      {/* Particules d'étoiles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute"
            animate={{
              opacity: particle.opacity,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: particle.speed * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
          >
            <div className="w-full h-full rounded-full bg-violet-300 dark:bg-violet-400" />
          </motion.div>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-violet-100 dark:bg-violet-900/30 p-2.5 rounded-xl">
              <Focus className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-violet-900 dark:text-violet-100">
                Mode Focus
              </h1>
              <p className="text-violet-600 dark:text-violet-300">
                Votre univers grandit avec votre concentration
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-violet-100 dark:bg-violet-900/30 px-4 py-2 rounded-xl">
            <Star className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <span className="text-violet-900 dark:text-violet-100 font-medium">
              {totalFocusMinutes} minutes
            </span>
          </div>
        </div>

        {/* Système solaire */}
        <div className="relative h-[500px] flex items-center justify-center">
          {/* Soleil central */}
          <motion.div
            className="absolute"
            animate={{
              scale: [1, 1.1, 1],
              rotate: 360
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 dark:from-violet-500 dark:to-violet-700 shadow-lg shadow-violet-500/20">
              <Sparkles className="w-12 h-12 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>

          {/* Planètes */}
          {Array.from({ length: planets }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute"
              initial={{ scale: 0 }}
              animate={{
                scale: 1,
                rotate: 360
              }}
              transition={{
                duration: 20 + index * 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                width: `${300 + index * 100}px`,
                height: `${300 + index * 100}px`,
              }}
            >
              {/* Orbite */}
              <div className="absolute inset-0 rounded-full border-2 border-violet-200/20 dark:border-violet-700/20" />
              
              {/* Planète */}
              <motion.div
                className="absolute"
                animate={{
                  rotate: -360
                }}
                transition={{
                  duration: 20 + index * 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-300 to-violet-500 dark:from-violet-400 dark:to-violet-600 
                           shadow-lg shadow-violet-500/20 flex items-center justify-center"
                  style={{
                    transform: `translate(${150 + index * 50}px, 0)`
                  }}
                >
                  <Planet className="w-4 h-4 text-white" />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Statistiques */}
        <Card glass className="p-6 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-violet-900 dark:text-violet-100">
              Progression cosmique
            </h2>
            <div className="flex items-center space-x-2">
              <Orbit className="w-5 h-5 text-violet-500 dark:text-violet-400" />
              <span className="text-violet-600 dark:text-violet-300 font-medium">
                {planets} planètes
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-violet-600 dark:text-violet-300">
                Prochaine planète dans
              </span>
              <span className="text-violet-900 dark:text-violet-100 font-medium">
                {15 - (totalFocusMinutes % 15)} minutes
              </span>
            </div>

            <div className="h-2 bg-violet-100 dark:bg-violet-900/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-violet-400"
                initial={{ width: 0 }}
                animate={{ width: `${(totalFocusMinutes % 15) / 15 * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FocusPage;