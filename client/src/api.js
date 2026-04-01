const BASE = import.meta.env.VITE_API_BASE_URL;

const SESSION_KEY = 'hms_session';

const getToken = () => {
  try {
    const s = sessionStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s)?.token || null : null;
  } catch { return null; }
};

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const res = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

const get    = (url)         => request(url);
const post   = (url, body)   => request(url, { method: 'POST',   body: JSON.stringify(body) });
const patch  = (url, body)   => request(url, { method: 'PATCH',  body: JSON.stringify(body) });
const del    = (url)         => request(url, { method: 'DELETE' });

/* ── Auth ─────────────────────────────────────── */
export const authAPI = {
  login:  (email, password) => post('/api/auth/login', { email, password }),
  me:     ()                => get('/api/auth/me'),
  logout: ()                => post('/api/auth/logout'),
};

/* ── Admin ────────────────────────────────────── */
export const adminAPI = {
  // Dashboard
  stats:          ()                    => get('/api/admin/stats'),
  recentBookings: ()                    => get('/api/admin/bookings/recent'),

  // Staff
  getStaff:       (params = '')         => get(`/api/admin/staff${params}`),
  addStaff:       (body)                => post('/api/admin/staff', body),
  updateStaff:    (id, body)            => patch(`/api/admin/staff/${id}`, body),
  deleteStaff:    (id)                  => del(`/api/admin/staff/${id}`),

  // Rooms
  getRooms:       (params = '')         => get(`/api/admin/rooms${params}`),
  addRoom:        (body)                => post('/api/admin/rooms', body),
  updateRoom:     (id, body)            => patch(`/api/admin/rooms/${id}`, body),
  updateRoomStatus: (id, status)        => patch(`/api/admin/rooms/${id}/status`, { status }),
  deleteRoom:     (id)                  => del(`/api/admin/rooms/${id}`),

  // Guests & Bookings
  getGuests:      (params = '')         => get(`/api/admin/guests${params}`),
  getBookings:    (params = '')         => get(`/api/admin/bookings${params}`),
};

/* ── Receptionist ─────────────────────────────── */
export const receptionistAPI = {
  dashboard:      ()              => get('/api/receptionist/dashboard'),
  getGuests:      ()              => get('/api/receptionist/guests'),
  availableRooms: ()              => get('/api/receptionist/rooms/available'),
  assignRoom:     (guestId, roomId) => post(`/api/receptionist/guests/${guestId}/assign-room`, { roomId }),
  checkOut:       (guestId)       => post(`/api/receptionist/guests/${guestId}/checkout`),
};

/* ── Staff ────────────────────────────────────── */
export const staffAPI = {
  dashboard: ()              => get('/api/staff/dashboard'),
  getRooms:  (params = '')   => get(`/api/staff/rooms${params}`),
};

/* ── Guest ────────────────────────────────────── */
export const guestAPI = {
  dashboard:   ()      => get('/api/guest/dashboard'),
  getRooms:    (params = '') => get(`/api/guest/rooms${params}`),
  createBooking: (body) => post('/api/guest/bookings', body),
  myBookings:  ()      => get('/api/guest/bookings'),
};
