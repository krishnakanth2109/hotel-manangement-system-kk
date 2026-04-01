import { useState } from 'react';

const MOCK_ROOMS = [
  { id: 1, number: '101', type: 'Single', status: 'Available', price: 99, floor: 1, capacity: 1 },
  { id: 2, number: '102', type: 'Double', status: 'Occupied', price: 149, floor: 1, capacity: 2 },
  { id: 3, number: '201', type: 'Suite', status: 'Maintenance', price: 299, floor: 2, capacity: 4 },
  { id: 4, number: '202', type: 'Double', status: 'Available', price: 149, floor: 2, capacity: 2 },
  { id: 5, number: '301', type: 'Deluxe Suite', status: 'Available', price: 399, floor: 3, capacity: 4 },
];

const STATUS_COLORS = {
  Available: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Occupied: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Maintenance: 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function RoomManagement({ showAddRoom = true }) {
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.includes(search) || room.type.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Room Management</h1>
          <p className="text-sm text-slate-500">Manage hotel rooms, pricing, and availability.</p>
        </div>
        
        {showAddRoom && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <span>➕</span> Add New Room
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search room number or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm font-medium text-slate-700"
        >
          <option value="All">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Maintenance">Maintenance</option>
        </select>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map(room => (
          <div key={room.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-5 border-b border-slate-50 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-slate-800">Room {room.number}</h3>
                <p className="text-sm font-medium text-slate-500">{room.type}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${STATUS_COLORS[room.status]}`}>
                {room.status}
              </span>
            </div>
            
            <div className="p-5 flex-1 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Floor</p>
                <p className="font-medium text-slate-700">{room.floor}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Capacity</p>
                <p className="font-medium text-slate-700">👤 x {room.capacity}</p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Price / Night</p>
                <p className="text-lg font-bold text-indigo-600">${room.price}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex gap-2">
              {showAddRoom ? (
                <>
                  <button className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">
                    Edit
                  </button>
                  <button className="flex-1 py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm font-semibold hover:bg-rose-50 transition-colors">
                    Delete
                  </button>
                </>
              ) : (
                <button className="w-full py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">
                  Update Status
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
          <span className="text-4xl block mb-3">🔍</span>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No rooms found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Add Room Modal (Placeholder) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Room</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Room Number</label>
                <input type="text" className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50" placeholder="e.g. 101" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Room Type</label>
                <select className="w-full p-2 border border-slate-200 rounded-xl bg-slate-50">
                  <option>Single</option>
                  <option>Double</option>
                  <option>Suite</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-semibold">Cancel</button>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">Save Room</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}