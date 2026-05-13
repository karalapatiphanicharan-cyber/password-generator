import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiShieldKeyholeLine, RiArrowLeftLine } from 'react-icons/ri';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center cyber-grid"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Animated glitch number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <p className="text-[10rem] font-extrabold leading-none select-none"
          style={{
            background: 'linear-gradient(135deg, #5c7cfa, #7950f2, #00d2ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(92,124,250,0.4))',
          }}>
          404
        </p>
        {/* Glitch overlay */}
        <p className="absolute inset-0 text-[10rem] font-extrabold leading-none select-none opacity-20"
          style={{
            color: '#00d2ff',
            transform: 'translate(4px, 2px)',
            mixBlendMode: 'screen',
          }}>
          404
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-4 max-w-md"
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-neon">
            <RiShieldKeyholeLine className="text-white text-3xl" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white">Page Not Found</h1>
        <p className="text-white/50 leading-relaxed">
          The page you're looking for doesn't exist, was moved, or you may have mistyped the URL.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex items-center gap-2"
            >
              <RiArrowLeftLine /> Back to Home
            </motion.button>
          </Link>
          <Link to="/generator">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary flex items-center gap-2"
            >
              Generate Password
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Animated particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary-500/40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 1, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </div>
  );
}
