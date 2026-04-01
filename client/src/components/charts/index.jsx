import { REVENUE_DATA, ROOM_TYPE_STATS } from '../../data/mockData';
import { ROOM_TYPE_COLORS, formatCurrency } from '../../utils/helpers';

export const RevenueChart = () => {
  const max = Math.max(...REVENUE_DATA.map(d => d.revenue));
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-800">Revenue Overview</h3>
          <p className="text-xs text-slate-400 mt-0.5">Monthly revenue trend</p>
        </div>
        <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full font-semibold">2025</span>
      </div>
      <div className="flex items-end gap-2 h-40">
        {REVENUE_DATA.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full">
              <div
                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500 hover:from-indigo-700 hover:to-indigo-500 cursor-pointer"
                style={{ height: `${(d.revenue / max) * 120}px` }}
              >
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {formatCurrency(d.revenue)}
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BookingTrendChart = () => {
  const max = Math.max(...REVENUE_DATA.map(d => d.bookings));
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-slate-800">Booking Trends</h3>
          <p className="text-xs text-slate-400 mt-0.5">Monthly booking count</p>
        </div>
        <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full font-semibold">2025</span>
      </div>
      <div className="flex items-end gap-2 h-40">
        {REVENUE_DATA.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="relative w-full">
              <div
                className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-500 hover:from-emerald-700 hover:to-emerald-500 cursor-pointer"
                style={{ height: `${(d.bookings / max) * 120}px` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {d.bookings}
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RoomTypeDonut = () => {
  const total = ROOM_TYPE_STATS.reduce((s, r) => s + r.count, 0);
  let offset = 0;
  const cx = 60, cy = 60, r = 50, strokeWidth = 20;
  const circ = 2 * Math.PI * r;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-800 mb-4">Room Distribution</h3>
      <div className="flex items-center gap-6">
        <svg width="120" height="120" viewBox="0 0 120 120">
          {ROOM_TYPE_STATS.map((room, i) => {
            const pct = room.count / total;
            const dash = pct * circ;
            const segment = (
              <circle
                key={i}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={ROOM_TYPE_COLORS[room.type]}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={-offset * circ + circ / 4}
                className="transition-all duration-500"
              />
            );
            offset += pct;
            return segment;
          })}
          <text x={cx} y={cy - 4} textAnchor="middle" className="text-slate-800" fontSize="18" fontWeight="bold" fill="#1e293b">{total}</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#94a3b8">Rooms</text>
        </svg>
        <div className="space-y-2 flex-1">
          {ROOM_TYPE_STATS.map(room => (
            <div key={room.type} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: ROOM_TYPE_COLORS[room.type] }} />
                <span className="text-xs text-slate-600">{room.type}</span>
              </div>
              <span className="text-xs font-bold text-slate-800">{room.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const OccupancyBar = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-800 mb-4">Occupancy by Room Type</h3>
      <div className="space-y-4">
        {ROOM_TYPE_STATS.map(room => {
          const pct = room.count > 0 ? Math.round((room.occupied / room.count) * 100) : 0;
          return (
            <div key={room.type}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-slate-600 font-medium">{room.type}</span>
                <span className="text-sm font-bold" style={{ color: ROOM_TYPE_COLORS[room.type] }}>{pct}%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: ROOM_TYPE_COLORS[room.type] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
