import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, Cpu, HardDrive, Wifi, Shield, Zap } from 'lucide-react';

// Live metric component with animated value
const LiveMetric = ({
  label,
  value,
  unit,
  color,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
  icon: React.ElementType;
  delay?: number;
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    const animateValue = () => {
      const target = value + (Math.random() - 0.5) * value * 0.1;
      const duration = 1500;
      const start = currentValue;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCurrentValue(start + (target - start) * eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    };

    const interval = setInterval(animateValue, 3000);
    return () => clearInterval(interval);
  }, [value, currentValue]);

  return (
    <motion.div
      className="relative glass rounded-xl p-4 overflow-hidden group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}10 0%, transparent 70%)`,
        }}
      />
      <div className="relative flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div className="flex-grow">
          <div className="text-xs font-rajdhani text-white/50 uppercase tracking-wider">
            {label}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-orbitron font-bold" style={{ color }}>
              {currentValue.toFixed(2)}
            </span>
            <span className="text-xs text-white/50">{unit}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Animated graph component
const AnimatedGraph = ({ color }: { color: string }) => {
  const [data, setData] = useState<number[]>(Array(50).fill(50));

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newValue = Math.max(20, Math.min(80, prev[prev.length - 1] + (Math.random() - 0.5) * 20));
        return [...prev.slice(1), newValue];
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const points = data.map((y, i) => `${i * 4},${100 - y}`).join(' ');
  const path = `M ${points} L ${data.length * 4},100 L 0,100 Z`;

  return (
    <svg className="w-full h-40 overflow-visible" viewBox="0 0 200 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={path}
        fill={`url(#gradient-${color})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1 }}
      />
      {/* Animated dot at the end */}
      <motion.circle
        cx={data.length * 4 - 4}
        cy={100 - data[data.length - 1]}
        r="3"
        fill={color}
        animate={{ r: [3, 5, 3] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </svg>
  );
};

// Neural network node
const NeuralNode = ({
  x,
  y,
  delay,
  active,
}: {
  x: number;
  y: number;
  delay: number;
  active: boolean;
}) => (
  <motion.circle
    cx={x}
    cy={y}
    r="4"
    fill={active ? '#00fff7' : '#00d4ff'}
    initial={{ opacity: 0 }}
    animate={{
      opacity: 1,
      r: active ? [4, 6, 4] : 4,
      fill: active ? ['#00fff7', '#a855f7', '#00fff7'] : '#00d4ff',
    }}
    transition={{
      opacity: { delay },
      r: active ? { duration: 2, repeat: Infinity } : {},
      fill: active ? { duration: 3, repeat: Infinity } : {},
    }}
  />
);

// Neural network connections
const NeuralNetworkViz = () => {
  const layers = [5, 8, 6, 4];
  const layerSpacing = 100;
  const nodeSpacing = 25;
  const startX = 50;
  const startY = 25;

  const nodes: Array<{ x: number; y: number; layer: number }> = [];
  layers.forEach((count, layerIndex) => {
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: startX + layerIndex * layerSpacing,
        y: startY + i * nodeSpacing + ((layers[layerIndex] - count) / 2) * nodeSpacing,
        layer: layerIndex,
      });
    }
  });

  const connections: Array<{ from: typeof nodes[0]; to: typeof nodes[0] }> = [];
  nodes.forEach(node => {
    nodes.forEach(other => {
      if (other.layer === node.layer + 1 && Math.random() > 0.3) {
        connections.push({ from: node, to: other });
      }
    });
  });

  return (
    <svg className="w-full h-48" viewBox="0 0 450 150">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connections */}
      {connections.map((conn, i) => (
        <motion.path
          key={i}
          d={`M ${conn.from.x} ${conn.from.y} L ${conn.to.x} ${conn.to.y}`}
          stroke="rgba(0, 212, 255, 0.2)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: i * 0.01 }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <NeuralNode
          key={i}
          x={node.x}
          y={node.y}
          delay={i * 0.05}
          active={Math.random() > 0.7}
        />
      ))}
    </svg>
  );
};

export const NexusCoreSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-200px' });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 overflow-hidden"
      id="nexus-core"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-nexus-black via-nexus-darker to-nexus-black">
        <div className="absolute inset-0 cyber-grid opacity-30" />
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
            CONTROL CENTER
          </motion.span>

          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <span className="text-white">NEXUS</span>
            <span className="gradient-text"> CORE</span>
          </motion.h2>

          <motion.p
            className="text-xl font-rajdhani text-white/50 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            Real-time monitoring of our global AI infrastructure
          </motion.p>
        </motion.div>

        {/* Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main monitor */}
          <motion.div
            className="lg:col-span-2 glass rounded-2xl p-6 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-orbitron text-nexus-cyan">Neural Activity</h3>
              <span className="flex items-center gap-2 text-sm text-nexus-cyan">
                <span className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse" />
                LIVE
              </span>
            </div>
            <AnimatedGraph color="#00fff7" />
          </motion.div>

          {/* Side metrics */}
          <div className="space-y-4">
            <LiveMetric
              label="Processing Power"
              value={87.34}
              unit="PFLOPS"
              color="#00fff7"
              icon={Cpu}
              delay={0.9}
            />
            <LiveMetric
              label="Network Latency"
              value={0.32}
              unit="ms"
              color="#00d4ff"
              icon={Wifi}
              delay={1}
            />
            <LiveMetric
              label="Memory Usage"
              value={92.51}
              unit="%"
              color="#a855f7"
              icon={HardDrive}
              delay={1.1}
            />
            <LiveMetric
              label="Active Nodes"
              value={1847}
              unit=""
              color="#00fff7"
              icon={Activity}
              delay={1.2}
            />
          </div>
        </div>

        {/* Neural network visualization */}
        <motion.div
          className="mt-8 glass rounded-2xl p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-orbitron text-nexus-cyan">Network Topology</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-nexus-cyan" />
                <span className="text-sm text-white/50">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-nexus-blue" />
                <span className="text-sm text-white/50">Processing</span>
              </div>
            </div>
          </div>
          <NeuralNetworkViz />
        </motion.div>

        {/* Status bar */}
        <motion.div
          className="mt-8 glass rounded-xl p-4 flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-white/50">All Systems Operational</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-nexus-cyan" />
              <span className="text-sm text-white/50">Power Efficiency: 99.8%</span>
            </div>
          </div>
          <div className="text-sm text-nexus-cyan font-orbitron">
            UPTIME: 99.9997%
          </div>
        </motion.div>

        {/* Holographic circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-nexus-cyan/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-nexus-blue/5"
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-nexus-purple/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    </section>
  );
};
