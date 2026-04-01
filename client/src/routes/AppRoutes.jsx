import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../layouts/MainLayout';

// Pages
import LoginPage from '../pages/LoginPage';

// Admin
import AdminDashboard from '../pages/admin/AdminDashboard';
import StaffManagement from '../pages/admin/StaffManagement';
import RoomManagement from '../pages/admin/RoomManagement';
import { GuestList, BookingList } from '../pages/admin/GuestBookings';
import Analytics from '../pages/admin/Analytics';

// Staff
import { StaffDashboard } from '../pages/staff/StaffDashboard';

// Receptionist
import {
  ReceptionistDashboard,
  RoomAllocation,
  GuestTracking
} from '../pages/receptionist/ReceptionistPages';

// Guest (IMPORTANT FIX HERE 👇)
import {
  GuestDashboard,
  BrowseRooms
} from '../pages/guest/GuestPages';

import GuestBookings from '../pages/guest/GuestBookings'; // ✅ separate file

const ROLE_DEFAULTS = {
  admin: '/admin',
  staff: '/staff',
  receptionist: '/receptionist',
  guest: '/guest'
};

function Protected({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_DEFAULTS[user.role] || '/login'} replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          user
            ? <Navigate to={ROLE_DEFAULTS[user.role] || '/login'} replace />
            : <LoginPage />
        }
      />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={<Protected allowedRoles={['admin']}><AdminDashboard /></Protected>}
      />
      <Route
        path="/admin/rooms"
        element={<Protected allowedRoles={['admin']}><RoomManagement /></Protected>}
      />
      <Route
        path="/admin/staff"
        element={<Protected allowedRoles={['admin']}><StaffManagement /></Protected>}
      />
      <Route
        path="/admin/guests"
        element={<Protected allowedRoles={['admin']}><GuestList showCheckout /></Protected>}
      />
      <Route
        path="/admin/bookings"
        element={<Protected allowedRoles={['admin']}><BookingList /></Protected>}
      />
      <Route
        path="/admin/analytics"
        element={<Protected allowedRoles={['admin']}><Analytics /></Protected>}
      />

      {/* ================= STAFF ================= */}
      <Route
        path="/staff"
        element={<Protected allowedRoles={['staff']}><StaffDashboard /></Protected>}
      />
      <Route
        path="/staff/rooms"
        element={<Protected allowedRoles={['staff']}><RoomManagement showAddRoom={false} /></Protected>}
      />
      <Route
        path="/staff/guests"
        element={<Protected allowedRoles={['staff']}><GuestList /></Protected>}
      />

      {/* ================= RECEPTIONIST ================= */}
      <Route
        path="/receptionist"
        element={<Protected allowedRoles={['receptionist']}><ReceptionistDashboard /></Protected>}
      />
      <Route
        path="/receptionist/allocate"
        element={<Protected allowedRoles={['receptionist']}><RoomAllocation /></Protected>}
      />
      <Route
        path="/receptionist/guests"
        element={<Protected allowedRoles={['receptionist']}><GuestTracking /></Protected>}
      />

      {/* ================= GUEST ================= */}
      <Route
        path="/guest"
        element={<Protected allowedRoles={['guest']}><GuestDashboard /></Protected>}
      />
      <Route
        path="/guest/rooms"
        element={<Protected allowedRoles={['guest']}><BrowseRooms /></Protected>}
      />
      <Route
        path="/guest/bookings"
        element={<Protected allowedRoles={['guest']}><GuestBookings /></Protected>}
      />

      {/* ================= FALLBACK ================= */}
      <Route
        path="/"
        element={<Navigate to={user ? ROLE_DEFAULTS[user.role] : '/login'} replace />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? ROLE_DEFAULTS[user.role] : '/login'} replace />}
      />
    </Routes>
  );
}