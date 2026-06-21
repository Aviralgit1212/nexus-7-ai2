import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// Core artifact - floating crystalline structure
const ArtifactCore = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (innerRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
      innerRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      {/* Outer shell - icosahedron wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial
          color="#00fff7"
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Inner core - glowing sphere */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00fff7"
          emissiveIntensity={2}
          transparent
          opacity={0.9}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Central energy point */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>

      {/* Point light from core */}
      <pointLight color="#00fff7" intensity={5} distance={10} decay={2} />
      <pointLight color="#a855f7" intensity={2} distance={8} decay={3} />
    </group>
  );
};

// Orbiting rings with energy
const OrbitingRings = () => {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(() => [
    { radius: 2, speed: 0.5, rotation: [Math.PI / 2, 0, 0], color: '#00fff7' },
    { radius: 2.5, speed: -0.4, rotation: [Math.PI / 3, Math.PI / 6, 0], color: '#00d4ff' },
    { radius: 3, speed: 0.3, rotation: [Math.PI / 4, Math.PI / 4, Math.PI / 8], color: '#a855f7' },
    { radius: 3.5, speed: -0.25, rotation: [Math.PI / 5, -Math.PI / 6, Math.PI / 4], color: '#00fff7' },
  ], []);

  useFrame((state) => {
    rings.forEach((ring, i) => {
      const child = groupRef.current?.children[i] as THREE.Mesh;
      if (child) {
        child.rotation.z += ring.speed * 0.01;

        // Subtle wobble
        const wobble = Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.02;
        child.rotation.x = ring.rotation[0] + wobble;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={ring.rotation as [number, number, number]}>
          <torusGeometry args={[ring.radius, 0.02, 16, 100]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={0.7 - i * 0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

// Floating data nodes orbiting the artifact
const DataNodes = () => {
  const nodesRef = useRef<THREE.Group>(null);

  const nodes = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      angle: (i / 24) * Math.PI * 2,
      radius: 2.8 + Math.random() * 1.5,
      height: (Math.random() - 0.5) * 2,
      speed: 0.2 + Math.random() * 0.4,
      size: 0.06 + Math.random() * 0.04,
    })),
    []);

  useFrame((state) => {
    nodes.forEach((node, i) => {
      const child = nodesRef.current?.children[i];
      if (child) {
        const newAngle = node.angle + state.clock.elapsedTime * node.speed * 0.1;
        child.position.x = Math.cos(newAngle) * node.radius;
        child.position.z = Math.sin(newAngle) * node.radius;
        child.position.y = node.height + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.2;
      }
    });
  });

  return (
    <group ref={nodesRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={[Math.cos(node.angle) * node.radius, node.height, Math.sin(node.angle) * node.radius]}>
          <octahedronGeometry args={[node.size, 0]} />
          <meshStandardMaterial
            color="#00fff7"
            emissive="#00d4ff"
            emissiveIntensity={1}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

// Holographic energy streams connecting nodes
const EnergyStreams = () => {
  const groupRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const radius = 3.5 + Math.sin(angle * 5) * 0.5;
      pts.push([
        Math.cos(angle) * radius,
        Math.sin(angle * 3) * 1.5,
        Math.sin(angle) * radius
      ]);
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Line
        points={points}
        color="#00fff7"
        lineWidth={1}
        transparent
        opacity={0.3}
      />
    </group>
  );
};

// Glowing particles emitted from artifact
const ArtifactParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, velocities, colors } = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1 + Math.random() * 2;

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = Math.random() * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      const t = Math.random();
      col[i * 3] = t < 0.5 ? 0 : 0.65;
      col[i * 3 + 1] = t < 0.5 ? 0.83 : 0.33;
      col[i * 3 + 2] = 1;
    }

    return { positions: pos, velocities: vel, colors: col };
  }, []);

  useFrame((_state) => {
    if (particlesRef.current) {
      const positionAttr = particlesRef.current.geometry.attributes.position;
      const posArray = positionAttr.array as Float32Array;

      for (let i = 0; i < posArray.length / 3; i++) {
        posArray[i * 3] += velocities[i * 3];
        posArray[i * 3 + 1] += velocities[i * 3 + 1];
        posArray[i * 3 + 2] += velocities[i * 3 + 2];

        // Reset if too far
        const dist = Math.sqrt(
          posArray[i * 3] ** 2 +
          posArray[i * 3 + 1] ** 2 +
          posArray[i * 3 + 2] ** 2
        );
        if (dist > 6) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          posArray[i * 3] = Math.sin(phi) * Math.cos(theta);
          posArray[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
          posArray[i * 3 + 2] = Math.cos(phi);
        }
      }

      positionAttr.needsUpdate = true;
      particlesRef.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Main AI Artifact component
export const AIArtifact = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((_state) => {
    if (groupRef.current) {
      // Smooth mouse following
      groupRef.current.rotation.y += (mouse.x * 0.3 - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x += (-mouse.y * 0.2 - groupRef.current.rotation.x) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <ArtifactCore />
      <OrbitingRings />
      <DataNodes />
      <EnergyStreams />
      <ArtifactParticles />
    </group>
  );
};
