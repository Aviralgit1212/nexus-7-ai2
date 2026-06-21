import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('INITIALIZING');

  useEffect(() => {
    const texts = ['INITIALIZING', 'LOADING CORE', 'CALIBRATING SYSTEMS', 'READY'];

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        const increment = Math.random() * 15 + 5;
        const newProgress = Math.min(prev + increment, 100);

        const textIndex = Math.min(Math.floor(newProgress / 25), 3);
        setText(texts[textIndex]);

        return newProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] bg-nexus-black flex flex-col items-center justify-center"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Animated grid background */}
        <div className="absolute inset-0 cyber-grid opacity-30" />

        {/* Scan line effect */}
        <div className="absolute inset-0 scan-line" />

        {/* Center content */}
        <div className="relative z-10 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-6xl md:text-8xl font-orbitron font-bold text-glow-cyan">
              NEXUS-7
            </h1>
            <div className="h-1 w-48 mx-auto mt-4 bg-gradient-to-r from-transparent via-nexus-cyan to-transparent" />
          </motion.div>

          {/* Progress container */}
          <div className="w-80 mx-auto">
            {/* Progress bar */}
            <div className="relative h-1 bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-nexus-blue via-nexus-cyan to-nexus-blue"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              />
              {/* Glow effect */}
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-4 bg-nexus-cyan/50 blur-md"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>

            {/* Status text */}
            <motion.div
              className="flex justify-between text-xs font-rajdhani tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-nexus-blue">{text}</span>
              <span className="text-nexus-cyan">{Math.floor(progress)}%</span>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="flex justify-center gap-4 mt-12">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-nexus-cyan"
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-nexus-cyan/30" />
        <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-nexus-cyan/30" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-nexus-cyan/30" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-nexus-cyan/30" />
      </motion.div>
    </AnimatePresence>
  );
};
