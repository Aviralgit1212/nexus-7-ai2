import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  opacity: number;
}

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const particleCount = 150;
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: Math.random() * 2 + 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z -= particle.vz;

        // Mouse interaction
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          particle.vx -= dx * 0.0001;
          particle.vy -= dy * 0.0001;
        }

        // Reset particle if it goes too close
        if (particle.z < 1) {
          particle.z = 1000;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }

        // Calculate 3D perspective
        const perspective = 1000;
        const scale = perspective / (perspective + particle.z);
        const screenX = (particle.x - canvas.width / 2) * scale + canvas.width / 2;
        const screenY = (particle.y - canvas.height / 2) * scale + canvas.height / 2;
        const size = particle.size * scale * 3;

        // Calculate opacity based on z-depth
        const depthOpacity = (1000 - particle.z) / 1000;
        const finalOpacity = particle.opacity * depthOpacity;

        // Draw particle
        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${finalOpacity})`;
        ctx.fill();

        // Draw glow
        const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, size * 4);
        gradient.addColorStop(0, `rgba(0, 255, 247, ${finalOpacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(screenX, screenY, size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections to nearby particles
        particlesRef.current.slice(index + 1).forEach(other => {
          const otherScale = perspective / (perspective + other.z);
          const otherScreenX = (other.x - canvas.width / 2) * otherScale + canvas.width / 2;
          const otherScreenY = (other.y - canvas.height / 2) * otherScale + canvas.height / 2;

          const distance = Math.sqrt(
            (screenX - otherScreenX) ** 2 + (screenY - otherScreenY) ** 2
          );

          if (distance < 100 && scale > 0.5 && otherScale > 0.5) {
            const lineOpacity = (1 - distance / 100) * 0.2 * Math.min(scale, otherScale);
            ctx.beginPath();
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(otherScreenX, otherScreenY);
            ctx.strokeStyle = `rgba(0, 212, 255, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-60"
      style={{ pointerEvents: 'none' }}
    />
  );
};
