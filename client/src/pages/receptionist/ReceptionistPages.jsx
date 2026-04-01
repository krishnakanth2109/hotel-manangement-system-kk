import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatCard, PageHeader, Badge, Button, Modal, Select } from '../../components/common';
import { formatDate, formatCurrency } from '../../utils/helpers';

const norm = (arr) => arr.map(o => ({ ...o, id: o._id || o.id }));

/* ─── Receptionist Dashboard ──────────────────────────────── */
export function ReceptionistDashboard() {
  const { stats, guests } = useApp();
  const activeGuests    = guests.filter(g => g.status === 'active');
  const recentCheckouts = guests.filter(g => g.status === 'checked-out').slice(-3);

  return (
    <div className="space-y-6">
      <PageHeader title="Receptionist Dashboard" subtitle="Front desk operations overview" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon="👥" label="Current Guests"     value={activeGuests.length}                           color="indigo" />
        <StatCard icon="✅" label="Available Rooms"    value={stats.availableRooms}                          color="emerald" />
        <StatCard icon="📤" label="Pending Allocation" value={guests.filter(g => g.status === 'pending').length} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active guests */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">🟢 Active Guests</h3>
          </div>
          <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
            {activeGuests.map(g => (
              <div key={g._id || g.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="font-semibold text-sm text-slate-800">{g.name}</p>
                  <p className="text-xs text-slate-400">Check-in: {formatDate(g.checkIn)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600 text-sm">Room #{g.roomNumber}</p>
                  <p className="text-xs text-slate-400">Out: {formatDate(g.checkOut)}</p>
                </div>
              </div>
            ))}
            {activeGuests.length === 0 && <div className="py-10 text-center text-slate-400 text-sm">No active guests</div>}
          </div>
        </div>

        {/* Recent checkouts */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">🔴 Recent Checkouts</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {recentCheckouts.map(g => (
              <div key={g._id || g.id} className="flex items-center justify-between px-6 py-3">
                <div>
                  <p className="font-semibold text-sm text-slate-800">{g.name}</p>
                  <p className="text-xs text-slate-400">{g.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600 text-sm">{formatCurrency(g.totalAmount)}</p>
                  <Badge status="checked-out" />
                </div>
              </div>
            ))}
            {recentCheckouts.length === 0 && <div className="py-10 text-center text-slate-400 text-sm">No recent checkouts</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Room Allocation ─────────────────────────────────────── */
export function RoomAllocation() {
  const { guests, rooms, assignRoom, checkOutGuest } = useApp();
  const [assignModal,   setAssignModal]   = useState(null);
  const [checkoutModal, setCheckoutModal] = useState(null);
  const [selectedRoom,  setSelectedRoom]  = useState('');

  const pendingGuests   = norm(guests).filter(g => g.status === 'pending');
  const activeGuests    = norm(guests).filter(g => g.status === 'active');
  const availableRooms  = norm(rooms).filter(r => r.status === 'available');

  return (
    <div className="space-y-6">
      <PageHeader title="Room Allocation" subtitle="Assign rooms to guests and manage check-outs" />

      {/* Pending */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">⏳ Pending Room Assignment</h3>
          <p className="text-xs text-slate-400 mt-0.5">{pendingGuests.length} guests awaiting room</p>
        </div>
        {pendingGuests.length === 0 ? (
          <div className="py-10 text-center text-slate-400">All guests have been assigned rooms ✓</div>
        ) : (
          <div className="divide-y divide-slate-50">
            {pendingGuests.map(g => (
              <div key={g.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold">{g.name?.[0]}</div>
                  <div>
                    <p className="font-semibold text-slate-800">{g.name}</p>
                    <p className="text-xs text-slate-400">{g.phone}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => { setAssignModal(g); setSelectedRoom(''); }}>Assign Room</Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active guests — checkout */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">✅ Active Guests — Check Out</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {activeGuests.map(g => (
            <div key={g.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">{g.name?.[0]}</div>
                <div>
                  <p className="font-semibold text-slate-800">{g.name}</p>
                  <p className="text-xs text-slate-400">Room #{g.roomNumber} · Check-in: {formatDate(g.checkIn)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-500">Out: {formatDate(g.checkOut)}</p>
                <Button variant="danger" size="sm" onClick={() => setCheckoutModal(g)}>Check Out</Button>
              </div>
            </div>
          ))}
          {activeGuests.length === 0 && <div className="py-10 text-center text-slate-400">No active guests</div>}
        </div>
      </div>

      {/* Assign Room Modal */}
      <Modal isOpen={!!assignModal} onClose={() => setAssignModal(null)} title={`Assign Room — ${assignModal?.name}`} size="sm">
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Available rooms: <strong>{availableRooms.length}</strong></p>
          <Select
            label="Select Room"
            value={selectedRoom}
            onChange={e => setSelectedRoom(e.target.value)}
            options={[
              { value: '', label: '— Choose a room —' },
              ...availableRooms.map(r => ({
                value: r.id,
                label: `Room #${r.number} — ${r.type} (${formatCurrency(r.price)}/night)`,
              })),
            ]}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setAssignModal(null)}>Cancel</Button>
            <Button
              disabled={!selectedRoom}
              onClick={() => { assignRoom(assignModal.id, selectedRoom); setAssignModal(null); }}
            >
              Confirm Assignment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Checkout confirm */}
      <Modal isOpen={!!checkoutModal} onClose={() => setCheckoutModal(null)} title="Confirm Check Out" size="sm">
        <div className="space-y-4">
          <p className="text-slate-600">
            Check out <strong>{checkoutModal?.name}</strong> from Room <strong>#{checkoutModal?.roomNumber}</strong>?
          </p>
          {checkoutModal?.totalAmount > 0 && (
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-600">Total Amount: <strong className="text-emerald-600">{formatCurrency(checkoutModal.totalAmount)}</strong></p>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setCheckoutModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { checkOutGuest(checkoutModal.id); setCheckoutModal(null); }}>
              Confirm Check Out
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ─── Guest Tracking ──────────────────────────────────────── */
export function GuestTracking() {
  const { guests } = useApp();

  const timeline = [...norm(guests)].sort((a, b) => {
    const da = new Date(a.checkIn || a.updatedAt || 0);
    const db = new Date(b.checkIn || b.updatedAt || 0);
    return db - da;
  });

  const statusIcon = { active: '🟢', pending: '🟡', 'checked-out': '⚫' };

  return (
    <div className="space-y-6">
      <PageHeader title="Guest Tracking" subtitle="Entry and exit timeline" />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="font-bold text-slate-800 mb-6">Guest Timeline</h3>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-200" />
          <div className="space-y-6">
            {timeline.map(g => (
              <div key={g.id} className="flex items-start gap-4 relative">
                <div className={`w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center text-sm z-10 ${g.status === 'active' ? 'bg-emerald-100' : g.status === 'pending' ? 'bg-amber-100' : 'bg-slate-100'}`}>
                  {statusIcon[g.status] || '⚪'}
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl p-4 hover:bg-slate-100/60 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-slate-800">{g.name}</p>
                      <p className="text-xs text-slate-400">{g.email} · {g.phone}</p>
                    </div>
                    <Badge status={g.status} />
                  </div>
                  <div className="flex gap-6 mt-2 text-xs text-slate-500">
                    <span>🏨 Room: <strong className="text-slate-700">{g.roomNumber ? `#${g.roomNumber}` : 'Unassigned'}</strong></span>
                    {g.checkIn  && <span>📅 In:  <strong className="text-slate-700">{formatDate(g.checkIn)}</strong></span>}
                    {g.checkOut && <span>📅 Out: <strong className="text-slate-700">{formatDate(g.checkOut)}</strong></span>}
                    {g.totalAmount > 0 && <span>💰 <strong className="text-emerald-600">{formatCurrency(g.totalAmount)}</strong></span>}
                  </div>
                </div>
              </div>
            ))}
            {timeline.length === 0 && <div className="py-10 text-center text-slate-400">No guest activity yet</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
