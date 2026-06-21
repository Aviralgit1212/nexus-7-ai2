import { motion } from 'framer-motion';
import { Zap, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = [
  { label: 'Documentation', href: '#' },
  { label: 'API Reference', href: '#' },
  { label: 'Research Papers', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Press', href: '#' },
];

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
];

export const Footer = () => {
  return (
    <footer className="relative bg-nexus-darker border-t border-white/5">
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nexus-cyan/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              className="flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-nexus-cyan/20 to-nexus-blue/20 flex items-center justify-center border border-nexus-cyan/30">
                <Zap size={20} className="text-nexus-cyan" />
              </div>
              <span className="font-orbitron font-bold text-xl tracking-wider">
                NEXUS-7
              </span>
            </motion.div>
            <p className="text-white/50 font-rajdhani leading-relaxed max-w-md mb-6">
              Engineering the cognitive infrastructure of tomorrow. Building AI systems that transcend the boundaries of traditional computing.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:border-nexus-cyan/30 transition-colors duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon size={18} className="text-white/50 hover:text-nexus-cyan" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-orbitron text-sm tracking-wider text-nexus-cyan mb-6">
              RESOURCES
            </h4>
            <ul className="space-y-3">
              {footerLinks.slice(0, 3).map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/50 hover:text-nexus-cyan font-rajdhani transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-orbitron text-sm tracking-wider text-nexus-cyan mb-6">
              COMPANY
            </h4>
            <ul className="space-y-3">
              {footerLinks.slice(3).map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/50 hover:text-nexus-cyan font-rajdhani transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-white/30 font-rajdhani">
              © 2045 NEXUS-7 Corporation. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-white/30 font-rajdhani">
              <a href="#" className="hover:text-nexus-cyan transition-colors">Privacy Protocol</a>
              <a href="#" className="hover:text-nexus-cyan transition-colors">Terms of Service</a>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none">
        <motion.div
          className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-nexus-cyan/10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none">
        <motion.div
          className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-nexus-cyan/10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        />
      </div>
    </footer>
  );
};
