import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { adminAPI, receptionistAPI, staffAPI, guestAPI } from '../services/api';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useAuth();

  const [rooms,     setRooms]     = useState([]);
  const [staff,     setStaff]     = useState([]);
  const [guests,    setGuests]    = useState([]);
  const [bookings,  setBookings]  = useState([]);
  const [stats,     setStats]     = useState({
    totalRooms: 0, availableRooms: 0, occupiedRooms: 0,
    maintenanceRooms: 0, totalGuests: 0, totalStaff: 0,
    totalBookings: 0, totalRevenue: 0,
  });
  const [loading,       setLoading]       = useState(false);
  const [notification,  setNotification]  = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  /* ─── Role-based initial data load ───────────────────── */
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        if (user.role === 'admin') {
          const [statsRes, roomsRes, staffRes, guestsRes, bookingsRes] = await Promise.all([
            adminAPI.stats(),
            adminAPI.getRooms(),
            adminAPI.getStaff(),
            adminAPI.getGuests(),
            adminAPI.getBookings(),
          ]);
          setStats(statsRes.data);
          setRooms(roomsRes.data.rooms);
          setStaff(staffRes.data.staff);
          setGuests(guestsRes.data.guests);
          setBookings(bookingsRes.data.bookings);
        }

        if (user.role === 'receptionist') {
          const [dashRes, guestsRes, roomsRes] = await Promise.all([
            receptionistAPI.dashboard(),
            receptionistAPI.getGuests(),
            receptionistAPI.availableRooms(),
          ]);
          setStats(dashRes.data.stats);
          setGuests(guestsRes.data.guests);
          setRooms(roomsRes.data.rooms);
        }

        if (user.role === 'staff') {
          const dashRes = await staffAPI.dashboard();
          setStats(dashRes.data.stats);
          setRooms(dashRes.data.roomsByType ? [] : []);  // rooms come from dashboard
          setGuests(dashRes.data.activeGuests || []);
          // Fetch full room list separately
          const roomsRes = await staffAPI.getRooms();
          setRooms(roomsRes.data.rooms);
        }

        if (user.role === 'guest') {
          const [dashRes, roomsRes, bookingsRes] = await Promise.all([
            guestAPI.dashboard(),
            guestAPI.getRooms(),
            guestAPI.myBookings(),
          ]);
          setStats(dashRes.data.stats);
          setRooms(roomsRes.data.rooms);
          setBookings(bookingsRes.data.bookings);
        }
      } catch (err) {
        showNotification(err.message || 'Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  /* ─── STAFF ───────────────────────────────────────────── */
  const addStaff = async (memberData) => {
    try {
      const res = await adminAPI.addStaff(memberData);
      setStaff(prev => [...prev, res.data.member]);
      setStats(prev => ({ ...prev, totalStaff: prev.totalStaff + 1 }));
      showNotification(`${memberData.name} added successfully`);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  /* ─── ROOMS ───────────────────────────────────────────── */
  const addRoom = async (roomData) => {
    try {
      const res = await adminAPI.addRoom(roomData);
      setRooms(prev => [...prev, res.data.room]);
      setStats(prev => ({ ...prev, totalRooms: prev.totalRooms + 1, availableRooms: prev.availableRooms + 1 }));
      showNotification(`Room ${roomData.number} added successfully`);
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const updateRoomStatus = async (roomId, status) => {
    try {
      await adminAPI.updateRoomStatus(roomId, status);
      setRooms(prev => prev.map(r => r._id === roomId || r.id === roomId ? { ...r, status } : r));
      // Recalculate available/occupied counts from updated list
      setRooms(prev => {
        const updated = prev.map(r => r._id === roomId || r.id === roomId ? { ...r, status } : r);
        setStats(s => ({
          ...s,
          availableRooms:   updated.filter(r => r.status === 'available').length,
          occupiedRooms:    updated.filter(r => r.status === 'occupied').length,
          maintenanceRooms: updated.filter(r => r.status === 'maintenance').length,
        }));
        return updated;
      });
      showNotification('Room status updated');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  /* ─── BOOKINGS (guest) ────────────────────────────────── */
  const addBooking = async (bookingData) => {
    try {
      const res = await guestAPI.createBooking(bookingData);
      const newBooking = res.data.booking;
      setBookings(prev => [...prev, newBooking]);
      // Mark room occupied locally
      setRooms(prev => prev.filter(r => {
        const id = r._id || r.id;
        return String(id) !== String(bookingData.roomId);
      }));
      showNotification('Booking confirmed!');
      return newBooking;
    } catch (err) {
      showNotification(err.message, 'error');
      return null;
    }
  };

  /* ─── CHECK OUT (admin / receptionist) ───────────────── */
  const checkOutGuest = async (guestId) => {
    try {
      await receptionistAPI.checkOut(guestId);
      setGuests(prev => prev.map(g =>
        (g._id === guestId || g.id === guestId)
          ? { ...g, status: 'checked-out', roomId: null, roomNumber: null }
          : g
      ));
      setBookings(prev => prev.map(b =>
        (b.guestId === guestId) && b.status === 'active'
          ? { ...b, status: 'completed' }
          : b
      ));
      showNotification('Guest checked out successfully');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  /* ─── ASSIGN ROOM (receptionist) ─────────────────────── */
  const assignRoom = async (guestId, roomId) => {
    try {
      await receptionistAPI.assignRoom(guestId, roomId);
      const room = rooms.find(r => (r._id || r.id) === roomId || String(r._id || r.id) === String(roomId));
      const checkIn = new Date().toISOString().split('T')[0];
      setGuests(prev => prev.map(g =>
        (g._id === guestId || g.id === guestId)
          ? { ...g, roomId, roomNumber: room?.number, status: 'active', checkIn }
          : g
      ));
      setRooms(prev => prev.map(r =>
        (r._id === roomId || r.id === roomId) ? { ...r, status: 'occupied' } : r
      ));
      showNotification('Room assigned successfully');
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  /* ─── Refresh helpers (called after any mutation if needed) */
  const refreshRooms = async () => {
    try {
      const api = user?.role === 'admin' ? adminAPI : user?.role === 'staff' ? staffAPI : receptionistAPI;
      const res = await api.getRooms?.() || await adminAPI.getRooms();
      setRooms(res.data.rooms);
    } catch { /* silent */ }
  };

  return (
    <AppContext.Provider value={{
      rooms, staff, guests, bookings, stats, loading, notification,
      addStaff, addRoom, updateRoomStatus, addBooking,
      checkOutGuest, assignRoom, refreshRooms, showNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
