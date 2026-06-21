import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, Globe, Radio, Cpu } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
  capacity: string;
  status: 'active' | 'building' | 'planned';
  connections: string[];
}

const locations: Location[] = [
  { id: 'sf', name: 'San Francisco', x: 14, y: 42, capacity: '2.4 PFLOPS', status: 'active', connections: ['tokyo', 'london', 'nyc'] },
  { id: 'nyc', name: 'New York', x: 22, y: 38, capacity: '1.8 PFLOPS', status: 'active', connections: ['sf', 'london', 'singapore'] },
  { id: 'london', name: 'London', x: 46, y: 32, capacity: '1.6 PFLOPS', status: 'active', connections: ['nyc', 'frankfurt', 'sf'] },
  { id: 'frankfurt', name: 'Frankfurt', x: 50, y: 35, capacity: '1.4 PFLOPS', status: 'active', connections: ['london', 'tokyo'] },
  { id: 'tokyo', name: 'Tokyo', x: 82, y: 38, capacity: '2.1 PFLOPS', status: 'active', connections: ['sf', 'singapore', 'frankfurt'] },
  { id: 'singapore', name: 'Singapore', x: 75, y: 58, capacity: '1.2 PFLOPS', status: 'building', connections: ['tokyo', 'sydney'] },
  { id: 'sydney', name: 'Sydney', x: 88, y: 72, capacity: '0.8 PFLOPS', status: 'building', connections: ['singapore'] },
  { id: 'brazil', name: 'Sao Paulo', x: 30, y: 68, capacity: '0.9 PFLOPS', status: 'active', connections: ['nyc'] },
  { id: 'dubai', name: 'Dubai', x: 60, y: 48, capacity: '1.0 PFLOPS', status: 'planned', connections: ['frankfurt', 'singapore'] },
];

// Connection path with traveling light
const ConnectionLine = ({
  from,
  to,
  isActive,
}: {
  from: Location;
  to: Location;
  isActive: boolean;
}) => {
  const [particlePos, setParticlePos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticlePos(prev => (prev + 0.005) % 1);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const x1 = from.x;
  const y1 = from.y;
  const x2 = to.x;
  const y2 = to.y;

  // Control point for bezier curve (slight arc)
  const midX = (x1 + x2) / 2;
  const midY = Math.min(y1, y2) - 10;

  const currentX = x1 + (x2 - x1) * particlePos;
  const currentY = y1 + (y2 - y1) * particlePos + Math.sin(particlePos * Math.PI) * -10;

  return (
    <g>
      {/* Main arc */}
      <motion.path
        d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
        fill="none"
        stroke={isActive ? 'rgba(0, 255, 247, 0.4)' : 'rgba(0, 212, 255, 0.15)'}
        strokeWidth={isActive ? 1.5 : 1}
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />
      {/* Traveling light */}
      <circle
        r="2"
        fill="#00fff7"
        cx={currentX}
        cy={currentY}
      >
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
};

// Location node
const LocationNode = ({
  location,
  isHovered,
  onHover,
  onLeave,
}: {
  location: Location;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const color =
    location.status === 'active' ? '#00fff7' :
    location.status === 'building' ? '#f59e0b' : '#ef4444';

  return (
    <g
      style={{ transform: `translate(${location.x}px, ${location.y}px)` }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="cursor-pointer"
    >
      {/* Outer pulse */}
      <motion.circle
        r={isHovered ? 15 : 12}
        fill="none"
        stroke={color}
        strokeWidth="1"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Inner glow */}
      <circle r="8" fill={color} opacity="0.2" filter="url(#blur)" />

      {/* Core dot */}
      <motion.circle
        r={isHovered ? 6 : 4}
        fill={color}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />

      {/* Label */}
      <text
        y={-18}
        textAnchor="middle"
        fill={isHovered ? color : 'rgba(255,255,255,0.5)'}
        className="text-xs font-orbitron"
        style={{ fontSize: '9px', fontWeight: 'bold' }}
      >
        {location.name.toUpperCase()}
      </text>
    </g>
  );
};

export const WorldMapSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-200px' });
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [scanPos, setScanPos] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos(prev => (prev + 0.5) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen py-32 overflow-hidden" id="global">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-nexus-darker via-nexus-black to-nexus-black">
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
          <div className="flex items-center justify-center gap-4 mb-4">
            <Globe className="w-6 h-6 text-nexus-cyan" />
            <span className="text-sm font-orbitron tracking-[0.3em] text-nexus-blue">
              GLOBAL INFRASTRUCTURE
            </span>
            <Globe className="w-6 h-6 text-nexus-cyan" />
          </div>

          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            <span className="text-white">World</span>
            <span className="gradient-text"> Network</span>
          </motion.h2>

          <motion.p
            className="text-xl font-rajdhani text-white/50 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Our distributed AI infrastructure spans continents
          </motion.p>
        </motion.div>

        {/* Map container */}
        <motion.div
          className="relative w-full aspect-[2/1] max-h-[600px] glass rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          {/* World map outline (simplified) */}
          <svg
            viewBox="0 0 100 60"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="blur">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>

            {/* Grid lines */}
            {[...Array(10)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 6}
                x2="100"
                y2={i * 6}
                stroke="rgba(0, 212, 255, 0.1)"
                strokeWidth="0.3"
              />
            ))}
            {[...Array(20)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 5}
                y1="0"
                x2={i * 5}
                y2="60"
                stroke="rgba(0, 212, 255, 0.1)"
                strokeWidth="0.3"
              />
            ))}

            {/* Simplified continent outlines */}
            <g opacity="0.3" stroke="#00d4ff" strokeWidth="0.5" fill="none">
              {/* North America */}
              <path d="M 5 30 Q 10 20 15 25 Q 20 20 25 30 L 22 35 Q 18 40 12 38 Z" />
              {/* South America */}
              <path d="M 22 50 Q 25 45 28 48 L 30 58 Q 28 60 25 58 Z" />
              {/* Europe */}
              <path d="M 45 28 Q 48 25 52 30 L 50 35 Q 47 35 45 32 Z" />
              {/* Africa */}
              <path d="M 45 40 Q 50 35 55 40 L 52 52 Q 48 55 45 50 Z" />
              {/* Asia */}
              <path d="M 55 25 Q 65 20 80 30 L 78 38 Q 70 40 60 35 Z" />
              {/* Australia */}
              <path d="M 82 55 Q 88 52 90 55 L 88 60 Q 85 62 82 58 Z" />
            </g>

            {/* Draw connections first (below nodes) */}
            {locations.map(loc =>
              loc.connections.map(targetId => {
                const target = locations.find(l => l.id === targetId);
                if (!target) return null;
                return (
                  <ConnectionLine
                    key={`${loc.id}-${targetId}`}
                    from={loc}
                    to={target}
                    isActive={hoveredLocation?.id === loc.id || hoveredLocation?.id === targetId}
                  />
                );
              })
            )}

            {/* Draw nodes */}
            {locations.map(loc => (
              <LocationNode
                key={loc.id}
                location={loc}
                isHovered={hoveredLocation?.id === loc.id}
                onHover={() => setHoveredLocation(loc)}
                onLeave={() => setHoveredLocation(null)}
              />
            ))}

            {/* Scan line effect */}
            <motion.rect
              x={scanPos}
              y="0"
              width="0.5"
              height="60"
              fill="rgba(0, 212, 255, 0.3)"
              animate={{
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
              }}
            />
          </svg>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-nexus-cyan/30" />
          <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-nexus-cyan/30" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-nexus-cyan/30" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-nexus-cyan/30" />
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          {[
            { icon: Globe, label: 'Locations', value: '9' },
            { icon: Cpu, label: 'Total Capacity', value: '13.2 PF' },
            { icon: Radio, label: 'Active Nodes', value: '2,847' },
            { icon: Activity, label: 'Uptime', value: '99.99%' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass rounded-xl p-4 text-center"
              whileHover={{ scale: 1.05 }}
              animate={{
                borderColor: ['rgba(0, 212, 255, 0.1)', 'rgba(0, 212, 255, 0.3)', 'rgba(0, 212, 255, 0.1)'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              <stat.icon className="w-6 h-6 mx-auto mb-2 text-nexus-cyan" />
              <div className="text-2xl font-orbitron font-bold text-nexus-cyan">{stat.value}</div>
              <div className="text-sm text-white/50 font-rajdhani">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
