import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiDashboardLine, RiLockPasswordLine, RiHistoryLine,
  RiBarChartLine, RiArrowRightLine, RiShieldCheckLine,
} from 'react-icons/ri';
import StatsCard from '../components/dashboard/StatsCard';
import { StrengthPieChart, ActivityBarChart } from '../components/dashboard/StrengthChart';
import { StatsSkeleton } from '../components/ui/LoadingSkeleton';

// Compute dashboard stats from localStorage
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

  // Last 7 days
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

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('pw_history') || '[]');
    setStats(computeStats(history));
    setLoading(false);
  }, []);

  const strengthBreakdown = stats?.strengthBreakdown || {};

  return (
    <div className="page-transition space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <RiDashboardLine className="text-primary-400" />
            Dashboard
          </h1>
          <p className="text-white/50 mt-1 text-sm">Your password security overview 🔐</p>
        </div>
        <Link to="/generator" className="btn-primary flex items-center gap-2 text-sm">
          <RiLockPasswordLine /> Generate
        </Link>
      </div>

      {/* Stats cards */}
      {loading ? <StatsSkeleton /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Saved"    value={stats?.totalGenerated ?? 0}          subtitle="In local storage"  icon={RiLockPasswordLine} color="primary" delay={0}   />
          <StatsCard title="Avg. Entropy"   value={`${stats?.averageEntropy ?? 0} bits`} subtitle="Higher = better"  icon={RiShieldCheckLine}  color="cyan"   delay={0.1} />
          <StatsCard title="Avg. Score"     value={`${stats?.averageScore ?? 0}%`}       subtitle="Strength score"   icon={RiBarChartLine}     color="green"  delay={0.2} />
          <StatsCard title="Very Strong"    value={strengthBreakdown['very-strong'] ?? 0} subtitle="Top-tier passwords" icon={RiShieldCheckLine} color="purple" delay={0.3} />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h2 className="font-semibold text-white/90 mb-1">Strength Distribution</h2>
          <p className="text-xs text-white/40 mb-4">Breakdown of saved passwords by strength</p>
          <StrengthPieChart data={strengthBreakdown} />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h2 className="font-semibold text-white/90 mb-1">7-Day Activity</h2>
          <p className="text-xs text-white/40 mb-4">Passwords saved per day this week</p>
          <ActivityBarChart data={stats?.recentActivity || []} />
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="font-semibold text-white/90 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/generator', icon: RiLockPasswordLine, label: 'Generate Password', desc: 'Create a new secure password',  color: 'from-primary-600 to-primary-400' },
            { to: '/history',   icon: RiHistoryLine,      label: 'View History',      desc: 'Browse your saved passwords',  color: 'from-purple-600 to-purple-400'  },
            { to: '/analytics', icon: RiBarChartLine,     label: 'Analytics',         desc: 'View detailed security charts', color: 'from-cyan-600 to-cyan-400'     },
          ].map(({ to, icon: Icon, label, desc, color }) => (
            <Link key={to} to={to}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="glass-card p-5 flex items-center gap-4 cursor-pointer">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="text-white text-xl" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm">{label}</p>
                  <p className="text-xs text-white/40 truncate">{desc}</p>
                </div>
                <RiArrowRightLine className="ml-auto text-white/30 flex-shrink-0" />
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
