import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Lock, User, Send, Shield, Eye } from 'lucide-react';

// AI Eye component that follows cursor and closes on password focus
const AIEye = ({
  containerRef,
  isPasswordFocused,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  isPasswordFocused: boolean;
}) => {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isPasswordFocused) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const maxMove = 10;
      const dx = Math.min(Math.max((e.clientX - centerX) / 30, -maxMove), maxMove);
      const dy = Math.min(Math.max((e.clientY - centerY) / 30, -maxMove), maxMove);

      setEyePosition({ x: dx, y: dy });
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [containerRef, isPasswordFocused]);

  return (
    <div className="relative w-32 h-32 mx-auto mb-12">
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-nexus-cyan/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      {/* Eye container */}
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-nexus-darker to-black overflow-hidden"
        style={{ boxShadow: '0 0 30px rgba(0, 255, 247, 0.2)' }}
        animate={{
          boxShadow: isPasswordFocused
            ? '0 0 10px rgba(239, 68, 68, 0.3)'
            : '0 0 30px rgba(0, 255, 247, 0.3)',
        }}
      >
        {/* Eye white */}
        <div className="absolute inset-2 rounded-full bg-white/5" />

        {/* Iris */}
        <motion.div
          className="absolute inset-6 rounded-full overflow-hidden"
          style={{
            background: 'radial-gradient(circle, #00fff7 0%, #00d4ff 50%, #0066ff 100%)',
          }}
          animate={{
            scale: isPasswordFocused ? 0.8 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Pupil */}
          <motion.div
            className="absolute rounded-full bg-nexus-black"
            style={{
              width: '50%',
              height: '50%',
              left: '25%',
              top: '25%',
              transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
            }}
            animate={{
              width: isPasswordFocused ? '90%' : '50%',
              height: isPasswordFocused ? '90%' : '50%',
            }}
            transition={{ duration: 0.2 }}
          />

          {/* Highlight */}
          <motion.div
            className="absolute w-3 h-3 rounded-full bg-white/70"
            style={{
              left: '30%',
              top: '30%',
              transform: `translate(${eyePosition.x}px, ${eyePosition.y}px)`,
            }}
            animate={{
              opacity: isPasswordFocused ? 0 : 1,
            }}
          />
        </motion.div>

        {/* Closing eyelid */}
        <motion.div
          className="absolute inset-0 bg-nexus-black"
          initial={{ scaleY: 0, transformOrigin: 'top' }}
          animate={{
            scaleY: isPasswordFocused ? 1 : 0,
            transformOrigin: isPasswordFocused ? 'center' : 'top',
          }}
          transition={{ duration: 0.15, ease: 'easeInOut' }}
        />

        {/* Scan lines overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 212, 255, 0.1) 2px, rgba(0, 212, 255, 0.1) 4px)',
          }}
        />
      </motion.div>

      {/* Status indicator */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-orbitron tracking-wider flex items-center gap-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isPasswordFocused ? (
          <>
            <Shield className="w-3 h-3 text-red-500" />
            <span className="text-red-400">SECURE MODE</span>
          </>
        ) : (
          <>
            <Eye className="w-3 h-3 text-nexus-cyan" />
            <span className="text-nexus-cyan">AI SENTINEL ACTIVE</span>
          </>
        )}
      </motion.div>
    </div>
  );
};

// Futuristic input field
const FormField = ({
  icon: Icon,
  label,
  type,
  placeholder,
  onFocus,
  onBlur,
  isFocused,
}: {
  icon: React.ElementType;
  label: string;
  type: string;
  placeholder: string;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
}) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <label className="block text-sm font-orbitron text-white/50 mb-2 tracking-wider">
        {label}
      </label>
      <div className="relative">
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
            isFocused ? 'text-nexus-cyan' : 'text-white/30'
          }`}
        >
          <Icon size={20} />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white font-rajdhani focus:outline-none transition-all duration-300 placeholder:text-white/20 focus:border-nexus-cyan/50 focus:bg-white/10"
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {/* Glow effect on focus */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 1 : 0 }}
          style={{
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
          }}
          transition={{ duration: 0.3 }}
        />
        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 40%, rgba(0, 255, 247, 0.5) 50%, transparent 60%)`,
            backgroundSize: '300% 300%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>
    </motion.div>
  );
};

export const ContactSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: '-200px' });
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 overflow-hidden"
      id="contact"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-nexus-black via-nexus-darker to-nexus-black">
        <div className="absolute inset-0 cyber-grid opacity-20" />
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="relative z-10 max-w-4xl mx-auto px-6"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          <motion.span
            className="inline-block text-sm font-orbitron tracking-[0.3em] text-nexus-blue mb-4"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            SECURE ACCESS PORTAL
          </motion.span>

          <motion.h2
            className="text-4xl md:text-6xl font-orbitron font-bold text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <span className="text-white">Request</span>
            <span className="gradient-text"> Access</span>
          </motion.h2>

          <motion.p
            className="text-xl font-rajdhani text-white/50 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            Join the next evolution of cognitive technology
          </motion.p>
        </motion.div>

        {/* AI Eye */}
        <AIEye containerRef={containerRef} isPasswordFocused={passwordFocused} />

        {/* Form container */}
        <motion.div
          className="glass rounded-2xl p-8 md:p-12 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          {/* Security warning on password focus */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-nexus-black/80 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: passwordFocused ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: passwordFocused ? 1 : 0 }}
                transition={{ duration: 0.3, delay: passwordFocused ? 0.15 : 0 }}
              >
                <Shield className="w-16 h-16 mx-auto text-nexus-cyan mb-4" />
                <p className="text-xl font-orbitron text-nexus-cyan">SECURE FIELD</p>
                <p className="text-white/50 font-rajdhani mt-2">AI Sentinel is protecting your data</p>
              </motion.div>
            </div>
          </motion.div>

          <form className="space-y-6 relative z-0">
            <FormField
              icon={User}
              label="DESIGNATION"
              type="text"
              placeholder="Enter your name"
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              isFocused={nameFocused}
            />
            <FormField
              icon={Mail}
              label="COMMUNICATION CHANNEL"
              type="email"
              placeholder="Enter your email"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              isFocused={emailFocused}
            />
            <FormField
              icon={Lock}
              label="ACCESS CODE"
              type="password"
              placeholder="Create access key"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              isFocused={passwordFocused}
            />

            {/* Submit button */}
            <motion.button
              type="submit"
              data-hover
              className="w-full relative py-4 rounded-xl font-orbitron text-sm tracking-wider uppercase overflow-hidden group mt-8"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-nexus-cyan to-nexus-blue"
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: 0.5 }}
              />
              <div className="relative z-10 flex items-center justify-center gap-3 text-nexus-black font-bold">
                <span>Initialize Access Protocol</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Send size={18} />
                </motion.div>
              </div>
              <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0, 255, 247, 0.3)',
                    '0 0 40px rgba(0, 255, 247, 0.5)',
                    '0 0 20px rgba(0, 255, 247, 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          </form>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-nexus-cyan/20" />
          <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-nexus-cyan/20" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-nexus-cyan/20" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-nexus-cyan/20" />
        </motion.div>

        {/* Security notice */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-3 text-sm text-white/30 font-rajdhani"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        >
          <Shield size={16} className="text-nexus-cyan" />
          <span>All communications secured with quantum encryption</span>
        </motion.div>
      </div>
    </section>
  );
};
