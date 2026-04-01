import { useApp } from '../../context/AppContext';
import { StatCard, PageHeader } from '../../components/common';
import { RevenueChart, BookingTrendChart, RoomTypeDonut, OccupancyBar } from '../../components/charts';
import { formatCurrency } from '../../utils/helpers';

// MongoDB returns _id — normalise to id for key usage
const normalize = (obj) => ({ ...obj, id: obj._id || obj.id });

export default function AdminDashboard() {
  const { stats, bookings } = useApp();
  const recentBookings = bookings.map(normalize).slice(-5).reverse();

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" subtitle="Welcome back! Here's what's happening at your hotel." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="👤" label="Total Guests"     value={stats.totalGuests}     sub="Currently staying"          color="indigo" trend={12} />
        <StatCard icon="🛏️" label="Total Rooms"      value={stats.totalRooms}      sub={`${stats.availableRooms} available`} color="cyan" />
        <StatCard icon="✅" label="Available Rooms"  value={stats.availableRooms}  sub={`${stats.occupiedRooms} occupied`}  color="emerald" trend={-5} />
        <StatCard icon="👥" label="Total Staff"      value={stats.totalStaff}      sub="Active employees"           color="violet" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="📋" label="Total Bookings" value={stats.totalBookings} sub="All time"           color="amber" trend={8} />
        <StatCard icon="💰" label="Total Revenue"  value={formatCurrency(stats.totalRevenue)} sub="All time earnings" color="rose"  trend={15} />
        <StatCard icon="🔧" label="Maintenance"    value={stats.maintenanceRooms} sub="Rooms in maintenance" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart />
        <BookingTrendChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RoomTypeDonut />
        <OccupancyBar />
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Recent Bookings</h3>
          <p className="text-xs text-slate-400">Latest reservation activity</p>
        </div>
        <div className="divide-y divide-slate-50">
          {recentBookings.map(b => (
            <div key={b.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold flex items-center justify-center">
                  {b.guestName?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">{b.guestName}</p>
                  <p className="text-xs text-slate-400">Room {b.roomNumber} · {b.roomType}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-slate-800">{formatCurrency(b.amount)}</p>
                <p className="text-xs text-slate-400">{b.nights} nights</p>
              </div>
            </div>
          ))}
          {recentBookings.length === 0 && (
            <div className="py-10 text-center text-slate-400 text-sm">No bookings yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
