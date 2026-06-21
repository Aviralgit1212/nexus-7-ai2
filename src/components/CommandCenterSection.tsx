import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Activity, Shield, Server, Cpu, Radio, Wifi } from 'lucide-react';

// City data with real-world approximate coordinates
interface City {
  id: string;
  name: string;
  x: number; // percentage position
  y: number;
  countryCode: string;
  stats: {
    status: 'Operational' | 'Critical' | 'Maintenance';
    aiNodes: number;
    capacity: string;
    security: string;
    uptime: string;
    connections: number;
  };
}

const cities: City[] = [
  {
    id: 'singapore',
    name: 'Singapore',
    x: 76.5,
    y: 57.5,
    countryCode: 'SG',
    stats: {
      status: 'Operational',
      aiNodes: 2847,
      capacity: '2.4 PFLOPS',
      security: 'Level 7',
      uptime: '99.99%',
      connections: 4,
    },
  },
  {
    id: 'tokyo',
    name: 'Tokyo',
    x: 84,
    y: 38,
    countryCode: 'JP',
    stats: {
      status: 'Operational',
      aiNodes: 3156,
      capacity: '3.1 PFLOPS',
      security: 'Level 9',
      uptime: '99.97%',
      connections: 3,
    },
  },
  {
    id: 'dubai',
    name: 'Dubai',
    x: 58,
    y: 47,
    countryCode: 'AE',
    stats: {
      status: 'Operational',
      aiNodes: 1523,
      capacity: '1.6 PFLOPS',
      security: 'Level 8',
      uptime: '99.95%',
      connections: 3,
    },
  },
  {
    id: 'london',
    name: 'London',
    x: 47,
    y: 32,
    countryCode: 'UK',
    stats: {
      status: 'Operational',
      aiNodes: 2089,
      capacity: '2.2 PFLOPS',
      security: 'Level 9',
      uptime: '99.98%',
      connections: 3,
    },
  },
  {
    id: 'berlin',
    name: 'Berlin',
    x: 51,
    y: 31,
    countryCode: 'DE',
    stats: {
      status: 'Operational',
      aiNodes: 1756,
      capacity: '1.8 PFLOPS',
      security: 'Level 8',
      uptime: '99.94%',
      connections: 2,
    },
  },
  {
    id: 'newyork',
    name: 'New York',
    x: 23,
    y: 37,
    countryCode: 'US',
    stats: {
      status: 'Operational',
      aiNodes: 2567,
      capacity: '2.6 PFLOPS',
      security: 'Level 9',
      uptime: '99.98%',
      connections: 3,
    },
  },
  {
    id: 'sanfrancisco',
    name: 'San Francisco',
    x: 14,
    y: 40,
    countryCode: 'US',
    stats: {
      status: 'Operational',
      aiNodes: 2434,
      capacity: '2.5 PFLOPS',
      security: 'Level 9',
      uptime: '99.99%',
      connections: 3,
    },
  },
];

// Connection paths between cities
const connections: Array<{ from: string; to: string }> = [
  { from: 'singapore', to: 'tokyo' },
  { from: 'singapore', to: 'dubai' },
  { from: 'tokyo', to: 'sanfrancisco' },
  { from: 'dubai', to: 'london' },
  { from: 'london', to: 'newyork' },
  { from: 'london', to: 'berlin' },
  { from: 'newyork', to: 'sanfrancisco' },
  { from: 'dubai', to: 'singapore' },
  { from: 'newyork', to: 'london' },
  { from: 'sanfrancisco', to: 'tokyo' },
];

// Animated data packet traveling along path
const DataPacket = ({
  from,
  to,
  progress,
  isActive,
}: {
  from: City;
  to: City;
  progress: number;
  isActive: boolean;
}) => {
  const x = from.x + (to.x - from.x) * progress;
  const y = from.y + (to.y - from.y) * progress;

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        background: isActive
          ? 'radial-gradient(circle, #00fff7 0%, #00d4ff 50%, transparent 100%)'
          : 'radial-gradient(circle, #00d4ff 0%, transparent 100%)',
        boxShadow: isActive
          ? '0 0 10px #00fff7, 0 0 20px #00d4ff'
          : '0 0 5px #00d4ff',
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        scale: isActive ? [1, 1.5, 1] : 1,
        opacity: isActive ? 1 : 0.6,
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
      }}
    />
  );
};

// City node on the map
const CityNode = ({
  city,
  isHovered,
  otherHovered,
  onHover,
  onLeave,
}: {
  city: City;
  isHovered: boolean;
  otherHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const statusColor = city.stats.status === 'Operational' ? '#00fff7' :
    city.stats.status === 'Critical' ? '#ef4444' : '#f59e0b';

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${city.x}%`,
        top: `${city.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      animate={{
        scale: isHovered ? 2.5 : otherHovered ? 0.7 : 1,
        opacity: otherHovered && !isHovered ? 0.3 : 1,
        zIndex: isHovered ? 20 : 10,
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Outer pulsing ring */}
      <motion.div
        className="absolute rounded-full border-2"
        style={{
          borderColor: statusColor,
          width: 60,
          height: 60,
          left: -30,
          top: -30,
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: isHovered ? [0.6, 0.9, 0.6] : [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute rounded-full border"
        style={{
          borderColor: isHovered ? statusColor : `${statusColor}80`,
          width: 40,
          height: 40,
          left: -20,
          top: -20,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Core glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: `radial-gradient(circle, ${statusColor} 0%, transparent 70%)`,
          width: 50,
          height: 50,
          left: -25,
          top: -25,
          filter: 'blur(8px)',
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.8 : 0.4,
        }}
      />

      {/* Core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          background: `radial-gradient(circle, #ffffff 0%, ${statusColor} 50%, ${statusColor}80 100%)`,
          width: 20,
          height: 20,
          left: -10,
          top: -10,
          boxShadow: isHovered
            ? `0 0 30px ${statusColor}, 0 0 60px ${statusColor}50`
            : `0 0 15px ${statusColor}`,
        }}
        animate={{
          scale: isHovered ? 1.2 : [1, 1.1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      />

      {/* City label */}
      <motion.div
        className="absolute whitespace-nowrap text-center"
        style={{
          left: '50%',
          top: isHovered ? 45 : 30,
          transform: 'translateX(-50%)',
        }}
        animate={{
          y: isHovered ? 10 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          className="font-orbitron text-xs md:text-sm tracking-widest"
          style={{
            color: isHovered ? '#00fff7' : 'rgba(255,255,255,0.7)',
            textShadow: isHovered ? '0 0 10px #00fff7' : 'none',
          }}
        >
          {city.name.toUpperCase()}
        </motion.span>
      </motion.div>

      {/* Status indicator */}
      <motion.div
        className="absolute"
        style={{
          left: '50%',
          top: isHovered ? 60 : 45,
          transform: 'translateX(-50%)',
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : -5,
        }}
        transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
      >
        <span
          className="text-xs font-rajdhani"
          style={{ color: statusColor }}
        >
          {city.stats.status}
        </span>
      </motion.div>
    </motion.div>
  );
};

// Connection line between cities
const ConnectionLine = ({
  from,
  to,
  isActive,
  packets,
}: {
  from: City;
  to: City;
  isActive: boolean;
  packets: number[];
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* SVG line */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient
            id={`line-${from.id}-${to.id}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={isActive ? '#00fff7' : '#00d4ff'} stopOpacity="0" />
            <stop offset="50%" stopColor={isActive ? '#00fff7' : '#00d4ff'} stopOpacity={isActive ? '0.8' : '0.3'} />
            <stop offset="100%" stopColor={isActive ? '#00fff7' : '#00d4ff'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke={`url(#line-${from.id}-${to.id})`}
          strokeWidth={isActive ? 0.4 : 0.2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
      </svg>

      {/* Animated data packets */}
      {packets.map((progress, i) => (
        <DataPacket
          key={`${from.id}-${to.id}-${i}`}
          from={from}
          to={to}
          progress={progress}
          isActive={isActive}
        />
      ))}
    </div>
  );
};

// Holographic information panel
const InfoPanel = ({
  city,
  onClose,
}: {
  city: City;
  onClose: () => void;
}) => {
  const statusColor = city.stats.status === 'Operational' ? '#00fff7' :
    city.stats.status === 'Critical' ? '#ef4444' : '#f59e0b';

  return (
    <motion.div
      className="fixed right-8 top-1/2 -translate-y-1/2 w-80 z-50"
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Glassmorphism panel */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 20, 40, 0.9) 0%, rgba(0, 10, 20, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 247, 0.2)',
          boxShadow: `0 0 40px rgba(0, 255, 247, 0.1), inset 0 0 40px rgba(0, 20, 40, 0.5)`,
        }}
      >
        {/* Scanning line effect */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-cyan to-transparent"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2" style={{ borderColor: 'rgba(0, 255, 247, 0.3)' }} />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2" style={{ borderColor: 'rgba(0, 255, 247, 0.3)' }} />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2" style={{ borderColor: 'rgba(0, 255, 247, 0.3)' }} />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2" style={{ borderColor: 'rgba(0, 255, 247, 0.3)' }} />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${statusColor}20 0%, ${statusColor}10 100%)`,
                  border: `1px solid ${statusColor}40`,
                }}
                animate={{
                  boxShadow: [`0 0 10px ${statusColor}40`, `0 0 20px ${statusColor}60`, `0 0 10px ${statusColor}40`],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Server size={24} style={{ color: statusColor }} />
              </motion.div>
              <div>
                <h3 className="font-orbitron font-bold text-lg" style={{ color: '#00fff7' }}>
                  {city.name}
                </h3>
                <span className="text-xs text-white/40 font-orbitron tracking-wider">
                  {city.countryCode} // NODE_{city.id.toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/30 hover:text-nexus-cyan transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Status badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
            style={{
              background: `${statusColor}15`,
              border: `1px solid ${statusColor}40`,
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: statusColor }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs font-orbitron tracking-wider" style={{ color: statusColor }}>
              {city.stats.status.toUpperCase()}
            </span>
          </motion.div>

          {/* Stats grid */}
          <div className="space-y-4">
            {/* AI Nodes */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <Cpu size={18} className="text-nexus-cyan" />
                <span className="text-sm text-white/60 font-rajdhani">AI Nodes</span>
              </div>
              <span className="font-orbitron font-bold" style={{ color: '#00fff7' }}>
                {city.stats.aiNodes.toLocaleString()}
              </span>
            </div>

            {/* Processing Capacity */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-nexus-blue" />
                <span className="text-sm text-white/60 font-rajdhani">Capacity</span>
              </div>
              <span className="font-orbitron font-bold" style={{ color: '#00d4ff' }}>
                {city.stats.capacity}
              </span>
            </div>

            {/* Security Level */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-purple-400" />
                <span className="text-sm text-white/60 font-rajdhani">Security</span>
              </div>
              <span className="font-orbitron font-bold text-purple-400">
                {city.stats.security}
              </span>
            </div>

            {/* Uptime */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <Wifi size={18} className="text-green-400" />
                <span className="text-sm text-white/60 font-rajdhani">Uptime</span>
              </div>
              <span className="font-orbitron font-bold text-green-400">
                {city.stats.uptime}
              </span>
            </div>

            {/* Connections */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <Radio size={18} className="text-amber-400" />
                <span className="text-sm text-white/60 font-rajdhani">Connections</span>
              </div>
              <span className="font-orbitron font-bold text-amber-400">
                {city.stats.connections}
              </span>
            </div>
          </div>

          {/* Activity graph placeholder */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="text-xs font-orbitron text-white/40 mb-2">NETWORK ACTIVITY</div>
            <div className="flex items-end gap-1 h-12">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ background: 'rgba(0, 255, 247, 0.3)' }}
                  animate={{
                    height: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: i * 0.05,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Radar sweep effect
const RadarSweep = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: 0.15 }}>
      <motion.div
        className="absolute top-1/2 left-1/2 w-full"
        style={{
          transformOrigin: '0 0',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 255, 247, 0.3) 50%, transparent 100%)',
          height: '2px',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Concentric circles */}
      {[20, 35, 50, 65, 80].map((size, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-nexus-cyan/20 top-1/2 left-1/2"
          style={{
            width: `${size}%`,
            height: `${size}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};

// Main component
export const CommandCenterSection = () => {
  const [hoveredCity, setHoveredCity] = useState<City | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [packets, setPackets] = useState<Record<string, number[]>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for subtle parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cameraX = useSpring(useTransform(mouseX, [-1, 1], [3, -3]), springConfig);
  const cameraY = useSpring(useTransform(mouseY, [-1, 1], [2, -2]), springConfig);

  // Handle mouse move for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Animate data packets
  useEffect(() => {
    const interval = setInterval(() => {
      setPackets(prev => {
        const newPackets = { ...prev };

        connections.forEach(conn => {
          const key = `${conn.from}-${conn.to}`;
          const current = newPackets[key] || [];

          // Add new packet randomly
          if (Math.random() > 0.7 && current.length < 3) {
            newPackets[key] = [...current, 0];
          }

          // Progress existing packets
          newPackets[key] = current
            .map(p => p + 0.02)
            .filter(p => p < 1);
        });

        return newPackets;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleCityHover = useCallback((city: City) => {
    setHoveredCity(city);
  }, []);

  const handleCityLeave = useCallback(() => {
    setHoveredCity(null);
  }, []);

  const handleCityClick = useCallback((city: City) => {
    setSelectedCity(city);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSelectedCity(null);
  }, []);

  // Get city by ID helper
  const getCityById = (id: string) => cities.find(c => c.id === id);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-32 overflow-hidden"
      id="global-network"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-nexus-black via-nexus-darker to-nexus-black">
        <div className="absolute inset-0 cyber-grid opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="flex items-center justify-center gap-4 mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Radio className="w-6 h-6 text-nexus-cyan" />
            <span className="text-sm font-orbitron tracking-[0.3em] text-nexus-blue">
              CLASSIFIED NETWORK
            </span>
            <Radio className="w-6 h-6 text-nexus-cyan" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-white">Global</span>
            <span className="gradient-text"> Command</span>
          </motion.h2>

          <motion.p
            className="text-xl font-rajdhani text-white/50 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Planetary AI infrastructure spanning 7 strategic nodes
          </motion.p>
        </motion.div>

        {/* Map container */}
        <motion.div
          className="relative w-full aspect-[2/1] max-h-[700px] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, rgba(0, 20, 40, 0.8) 0%, rgba(0, 10, 20, 0.9) 100%)',
            border: '1px solid rgba(0, 255, 247, 0.1)',
            boxShadow: '0 0 60px rgba(0, 255, 247, 0.05), inset 0 0 100px rgba(0, 20, 40, 0.5)',
          }}
        >
          {/* Radar sweep */}
          <RadarSweep />

          {/* World map silhouette (simplified) */}
          <svg
            viewBox="0 0 100 50"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full opacity-20"
          >
            {/* Simplified world continents */}
            <g fill="#00d4ff" fillOpacity="0.3">
              {/* North America */}
              <path d="M 10 20 Q 15 12 22 15 L 25 22 Q 22 28 18 26 Z" />
              {/* South America */}
              <path d="M 24 35 Q 28 30 30 33 L 28 45 Q 25 48 22 45 Z" />
              {/* Europe */}
              <path d="M 46 18 Q 50 15 54 20 L 52 25 Q 48 25 46 22 Z" />
              {/* Africa */}
              <path d="M 46 28 Q 52 22 56 28 L 54 40 Q 50 42 46 38 Z" />
              {/* Asia */}
              <path d="M 55 15 Q 70 10 85 22 L 82 30 Q 70 32 58 25 Z" />
              {/* Australia */}
              <path d="M 82 38 Q 88 35 90 38 L 88 45 Q 85 46 82 42 Z" />
            </g>

            {/* Grid lines */}
            {[...Array(5)].map((_, i) => (
              <line
                key={`lat-${i}`}
                x1="0"
                y1={10 + i * 10}
                x2="100"
                y2={10 + i * 10}
                stroke="#00fff7"
                strokeOpacity="0.05"
                strokeWidth="0.2"
              />
            ))}
            {[...Array(10)].map((_, i) => (
              <line
                key={`lon-${i}`}
                x1={10 + i * 10}
                y1="0"
                x2={10 + i * 10}
                y2="50"
                stroke="#00fff7"
                strokeOpacity="0.05"
                strokeWidth="0.2"
              />
            ))}
          </svg>

          {/* Camera transform container */}
          <motion.div
            className="absolute inset-0"
            style={{
              x: cameraX,
              y: cameraY,
            }}
          >
            {/* Connection lines with packets */}
            {connections.map(conn => {
              const fromCity = getCityById(conn.from);
              const toCity = getCityById(conn.to);
              if (!fromCity || !toCity) return null;

              const key = `${conn.from}-${conn.to}`;
              const isActive = hoveredCity?.id === conn.from || hoveredCity?.id === conn.to;

              return (
                <ConnectionLine
                  key={key}
                  from={fromCity}
                  to={toCity}
                  isActive={isActive}
                  packets={packets[key] || []}
                />
              );
            })}

            {/* City nodes */}
            {cities.map(city => (
              <div
                key={city.id}
                onClick={() => handleCityClick(city)}
              >
                <CityNode
                  city={city}
                  isHovered={hoveredCity?.id === city.id}
                  otherHovered={hoveredCity !== null && hoveredCity?.id !== city.id}
                  onHover={() => handleCityHover(city)}
                  onLeave={handleCityLeave}
                />
              </div>
            ))}
          </motion.div>

          {/* Scanning corner decorations */}
          <div className="absolute top-4 left-4 w-16 h-16">
            <div className="absolute inset-0 border-l-2 border-t-2 border-nexus-cyan/30" />
            <motion.div
              className="absolute top-0 left-0 w-full h-px bg-nexus-cyan/50"
              animate={{ x: [0, 64, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="absolute top-4 right-4 w-16 h-16">
            <div className="absolute inset-0 border-r-2 border-t-2 border-nexus-cyan/30" />
          </div>
          <div className="absolute bottom-4 left-4 w-16 h-16">
            <div className="absolute inset-0 border-l-2 border-b-2 border-nexus-cyan/30" />
          </div>
          <div className="absolute bottom-4 right-4 w-16 h-16">
            <div className="absolute inset-0 border-r-2 border-b-2 border-nexus-cyan/30" />
          </div>

          {/* HUD overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-4 px-6 py-2 rounded-full bg-black/30 border border-nexus-cyan/20">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs font-orbitron tracking-wider text-nexus-cyan/70">
                GLOBAL NETWORK SYNCHRONIZED
              </span>
            </div>
          </div>

          {/* Bottom stats bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3">
            <div className="flex justify-center gap-8 py-2 px-6 rounded-full bg-black/30 border border-nexus-cyan/10">
              {[
                { label: 'Nodes', value: '16,376' },
                { label: 'Capacity', value: '16.2 PF' },
                { label: 'Latency', value: '23ms' },
                { label: 'Uptime', value: '99.97%' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-sm font-orbitron text-nexus-cyan">{stat.value}</div>
                  <div className="text-xs text-white/40 font-rajdhani">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          className="mt-8 flex justify-center gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[
            { label: 'Operational', color: '#00fff7' },
            { label: 'Maintenance', color: '#f59e0b' },
            { label: 'Critical', color: '#ef4444' },
          ].map(status => (
            <div key={status.label} className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ background: status.color }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm text-white/50 font-rajdhani">{status.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Holographic info panel */}
      <AnimatePresence>
        {selectedCity && (
          <InfoPanel city={selectedCity} onClose={handleClosePanel} />
        )}
      </AnimatePresence>
    </section>
  );
};
