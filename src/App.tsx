import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { LoadingScreen } from './components/LoadingScreen';
import { CustomCursor } from './components/CustomCursor';
import { ParticleSystem } from './components/ParticleSystem';
import { Navigation } from './components/Navigation';
import { CinematicHeroSection } from './components/hero/CinematicHeroSection';
import { AISystemsSection } from './components/AISystemsSection';
import { NexusCoreSection } from './components/NexusCoreSection';
import { NeuralNetworkSection } from './components/NeuralNetworkSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CommandCenterSection } from './components/CommandCenterSection';
import { FutureVisionSection } from './components/FutureVisionSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize GSAP ScrollTrigger
  useEffect(() => {
    if (!isLoading) {
      // Smooth scroll behavior
      gsap.defaults({
        ease: 'power2.inOut',
      });

      // Clean up on unmount
      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 100);
  };

  const handleExploreClick = () => {
    const systemsSection = document.getElementById('systems');
    if (systemsSection) {
      systemsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="bg-nexus-black min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Custom cursor */}
          <CustomCursor />

          {/* Global particle system */}
          <ParticleSystem />

          {/* Navigation */}
          <Navigation />

          {/* Cinematic Hero */}
          <CinematicHeroSection onExploreClick={handleExploreClick} />

          {/* AI Systems Section */}
          <div id="systems">
            <AISystemsSection />
          </div>

          {/* Nexus Core Dashboard */}
          <NexusCoreSection />

          {/* Neural Network Matrix */}
          <NeuralNetworkSection />

          {/* Projects */}
          <ProjectsSection />

          {/* Command Center */}
          <CommandCenterSection />

          {/* Future Vision */}
          <FutureVisionSection />

          {/* Contact */}
          <ContactSection />

          {/* Footer */}
          <Footer />
        </motion.div>
      )}
    </div>
  );
}

export default App;
