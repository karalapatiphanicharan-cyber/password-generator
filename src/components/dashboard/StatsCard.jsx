import { motion } from 'framer-motion';

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'primary', delay = 0 }) {
  const colorMap = {
    primary: 'from-primary-600 to-primary-400 shadow-primary-500/20',
    green: 'from-green-600 to-green-400 shadow-green-500/20',
    yellow: 'from-yellow-600 to-yellow-400 shadow-yellow-500/20',
    cyan: 'from-cyan-600 to-cyan-400 shadow-cyan-500/20',
    purple: 'from-purple-600 to-purple-400 shadow-purple-500/20',
    red: 'from-red-600 to-red-400 shadow-red-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="glass-card p-5 flex items-center gap-4"
    >
      {/* Icon box */}
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg flex-shrink-0`}>
        {Icon && <Icon className="text-white text-2xl" />}
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-xs text-white/50 font-medium uppercase tracking-wider">{title}</p>
        <motion.p
          className="text-2xl font-bold text-white mt-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          {value ?? '—'}
        </motion.p>
        {subtitle && <p className="text-xs text-white/40 mt-0.5 truncate">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
