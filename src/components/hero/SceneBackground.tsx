import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

// Distant stars in the background
export const Stars = () => {
  const starsRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Varied colors: white, cyan, purple
      const colorChoice = Math.random();
      if (colorChoice < 0.7) {
        col[i * 3] = 1;
        col[i * 3 + 1] = 1;
        col[i * 3 + 2] = 1;
      } else if (colorChoice < 0.9) {
        col[i * 3] = 0;
        col[i * 3 + 1] = 0.83;
        col[i * 3 + 2] = 1;
      } else {
        col[i * 3] = 0.66;
        col[i * 3 + 1] = 0.33;
        col[i * 3 + 2] = 0.97;
      }

      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions: pos, colors: col, sizes };
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
      starsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.01;
    }
  });

  return (
    <points ref={starsRef}>
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
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Floating background particles (digital dust)
export const BackgroundParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);

  const { positions, velocities, colors } = useMemo(() => {
    const count = 500;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;

      vel[i * 3] = (Math.random() - 0.5) * 0.005;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.005;

      col[i * 3] = 0;
      col[i * 3 + 1] = 0.83 + Math.random() * 0.17;
      col[i * 3 + 2] = 1;
    }

    return { positions: pos, velocities: vel, colors: col };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.attributes.position;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < posArray.length / 3; i++) {
        posArray[i * 3] += velocities[i * 3];
        posArray[i * 3 + 1] += velocities[i * 3 + 1];
        posArray[i * 3 + 2] += velocities[i * 3 + 2];

        // Wrap around
        if (posArray[i * 3] > 15) posArray[i * 3] = -15;
        if (posArray[i * 3] < -15) posArray[i * 3] = 15;
        if (posArray[i * 3 + 1] > 10) posArray[i * 3 + 1] = -10;
        if (posArray[i * 3 + 1] < -10) posArray[i * 3 + 1] = 10;
        if (posArray[i * 3 + 2] > 15) posArray[i * 3 + 2] = -15;
        if (posArray[i * 3 + 2] < -15) posArray[i * 3 + 2] = 15;
      }

      posAttr.needsUpdate = true;
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
        size={0.02}
        vertexColors
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Neural energy lines connecting distant points
export const NeuralLines = () => {
  const linesRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const result: { points: [number, number, number][]; color: string }[] = [];

    for (let i = 0; i < 20; i++) {
      const points: [number, number, number][] = [];
      const startX = (Math.random() - 0.5) * 20;
      const startY = (Math.random() - 0.5) * 15;
      const startZ = -10 + Math.random() * -10;

      for (let j = 0; j < 10; j++) {
        points.push([
          startX + (Math.random() - 0.5) * 5,
          startY + (Math.random() - 0.5) * 5,
          startZ + j * 2
        ]);
      }

      result.push({
        points,
        color: Math.random() > 0.5 ? '#00fff7' : '#a855f7',
      });
    }

    return result;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          color={line.color}
          lineWidth={1}
          transparent
          opacity={0.15}
        />
      ))}
    </group>
  );
};

// Ambient fog plane
export const AmbientFog = () => {
  const fogRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null);

  useFrame((state) => {
    if (fogRef.current) {
      fogRef.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={fogRef} position={[0, 0, -20]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial
        color="#050510"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Combined background
export const SceneBackground = () => {
  return (
    <group>
      <Stars />
      <BackgroundParticles />
      <NeuralLines />
      <AmbientFog />

      {/* Ambient lights */}
      <ambientLight color="#111122" intensity={0.3} />
      <pointLight position={[10, 10, 10]} color="#00fff7" intensity={0.5} />
      <pointLight position={[-10, -10, -10]} color="#a855f7" intensity={0.3} />
    </group>
  );
};
