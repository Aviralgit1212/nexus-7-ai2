import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { Brain, Cpu, Eye, Database } from 'lucide-react';

const systems = [
  {
    icon: Brain,
    title: 'Autonomous Agents',
    description: 'Self-evolving AI entities capable of independent decision-making and adaptive learning.',
    color: '#00fff7',
  },
  {
    icon: Cpu,
    title: 'Cognitive Systems',
    description: 'Neural architectures that process information with unprecedented depth and context.',
    color: '#00d4ff',
  },
  {
    icon: Eye,
    title: 'Predictive Intelligence',
    description: 'Advanced forecasting models that anticipate needs before they manifest.',
    color: '#a855f7',
  },
  {
    icon: Database,
    title: 'Neural Infrastructure',
    description: 'Distributed computing networks optimized for AI model deployment.',
    color: '#00fff7',
  },
];

const SystemCard = ({ system, index }: { system: typeof systems[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, margin: '-100px' });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      gsap.to(card, {
        rotateX,
        rotateY,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      });

      // Dynamic glow position
      const glow = card.querySelector('.card-glow') as HTMLElement;
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}px ${y}px, ${system.color}15 0%, transparent 50%)`;
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [system.color]);

  return (
    <motion.div
      ref={cardRef}
      data-hover
      className="relative group"
      initial={{ opacity: 0, y: 100, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15, ease: 'easeOut' }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Card */}
      <div className="relative h-80 glass rounded-2xl overflow-hidden border border-white/10 hover:border-nexus-cyan/30 transition-colors duration-500">
        {/* Dynamic glow */}
        <div className="card-glow absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${system.color}00 40%, ${system.color}50 50%, ${system.color}00 60%)`,
            backgroundSize: '300% 300%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col p-8">
          {/* Icon */}
          <div className="mb-6">
            <motion.div
              className="relative w-16 h-16 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${system.color}10 0%, ${system.color}05 100%)`,
                boxShadow: `0 0 30px ${system.color}20`,
              }}
              animate={{
                boxShadow: [
                  `0 0 20px ${system.color}20`,
                  `0 0 40px ${system.color}30`,
                  `0 0 20px ${system.color}20`,
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <system.icon size={32} style={{ color: system.color }} />
            </motion.div>
          </div>

          {/* Title */}
          <h3
            className="text-2xl font-orbitron font-bold mb-4"
            style={{ color: system.color }}
          >
            {system.title}
          </h3>

          {/* Description */}
          <p className="text-white/60 font-rajdhani text-lg leading-relaxed flex-grow">
            {system.description}
          </p>

          {/* Bottom decoration */}
          <div className="flex items-center gap-2 mt-4">
            <motion.div
              className="h-1 flex-1 rounded-full"
              style={{ background: `linear-gradient(90deg, ${system.color}, transparent)` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
            />
            <span className="text-xs font-orbitron tracking-wider text-white/30">SYS.{index + 1}</span>
          </div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ background: system.color }}
              initial={{
                x: `${20 + i * 30}%`,
                y: '100%',
                opacity: 0,
              }}
              animate={{
                y: '0%',
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.7,
                ease: 'linear',
              }}
            />
          ))}
        </div>

        {/* Scan line effect */}
        <motion.div
          className="absolute left-0 right-0 h-px opacity-30"
          style={{ background: `linear-gradient(90deg, transparent, ${system.color}, transparent)` }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
};

export const AISystemsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-200px' });

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-nexus-black">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #00fff7 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          {/* Decorative line */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-nexus-cyan/50" />
            <div className="w-2 h-2 rounded-full bg-nexus-cyan" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-nexus-cyan/50" />
          </motion.div>

          <motion.span
            className="inline-block text-sm font-orbitron tracking-[0.3em] text-nexus-blue mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            CAPABILITIES
          </motion.span>

          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <span className="text-white">AI Beyond</span>
            <span className="gradient-text"> Software</span>
          </motion.h2>

          <motion.p
            className="text-xl font-rajdhani text-white/50 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            Next-generation cognitive systems that transcend traditional computing boundaries
          </motion.p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systems.map((system, index) => (
            <SystemCard key={system.title} system={system} index={index} />
          ))}
        </div>

        {/* Bottom stats */}
        <motion.div
          className="mt-20 flex justify-center items-center gap-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
        >
          {[
            { value: '99.97%', label: 'Accuracy Rate' },
            { value: '0.3ms', label: 'Response Time' },
            { value: '10PB', label: 'Data Processed' },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <motion.div
                className="text-3xl md:text-4xl font-orbitron font-bold text-nexus-cyan"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm font-rajdhani text-white/50 mt-2">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-nexus-cyan/50 to-transparent" />
      </motion.div>
    </section>
  );
};
