import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiDashboardLine, RiLockPasswordLine, RiHistoryLine,
  RiBarChartLine, RiSettings4Line, RiShieldKeyholeLine,
  RiMenuFoldLine, RiMenuUnfoldLine,
} from 'react-icons/ri';

const navItems = [
  { to: '/dashboard',  icon: RiDashboardLine,    label: 'Dashboard'  },
  { to: '/generator',  icon: RiLockPasswordLine,  label: 'Generator'  },
  { to: '/history',    icon: RiHistoryLine,       label: 'History'    },
  { to: '/analytics',  icon: RiBarChartLine,      label: 'Analytics'  },
  { to: '/settings',   icon: RiSettings4Line,     label: 'Settings'   },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen glass-card rounded-none border-r border-white/10 overflow-hidden z-20"
      style={{ minWidth: collapsed ? 72 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-neon">
          <RiShieldKeyholeLine className="text-white text-xl" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-bold text-base text-white leading-tight">SecurePass</p>
              <p className="text-xs text-white/40">Password Manager</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? label : ''}
          >
            <Icon className="text-xl flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(p => !p)}
        className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-primary-600 border border-white/20 flex items-center justify-center text-white text-xs shadow-lg hover:bg-primary-500 transition-colors z-30"
      >
        {collapsed ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
      </button>
    </motion.aside>
  );
}
