import { motion } from 'framer-motion';
import { RiSettings4Line, RiShieldLine, RiPaletteLine, RiInformationLine } from 'react-icons/ri';

const Section = ({ icon: Icon, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6 space-y-4"
  >
    <h2 className="font-bold text-white flex items-center gap-2 text-lg border-b border-white/10 pb-3">
      <Icon className="text-primary-400" /> {title}
    </h2>
    {children}
  </motion.div>
);

export default function Settings() {
  return (
    <div className="page-transition space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <RiSettings4Line className="text-primary-400" />
          Settings
        </h1>
        <p className="text-white/50 mt-1 text-sm">App preferences and information.</p>
      </div>

      {/* Appearance */}
      <Section icon={RiPaletteLine} title="Appearance">
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
          <div>
            <p className="font-medium text-white text-sm">Theme</p>
            <p className="text-xs text-white/40 mt-0.5">Dark mode is always active</p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 text-sm font-semibold border border-primary-500/30">
            🌙 Dark Mode
          </span>
        </div>
      </Section>

      {/* Security Info */}
      <Section icon={RiShieldLine} title="Security Info">
        <div className="space-y-3">
          {[
            { label: 'Password Generation', value: 'Client-side only — never leaves your browser' },
            { label: 'Strength Analysis', value: 'Computed locally using entropy math' },
            { label: 'History Storage', value: 'Saved to backend (requires server connection)' },
            { label: 'Encryption', value: 'HTTPS in production, JWT for API auth' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start justify-between gap-4 p-3 rounded-xl bg-white/5">
              <p className="text-sm font-medium text-white/80 flex-shrink-0">{label}</p>
              <p className="text-xs text-white/40 text-right">{value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* About */}
      <Section icon={RiInformationLine} title="About SecurePass">
        <div className="space-y-3 text-sm text-white/50">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Version',    value: '1.0.0' },
              { label: 'Frontend',  value: 'React 18 + Vite' },
              { label: 'Backend',   value: 'Node.js + Express' },
              { label: 'Database',  value: 'MongoDB Atlas' },
              { label: 'Auth',      value: 'JWT + bcryptjs' },
              { label: 'Charts',    value: 'Recharts' },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-white/30 mb-0.5">{label}</p>
                <p className="text-white/80 font-medium text-sm">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/30 pt-2 text-center">
            Built as a production-ready portfolio project · MIT License
          </p>
        </div>
      </Section>
    </div>
  );
}
