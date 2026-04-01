import { useApp } from '../../context/AppContext';
import { StatCard, PageHeader, Badge } from '../../components/common';
import { formatCurrency } from '../../utils/helpers';

export function StaffDashboard() {
  const { stats, rooms, guests } = useApp();
  const activeGuests = guests.filter(g => g.status === 'active');

  return (
    <div className="space-y-6">
      <PageHeader title="Staff Dashboard" subtitle="Room availability and guest overview" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="👤" label="Active Guests"   value={stats.totalGuests}    color="indigo" />
        <StatCard icon="✅" label="Available Rooms" value={stats.availableRooms} color="emerald" />
        <StatCard icon="🛏️" label="Total Rooms"     value={stats.totalRooms}     sub={`${stats.occupiedRooms} occupied`} color="cyan" />
      </div>

      {/* Room type summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-slate-800 mb-4">Room Types & Availability</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {['Standard', 'Deluxe', 'Suite', 'Presidential'].map(type => {
            const typeRooms = rooms.filter(r => r.type === type);
            const available = typeRooms.filter(r => r.status === 'available').length;
            const price     = typeRooms[0]?.price || 0;
            return (
              <div key={type} className="border border-slate-200 rounded-xl p-4 hover:border-indigo-200 transition-colors">
                <p className="font-bold text-slate-800 mb-1">{type}</p>
                <p className="text-2xl font-black text-indigo-600">
                  {available}<span className="text-sm text-slate-400 font-normal">/{typeRooms.length}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">available</p>
                <p className="text-sm font-bold text-emerald-600 mt-2">
                  {formatCurrency(price)}<span className="text-xs text-slate-400">/night</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active guests */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Active Guests</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {activeGuests.length === 0 ? (
            <div className="py-10 text-center text-slate-400">No active guests</div>
          ) : activeGuests.map(g => (
            <div key={g._id || g.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-sm">
                  {g.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{g.name}</p>
                  <p className="text-xs text-slate-400">{g.email}</p>
                </div>
              </div>
              <div className="text-right">
                {g.roomNumber
                  ? <p className="font-bold text-indigo-600">Room #{g.roomNumber}</p>
                  : <Badge status="pending" />
                }
                <p className="text-xs text-slate-400">Check-in: {g.checkIn || '—'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
