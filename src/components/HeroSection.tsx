import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { AICore } from './AICore';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export const HeroSection = ({ onExploreClick }: HeroSectionProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Magnetic button effect
  const buttonRef1 = useRef<HTMLButtonElement>(null);
  const buttonRef2 = useRef<HTMLButtonElement>(null);

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
  }, [isLoaded]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen overflow-hidden bg-nexus-black"
    >
      {/* Animated cyber grid */}
      <div className="absolute inset-0 cyber-grid opacity-40" />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(5,5,5,0.8) 70%, rgba(5,5,5,1) 100%)',
        }}
      />

      {/* Fog effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          background: 'radial-gradient(circle at 50% 100%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)',
        }}
      />

      {/* Horizontal glow lines */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute h-px w-full left-0"
          style={{
            top: '30%',
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.2), transparent)',
          }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute h-px w-full left-0"
          style={{
            top: '70%',
            background: 'linear-gradient(90deg, transparent, rgba(0, 255, 247, 0.15), transparent)',
          }}
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* 3D AI Core */}
      <AICore />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4">
        {/* Top decoration */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-nexus-cyan/50" />
            <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-nexus-cyan/50" />
          </div>
        </motion.div>

        {/* Logo / Brand */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="w-20 h-20 mx-auto mb-8 relative">
            <motion.div
              className="absolute inset-0 rounded-full border border-nexus-cyan/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border border-nexus-blue/50"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-nexus-cyan/20 to-nexus-blue/20 flex items-center justify-center">
              <span className="text-nexus-cyan text-xl font-orbitron font-bold">N7</span>
            </div>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          ref={headlineRef}
          className="text-7xl md:text-9xl lg:text-[12rem] font-orbitron font-black text-center mb-6 tracking-wider"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <span className="text-glow-cyan">NEXUS</span>
          <span className="text-nexus-blue">-7</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          ref={subheadRef}
          className="text-xl md:text-2xl lg:text-3xl font-rajdhani text-center text-nexus-white/80 tracking-[0.3em] uppercase mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Building the Cognitive Infrastructure of Tomorrow
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
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
              transition={{ duration: 0.5 }}
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

        {/* Bottom scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
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
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none">
        <motion.div
          className="absolute top-4 left-4 w-20 h-20 border-l-2 border-t-2 border-nexus-cyan/20"
          initial={{ opacity: 0, x: -20, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        />
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none">
        <motion.div
          className="absolute top-4 right-4 w-20 h-20 border-r-2 border-t-2 border-nexus-cyan/20"
          initial={{ opacity: 0, x: 20, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none">
        <motion.div
          className="absolute bottom-4 left-4 w-20 h-20 border-l-2 border-b-2 border-nexus-cyan/20"
          initial={{ opacity: 0, x: -20, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none">
        <motion.div
          className="absolute bottom-4 right-4 w-20 h-20 border-r-2 border-b-2 border-nexus-cyan/20"
          initial={{ opacity: 0, x: 20, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        />
      </div>
    </div>
  );
};
