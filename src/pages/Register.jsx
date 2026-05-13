import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiShieldKeyholeLine, RiEyeLine, RiEyeOffLine, RiUserAddLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) return toast.error('Please fill in all fields.');
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      toast.success('Account created! Welcome to SecurePass 🎉');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator for the registration form
  const pwStrength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2
    : form.password.length < 14 ? 3 : 4;

  const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-cyan-500'];
  const strengthLabels = ['', 'Too short', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 cyber-grid" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-neon">
            <RiShieldKeyholeLine className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-white/50 mt-2">Join SecurePass — it's completely free</p>
        </div>

        <div className="glass-card p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="username">Username</label>
              <input id="username" name="username" type="text" autoComplete="username"
                value={form.username} onChange={handleChange}
                placeholder="coolhacker42" className="input-field" required minLength={3} maxLength={30} />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" autoComplete="email"
                value={form.email} onChange={handleChange}
                placeholder="you@example.com" className="input-field" required />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="reg-password">Password</label>
              <div className="relative">
                <input id="reg-password" name="password"
                  type={showPassword ? 'text' : 'password'} autoComplete="new-password"
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" className="input-field pr-12" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
                  {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
              {/* Mini strength bar */}
              {form.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${pwStrength >= i ? strengthColors[pwStrength] : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-white/40">{strengthLabels[pwStrength]}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="confirm">Confirm Password</label>
              <input id="confirm" name="confirm" type="password" autoComplete="new-password"
                value={form.confirm} onChange={handleChange}
                placeholder="Repeat your password" className="input-field" required />
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><RiUserAddLine /> Create Account</>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-white/50">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold transition-colors">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          <Link to="/" className="hover:text-white/60 transition-colors">← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
}
