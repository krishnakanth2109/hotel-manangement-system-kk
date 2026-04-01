import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, Button, Badge, Modal, Input, Select, SearchInput } from '../../components/common';
import { formatCurrency } from '../../utils/helpers';

const ROOM_TYPES    = ['Standard', 'Deluxe', 'Suite', 'Presidential'];
const AMENITIES_LIST = ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Balcony', 'Sea View', 'Butler', 'Private Pool'];
const INIT_FORM     = { number: '', type: 'Standard', floor: '1', price: '', capacity: '2', amenities: ['WiFi', 'AC', 'TV'] };

const STATUS_STYLES = {
  available:   'border-emerald-200 bg-emerald-50/30',
  occupied:    'border-rose-200 bg-rose-50/30',
  maintenance: 'border-amber-200 bg-amber-50/30',
};

const norm = (arr) => arr.map(r => ({ ...r, id: r._id || r.id }));

export default function RoomManagement({ showAddRoom = true }) {
  const { rooms, addRoom, updateRoomStatus } = useApp();
  const [search,       setSearch]       = useState('');
  const [filterType,   setFilterType]   = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [addModal,     setAddModal]     = useState(false);
  const [statusModal,  setStatusModal]  = useState(null);
  const [form,         setForm]         = useState(INIT_FORM);
  const [errors,       setErrors]       = useState({});

  const normRooms = norm(rooms);

  const filtered = normRooms.filter(r => {
    const ms  = r.number.includes(search) || r.type.toLowerCase().includes(search.toLowerCase());
    const mt  = filterType   === 'all' || r.type   === filterType;
    const mst = filterStatus === 'all' || r.status === filterStatus;
    return ms && mt && mst;
  });

  const validate = () => {
    const e = {};
    if (!form.number.trim())          e.number = 'Room number required';
    if (!form.price || isNaN(form.price)) e.price = 'Valid price required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddRoom = () => {
    if (!validate()) return;
    addRoom({ ...form, floor: Number(form.floor), price: Number(form.price), capacity: Number(form.capacity) });
    setForm(INIT_FORM);
    setErrors({});
    setAddModal(false);
  };

  const toggleAmenity = (a) => setForm(p => ({
    ...p,
    amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a],
  }));

  const summaryStats = {
    available:   normRooms.filter(r => r.status === 'available').length,
    occupied:    normRooms.filter(r => r.status === 'occupied').length,
    maintenance: normRooms.filter(r => r.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Room Management"
        subtitle={`${rooms.length} total rooms`}
        action={showAddRoom && <Button onClick={() => setAddModal(true)}>＋ Add Room</Button>}
      />

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Available',   count: summaryStats.available,   color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '✅' },
          { label: 'Occupied',    count: summaryStats.occupied,    color: 'bg-rose-50 text-rose-700 border-rose-200',          icon: '🔴' },
          { label: 'Maintenance', count: summaryStats.maintenance, color: 'bg-amber-50 text-amber-700 border-amber-200',        icon: '🔧' },
        ].map(c => (
          <div key={c.label} className={`${c.color} border rounded-2xl p-4`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="text-3xl font-black">{c.count}</p>
                <p className="text-xs font-semibold opacity-80">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput value={search} onChange={setSearch} placeholder="Search by room number or type..." />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1">
              {['all', ...ROOM_TYPES].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterType === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {t === 'all' ? 'All Types' : t}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {['all', 'available', 'occupied', 'maintenance'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${filterStatus === s ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {s === 'all' ? 'All Status' : s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(room => (
          <div key={room.id} className={`bg-white rounded-2xl border-2 ${STATUS_STYLES[room.status]} shadow-sm hover:shadow-md transition-shadow overflow-hidden`}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-2xl font-black text-slate-800">#{room.number}</p>
                  <p className="text-xs text-slate-500 font-medium">Floor {room.floor}</p>
                </div>
                <Badge status={room.status} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">{room.type}</span>
                  <span className="text-sm font-bold text-indigo-600">{formatCurrency(room.price)}<span className="text-xs text-slate-400">/night</span></span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <span>👥 {room.capacity} guests</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {room.amenities?.slice(0, 3).map(a => (
                    <span key={a} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{a}</span>
                  ))}
                  {room.amenities?.length > 3 && (
                    <span className="text-xs text-slate-400">+{room.amenities.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
            {showAddRoom && (
              <div className="px-4 pb-4">
                <button
                  onClick={() => setStatusModal(room)}
                  className="w-full py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Change Status
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🛏️</p>
          <p className="font-medium">No rooms found</p>
        </div>
      )}

      {/* Add Room Modal */}
      <Modal
        isOpen={addModal}
        onClose={() => { setAddModal(false); setErrors({}); setForm(INIT_FORM); }}
        title="Add New Room"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Room Number" value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))} placeholder="e.g. 501" error={errors.number} />
            <Select label="Room Type" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} options={ROOM_TYPES.map(t => ({ value: t, label: t }))} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Floor"          type="number" value={form.floor}    onChange={e => setForm(p => ({ ...p, floor:    e.target.value }))} min="1" />
            <Input label="Price/Night (₹)" type="number" value={form.price}   onChange={e => setForm(p => ({ ...p, price:    e.target.value }))} placeholder="3000" error={errors.price} />
            <Input label="Capacity"       type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} min="1" max="10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_LIST.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${form.amenities.includes(a) ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddRoom}>Add Room</Button>
          </div>
        </div>
      </Modal>

      {/* Status Change Modal */}
      <Modal
        isOpen={!!statusModal}
        onClose={() => setStatusModal(null)}
        title={`Change Status — Room ${statusModal?.number}`}
        size="sm"
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-500">Current: <Badge status={statusModal?.status} /></p>
          <div className="grid gap-2">
            {['available', 'occupied', 'maintenance'].map(s => (
              <button
                key={s}
                onClick={() => { updateRoomStatus(statusModal.id, s); setStatusModal(null); }}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all capitalize border-2 ${statusModal?.status === s ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-200 text-slate-700'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
