import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { Sun, Shield, Orbit, Star, ArrowUpRight, Eye, Zap } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  color: string;
  icon: React.ElementType;
  year: string;
}

const projects: Project[] = [
  {
    id: 'helios',
    name: 'Project Helios',
    description: 'Solar-powered AI compute clusters for sustainable intelligence at planetary scale.',
    status: 'In Development',
    progress: 67,
    color: '#f59e0b',
    icon: Sun,
    year: '2043',
  },
  {
    id: 'sentinel',
    name: 'Project Sentinel',
    description: 'Autonomous threat detection and neutralization systems for global security.',
    status: 'Active',
    progress: 94,
    color: '#ef4444',
    icon: Shield,
    year: '2044',
  },
  {
    id: 'orion',
    name: 'Project Orion',
    description: 'Deep space AI relay networks for extending cognitive infrastructure beyond Earth.',
    status: 'In Development',
    progress: 45,
    color: '#8b5cf6',
    icon: Orbit,
    year: '2045',
  },
  {
    id: 'titan',
    name: 'Project Titan',
    description: 'Molecular-scale neural processors for next-generation artificial consciousness.',
    status: 'Research Phase',
    progress: 23,
    color: '#00fff7',
    icon: Star,
    year: '2046',
  },
];

const ProjectCard = ({
  project,
  index,
  onHover,
  onLeave,
  isHovered,
}: {
  project: Project;
  index: number;
  onHover: () => void;
  onLeave: () => void;
  isHovered: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, margin: '-50px' });
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });

      gsap.to(card, {
        rotateX: (y - 0.5) * -15,
        rotateY: (x - 0.5) * 15,
        scale: 1.03,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
      setMousePosition({ x: 0.5, y: 0.5 });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const Icon = project.icon;

  return (
    <motion.div
      ref={cardRef}
      data-hover
      className="relative h-[400px] rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 100, rotateX: -10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      style={{ transformStyle: 'preserve-3d' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Card background */}
      <div className="absolute inset-0 bg-gradient-to-br from-nexus-darker via-nexus-black to-nexus-darker">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${project.color}40 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-50 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 0 1px ${project.color}40, 0 0 30px ${project.color}20`,
          opacity: isHovered ? 1 : 0.3,
        }}
      />

      {/* Scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Content */}
      <div className="relative h-full p-8 flex flex-col">
        {/* Top section */}
        <div className="flex items-start justify-between mb-auto">
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-orbitron tracking-wider"
              style={{
                background: `${project.color}20`,
                color: project.color,
                border: `1px solid ${project.color}40`,
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: project.color }} />
              {project.status.toUpperCase()}
            </motion.div>
          </div>
          <motion.div
            className="flex items-center gap-1 text-sm text-white/30 font-orbitron"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Eye size={14} />
            <span>EXPLORE</span>
            <ArrowUpRight size={14} />
          </motion.div>
        </div>

        {/* Icon */}
        <motion.div
          className="mt-8"
          animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center relative"
            style={{
              background: `linear-gradient(135deg, ${project.color}20 0%, ${project.color}05 100%)`,
              boxShadow: `0 0 40px ${project.color}30`,
            }}
          >
            <Icon size={36} style={{ color: project.color }} />
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ border: `1px solid ${project.color}30` }}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>

        {/* Title & Description */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xs text-white/30 font-rajdhani">{project.year}</span>
          </div>
          <h3 className="text-2xl font-orbitron font-bold mb-3" style={{ color: project.color }}>
            {project.name}
          </h3>
          <p className="text-white/50 font-rajdhani text-sm leading-relaxed mb-6">
            {project.description}
          </p>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/30 font-rajdhani">Development Progress</span>
              <span style={{ color: project.color }} className="font-orbitron">{project.progress}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: project.color }}
                initial={{ width: 0 }}
                animate={isInView ? { width: `${project.progress}%` } : {}}
                transition={{ duration: 1.5, delay: index * 0.15 + 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2" style={{ borderColor: `${project.color}30` }} />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2" style={{ borderColor: `${project.color}30` }} />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: project.color,
                left: `${10 + i * 20}%`,
              }}
              animate={{
                y: [400, -20],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-200px' });
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 overflow-hidden" id="projects">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-nexus-black via-nexus-darker to-nexus-black">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <motion.div
          className="absolute top-1/4 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.2), transparent)',
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Zap size={24} className="text-nexus-cyan" />
            </motion.div>
            <span className="text-sm font-orbitron tracking-[0.3em] text-nexus-blue">
              INITIATIVES
            </span>
          </div>

          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <span className="text-white">Classified</span>
            <span className="gradient-text"> Projects</span>
          </motion.h2>

          <motion.p
            className="text-xl font-rajdhani text-white/50 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Advanced AI initiatives shaping the future of technology
          </motion.p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onHover={() => setHoveredProject(project.id)}
              onLeave={() => setHoveredProject(null)}
              isHovered={hoveredProject === project.id}
            />
          ))}
        </div>

        {/* Bottom decoration */}
        <motion.div
          className="mt-20 flex justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-nexus-cyan/50" />
            <div className="w-3 h-3 rounded-full border border-nexus-cyan/50 flex items-center justify-center">
              <motion.div
                className="w-1 h-1 rounded-full bg-nexus-cyan"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-nexus-cyan/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
