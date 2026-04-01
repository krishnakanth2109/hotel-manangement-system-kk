# 🏨 HotelMS — Hotel Management System

A complete, production-ready frontend for a Hotel Management System built with **React + Vite + Tailwind CSS**.

---

## ✨ Features

| Role | Capabilities |
|------|-------------|
| **Admin** | Dashboard stats, staff management, room management, analytics |
| **Staff Agent** | Dashboard, room availability, guest overview |
| **Receptionist** | Room allocation, guest check-in/out, timeline tracking |
| **Guest** | Browse rooms, book a room, booking confirmation & history |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and configure
cp .env.example .env.local
# Edit .env.local — leave VITE_API_BASE_URL blank to use mock data

# 3. Start dev server
npm run dev
```

App runs at **http://localhost:5173**

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hotel.com | admin123 |
| Staff Agent | rajesh@hotel.com | staff123 |
| Receptionist | priya@hotel.com | recep123 |
| Guest | guest@hotel.com | guest123 |

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── common/         # StatCard, Button, Modal, Table, Input, Badge, etc.
│   └── charts/         # Revenue, Booking, Donut, Occupancy charts (pure SVG/CSS)
├── context/
│   ├── AuthContext.jsx # Auth + sessionStorage + VITE_API_BASE_URL
│   └── AppContext.jsx  # Rooms, Guests, Staff, Bookings state
├── data/
│   └── mockData.js     # All seed data — no backend required
├── hooks/
│   └── useApi.js       # Authenticated fetch wrapper + useLocalSearch
├── layouts/
│   └── MainLayout.jsx  # Sidebar + Topbar + Notification
├── pages/
│   ├── admin/          # Dashboard, Staff, Rooms, Guests, Bookings, Analytics
│   ├── staff/          # Dashboard
│   ├── receptionist/   # Dashboard, Room Allocation, Guest Tracking
│   └── guest/          # Dashboard, Browse Rooms, Bookings
├── routes/
│   └── AppRoutes.jsx   # Role-based protected routing
├── utils/
│   └── helpers.js      # formatCurrency, formatDate, calcNights, badges
├── App.jsx
├── App.css
└── main.jsx
```

---

## 🌐 API Integration

When `VITE_API_BASE_URL` is set in your `.env.local`, the app automatically:
- Sends `POST /auth/login` on sign-in and stores the JWT in **sessionStorage**
- Attaches `Authorization: Bearer <token>` to every request via `useApi()`

When the variable is empty (default), the app runs entirely on mock data — no backend needed.

```js
// src/context/AuthContext.jsx — how env var is consumed
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
```

---

## 🛠 Tech Stack

- **React 18** — Functional components + Hooks
- **React Router DOM v6** — Role-based protected routing
- **Tailwind CSS v3** — Utility-first styling
- **Context API** — Lightweight global state
- **Vite** — Lightning-fast dev server & build
- **No charting library** — Pure SVG/CSS bar & donut charts

---

## 📦 Build for Production

```bash
npm run build
# Output in ./dist
```
