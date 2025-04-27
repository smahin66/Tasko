import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const SplashScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-violet-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity
          }}
          className="inline-block mb-4"
        >
          <CheckCircle className="w-16 h-16 text-violet-500 dark:text-violet-400" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-semibold gradient-text mb-2"
        >
          Tasko
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 dark:text-gray-400"
        >
          Organisez votre journée efficacement
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;