import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const CameraController = () => {
  const { camera, mouse } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 12));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    // Smooth camera position based on mouse
    const targetX = mouse.x * 2;
    const targetY = -mouse.y * 1.5;

    targetPosition.current.x += (targetX - targetPosition.current.x) * 0.02;
    targetPosition.current.y += (targetY - targetPosition.current.y) * 0.02;

    // Subtle breathing motion
    const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    const distance = 12 + Math.sin(state.clock.elapsedTime * 0.3) * 0.5;

    camera.position.x += (targetPosition.current.x - camera.position.x) * 0.03;
    camera.position.y += (targetPosition.current.y + breathe - camera.position.y) * 0.03;
    camera.position.z += (distance - camera.position.z) * 0.02;

    // Smooth look at center with slight offset
    const lookAtX = mouse.x * 0.5;
    const lookAtY = -mouse.y * 0.3;
    targetLookAt.current.x += (lookAtX - targetLookAt.current.x) * 0.05;
    targetLookAt.current.y += (lookAtY - targetLookAt.current.y) * 0.05;

    camera.lookAt(targetLookAt.current);
  });

  return null;
};
