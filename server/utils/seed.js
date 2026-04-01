import User from '../models/User.js';
import Room from '../models/Room.js';

// Seed data with only one Admin user
const SEED_USERS = [
  { 
    name: 'Admin User',   
    email: 'admin@hotel.com',  
    password: 'admin123', 
    role: 'admin' 
  }
];

const SEED_ROOMS = [
  { number: '101', type: 'Standard',     floor: 1, price: 2500,  capacity: 2, amenities: ['WiFi', 'AC', 'TV'],                                        status: 'available'  },
  { number: '102', type: 'Standard',     floor: 1, price: 2500,  capacity: 2, amenities: ['WiFi', 'AC', 'TV'],                                        status: 'occupied'   },
  { number: '103', type: 'Standard',     floor: 1, price: 2500,  capacity: 2, amenities: ['WiFi', 'AC', 'TV'],                                        status: 'available'  },
  { number: '201', type: 'Deluxe',       floor: 2, price: 4500,  capacity: 3, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony'],                 status: 'available'  },
  { number: '202', type: 'Deluxe',       floor: 2, price: 4500,  capacity: 3, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'],                            status: 'maintenance'},
  { number: '301', type: 'Suite',        floor: 3, price: 8500,  capacity: 4, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Sea View'],     status: 'available'  },
  { number: '302', type: 'Suite',        floor: 3, price: 8500,  capacity: 4, amenities: ['WiFi', 'AC', 'TV', 'Jacuzzi'],                             status: 'available'  },
  { number: '401', type: 'Presidential', floor: 4, price: 18000, capacity: 6, amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Jacuzzi', 'Butler', 'Private Pool'], status: 'available' },
];

export default async function seedDatabase() {
  try {
    // Check if admin already exists so we don't duplicate
    const adminExists = await User.findOne({ email: 'admin@hotel.com' });
    
    if (adminExists) {
      console.log('⏩ Seed skipped — Admin user already exists');
      return;
    }

    console.log('⏳ Seeding database...');

    // 1. Create the Admin User
    // We use .save() so the pre-save hooks in User.js hash the password
    for (const userData of SEED_USERS) {
      const user = new User(userData);
      await user.save();
    }
    console.log('👤 Admin user created');

    // 2. Clear and Create Rooms (optional: remove Room.deleteMany if you want to keep existing rooms)
    await Room.deleteMany({}); 
    await Room.insertMany(SEED_ROOMS);
    console.log('🏨 Rooms created');

    console.log('🌱 Database seeded successfully');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
}