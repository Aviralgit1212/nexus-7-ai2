import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScanLineSubheading = () => {
  const [revealed, setRevealed] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const subheading = 'Building the Cognitive Infrastructure of Tomorrow';

  useEffect(() => {
    // Start scan animation after headline assembles
    const scanDelay = setTimeout(() => {
      // Animate scan line
      let progress = 0;
      const scanInterval = setInterval(() => {
        progress += 2;
        setScanProgress(progress);

        // Calculate which characters should be visible
        const charIndex = Math.floor((progress / 100) * subheading.length);
        setVisibleChars(charIndex);

        if (progress >= 100) {
          clearInterval(scanInterval);
          setRevealed(true);
        }
      }, 30);

      return () => clearInterval(scanInterval);
    }, 2500);

    return () => clearTimeout(scanDelay);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-x-0 z-30 pointer-events-none"
      style={{ top: '60%' }}
    >
      {/* Scan line effect */}
      <AnimatePresence>
        {scanProgress > 0 && scanProgress < 100 && (
          <motion.div
            className="absolute left-0 right-0 h-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              background: `linear-gradient(90deg,
                transparent 0%,
                transparent ${Math.max(0, scanProgress - 10)}%,
                rgba(0, 255, 247, 0.1) ${scanProgress - 5}%,
                rgba(0, 255, 247, 0.3) ${scanProgress}%,
                rgba(0, 255, 247, 0.1) ${scanProgress + 5}%,
                transparent ${Math.min(100, scanProgress + 10)}%,
                transparent 100%
              )`,
            }}
          >
            {/* Scan line */}
            <motion.div
              className="absolute top-0 bottom-0 w-1"
              style={{
                left: `${scanProgress}%`,
                background: 'linear-gradient(to bottom, transparent, #00fff7, transparent)',
                boxShadow: '0 0 20px rgba(0, 255, 247, 0.5)',
              }}
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text container */}
      <div className="flex justify-center">
        <p className="text-xl md:text-2xl lg:text-3xl font-rajdhani text-center tracking-[0.3em] uppercase">
          {subheading.split('').map((char, index) => (
            <motion.span
              key={index}
              className="inline-block"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: index < visibleChars ? 1 : 0,
                y: index < visibleChars ? 0 : 10,
              }}
              transition={{
                duration: 0.1,
                delay: index * 0.02,
              }}
              style={{
                color: index < visibleChars ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                textShadow: index < visibleChars ? '0 0 10px rgba(0, 255, 247, 0.5)' : 'none',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </p>
      </div>

      {/* Glitch effect after reveal */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            className="absolute inset-0 flex justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-rajdhani text-center tracking-[0.3em] uppercase text-white/80">
              {subheading}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative lines */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-96 h-px mt-8"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: revealed ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0, 255, 247, 0.5), transparent)',
        }}
      />
    </div>
  );
};
