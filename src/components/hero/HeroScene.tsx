import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { AIArtifact } from './AIArtifact';
import { SceneBackground } from './SceneBackground';
import { CameraController } from './CameraController';
import { PostProcessingEffects } from './PostProcessingEffects';

// Loading fallback
const LoadingFallback = () => (
  <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshBasicMaterial color="#00fff7" wireframe />
  </mesh>
);

export const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{
          position: [0, 0, 12],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        {/* Deep space background */}
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 10, 50]} />

        <Suspense fallback={<LoadingFallback />}>
          {/* Camera that follows cursor */}
          <CameraController />

          {/* Background elements */}
          <SceneBackground />

          {/* Main AI Artifact */}
          <AIArtifact />

          {/* Post-processing effects */}
          <PostProcessingEffects />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};
