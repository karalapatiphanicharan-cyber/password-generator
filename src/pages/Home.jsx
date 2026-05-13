import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RiShieldKeyholeLine, RiLockPasswordLine, RiBarChartLine,
  RiHistoryLine, RiArrowRightLine, RiShieldCheckLine,
  RiTimeLine, RiDeviceLine,
} from 'react-icons/ri';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300"
  >
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center mb-4 shadow-neon">
      <Icon className="text-white text-2xl" />
    </div>
    <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
    <p className="text-white/50 text-sm leading-relaxed">{description}</p>
  </motion.div>
);

const stats = [
  { value: '128-bit', label: 'Max Entropy' },
  { value: '10B+',    label: 'Guesses/sec simulated' },
  { value: '4',       label: 'Generation Modes' },
  { value: '100%',    label: 'Free to Use' },
];

export default function Home() {
  return (
    <div className="min-h-screen cyber-grid" style={{ background: 'var(--bg-primary)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-neon">
            <RiShieldKeyholeLine className="text-white text-xl" />
          </div>
          <span className="font-bold text-white text-xl">SecurePass</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="btn-secondary text-sm px-4 py-2">Dashboard</Link>
          <Link to="/generator" className="btn-primary text-sm px-4 py-2">Generator</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            Production-Ready Cybersecurity Tool
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Generate{' '}
            <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Unbreakable
            </span>
            <br />Passwords
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Professional password generator with real-time strength analysis, entropy calculation,
            crack-time estimation, and secure history management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/generator">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
                className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                <RiLockPasswordLine /> Generate Password <RiArrowRightLine />
              </motion.button>
            </Link>
            <Link to="/dashboard">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
                className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
                <RiBarChartLine /> View Dashboard
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Demo card */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-16 max-w-2xl mx-auto">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-white/30 text-xs ml-2 font-mono">secure-pass.app</span>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 mb-4">
              <p className="password-display text-center text-2xl tracking-widest animate-pulse-slow">
                Xk9@mP#2vL$nQ7&w
              </p>
            </div>
            <div className="flex gap-2 flex-wrap mb-4">
              {['Uppercase', 'Numbers', 'Symbols', '16 chars'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-medium">{tag}</span>
              ))}
            </div>
            <div className="flex gap-1.5">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex-1 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
              ))}
            </div>
            <p className="text-right text-xs text-cyan-400 mt-1 font-semibold">Very Strong — Centuries to crack</p>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/10 bg-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="text-3xl font-extrabold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">{s.value}</p>
              <p className="text-white/40 text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-white mb-4">Everything You Need</h2>
          <p className="text-white/50 max-w-xl mx-auto">A complete security toolkit built with modern web technologies.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard delay={0}   icon={RiLockPasswordLine} title="Smart Generator"       description="Standard, Passphrase, Banking Grade, and WiFi-compatible generation modes." />
          <FeatureCard delay={0.1} icon={RiShieldCheckLine}  title="Strength Analyzer"     description="Real-time entropy, crack-time estimation, and improvement suggestions." />
          <FeatureCard delay={0.2} icon={RiHistoryLine}      title="Password History"      description="Save, search, copy, delete and export your generated passwords." />
          <FeatureCard delay={0.3} icon={RiBarChartLine}     title="Analytics Dashboard"   description="Interactive charts showing your password security trends over time." />
          <FeatureCard delay={0.4} icon={RiTimeLine}         title="Crack Time Estimation" description="Simulate how long a modern GPU cluster takes to brute-force your password." />
          <FeatureCard delay={0.5} icon={RiDeviceLine}       title="QR Code Export"        description="Transfer passwords to your phone instantly via scannable QR code." />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-20 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="glass-card p-12"
          style={{ background: 'linear-gradient(135deg, rgba(92,124,250,0.15), rgba(121,80,242,0.1))' }}>
          <h2 className="text-4xl font-bold text-white mb-4">Start Securing Your Passwords</h2>
          <p className="text-white/50 mb-8">Free. No account needed. Just open and generate.</p>
          <Link to="/generator">
            <motion.button whileHover={{ scale: 1.05 }} className="btn-primary text-lg px-10 py-4 flex items-center gap-2 mx-auto">
              Open Generator <RiArrowRightLine />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-white/30 text-sm">
        <p>SecurePass © 2025 — Built with React, Node.js, MongoDB</p>
      </footer>
    </div>
  );
}
