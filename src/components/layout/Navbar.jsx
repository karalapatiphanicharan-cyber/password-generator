import { Link } from 'react-router-dom';
import { RiShieldKeyholeLine } from 'react-icons/ri';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 glass-card rounded-none border-b border-white/10 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          <span className="text-sm text-white/50 font-mono">SecurePass v1.0</span>
        </div>
        <Link to="/generator">
          <button className="btn-primary text-sm px-5 py-2 flex items-center gap-2">
            <RiShieldKeyholeLine />
            Generate Password
          </button>
        </Link>
      </div>
    </header>
  );
}
