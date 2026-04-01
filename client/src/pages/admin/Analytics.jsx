import { useApp } from '../../context/AppContext';
import { PageHeader, StatCard } from '../../components/common';
import { RevenueChart, BookingTrendChart, RoomTypeDonut, OccupancyBar } from '../../components/charts';
import { formatCurrency } from '../../utils/helpers';

// Static monthly breakdown — replace with real API data if you add a /analytics endpoint
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Analytics() {
  const { bookings, rooms, stats } = useApp();

  const avgBookingValue = bookings.length > 0
    ? stats.totalRevenue / bookings.length
    : 0;

  const occupancyRate = rooms.length > 0
    ? Math.round((stats.occupiedRooms / rooms.length) * 100)
    : 0;

  // Build a simple monthly breakdown from real bookings data
  const monthlyData = MONTHS.map((month, i) => {
    const monthBookings = bookings.filter(b => {
      const d = new Date(b.createdAt || b.checkIn);
      return d.getMonth() === i;
    });
    const revenue = monthBookings.reduce((s, b) => s + (b.amount || 0), 0);
    return { month, revenue, bookings: monthBookings.length };
  }).filter(d => d.bookings > 0 || d.revenue > 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Revenue, booking trends, and occupancy insights" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📈" label="Occupancy Rate"     value={`${occupancyRate}%`}              color="indigo"  trend={5}  />
        <StatCard icon="💰" label="Avg Booking Value"  value={formatCurrency(avgBookingValue)}  color="emerald" trend={8}  />
        <StatCard icon="📋" label="Total Bookings"     value={stats.totalBookings}              color="amber"              />
        <StatCard icon="💵" label="Total Revenue"      value={formatCurrency(stats.totalRevenue)} color="rose"  trend={12} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart />
        <BookingTrendChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RoomTypeDonut />
        <OccupancyBar />
      </div>

      {/* Monthly breakdown derived from real booking data */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Monthly Breakdown</h3>
        </div>
        {monthlyData.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-sm">No booking data available yet</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Month', 'Revenue', 'Bookings', 'Avg / Booking', 'Growth'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {monthlyData.map((d, i) => {
                const avg    = d.bookings > 0 ? d.revenue / d.bookings : 0;
                const prev   = monthlyData[i - 1];
                const growth = prev && prev.revenue > 0
                  ? Math.round(((d.revenue - prev.revenue) / prev.revenue) * 100)
                  : 0;
                return (
                  <tr key={d.month} className="hover:bg-slate-50/60">
                    <td className="px-5 py-3 font-semibold text-slate-800">{d.month}</td>
                    <td className="px-5 py-3 font-bold text-emerald-600">{formatCurrency(d.revenue)}</td>
                    <td className="px-5 py-3 text-slate-700">{d.bookings}</td>
                    <td className="px-5 py-3 text-slate-700">{formatCurrency(avg)}</td>
                    <td className="px-5 py-3">
                      {i > 0 && (
                        <span className={`text-xs font-bold ${growth >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
