import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleData {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

// Particle for the headline
const Particle = ({
  x,
  y,
  size,
  opacity,
  isAssembled,
}: {
  x: number;
  y: number;
  size: number;
  opacity: number;
  isAssembled: boolean;
}) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: isAssembled
          ? `radial-gradient(circle, rgba(0, 255, 247, ${opacity}) 0%, rgba(0, 212, 255, ${opacity * 0.5}) 100%)`
          : `rgba(0, 212, 255, ${opacity * 0.7})`,
        boxShadow: isAssembled
          ? `0 0 ${size * 2}px rgba(0, 255, 247, ${opacity * 0.5})`
          : 'none',
      }}
      initial={{ scale: 0 }}
      animate={{
        scale: isAssembled ? [1, 1.2, 1] : 1,
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

export const ParticleHeadline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [isAssembled, setIsAssembled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create particles for "NEXUS-7"
    const text = 'NEXUS-7';
    const chars = text.split('');

    // Generate particles
    const newParticles: ParticleData[] = [];
    const particlesPerChar = 80;

    chars.forEach(() => {
      for (let i = 0; i < particlesPerChar; i++) {
        const angle = Math.random() * Math.PI * 2;
        const scatterRadius = Math.min(width, height);

        // Random scattered start position
        const startX = width / 2 + Math.cos(angle) * (Math.random() * scatterRadius);
        const startY = height / 2 + Math.sin(angle) * (Math.random() * scatterRadius);

        newParticles.push({
          x: startX,
          y: startY,
          size: 2 + Math.random() * 4,
          opacity: 0.5 + Math.random() * 0.5,
        });
      }
    });

    setParticles(newParticles);

    // Target particles that form the text
    const targetParticles: ParticleData[] = [];
    chars.forEach((_, charIndex) => {
      for (let i = 0; i < particlesPerChar; i++) {
        const charOffsetX = (charIndex - chars.length / 2 + 0.5) * 120;
        const jitterX = (Math.random() - 0.5) * 60;
        const jitterY = (Math.random() - 0.5) * 40;

        targetParticles.push({
          x: width / 2 + charOffsetX + jitterX,
          y: height / 2 + jitterY,
          size: 2 + Math.random() * 4,
          opacity: 0.5 + Math.random() * 0.5,
        });
      }
    });

    // Animate to positions
    let frame = 0;
    const animate = () => {
      frame++;
      setParticles(prev => prev.map((p, i) => {
        const target = targetParticles[i];
        if (!target) return p;

        const dx = target.x - p.x;
        const dy = target.y - p.y;
        const easing = 0.03;

        return {
          ...p,
          x: p.x + dx * easing,
          y: p.y + dy * easing,
        };
      }));

      if (frame < 120) {
        requestAnimationFrame(animate);
      } else {
        setIsAssembled(true);
      }
    };

    requestAnimationFrame(animate);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
    >
      {particles.map((particle, i) => (
        <Particle
          key={i}
          x={particle.x}
          y={particle.y}
          size={particle.size}
          opacity={particle.opacity}
          isAssembled={isAssembled}
        />
      ))}

      {/* Glowing center text overlay (reveals when assembled) */}
      <AnimatePresence>
        {isAssembled && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-7xl md:text-9xl lg:text-[12rem] font-orbitron font-black tracking-wider"
              initial={{ scale: 0.9, filter: 'blur(20px)' }}
              animate={{
                scale: 1,
                filter: 'blur(0px)',
              }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-glow-cyan text-white">NEXUS</span>
              <span className="text-nexus-blue">-7</span>
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
