import { motion } from 'framer-motion';
import { RiShieldLine, RiTimeLine, RiBarChartLine, RiLightbulbLine } from 'react-icons/ri';
import { getStrengthConfig } from '../../utils/passwordUtils';

export default function StrengthMeter({ strength, score, entropy, crackTime, suggestions }) {
  const config = getStrengthConfig(strength || 'weak');
  const segments = [1, 2, 3, 4];

  return (
    <div className="glass-card p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white/90 flex items-center gap-2">
          <RiShieldLine className="text-primary-400" />
          Strength Analysis
        </h3>
        <span className={`badge ${strength ? `badge-${strength}` : 'badge-weak'} text-sm px-3 py-1`}>
          {config.label}
        </span>
      </div>

      {/* Segmented strength bar */}
      <div className="space-y-2">
        <div className="flex gap-1.5">
          {segments.map((seg) => (
            <motion.div
              key={seg}
              className="flex-1 h-2.5 rounded-full overflow-hidden bg-white/10"
              initial={false}
            >
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${config.gradient}`}
                initial={{ width: 0 }}
                animate={{ width: config.segments >= seg ? '100%' : '0%' }}
                transition={{ duration: 0.5, delay: seg * 0.1, ease: 'easeOut' }}
              />
            </motion.div>
          ))}
        </div>

        {/* Score percentage */}
        <div className="flex justify-between text-xs text-white/40">
          <span>Weak</span>
          <span className={`font-semibold ${config.textColor}`}>{score || 0}% secure</span>
          <span>Very Strong</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
            <RiBarChartLine />
            <span>Entropy</span>
          </div>
          <p className="text-white font-mono font-semibold">{entropy || 0} <span className="text-xs text-white/40">bits</span></p>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
            <RiTimeLine />
            <span>Crack Time</span>
          </div>
          <p className="text-white font-mono font-semibold text-sm truncate">{crackTime || '—'}</p>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-white/50 flex items-center gap-1.5">
            <RiLightbulbLine className="text-yellow-400" />
            Suggestions to improve:
          </p>
          <ul className="space-y-1">
            {suggestions.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="text-xs text-white/60 flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-yellow-400 flex-shrink-0" />
                {s}
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
