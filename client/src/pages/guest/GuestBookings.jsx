import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, Table, Badge, Avatar, SearchInput, Button, Modal } from '../../components/common';
import { formatCurrency, formatDate } from '../../utils/helpers';

// Normalise MongoDB _id → id so JSX keys and callbacks stay consistent
const norm = (arr) => arr.map(o => ({ ...o, id: o._id || o.id }));

export function GuestList({ showCheckout = false }) {
  const { guests, checkOutGuest } = useApp();
  const [search,        setSearch]        = useState('');
  const [confirmGuest,  setConfirmGuest]  = useState(null);

  const rows = norm(guests).filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      key: 'name', label: 'Guest',
      render: r => (
        <div className="flex items-center gap-3">
          <Avatar initials={r.name?.[0] + (r.name?.split(' ')[1]?.[0] || '')} size="sm" color="amber" />
          <div>
            <p className="font-semibold text-slate-800">{r.name}</p>
            <p className="text-xs text-slate-400">{r.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone',      label: 'Phone',     render: r => <span className="text-slate-600">{r.phone}</span> },
    { key: 'roomNumber', label: 'Room',      render: r => r.roomNumber ? <span className="font-bold text-indigo-600">#{r.roomNumber}</span> : <span className="text-slate-400">—</span> },
    { key: 'checkIn',    label: 'Check In',  render: r => <span className="text-slate-600">{formatDate(r.checkIn)}</span> },
    { key: 'checkOut',   label: 'Check Out', render: r => <span className="text-slate-600">{formatDate(r.checkOut)}</span> },
    { key: 'status',     label: 'Status',    render: r => <Badge status={r.status} /> },
    { key: 'totalAmount',label: 'Amount',    render: r => <span className="font-bold text-slate-800">{r.totalAmount > 0 ? formatCurrency(r.totalAmount) : '—'}</span> },
    ...(showCheckout ? [{
      key: 'actions', label: 'Actions',
      render: r => r.status === 'active'
        ? <Button variant="danger" size="sm" onClick={() => setConfirmGuest(r)}>Check Out</Button>
        : null,
    }] : []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Guest Management" subtitle={`${guests.length} registered guests`} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-4 border-b border-slate-100">
          <SearchInput value={search} onChange={setSearch} placeholder="Search guests..." />
        </div>
        <Table columns={columns} data={rows} emptyMsg="No guests found" />
      </div>

      <Modal
        isOpen={!!confirmGuest}
        onClose={() => setConfirmGuest(null)}
        title="Confirm Check Out"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-slate-600">
            Check out <strong>{confirmGuest?.name}</strong> from Room <strong>#{confirmGuest?.roomNumber}</strong>?
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setConfirmGuest(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => { checkOutGuest(confirmGuest.id); setConfirmGuest(null); }}
            >
              Confirm Check Out
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function BookingList() {
  const { bookings } = useApp();
  const [search, setSearch] = useState('');

  const rows = norm(bookings).filter(b =>
    b.guestName?.toLowerCase().includes(search.toLowerCase()) ||
    (b.bookingCode || b.id)?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { key: 'bookingCode', label: 'Booking ID',  render: r => <span className="font-mono text-sm font-bold text-indigo-600">{r.bookingCode || r.id}</span> },
    { key: 'guestName',   label: 'Guest',       render: r => <span className="font-semibold text-slate-800">{r.guestName}</span> },
    { key: 'roomNumber',  label: 'Room',        render: r => <span className="font-bold">#{r.roomNumber} <span className="text-xs text-slate-400">({r.roomType})</span></span> },
    { key: 'checkIn',     label: 'Check In',    render: r => <span className="text-slate-600">{formatDate(r.checkIn)}</span> },
    { key: 'checkOut',    label: 'Check Out',   render: r => <span className="text-slate-600">{formatDate(r.checkOut)}</span> },
    { key: 'nights',      label: 'Nights',      render: r => <span className="text-slate-600">{r.nights}N</span> },
    { key: 'amount',      label: 'Amount',      render: r => <span className="font-bold text-slate-800">{formatCurrency(r.amount)}</span> },
    { key: 'status',      label: 'Status',      render: r => <Badge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Bookings" subtitle={`${bookings.length} total bookings`} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-4 border-b border-slate-100">
          <SearchInput value={search} onChange={setSearch} placeholder="Search by guest name or booking ID..." />
        </div>
        <Table columns={columns} data={rows} emptyMsg="No bookings found" />
      </div>
    </div>
  );
}
export default BookingList;