import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';

const navItems = [
  { label: 'Systems', href: '#systems' },
  { label: 'Core', href: '#nexus-core' },
  { label: 'Network', href: '#network' },
  { label: 'Projects', href: '#projects' },
  { label: 'Global', href: '#global' },
  { label: 'Vision', href: '#vision' },
  { label: 'Access', href: '#contact' },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-nexus-black/80 backdrop-blur-xl' : 'bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <motion.div
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-nexus-cyan/20 to-nexus-blue/20 flex items-center justify-center border border-nexus-cyan/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Zap size={20} className="text-nexus-cyan" />
              </motion.div>
              <span className="font-orbitron font-bold text-xl tracking-wider group-hover:text-nexus-cyan transition-colors duration-300">
                NEXUS-7
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="relative font-rajdhani text-sm tracking-wider text-white/70 hover:text-nexus-cyan transition-colors duration-300"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-px bg-nexus-cyan"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </nav>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="lg:hidden p-2 text-white/70 hover:text-nexus-cyan transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-nexus-black/95 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Menu content */}
            <motion.nav
              className="absolute inset-0 flex flex-col items-center justify-center gap-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.1 }}
            >
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="text-2xl font-orbitron text-white/70 hover:text-nexus-cyan transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </motion.nav>

            {/* Close button */}
            <motion.button
              className="absolute top-6 right-6 p-4 text-white/50 hover:text-nexus-cyan transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <X size={32} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
