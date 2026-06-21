import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const AICore = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    core: THREE.Group;
    particles: THREE.Points;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050505, 5, 25);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 8;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Core group
    const core = new THREE.Group();

    // Central sphere - glowing core
    const coreGeometry = new THREE.IcosahedronGeometry(1, 2);
    const coreMaterial = new THREE.MeshPhongMaterial({
      color: 0x00fff7,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.9,
      wireframe: false,
      shininess: 100,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    core.add(coreMesh);

    // Inner wireframe
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const wireframeMesh = new THREE.Mesh(coreGeometry.clone(), wireframeMaterial);
    wireframeMesh.scale.setScalar(1.05);
    core.add(wireframeMesh);

    // Orbital rings
    const ringColors = [0x00d4ff, 0x00fff7, 0xa855f7];
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(1.8 + i * 0.5, 0.02, 16, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: ringColors[i],
        transparent: true,
        opacity: 0.6 - i * 0.15,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2 + (i * Math.PI) / 8;
      ring.rotation.y = (i * Math.PI) / 6;
      ring.userData = { speed: 0.5 - i * 0.1, offset: i };
      core.add(ring);
    }

    // Floating data nodes
    const nodeGeometry = new THREE.OctahedronGeometry(0.08);
    const nodeMaterial = new THREE.MeshPhongMaterial({
      color: 0x00fff7,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.8,
    });

    for (let i = 0; i < 24; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
      const angle = (i / 24) * Math.PI * 2;
      const radius = 2.5 + Math.random() * 1;
      const height = (Math.random() - 0.5) * 2;
      node.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
      node.userData = {
        angle,
        radius,
        height,
        speed: 0.2 + Math.random() * 0.3,
        floatSpeed: Math.random() * 0.5,
      };
      core.add(node);
    }

    // Outer shell - dodecahedron wireframe
    const shellGeometry = new THREE.DodecahedronGeometry(2.8, 0);
    const shellMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const shellMesh = new THREE.Mesh(shellGeometry, shellMaterial);
    core.add(shellMesh);

    // Particle system around core
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 3;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Color gradient from cyan to blue
      const t = Math.random();
      colors[i * 3] = 0;
      colors[i * 3 + 1] = 0.83 * (1 - t) + 0.5 * t;
      colors[i * 3 + 2] = 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    core.add(particles);

    scene.add(core);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x111122, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00fff7, 2, 20);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00d4ff, 1.5, 20);
    pointLight2.position.set(-5, -3, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xa855f7, 1, 15);
    pointLight3.position.set(0, -5, -5);
    scene.add(pointLight3);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;

      // Core pulsing
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      coreMesh.scale.setScalar(pulse);
      wireframeMesh.scale.setScalar(pulse * 1.05);

      // Core rotation
      core.rotation.y += 0.003;
      core.rotation.x += 0.001;

      // Shell rotation
      shellMesh.rotation.x += 0.002;
      shellMesh.rotation.z += 0.001;

      // Ring rotation
      core.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
          const userData = child.userData;
          if (userData.speed) {
            child.rotation.z += 0.005 * userData.speed;
          }
        }
      });

      // Node animation
      core.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.OctahedronGeometry) {
          const userData = child.userData;
          if (userData.angle !== undefined) {
            userData.angle += userData.speed * 0.01;
            child.position.x = Math.cos(userData.angle) * userData.radius;
            child.position.z = Math.sin(userData.angle) * userData.radius;
            child.position.y = userData.height + Math.sin(time * userData.floatSpeed) * 0.3;
            child.rotation.x += 0.02;
            child.rotation.y += 0.03;
          }
        }
      });

      // Particle rotation
      particles.rotation.y += 0.002;
      particles.rotation.x += 0.001;

      // Mouse interaction
      core.rotation.x += (mouseY * 0.2 - core.rotation.x) * 0.02;
      core.rotation.y += (mouseX * 0.2 - core.rotation.y) * 0.02;

      // Color shift based on mouse
      const hue = 0.5 + mouseX * 0.1;
      coreMesh.material.emissive.setHSL(hue, 1, 0.5);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Store refs
    sceneRef.current = { scene, camera, renderer, core, particles };

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      sceneRef.current.camera.aspect = newWidth / newHeight;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
