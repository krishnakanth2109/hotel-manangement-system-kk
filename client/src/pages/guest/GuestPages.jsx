import { useState } from 'react';

// You can keep GuestDashboard here or import it from wherever you have it
export function GuestDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Welcome back, Guest!</h1>
      <p className="text-slate-500 mt-2">Manage your bookings and explore our rooms.</p>
    </div>
  );
}

// ---- THIS IS THE BROWSE ROOMS UI ----
const AVAILABLE_ROOMS = [
  { id: 1, type: 'Deluxe Ocean View', price: 299, capacity: 2, bed: '1 King Bed', size: '400 sq ft', image: '🌊', desc: 'Stunning ocean views with a private balcony and premium amenities.' },
  { id: 2, type: 'Premium Suite', price: 450, capacity: 4, bed: '2 Queen Beds', size: '650 sq ft', image: '✨', desc: 'Spacious suite perfect for families, featuring a separate living area.' },
  { id: 3, type: 'Cozy Single', price: 120, capacity: 1, bed: '1 Twin Bed', size: '200 sq ft', image: '🛏️', desc: 'Perfect for solo travelers. Compact, comfortable, and budget-friendly.' },
  { id: 4, type: 'Executive Double', price: 199, capacity: 2, bed: '1 Queen Bed', size: '350 sq ft', image: '💼', desc: 'Designed for business travelers with a dedicated workspace and high-speed Wi-Fi.' },
];

export function BrowseRooms() {
  const [bookingModal, setBookingModal] = useState(null);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-black mb-2">Find Your Perfect Stay</h1>
        <p className="text-amber-50 max-w-xl">Browse our exquisite selection of rooms and suites. Book directly with us for the best rates guaranteed.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Check-in / Check-out</label>
          <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm text-slate-700" />
        </div>
        <div className="w-32">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Guests</label>
          <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm text-slate-700">
            <option>1 Guest</option>
            <option>2 Guests</option>
            <option>3 Guests</option>
            <option>4+ Guests</option>
          </select>
        </div>
        <button className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors shadow-sm text-sm h-[42px]">
          Search
        </button>
      </div>

      {/* Room List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {AVAILABLE_ROOMS.map(room => (
          <div key={room.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all flex flex-col sm:flex-row overflow-hidden group">
            
            {/* Image Placeholder */}
            <div className="sm:w-2/5 bg-slate-100 flex items-center justify-center text-6xl py-12 sm:py-0 group-hover:scale-105 transition-transform duration-500">
              {room.image}
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800">{room.type}</h3>
                  <span className="text-lg font-black text-amber-500">${room.price}<span className="text-xs text-slate-400 font-medium">/nt</span></span>
                </div>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{room.desc}</p>
                
                <div className="flex gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                    <span>👤</span> {room.capacity} Max
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                    <span>📏</span> {room.size}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setBookingModal(room)}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-sm shadow-amber-500/30"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="bg-amber-500 p-6 text-white">
              <h2 className="text-2xl font-black mb-1">Complete Booking</h2>
              <p className="text-amber-100 text-sm">{bookingModal.type} • ${bookingModal.price} / night</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Check-in</label>
                  <input type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Check-out</label>
                  <input type="date" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Special Requests</label>
                <textarea rows="3" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none" placeholder="Any special needs?"></textarea>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center mb-6">
                <span className="font-semibold text-slate-600">Total Estimated</span>
                <span className="text-2xl font-black text-slate-800">${bookingModal.price}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setBookingModal(null)} 
                  className="flex-1 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    alert('Booking Confirmed!');
                    setBookingModal(null);
                  }} 
                  className="flex-1 py-3 text-white bg-slate-800 hover:bg-slate-900 rounded-xl font-bold transition-colors shadow-lg"
                >
                  Confirm Stay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}