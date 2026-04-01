export const ROOMS = [
  { id: 1, number: '101', type: 'Standard', floor: 1, price: 2500, status: 'available', capacity: 2, amenities: ['WiFi', 'AC', 'TV'], image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' },
  { id: 2, number: '102', type: 'Standard', floor: 1, price: 2500, status: 'occupied', capacity: 2, amenities: ['WiFi', 'AC', 'TV'], image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' },
  { id: 3, number: '201', type: 'Deluxe', floor: 2, price: 4500, status: 'available', capacity: 2, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Sea View'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400' },
  { id: 4, number: '202', type: 'Deluxe', floor: 2, price: 4500, status: 'maintenance', capacity: 2, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400' },
  { id: 5, number: '301', type: 'Suite', floor: 3, price: 9000, status: 'available', capacity: 4, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Balcony'], image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400' },
  { id: 6, number: '302', type: 'Suite', floor: 3, price: 9000, status: 'occupied', capacity: 4, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi'], image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400' },
  { id: 7, number: '401', type: 'Presidential', floor: 4, price: 18000, status: 'available', capacity: 6, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Private Pool', 'Butler'], image: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=400' },
  { id: 8, number: '103', type: 'Standard', floor: 1, price: 2500, status: 'available', capacity: 2, amenities: ['WiFi', 'AC', 'TV'], image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' },
  { id: 9, number: '203', type: 'Deluxe', floor: 2, price: 4500, status: 'occupied', capacity: 2, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'], image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400' },
  { id: 10, number: '303', type: 'Suite', floor: 3, price: 9000, status: 'available', capacity: 4, amenities: ['WiFi', 'AC', 'TV', 'Jacuzzi'], image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400' },
];

export const STAFF = [
  { id: 1, name: 'Rajesh Kumar', role: 'staff', email: 'rajesh@hotel.com', phone: '9876543210', department: 'Sales', salary: 35000, joinDate: '2022-03-15', status: 'active', avatar: 'RK' },
  { id: 2, name: 'Priya Sharma', role: 'receptionist', email: 'priya@hotel.com', phone: '9876543211', department: 'Front Desk', salary: 28000, joinDate: '2023-01-10', status: 'active', avatar: 'PS' },
  { id: 3, name: 'Amit Singh', role: 'staff', email: 'amit@hotel.com', phone: '9876543212', department: 'Sales', salary: 33000, joinDate: '2021-07-20', status: 'active', avatar: 'AS' },
  { id: 4, name: 'Sneha Patel', role: 'receptionist', email: 'sneha@hotel.com', phone: '9876543213', department: 'Front Desk', salary: 27000, joinDate: '2023-06-05', status: 'active', avatar: 'SP' },
  { id: 5, name: 'Vikram Rao', role: 'staff', email: 'vikram@hotel.com', phone: '9876543214', department: 'Housekeeping', salary: 25000, joinDate: '2022-11-12', status: 'inactive', avatar: 'VR' },
];

export const GUESTS = [
  { id: 1, name: 'Arjun Mehta', email: 'arjun@gmail.com', phone: '9000000001', roomId: 2, roomNumber: '102', checkIn: '2025-07-01', checkOut: '2025-07-05', status: 'active', totalAmount: 10000, paid: true },
  { id: 2, name: 'Kavya Nair', email: 'kavya@gmail.com', phone: '9000000002', roomId: 6, roomNumber: '302', checkIn: '2025-07-02', checkOut: '2025-07-08', status: 'active', totalAmount: 54000, paid: false },
  { id: 3, name: 'Ravi Verma', email: 'ravi@gmail.com', phone: '9000000003', roomId: 9, roomNumber: '203', checkIn: '2025-06-28', checkOut: '2025-07-03', status: 'active', totalAmount: 22500, paid: true },
  { id: 4, name: 'Meera Iyer', email: 'meera@gmail.com', phone: '9000000004', roomId: null, roomNumber: null, checkIn: null, checkOut: null, status: 'pending', totalAmount: 0, paid: false },
  { id: 5, name: 'Suresh Babu', email: 'suresh@gmail.com', phone: '9000000005', roomId: null, roomNumber: null, checkIn: '2025-06-20', checkOut: '2025-06-25', status: 'checked-out', totalAmount: 12500, paid: true },
];

export const BOOKINGS = [
  { id: 'BK001', guestId: 1, guestName: 'Arjun Mehta', roomId: 2, roomNumber: '102', roomType: 'Standard', checkIn: '2025-07-01', checkOut: '2025-07-05', nights: 4, amount: 10000, status: 'confirmed', createdAt: '2025-06-25' },
  { id: 'BK002', guestId: 2, guestName: 'Kavya Nair', roomId: 6, roomNumber: '302', roomType: 'Suite', checkIn: '2025-07-02', checkOut: '2025-07-08', nights: 6, amount: 54000, status: 'confirmed', createdAt: '2025-06-26' },
  { id: 'BK003', guestId: 3, guestName: 'Ravi Verma', roomId: 9, roomNumber: '203', roomType: 'Deluxe', checkIn: '2025-06-28', checkOut: '2025-07-03', nights: 5, amount: 22500, status: 'active', createdAt: '2025-06-27' },
  { id: 'BK004', guestId: 5, guestName: 'Suresh Babu', roomId: null, roomNumber: '101', roomType: 'Standard', checkIn: '2025-06-20', checkOut: '2025-06-25', nights: 5, amount: 12500, status: 'completed', createdAt: '2025-06-18' },
];

export const REVENUE_DATA = [
  { month: 'Jan', revenue: 185000, bookings: 42 },
  { month: 'Feb', revenue: 210000, bookings: 51 },
  { month: 'Mar', revenue: 195000, bookings: 47 },
  { month: 'Apr', revenue: 240000, bookings: 58 },
  { month: 'May', revenue: 275000, bookings: 64 },
  { month: 'Jun', revenue: 310000, bookings: 72 },
  { month: 'Jul', revenue: 298000, bookings: 68 },
];

export const ROOM_TYPE_STATS = [
  { type: 'Standard', count: 3, occupied: 1, revenue: 7500 },
  { type: 'Deluxe', count: 3, occupied: 2, revenue: 9000 },
  { type: 'Suite', count: 3, occupied: 1, revenue: 9000 },
  { type: 'Presidential', count: 1, occupied: 0, revenue: 0 },
];

export const USERS = [
  { id: 1, name: 'Admin User', email: 'admin@hotel.com', password: 'admin123', role: 'admin', avatar: 'AU' },
  { id: 2, name: 'Rajesh Kumar', email: 'rajesh@hotel.com', password: 'staff123', role: 'staff', avatar: 'RK' },
  { id: 3, name: 'Priya Sharma', email: 'priya@hotel.com', password: 'recep123', role: 'receptionist', avatar: 'PS' },
  { id: 4, name: 'Guest User', email: 'guest@hotel.com', password: 'guest123', role: 'guest', avatar: 'GU' },
];
