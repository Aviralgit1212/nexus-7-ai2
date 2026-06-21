import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, Shield, Eye, Cpu, Atom } from 'lucide-react';

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  connections: string[];
  size: number;
}

const nodes: Node[] = [
  {
    id: 'research',
    x: 20,
    y: 30,
    label: 'Research',
    description: 'Advanced AI research laboratories exploring the frontiers of machine cognition.',
    icon: Brain,
    color: '#00fff7',
    connections: ['security', 'vision'],
    size: 60,
  },
  {
    id: 'security',
    x: 50,
    y: 15,
    label: 'Security',
    description: 'Multi-layer defense systems protecting critical AI infrastructure.',
    icon: Shield,
    color: '#00d4ff',
    connections: ['vision', 'autonomous'],
    size: 55,
  },
  {
    id: 'vision',
    x: 80,
    y: 25,
    label: 'Vision Systems',
    description: 'Computer vision networks processing visual data at unprecedented scale.',
    icon: Eye,
    color: '#a855f7',
    connections: ['autonomous', 'quantum'],
    size: 58,
  },
  {
    id: 'autonomous',
    x: 35,
    y: 70,
    label: 'Autonomous Agents',
    description: 'Self-evolving AI entities operating independently across global networks.',
    icon: Cpu,
    color: '#00fff7',
    connections: ['quantum', 'research'],
    size: 62,
  },
  {
    id: 'quantum',
    x: 65,
    y: 75,
    label: 'Quantum Simulation',
    description: 'Quantum computing infrastructure for next-generation AI training.',
    icon: Atom,
    color: '#00d4ff',
    connections: ['research', 'security'],
    size: 56,
  },
];

// Network Node Component
const NetworkNode = ({
  node,
  isActive,
  onHover,
  onLeave,
}: {
  node: Node;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const Icon = node.icon;

  return (
    <motion.g
      style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="cursor-pointer"
    >
      {/* Outer pulse ring */}
      <motion.circle
        r={node.size}
        fill="none"
        stroke={node.color}
        strokeWidth="1"
        opacity={0.3}
        animate={{
          r: [node.size, node.size + 20, node.size],
          opacity: [0.3, 0, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
        }}
      />

      {/* Middle ring */}
      <motion.circle
        r={node.size - 5}
        fill="none"
        stroke={node.color}
        strokeWidth="1"
        opacity={0.5}
        style={{
          strokeDasharray: `${Math.PI * node.size}`,
          strokeDashoffset: (pulsePhase / 360) * Math.PI * node.size * 2,
        }}
      />

      {/* Inner glow */}
      <circle
        r={node.size - 15}
        fill={node.color}
        opacity={isActive ? 0.3 : 0.1}
        filter="blur(10px)"
      />

      {/* Core */}
      <motion.circle
        r={node.size - 20}
        fill="rgba(5, 5, 5, 0.8)"
        stroke={node.color}
        strokeWidth="2"
        animate={{
          scale: isActive ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon */}
      <foreignObject
        x={-12}
        y={-12}
        width={24}
        height={24}
        style={{ transform: `translate(${node.x - 12}px, ${node.y - 12}px)` }}
      >
        <Icon size={24} color={node.color} />
      </foreignObject>

      {/* Label */}
      <text
        y={node.size + 15}
        textAnchor="middle"
        fill={isActive ? node.color : 'rgba(255,255,255,0.7)'}
        className="text-sm font-orbitron"
        style={{ fontSize: '12px' }}
      >
        {node.label}
      </text>
    </motion.g>
  );
};

// Animated Connection Line
const ConnectionLine = ({
  from,
  to,
  isActive,
}: {
  from: Node;
  to: Node;
  isActive: boolean;
}) => {
  const [particlePos, setParticlePos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticlePos(prev => (prev + 0.02) % 1);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const x1 = from.x;
  const y1 = from.y;
  const x2 = to.x;
  const y2 = to.y;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - 20;

  const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

  // Particle position along path
  const particleX = x1 + (x2 - x1) * particlePos + (midX - (x1 + x2) / 2) * 4 * particlePos * (1 - particlePos);
  const particleY = y1 + (y2 - y1) * particlePos + (midY - (y1 + y2) / 2) * 4 * particlePos * (1 - particlePos);

  return (
    <g>
      {/* Connection path */}
      <path
        d={pathD}
        fill="none"
        stroke={isActive ? '#00fff7' : 'rgba(0, 212, 255, 0.2)'}
        strokeWidth={isActive ? 2 : 1}
        strokeDasharray="4 4"
        opacity={isActive ? 0.8 : 0.4}
      />
      {/* Animated particle */}
      <circle
        r={isActive ? 4 : 2}
        fill={isActive ? '#00fff7' : '#00d4ff'}
        cx={particleX}
        cy={particleY}
        style={{ filter: isActive ? 'blur(2px)' : 'none' }}
      />
    </g>
  );
};

// Info Panel
const InfoPanel = ({ node }: { node: Node | null }) => {
  if (!node) return null;

  const Icon = node.icon;

  return (
    <motion.div
      className="fixed right-8 top-1/2 -translate-y-1/2 w-80 glass rounded-2xl p-6 z-50"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${node.color}20` }}
        >
          <Icon size={24} style={{ color: node.color }} />
        </div>
        <div>
          <h3 className="font-orbitron font-bold text-lg" style={{ color: node.color }}>
            {node.label}
          </h3>
          <span className="text-xs text-white/50 font-rajdhani">NEXUS SYSTEM</span>
        </div>
      </div>
      <p className="text-white/70 font-rajdhani leading-relaxed">{node.description}</p>
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Connections:</span>
          <span style={{ color: node.color }}>{node.connections.length}</span>
        </div>
      </div>
    </motion.div>
  );
};

export const NetworkVisualizationSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-200px' });
  const [activeNode, setActiveNode] = useState<Node | null>(null);
  const [activeConnections, setActiveConnections] = useState<string[]>([]);

  const handleNodeHover = useCallback((node: Node) => {
    setActiveNode(node);
    setActiveConnections([node.id, ...node.connections]);
  }, []);

  const handleNodeLeave = useCallback(() => {
    setActiveNode(null);
    setActiveConnections([]);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 overflow-hidden"
      id="network"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-nexus-black">
        <div className="absolute inset-0 cyber-grid opacity-20" />
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
          <motion.span
            className="inline-block text-sm font-orbitron tracking-[0.3em] text-nexus-blue mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            INTERACTIVE NETWORK
          </motion.span>

          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <span className="text-white">AI</span>
            <span className="gradient-text"> Network</span>
          </motion.h2>

          <motion.p
            className="text-xl font-rajdhani text-white/50 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            Hover over nodes to explore our interconnected AI systems
          </motion.p>
        </motion.div>

        {/* Network SVG */}
        <motion.div
          className="relative w-full aspect-[16/9] max-h-[600px] glass rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          {/* Animated background */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute w-full h-full"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.05) 0%, transparent 50%)',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            />
          </div>

          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="glow-network">
                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Draw connections */}
            {nodes.map(node =>
              node.connections.map(targetId => {
                const target = nodes.find(n => n.id === targetId);
                if (!target) return null;
                return (
                  <ConnectionLine
                    key={`${node.id}-${targetId}`}
                    from={node}
                    to={target}
                    isActive={
                      activeConnections.includes(node.id) && activeConnections.includes(targetId)
                    }
                  />
                );
              })
            )}

            {/* Draw nodes */}
            {nodes.map(node => (
              <NetworkNode
                key={node.id}
                node={node}
                isActive={activeNode?.id === node.id}
                onHover={() => handleNodeHover(node)}
                onLeave={handleNodeLeave}
              />
            ))}
          </svg>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-nexus-cyan/30" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-nexus-cyan/30" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-nexus-cyan/30" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-nexus-cyan/30" />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-12 grid grid-cols-5 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
        >
          {nodes.map(node => {
            const Icon = node.icon;
            return (
              <motion.div
                key={node.id}
                className="text-center p-4 glass rounded-xl"
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => handleNodeHover(node)}
                onMouseLeave={handleNodeLeave}
              >
                <Icon size={24} className="mx-auto mb-2" style={{ color: node.color }} />
                <div className="text-xs font-rajdhani text-white/50">{node.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Info Panel */}
      {activeNode && <InfoPanel node={activeNode} />}
    </section>
  );
};
