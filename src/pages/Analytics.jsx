import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiBarChartLine, RiShieldCheckLine, RiTimeLine, RiLockPasswordLine } from 'react-icons/ri';
import { StrengthPieChart, ActivityBarChart } from '../components/dashboard/StrengthChart';
import StatsCard from '../components/dashboard/StatsCard';

// Compute stats from localStorage data
const computeStats = (history) => {
  const total = history.length;
  const strengthBreakdown = {};
  let totalEntropy = 0;
  let totalScore = 0;

  history.forEach(h => {
    strengthBreakdown[h.strength] = (strengthBreakdown[h.strength] || 0) + 1;
    totalEntropy += h.entropy || 0;
    totalScore += h.strengthScore || 0;
  });

  // Last 7 days activity
  const now = Date.now();
  const activityMap = {};
  history.forEach(h => {
    const d = new Date(h.createdAt);
    if (now - d.getTime() < 7 * 86400000) {
      const key = d.toISOString().slice(0, 10);
      activityMap[key] = (activityMap[key] || 0) + 1;
    }
  });
  const recentActivity = Object.entries(activityMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([_id, count]) => ({ _id, count }));

  return {
    totalGenerated: total,
    strengthBreakdown,
    averageEntropy: total ? Math.round(totalEntropy / total) : 0,
    averageScore: total ? Math.round(totalScore / total) : 0,
    recentActivity,
  };
};

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('pw_history') || '[]');
    setStats(computeStats(history));
  }, []);

  const breakdown = stats?.strengthBreakdown || {};
  const total = stats?.totalGenerated || 0;
  const getPercent = (key) => total > 0 ? Math.round(((breakdown[key] || 0) / total) * 100) : 0;

  return (
    <div className="page-transition space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <RiBarChartLine className="text-primary-400" />
          Security Analytics
        </h1>
        <p className="text-white/50 mt-1 text-sm">
          Insights from your locally saved passwords.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Passwords"  value={total}                          icon={RiLockPasswordLine} color="primary" delay={0}   />
        <StatsCard title="Avg. Entropy"     value={`${stats?.averageEntropy ?? 0} bits`} icon={RiShieldCheckLine}  color="cyan"    delay={0.1} />
        <StatsCard title="Avg. Score"       value={`${stats?.averageScore ?? 0}%`} icon={RiBarChartLine}     color="green"   delay={0.2} />
        <StatsCard title="Very Strong"      value={breakdown['very-strong'] || 0}  subtitle={`${getPercent('very-strong')}% of total`} icon={RiTimeLine} color="purple" delay={0.3} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h2 className="font-bold text-white mb-1">Strength Distribution</h2>
          <p className="text-xs text-white/40 mb-5">Breakdown of all saved passwords by strength level</p>
          <StrengthPieChart data={breakdown} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h2 className="font-bold text-white mb-1">7-Day Activity</h2>
          <p className="text-xs text-white/40 mb-5">Passwords saved per day this week</p>
          <ActivityBarChart data={stats?.recentActivity || []} />
        </motion.div>
      </div>

      {/* Strength breakdown bars */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
        <h2 className="font-bold text-white mb-5">Strength Breakdown</h2>
        <div className="space-y-4">
          {[
            { key: 'very-strong', label: 'Very Strong', colorClass: 'bg-cyan-500',   textClass: 'text-cyan-400'   },
            { key: 'strong',      label: 'Strong',      colorClass: 'bg-green-500',  textClass: 'text-green-400'  },
            { key: 'medium',      label: 'Medium',      colorClass: 'bg-yellow-500', textClass: 'text-yellow-400' },
            { key: 'weak',        label: 'Weak',        colorClass: 'bg-red-500',    textClass: 'text-red-400'    },
          ].map(({ key, label, colorClass, textClass }) => {
            const count = breakdown[key] || 0;
            const pct = getPercent(key);
            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-sm font-medium ${textClass}`}>{label}</span>
                  <span className="text-sm text-white/60">
                    {count} <span className="text-white/30">({pct}%)</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${colorClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {total === 0 && (
        <div className="text-center text-white/30 text-sm py-4">
          No data yet — generate and save some passwords first!
        </div>
      )}
    </div>
  );
}
