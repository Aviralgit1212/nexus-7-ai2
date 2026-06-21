import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Shield, Eye, MessageSquare, Cpu, Compass, Activity } from 'lucide-react';

// Node categories with visual properties
const nodeTypes = {
  Reasoning: { color: '#00fff7', icon: Brain, description: 'Logical inference and deduction systems' },
  Security: { color: '#ef4444', icon: Shield, description: 'Threat detection and defense mechanisms' },
  Vision: { color: '#a855f7', icon: Eye, description: 'Visual processing and pattern recognition' },
  Language: { color: '#22c55e', icon: MessageSquare, description: 'Natural language understanding and generation' },
  Autonomy: { color: '#f59e0b', icon: Cpu, description: 'Autonomous decision-making agents' },
  Planning: { color: '#3b82f6', icon: Compass, description: 'Strategic planning and optimization' },
};

type NodeType = keyof typeof nodeTypes;

// Neural node structure
interface NeuralNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  connections: string[];
  activity: number;
  pulsePhase: number;
}

// Data packet structure
interface Packet {
  id: string;
  fromId: string;
  toId: string;
  progress: number;
  speed: number;
}

// Generate initial nodes
const generateNodes = (count: number): NeuralNode[] => {
  const types = Object.keys(nodeTypes) as NodeType[];
  const nodes: NeuralNode[] = [];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const angle = Math.random() * Math.PI * 2;
    const radius = 20 + Math.random() * 25;

    nodes.push({
      id: `node-${i}`,
      type,
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      radius: 3 + Math.random() * 4,
      connections: [],
      activity: Math.random(),
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }

  // Generate connections based on proximity
  nodes.forEach(node => {
    const nearbyNodes = nodes
      .filter(n => n.id !== node.id)
      .map(n => ({
        id: n.id,
        dist: Math.sqrt((n.x - node.x) ** 2 + (n.y - node.y) ** 2),
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2 + Math.floor(Math.random() * 4));

    node.connections = nearbyNodes.map(n => n.id);
  });

  return nodes;
};

// Neural node component
const NeuralNodeComponent = ({
  node,
  isSelected,
  isConnected,
  scale,
  onSelect,
}: {
  node: NeuralNode;
  isSelected: boolean;
  isConnected: boolean;
  scale: number;
  onSelect: () => void;
}) => {
  const typeConfig = nodeTypes[node.type];
  const Icon = typeConfig.icon;

  return (
    <motion.g
      style={{ transform: `translate(${node.x}%, ${node.y}%)` }}
      onClick={onSelect}
      className="cursor-pointer"
      animate={{
        scale: isSelected ? 2 : isConnected ? 1.3 : scale,
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Outer activity pulse */}
      <motion.circle
        r={node.radius * 4}
        fill="none"
        stroke={typeConfig.color}
        strokeWidth="0.5"
        animate={{
          opacity: isSelected ? [0.4, 0.8, 0.4] : [0.1, 0.3, 0.1],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: node.pulsePhase,
        }}
      />

      {/* Inner glow */}
      <motion.circle
        r={node.radius * 1.5}
        fill={typeConfig.color}
        animate={{
          opacity: isSelected ? 0.4 : isConnected ? 0.25 : 0.15,
        }}
        filter="url(#blur)"
      />

      {/* Core */}
      <motion.circle
        r={node.radius}
        fill={typeConfig.color}
        animate={{
          opacity: isSelected ? 1 : 0.8,
          scale: node.activity > 0.7 ? [1, 1.15, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: node.activity > 0.7 ? Infinity : 0,
        }}
      />

      {/* Center dot */}
      <circle
        r={node.radius * 0.4}
        fill="#ffffff"
        opacity={isSelected ? 1 : 0.6}
      />

      {/* Icon for selected node */}
      <AnimatePresence>
        {isSelected && (
          <motion.foreignObject
            x={-12}
            y={-node.radius * 4 - 20}
            width={24}
            height={24}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Icon size={20} style={{ color: typeConfig.color }} />
          </motion.foreignObject>
        )}
      </AnimatePresence>

      {/* Label for selected node */}
      <AnimatePresence>
        {isSelected && (
          <motion.text
            y={node.radius + 20}
            textAnchor="middle"
            fill={typeConfig.color}
            fontSize="4"
            fontFamily="Orbitron"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {node.type.toUpperCase()}
          </motion.text>
        )}
      </AnimatePresence>
    </motion.g>
  );
};

// Connection line with data flow
const NeuralConnection = ({
  from,
  to,
  isActive,
  packets,
  onConnectionHover,
}: {
  from: NeuralNode;
  to: NeuralNode;
  isActive: boolean;
  packets: Packet[];
  onConnectionHover: (hovered: boolean) => void;
}) => {
  return (
    <g onMouseEnter={() => onConnectionHover(true)} onMouseLeave={() => onConnectionHover(false)}>
      {/* Base connection line */}
      <motion.line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={isActive ? '#00fff7' : 'rgba(0, 212, 255, 0.15)'}
        strokeWidth={isActive ? 0.8 : 0.3}
        animate={{
          opacity: isActive ? 0.8 : 0.15,
        }}
      />

      {/* Active glow line */}
      {isActive && (
        <motion.line
          x1={from.x}
          y1={from.y}
          x2={to.x}
          y2={to.y}
          stroke="#00fff7"
          strokeWidth="1.5"
          animate={{
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
        />
      )}

      {/* Data packets */}
      {packets.map(packet => (
        <DataPacketVisual
          key={packet.id}
          from={from}
          to={to}
          progress={packet.progress}
          isActive={isActive}
        />
      ))}
    </g>
  );
};

// Data packet visual
const DataPacketVisual = ({
  from,
  to,
  progress,
  isActive,
}: {
  from: NeuralNode;
  to: NeuralNode;
  progress: number;
  isActive: boolean;
}) => {
  const x = from.x + (to.x - from.x) * progress;
  const y = from.y + (to.y - from.y) * progress;

  return (
    <motion.circle
      cx={x}
      cy={y}
      r={isActive ? 1.5 : 0.8}
      fill={isActive ? '#00fff7' : '#00d4ff'}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 0.3,
        repeat: Infinity,
      }}
    />
  );
};

// Information panel
const NodeInfoPanel = ({
  node,
  onClose,
}: {
  node: NeuralNode;
  onClose: () => void;
}) => {
  const typeConfig = nodeTypes[node.type];
  const Icon = typeConfig.icon;

  return (
    <motion.div
      className="fixed left-8 top-1/2 -translate-y-1/2 w-72 z-50"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="relative rounded-2xl overflow-hidden p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 20, 40, 0.95) 0%, rgba(0, 10, 20, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${typeConfig.color}40`,
          boxShadow: `0 0 40px ${typeConfig.color}20`,
        }}
      >
        {/* Scanning line */}
        <motion.div
          className="absolute left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${typeConfig.color}, transparent)` }}
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: `${typeConfig.color}20`,
              border: `1px solid ${typeConfig.color}40`,
            }}
            animate={{
              boxShadow: [`0 0 10px ${typeConfig.color}40`, `0 0 20px ${typeConfig.color}60`, `0 0 10px ${typeConfig.color}40`],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Icon size={20} style={{ color: typeConfig.color }} />
          </motion.div>
          <div>
            <h3 className="font-orbitron font-bold text-sm" style={{ color: typeConfig.color }}>
              {node.type.toUpperCase()}
            </h3>
            <span className="text-xs text-white/40 font-rajdhani">
              NODE_{node.id.slice(-4).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-white/60 font-rajdhani mb-4">
          {typeConfig.description}
        </p>

        {/* Stats */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/40 font-rajdhani">Activity Level</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: typeConfig.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${node.activity * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="font-orbitron text-xs" style={{ color: typeConfig.color }}>
                {Math.round(node.activity * 100)}%
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-white/40 font-rajdhani">Connections</span>
            <span className="font-orbitron text-xs" style={{ color: typeConfig.color }}>
              {node.connections.length}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-white/40 font-rajdhani">Processing Queue</span>
            <span className="font-orbitron text-xs" style={{ color: typeConfig.color }}>
              {Math.floor(Math.random() * 1000 + 100)}
            </span>
          </div>
        </div>

        {/* Signal pulses */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-xs text-white/40 font-orbitron mb-2">NEURAL SIGNALS</div>
          <div className="flex gap-1">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 h-8 rounded-sm"
                style={{ background: `${typeConfig.color}30` }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scaleY: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/30 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

// Main component
export const NeuralNetworkSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NeuralNode[]>([]);
  const [packets, setPackets] = useState<Packet[]>([]);
  const [selectedNode, setSelectedNode] = useState<NeuralNode | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize nodes
  useEffect(() => {
    setNodes(generateNodes(150));
    setIsLoaded(true);
  }, []);

  // Animate nodes (physics simulation)
  useEffect(() => {
    if (!isLoaded || nodes.length === 0) return;

    const interval = setInterval(() => {
      setNodes(prev => {
        const newNodes = prev.map(node => {
          let fx = 0, fy = 0;

          // Repulsion from all other nodes
          prev.forEach(other => {
            if (other.id === node.id) return;
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 15) {
              const force = (15 - dist) * 0.02;
              fx += (dx / dist) * force;
              fy += (dy / dist) * force;
            }

            // Attraction to connected nodes
            if (node.connections.includes(other.id)) {
              const idealDist = 8;
              const connDist = Math.sqrt(dx * dx + dy * dy);
              if (connDist > idealDist) {
                const attractForce = (connDist - idealDist) * 0.001;
                fx -= (dx / connDist) * attractForce;
                fy -= (dy / connDist) * attractForce;
              }
            }
          });

          // Return to center (prevent drift)
          fx += (50 - node.x) * 0.0002;
          fy += (50 - node.y) * 0.0002;

          // Apply forces
          return {
            ...node,
            vx: (node.vx + fx) * 0.9,
            vy: (node.vy + fy) * 0.9,
            x: Math.max(5, Math.min(95, node.x + node.vx)),
            y: Math.max(5, Math.min(95, node.y + node.vy)),
            activity: Math.max(0.1, Math.min(1, node.activity + (Math.random() - 0.48) * 0.02)),
            pulsePhase: node.pulsePhase + 0.02,
          };
        });
        return newNodes;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isLoaded, nodes.length]);

  // Animate packets
  useEffect(() => {
    if (!isLoaded || nodes.length === 0) return;

    const interval = setInterval(() => {
      setPackets(prev => {
        // Remove completed packets
        let newPackets = prev
          .map(p => ({ ...p, progress: p.progress + p.speed }))
          .filter(p => p.progress < 1);

        // Add new packets
        if (Math.random() > 0.5) {
          const activeNodes = nodes.filter(n => n.activity > 0.5);
          if (activeNodes.length > 0) {
            const fromNode = activeNodes[Math.floor(Math.random() * activeNodes.length)];
            if (fromNode.connections.length > 0) {
              const toId = fromNode.connections[Math.floor(Math.random() * fromNode.connections.length)];
              newPackets.push({
                id: `packet-${Date.now()}-${Math.random()}`,
                fromId: fromNode.id,
                toId,
                progress: 0,
                speed: 0.01 + Math.random() * 0.02,
              });
            }
          }
        }

        // Limit total packets
        if (newPackets.length > 100) {
          newPackets = newPackets.slice(-100);
        }

        return newPackets;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isLoaded, nodes]);

  // Get connected nodes (including secondary connections)
  const getConnectedNodeIds = useCallback((node: NeuralNode): Set<string> => {
    const connected = new Set<string>();
    const toProcess = [node.id];
    const visited = new Set<string>();

    while (toProcess.length > 0) {
      const currentId = toProcess.shift()!;
      if (visited.has(currentId)) continue;
      visited.add(currentId);

      const currentNode = nodes.find(n => n.id === currentId);
      if (!currentNode) continue;

      currentNode.connections.forEach(connId => {
        if (!visited.has(connId)) {
          connected.add(connId);
          toProcess.push(connId);
        }
      });
    }

    return connected;
  }, [nodes]);

  // Build connection map
  const connectionMap = useMemo(() => {
    const map = new Map<string, { from: NeuralNode; to: NeuralNode }>();
    nodes.forEach(node => {
      node.connections.forEach(connId => {
        const other = nodes.find(n => n.id === connId);
        if (other) {
          const key = [node.id, connId].sort().join('-');
          if (!map.has(key)) {
            map.set(key, { from: node, to: other });
          }
        }
      });
    });
    return map;
  }, [nodes]);

  const handleNodeSelect = useCallback((node: NeuralNode) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
  }, []);

  const connectedIds = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    return getConnectedNodeIds(selectedNode);
  }, [selectedNode, getConnectedNodeIds]);

  // Packets for each connection
  const connectionPackets = useMemo(() => {
    const map = new Map<string, Packet[]>();
    packets.forEach(packet => {
      const key = [packet.fromId, packet.toId].sort().join('-');
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(packet);
    });
    return map;
  }, [packets]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-32 overflow-hidden"
      id="neural-network"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-nexus-black">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 60%)',
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
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
            <Activity className="w-6 h-6 text-nexus-cyan" />
            <span className="text-sm font-orbitron tracking-[0.3em] text-nexus-blue">
              COGNITIVE ARCHITECTURE
            </span>
            <Activity className="w-6 h-6 text-nexus-cyan" />
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-white">Neural</span>
            <span className="gradient-text"> Matrix</span>
          </motion.h2>

          <motion.p
            className="text-xl font-rajdhani text-white/50 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            A living AI brain processing information in real time
          </motion.p>

          {/* Node type legend */}
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Object.entries(nodeTypes).map(([type, config]) => {
              const Icon = config.icon;
              return (
                <div
                  key={type}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: config.color }}
                  />
                  <Icon size={12} style={{ color: config.color }} />
                  <span className="text-xs font-orbitron text-white/60">{type}</span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Neural network canvas */}
        <motion.div
          className="relative w-full aspect-square max-w-4xl mx-auto rounded-3xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, rgba(0, 20, 40, 0.6) 0%, rgba(0, 10, 20, 0.8) 100%)',
            border: '1px solid rgba(0, 255, 247, 0.1)',
            boxShadow: '0 0 80px rgba(0, 212, 255, 0.1), inset 0 0 100px rgba(0, 20, 40, 0.5)',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full"
          >
            <defs>
              <filter id="blur">
                <feGaussianBlur stdDeviation="0.5" />
              </filter>
            </defs>

            {/* Connections */}
            <g>
              {Array.from(connectionMap.entries()).map(([key, { from, to }]) => {
                const isActive = selectedNode
                  ? connectedIds.has(from.id) && connectedIds.has(to.id)
                  : false;

                return (
                  <NeuralConnection
                    key={key}
                    from={from}
                    to={to}
                    isActive={isActive}
                    packets={connectionPackets.get(key) || []}
                    onConnectionHover={() => {}}
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g>
              {nodes.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const isConnected = connectedIds.has(node.id) && !isSelected;
                const scale = node.activity > 0.7 ? 1.1 : 1;

                return (
                  <NeuralNodeComponent
                    key={node.id}
                    node={node}
                    isSelected={isSelected}
                    isConnected={isConnected}
                    scale={scale}
                    onSelect={() => handleNodeSelect(node)}
                  />
                );
              })}
            </g>
          </svg>

          {/* HUD overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            <div className="text-left">
              <motion.div
                className="flex items-center gap-2 text-xs font-orbitron text-nexus-cyan/70"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse" />
                ACTIVE NODES: {nodes.length}
              </motion.div>
              <div className="text-xs font-rajdhani text-white/40 mt-1">
                CONNECTIONS: {connectionMap.size}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-orbitron text-nexus-cyan/70">
                PACKETS: {packets.length}
              </div>
              <div className="text-xs font-rajdhani text-white/40 mt-1">
                ACTIVE CONNECTIONS: {Math.floor(packets.length * 0.3)}
              </div>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
            <div className="text-xs font-rajdhani text-white/40">
              SIMULATION MODE: ACTIVE
            </div>
            <div className="flex items-center gap-3">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-xs font-orbitron text-green-400">COGNITIVE MATRIX ONLINE</span>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-nexus-cyan/20" />
          <div className="absolute top-0 right-0 w-12 h-12 border-r-2 border-t-2 border-nexus-cyan/20" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-l-2 border-b-2 border-nexus-cyan/20" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-nexus-cyan/20" />
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm font-rajdhani text-white/40">
            Click any node to explore its neural connections
          </p>
        </motion.div>
      </div>

      {/* Info panel */}
      <AnimatePresence>
        {selectedNode && (
          <NodeInfoPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
