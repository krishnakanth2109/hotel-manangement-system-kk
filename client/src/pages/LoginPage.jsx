import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../layouts/MainLayout';

const DEMO_ACCOUNTS = [
  { role: 'Admin',        email: 'admin@hotel.com',  password: 'admin123', color: 'from-indigo-500 to-violet-500' },
  { role: 'Staff',        email: 'rajesh@hotel.com', password: 'staff123', color: 'from-cyan-500 to-blue-500'    },
  { role: 'Receptionist', email: 'priya@hotel.com',  password: 'recep123', color: 'from-emerald-500 to-teal-500' },
  { role: 'Guest',        email: 'guest@hotel.com',  password: 'guest123', color: 'from-amber-500 to-orange-500' },
];

const ROLE_ROUTES = { admin: '/admin', staff: '/staff', receptionist: '/receptionist', guest: '/guest' };

export default function LoginPage() {
  const { login, authError, loading } = useAuth();
  const navigate = useNavigate();
  const [form,   setForm]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email.trim())                       e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))   e.email    = 'Invalid email';
    if (!form.password)                            e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const user = await login(form.email, form.password);
    if (user) navigate(ROLE_ROUTES[user.role] || '/');
  };

  return (
    <AuthLayout>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-lg">H</div>
          <h1 className="text-3xl font-black text-white tracking-tight">HotelMS</h1>
          <p className="text-slate-400 text-sm mt-1.5">Hotel Management System</p>
        </div>

        {/* Demo quick-login */}
        <div className="mb-6">
          <p className="text-xs text-slate-500 text-center mb-3 font-medium uppercase tracking-wider">Quick Login</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.role}
                onClick={() => setForm({ email: acc.email, password: acc.password })}
                className={`text-left px-3 py-2.5 rounded-xl bg-gradient-to-r ${acc.color} text-white transition-all hover:scale-[1.02] active:scale-[0.98]`}
              >
                <p className="font-bold text-sm">{acc.role}</p>
                <p className="text-xs opacity-75">{acc.email}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-slate-500">or enter manually</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all ${errors.email ? 'border-rose-400' : 'border-white/10 hover:border-white/20'}`}
            />
            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all ${errors.password ? 'border-rose-400' : 'border-white/10 hover:border-white/20'}`}
            />
            {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password}</p>}
          </div>

          {authError && (
            <div className="bg-rose-500/20 border border-rose-400/30 text-rose-300 text-sm px-4 py-3 rounded-xl">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-bold text-sm hover:from-indigo-600 hover:to-violet-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/30 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
