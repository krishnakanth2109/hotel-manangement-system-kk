import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PageHeader, Button, Table, Badge, Avatar, Modal, Input, Select, SearchInput } from '../../components/common';

const INITIAL_FORM = { name: '', email: '', phone: '', role: 'staff', department: 'Sales', salary: '' };

export default function StaffManagement() {
  const { staff, addStaff } = useApp();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const filtered = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || s.role === filterRole;
    return matchSearch && matchRole;
  });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone required';
    if (!form.salary || isNaN(form.salary)) e.salary = 'Valid salary required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    addStaff({ ...form, salary: Number(form.salary), joinDate: new Date().toISOString().split('T')[0] });
    setForm(INITIAL_FORM);
    setErrors({});
    setModalOpen(false);
  };

  const columns = [
    { key: 'name', label: 'Name', render: r => (
      <div className="flex items-center gap-3">
        <Avatar initials={r.avatar} size="sm" color="indigo" />
        <div>
          <p className="font-semibold text-slate-800">{r.name}</p>
          <p className="text-xs text-slate-400">{r.email}</p>
        </div>
      </div>
    )},
    { key: 'role', label: 'Role', render: r => <Badge status={r.role} /> },
    { key: 'department', label: 'Department', render: r => <span className="text-slate-600">{r.department}</span> },
    { key: 'phone', label: 'Phone', render: r => <span className="text-slate-600">{r.phone}</span> },
    { key: 'salary', label: 'Salary', render: r => <span className="font-semibold text-slate-800">₹{r.salary?.toLocaleString('en-IN')}</span> },
    { key: 'joinDate', label: 'Joined', render: r => <span className="text-slate-500 text-xs">{r.joinDate}</span> },
    { key: 'status', label: 'Status', render: r => <Badge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff Management"
        subtitle={`${staff.length} total employees`}
        action={<Button onClick={() => setModalOpen(true)}>＋ Add Staff</Button>}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Staff Agents', count: staff.filter(s => s.role === 'staff').length, color: 'bg-indigo-50 text-indigo-700', icon: '🧑‍💼' },
          { label: 'Receptionists', count: staff.filter(s => s.role === 'receptionist').length, color: 'bg-emerald-50 text-emerald-700', icon: '🖥️' },
          { label: 'Active', count: staff.filter(s => s.status === 'active').length, color: 'bg-cyan-50 text-cyan-700', icon: '✅' },
        ].map(c => (
          <div key={c.label} className={`${c.color} rounded-2xl p-4 border border-current/10`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="text-2xl font-black">{c.count}</p>
                <p className="text-xs font-semibold opacity-80">{c.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-slate-100">
          <div className="flex-1"><SearchInput value={search} onChange={setSearch} placeholder="Search staff..." /></div>
          <div className="flex gap-2">
            {['all', 'staff', 'receptionist'].map(r => (
              <button key={r} onClick={() => setFilterRole(r)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${filterRole === r ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {r === 'all' ? 'All' : r}
              </button>
            ))}
          </div>
        </div>
        <Table columns={columns} data={filtered} emptyMsg="No staff members found" />
      </div>

      {/* Add Staff Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setErrors({}); setForm(INITIAL_FORM); }} title="Add New Staff Member" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" error={errors.name} />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="john@hotel.com" error={errors.email} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="9876543210" error={errors.phone} />
            <Input label="Salary (₹)" type="number" value={form.salary} onChange={e => setForm(p => ({ ...p, salary: e.target.value }))} placeholder="30000" error={errors.salary} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Role" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} options={[{ value: 'staff', label: 'Staff Agent' }, { value: 'receptionist', label: 'Receptionist' }]} />
            <Select label="Department" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} options={[{ value: 'Sales', label: 'Sales' }, { value: 'Front Desk', label: 'Front Desk' }, { value: 'Housekeeping', label: 'Housekeeping' }, { value: 'Security', label: 'Security' }]} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Add Staff</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
