# 🏨 LuxNest - Smart Hotel Management Web App

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://lux-nest-smart-hotel-management-web.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repo-blue?style=for-the-badge&logo=github)](https://github.com/ripro805/LuxNest-Smart-Hotel-Management-Web-App)

> A modern, full-stack hotel management system for managing rooms, bookings, guests, and staff operations with an intuitive dashboard.

## 🌐 Live Demo

**Frontend**: [https://lux-nest-smart-hotel-management-web.vercel.app/](https://lux-nest-smart-hotel-management-web.vercel.app/)  
**Backend API**: [https://luxnest-smart-hotel-management-web-app.onrender.com/](https://luxnest-smart-hotel-management-web-app.onrender.com/)

---

## 📃 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🏠 Dashboard
- Real-time overview of hotel operations
- Total rooms, bookings, and revenue statistics
- Quick access to all management sections

### 🛏️ Room Management
- View all rooms with status (Available/Occupied/Maintenance)
- Add, edit, and delete room information
- Room type categorization (Single, Double, Suite, Deluxe)
- Price management

### 🧑‍💼 Guest Management
- Complete guest directory
- Add and manage customer information
- View booking history per guest
- Search and filter capabilities

### 📅 Booking Management
- Create new bookings with room assignment
- Check-in and check-out operations
- View booking status (Confirmed, Checked-in, Checked-out, Cancelled)
- Booking date tracking

### 👨‍💼 Staff Management
- Employee directory
- Staff role assignment (Manager, Receptionist, Housekeeper, etc.)
- Contact information management
- Salary tracking

### 🏨 Currently Staying
- Real-time view of current guests
- Room occupancy status
- Quick check-out functionality

---

## 🛠️ Tech Stack

### Frontend
- **React** (v19.1.1) - UI library
- **Vite** (v7.1.6) - Build tool
- **React Router DOM** (v7.9.1) - Client-side routing
- **Axios** (v1.12.2) - HTTP client
- **CSS Modules** - Component styling

### Backend
- **Node.js** - Runtime environment
- **Express** (v5.1.0) - Web framework
- **pg** (v8.x) - PostgreSQL driver
- **CORS** (v2.8.5) - Cross-origin resource sharing
- **dotenv** (v17.2.2) - Environment configuration

### Database
- **PostgreSQL (Neon)** - Relational database

### Deployment
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon PostgreSQL

---

## 📁 Project Structure

```
LuxNest/
├── backend/
│   ├── db.js                 # Database connection pool
│   ├── index.js              # Express server entry point
│   ├── package.json
│   ├── routes/
│   │   ├── bookings.js       # Booking CRUD operations
│   │   ├── customers.js      # Guest management
│   │   ├── dashboard.js      # Dashboard statistics
│   │   ├── rooms.js          # Room management
│   │   ├── staffs.js         # Staff management
│   │   └── staying.js        # Current occupancy
│   └── utils/
│       └── helpers.js        # Utility functions
├── frontend/
│   ├── src/
│   │   ├── api/              # API client modules
│   │   │   ├── api.js
│   │   │   ├── bookingsApi.js
│   │   │   ├── customersApi.js
│   │   │   ├── dashboardApi.js
│   │   │   ├── roomsApi.js
│   │   │   ├── staffsApi.js
│   │   │   └── stayingApi.js
│   │   ├── components/       # Reusable components
│   │   │   ├── Sidebar.jsx
│   │   │   └── Topbar.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Booking/
│   │   │   ├── Dashboard/
│   │   │   ├── Guests/
│   │   │   ├── Rooms/
│   │   │   ├── Staffs/
│   │   │   └── Staying/
│   │   ├── styles/           # Global styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json           # Vercel SPA routing config
├── database/
│   └── hotel_management.sql  # Database schema & seed data
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **PostgreSQL/Neon** connection
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ripro805/LuxNest-Smart-Hotel-Management-Web-App.git
   cd LuxNest-Smart-Hotel-Management-Web-App
   ```

2. **Setup Database (Neon/PostgreSQL)**
   - Create a Neon project and copy `DATABASE_URL`
   - Run PostgreSQL schema:
   ```bash
   psql "$DATABASE_URL" -f database/hotel_management_postgres.sql
   ```
   - For migrating old MySQL data, follow: `NEON_MIGRATION.md`

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   
   # Edit .env with your database credentials
   ```

   `.env` file:
   ```env
   DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Create .env file
   cp .env.example .env
   ```

   `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Run the Application**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm start
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

---

## 🔐 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon/PostgreSQL connection string | `postgresql://...` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 🌍 Deployment

### Deployed Services
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon PostgreSQL

### Quick Deploy



#### Vercel (Frontend)
1. Push code to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

#### Render + Neon
1. Create Neon PostgreSQL database
2. Import `database/hotel_management_postgres.sql` (or migrate old MySQL data with `NEON_MIGRATION.md`)
3. Deploy backend from GitHub (Render)
4. Set root directory to `backend`
5. Set backend environment variables:
   - `DATABASE_URL=postgresql://...`
   - `FRONTEND_URL=https://your-frontend.vercel.app`
   - `NODE_ENV=production`

---

## 📡 API Endpoints

### Dashboard
- `GET /api/dashboard` - Get overview statistics

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `POST /api/bookings/:id/checkin` - Check-in booking
- `POST /api/bookings/:id/checkout` - Check-out booking

### Staffs
- `GET /api/staffs` - Get all staff members
- `POST /api/staffs` - Create new staff
- `PUT /api/staffs/:id` - Update staff
- `DELETE /api/staffs/:id` - Delete staff

### Currently Staying
- `GET /api/staying` - Get current guests

---

## 🖼️ Screenshots

### 🏠 Dashboard
The main dashboard provides a comprehensive overview of hotel operations with real-time statistics.

![Dashboard](./screenshots/Dashboard.png)

### 🛏️ Room Management
Manage all rooms with status tracking, pricing, and availability management.

![Rooms](./screenshots/Rooms.png)

### 📅 Booking System
Streamlined booking process with available room listings and reservation management.

![Bookings](./screenshots/Booking.png)

---

## 🙏 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Rifat Pro**  
- GitHub: [@ripro805](https://github.com/ripro805)
- Repository: [LuxNest-Smart-Hotel-Management-Web-App](https://github.com/ripro805/LuxNest-Smart-Hotel-Management-Web-App)

---

## 🙏 Acknowledgments

- React team for the amazing library
- Express.js for the robust backend framework
- Vercel for seamless frontend deployment
- Render for backend hosting
- Neon for PostgreSQL hosting

---

## ðŸ“ž Support

If you have any questions or issues, please open an issue on [GitHub Issues](https://github.com/ripro805/LuxNest-Smart-Hotel-Management-Web-App/issues).

---

**Made with ❤️ for Hotel Management**


