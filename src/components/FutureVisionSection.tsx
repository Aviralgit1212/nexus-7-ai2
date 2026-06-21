import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll } from 'framer-motion';

const visionStatements = [
  {
    text: 'The Future Is Not Waiting.',
    subtext: 'It is being engineered.',
    color: '#00fff7',
  },
  {
    text: 'Intelligence Will Become Infrastructure.',
    subtext: 'As essential as electricity, as ubiquitous as air.',
    color: '#00d4ff',
  },
  {
    text: 'Tomorrow Is Being Engineered Today.',
    subtext: 'Every line of code, a step toward the inevitable.',
    color: '#a855f7',
  },
];

const AnimatedText = ({
  text,
  color,
  subtext,
  index,
}: {
  text: string;
  color: string;
  subtext: string;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: '-100px' });
  const words = text.split(' ');
  const subWords = subtext.split(' ');

  return (
    <motion.div
      ref={ref}
      className="h-screen flex flex-col items-center justify-center relative"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Main text */}
      <div className="overflow-hidden">
        <motion.h2
          className="text-4xl md:text-6xl lg:text-8xl font-orbitron font-black text-center leading-tight"
          style={{ color }}
          initial={{ y: '100%' }}
          animate={isInView ? { y: 0 } : { y: '100%' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {words.map((word, i) => (
            <span key={i} className="inline-block mr-4">
              <motion.span
                className="inline-block"
                initial={{ y: 100, rotateX: -90 }}
                animate={isInView ? { y: 0, rotateX: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>
      </div>

      {/* Subtext */}
      <div className="overflow-hidden mt-4">
        <motion.p
          className="text-lg md:text-xl lg:text-2xl font-rajdhani text-white/50 text-center"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {subWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-2"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 + 0.8 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute left-10 top-1/2 -translate-y-1/2 text-xs font-orbitron tracking-widest opacity-30"
        style={{ color }}
        animate={{ opacity: isInView ? [0.2, 0.4, 0.2] : 0.2 }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="transform -rotate-90">{`0${index + 1}`}</div>
      </motion.div>

      <motion.div
        className="absolute right-10 top-1/2 -translate-y-1/2 text-xs font-orbitron tracking-widest opacity-30"
        style={{ color }}
        animate={{ opacity: isInView ? [0.2, 0.4, 0.2] : 0.2 }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        <div className="transform rotate-90">2045</div>
      </motion.div>

      {/* Glitch line */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        animate={{
          top: ['0%', '100%'],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
};

// Text scramble effect
const TextScramble = ({ text, isActive }: { text: string; isActive: boolean }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) return text[index];
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text, isActive]);

  return <span>{displayText}</span>;
};

export const FutureVisionSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', latest => {
      const progress = latest;
      const index = Math.min(Math.floor(progress * visionStatements.length), visionStatements.length - 1);
      setActiveIndex(index);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section ref={containerRef} className="relative bg-nexus-black" id="vision">
      {/* Progress indicator */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <div className="flex flex-col gap-2">
          {visionStatements.map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-8 rounded-full"
              style={{
                background: i <= activeIndex ? visionStatements[i].color : 'rgba(255,255,255,0.1)',
              }}
              animate={{ scale: i === activeIndex ? 1.3 : 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-full h-full"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${visionStatements[activeIndex].color}15 0%, transparent 50%)`,
          }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute inset-0 cyber-grid opacity-20" />
      </div>

      {/* Statements */}
      <div className="relative">
        {visionStatements.map((statement, i) => (
          <AnimatedText
            key={i}
            text={statement.text}
            color={statement.color}
            subtext={statement.subtext}
            index={i}
          />
        ))}
      </div>

      {/* Final call to action */}
      <motion.div
        className="h-screen flex flex-col items-center justify-center relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="text-center mb-12"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            className="text-lg md:text-xl font-rajdhani text-white/50 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            ARE YOU READY TO STEP INTO TOMORROW?
          </motion.p>

          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold text-center gradient-text"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <TextScramble text="JOIN NEXUS-7" isActive={true} />
          </motion.h2>
        </motion.div>

        {/* Decorative rings */}
        <div className="relative w-40 h-40">
          <motion.div
            className="absolute inset-0 rounded-full border border-nexus-cyan/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border border-nexus-blue/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-8 rounded-full border border-nexus-purple/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-16 h-16 rounded-full bg-nexus-cyan/20 flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(0, 255, 247, 0.3)',
                  '0 0 40px rgba(0, 255, 247, 0.5)',
                  '0 0 20px rgba(0, 255, 247, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-nexus-cyan text-2xl font-orbitron font-bold">→</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
