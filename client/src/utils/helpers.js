export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const calcNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const getRoomStatusColor = (status) => {
  const map = { available: 'emerald', occupied: 'rose', maintenance: 'amber' };
  return map[status] || 'slate';
};

export const getStatusBadge = (status) => {
  const map = {
    available: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    occupied: 'bg-rose-100 text-rose-700 border border-rose-200',
    maintenance: 'bg-amber-100 text-amber-700 border border-amber-200',
    active: 'bg-blue-100 text-blue-700 border border-blue-200',
    confirmed: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    completed: 'bg-slate-100 text-slate-600 border border-slate-200',
    pending: 'bg-amber-100 text-amber-700 border border-amber-200',
    'checked-out': 'bg-slate-100 text-slate-600 border border-slate-200',
    inactive: 'bg-rose-100 text-rose-700 border border-rose-200',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
};

export const ROOM_TYPE_COLORS = {
  Standard: '#6366f1',
  Deluxe: '#f59e0b',
  Suite: '#10b981',
  Presidential: '#ec4899',
};
