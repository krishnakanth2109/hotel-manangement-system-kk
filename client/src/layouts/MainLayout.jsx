import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
 import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Avatar, Notification } from '../components/common';

const NAV_ITEMS = {
  admin: [
    { to: '/admin', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/admin/rooms', label: 'Rooms', icon: '🛏️' },
    { to: '/admin/staff', label: 'Staff', icon: '👥' },
    { to: '/admin/guests', label: 'Guests', icon: '👤' },
    { to: '/admin/bookings', label: 'Bookings', icon: '📋' },
    { to: '/admin/analytics', label: 'Analytics', icon: '📊' },
  ],
  staff: [
    { to: '/staff', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/staff/rooms', label: 'Rooms', icon: '🛏️' },
    { to: '/staff/guests', label: 'Guests', icon: '👤' },
  ],
  receptionist: [
    { to: '/receptionist', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/receptionist/allocate', label: 'Room Allocation', icon: '🔑' },
    { to: '/receptionist/guests', label: 'Guest Tracking', icon: '👤' },
  ],
  guest: [
    { to: '/guest', label: 'Dashboard', icon: '🏠', end: true },
    { to: '/guest/rooms', label: 'Browse Rooms', icon: '🛏️' },
    { to: '/guest/bookings', label: 'My Bookings', icon: '📋' },
  ],
};

const ROLE_LABELS = { admin: 'Administrator', staff: 'Staff Agent', receptionist: 'Receptionist', guest: 'Guest' };
const ROLE_COLORS = { admin: 'from-indigo-600 to-violet-600', staff: 'from-cyan-600 to-blue-600', receptionist: 'from-emerald-600 to-teal-600', guest: 'from-amber-500 to-orange-500' };

export const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { notification } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = NAV_ITEMS[user?.role] || [];
  const roleGrad = ROLE_COLORS[user?.role] || 'from-indigo-600 to-violet-600';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white border-r border-slate-100 flex flex-col shadow-sm z-30 fixed top-0 left-0 h-full`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-100 ${!sidebarOpen ? 'justify-center px-2' : ''}`}>
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${roleGrad} flex items-center justify-center text-white font-black text-base flex-shrink-0`}>H</div>
          {sidebarOpen && <span className="font-black text-slate-800 text-lg tracking-tight">HotelMS</span>}
        </div>

        {/* Role Badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-4 mb-2">
            <div className={`px-3 py-2 rounded-xl bg-gradient-to-r ${roleGrad} text-white`}>
              <p className="text-xs opacity-75 font-medium">Logged in as</p>
              <p className="font-bold text-sm">{ROLE_LABELS[user?.role]}</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-semibold ${isActive
                  ? `bg-gradient-to-r ${roleGrad} text-white shadow-sm`
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                } ${!sidebarOpen ? 'justify-center px-2' : ''}`
              }
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className={`p-3 border-t border-slate-100 ${!sidebarOpen ? 'flex justify-center' : ''}`}>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 text-sm text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2.5 rounded-xl transition-all font-semibold w-full ${!sidebarOpen ? 'justify-center w-auto px-2' : ''}`}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <span>🚪</span>{sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <button onClick={() => setSidebarOpen(p => !p)} className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
            <span className="text-lg">{sidebarOpen ? '◀' : '▶'}</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setProfileOpen(p => !p)}
              className="flex items-center gap-2 hover:bg-slate-50 rounded-xl px-3 py-1.5 transition-colors"
            >
              <Avatar initials={user?.avatar || 'U'} size="sm" />
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-400">{ROLE_LABELS[user?.role]}</p>
              </div>
              <span className="text-slate-400 text-xs ml-1">▾</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="font-semibold text-sm text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 rounded-lg transition-colors font-medium">
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      <Notification notification={notification} />

      {profileOpen && <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />}
    </div>
  );
};

export const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
    </div>
    <div className="relative w-full max-w-md">{children}</div>
  </div>
);
