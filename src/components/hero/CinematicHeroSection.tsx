import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { HeroScene } from './HeroScene';
import { ParticleHeadline } from './ParticleHeadline';
import { ScanLineSubheading } from './ScanLineSubheading';

interface CinematicHeroSectionProps {
  onExploreClick: () => void;
}

export const CinematicHeroSection = ({ onExploreClick }: CinematicHeroSectionProps) => {
  const buttonRef1 = useRef<HTMLButtonElement>(null);
  const buttonRef2 = useRef<HTMLButtonElement>(null);

  // Magnetic button effect
  useEffect(() => {
    const buttons = [buttonRef1.current, buttonRef2.current].filter(Boolean);

    buttons.forEach(button => {
      if (!button) return;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(button, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
        });
      };

      button.addEventListener('mousemove', handleMouseMove);
      button.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        button.removeEventListener('mousemove', handleMouseMove);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-nexus-black">
      {/* Three.js Scene */}
      <HeroScene />

      {/* Particle-assembled headline */}
      <ParticleHeadline />

      {/* Scan-line subheading */}
      <ScanLineSubheading />

      {/* Buttons */}
      <motion.div
        className="absolute z-30 flex flex-col sm:flex-row gap-6"
        style={{ bottom: '15%', left: '50%', transform: 'translateX(-50%)' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3.5 }}
      >
        <button
          ref={buttonRef1}
          data-hover
          className="relative px-12 py-4 rounded-full font-orbitron text-sm tracking-wider uppercase transition-all duration-300 group overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2 text-nexus-black">
            Access Future
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-nexus-cyan to-nexus-blue"
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 0.5, delay: 3.6 }}
          />
          <div className="absolute inset-0 bg-nexus-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: '0 0 30px rgba(0, 255, 247, 0.5), 0 0 60px rgba(0, 255, 247, 0.3)',
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </button>

        <button
          ref={buttonRef2}
          data-hover
          onClick={onExploreClick}
          className="relative px-12 py-4 rounded-full font-orbitron text-sm tracking-wider uppercase border border-nexus-cyan/50 text-nexus-cyan overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2">
            Explore Systems
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ↓
            </motion.span>
          </span>
          <div className="absolute inset-0 bg-nexus-cyan/5 group-hover:bg-nexus-cyan/10 transition-colors duration-300" />
          <motion.div
            className="absolute inset-0 border border-nexus-cyan rounded-full"
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </button>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={onExploreClick}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-rajdhani tracking-[0.3em] text-nexus-cyan/50 uppercase">
            Scroll
          </span>
          <div className="w-6 h-10 rounded-full border border-nexus-cyan/30 flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 rounded-full bg-nexus-cyan"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Corner decorations */}
      <>
        <motion.div
          className="absolute top-0 left-0 w-32 h-32 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.8 }}
        >
          <div className="absolute top-4 left-4 w-20 h-20 border-l-2 border-t-2 border-nexus-cyan/20" />
        </motion.div>
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.9 }}
        >
          <div className="absolute top-4 right-4 w-20 h-20 border-r-2 border-t-2 border-nexus-cyan/20" />
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
        >
          <div className="absolute bottom-4 left-4 w-20 h-20 border-l-2 border-b-2 border-nexus-cyan/20" />
        </motion.div>
        <motion.div
          className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.1 }}
        >
          <div className="absolute bottom-4 right-4 w-20 h-20 border-r-2 border-b-2 border-nexus-cyan/20" />
        </motion.div>
      </>
    </div>
  );
};
