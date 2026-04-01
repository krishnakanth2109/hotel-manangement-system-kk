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
  let res;
  try {
    res = await fetch(`${BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(`Cannot reach server at ${BASE}. Is the backend running?`);
  }

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Server returned non-JSON (status ${res.status}). Check VITE_API_BASE_URL="${BASE}"`);
  }

  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
};

const get   = (url)       => request(url);
const post  = (url, body) => request(url, { method: 'POST',   body: JSON.stringify(body) });
const patch = (url, body) => request(url, { method: 'PATCH',  body: JSON.stringify(body) });
const del   = (url)       => request(url, { method: 'DELETE' });

export const authAPI = {
  login:  (email, password) => post('/api/auth/login', { email, password }),
  me:     ()                => get('/api/auth/me'),
  logout: ()                => post('/api/auth/logout'),
};

export const adminAPI = {
  stats:            ()            => get('/api/admin/stats'),
  recentBookings:   ()            => get('/api/admin/bookings/recent'),
  getStaff:         (p = '')      => get(`/api/admin/staff${p}`),
  addStaff:         (body)        => post('/api/admin/staff', body),
  updateStaff:      (id, body)    => patch(`/api/admin/staff/${id}`, body),
  deleteStaff:      (id)          => del(`/api/admin/staff/${id}`),
  getRooms:         (p = '')      => get(`/api/admin/rooms${p}`),
  addRoom:          (body)        => post('/api/admin/rooms', body),
  updateRoom:       (id, body)    => patch(`/api/admin/rooms/${id}`, body),
  updateRoomStatus: (id, status)  => patch(`/api/admin/rooms/${id}/status`, { status }),
  deleteRoom:       (id)          => del(`/api/admin/rooms/${id}`),
  getGuests:        (p = '')      => get(`/api/admin/guests${p}`),
  getBookings:      (p = '')      => get(`/api/admin/bookings${p}`),
};

export const receptionistAPI = {
  dashboard:      ()                => get('/api/receptionist/dashboard'),
  getGuests:      ()                => get('/api/receptionist/guests'),
  availableRooms: ()                => get('/api/receptionist/rooms/available'),
  assignRoom:     (guestId, roomId) => post(`/api/receptionist/guests/${guestId}/assign-room`, { roomId }),
  checkOut:       (guestId)         => post(`/api/receptionist/guests/${guestId}/checkout`),
};

export const staffAPI = {
  dashboard: ()       => get('/api/staff/dashboard'),
  getRooms:  (p = '') => get(`/api/staff/rooms${p}`),
};

export const guestAPI = {
  dashboard:     ()       => get('/api/guest/dashboard'),
  getRooms:      (p = '') => get(`/api/guest/rooms${p}`),
  createBooking: (body)   => post('/api/guest/bookings', body),
  myBookings:    ()       => get('/api/guest/bookings'),
};