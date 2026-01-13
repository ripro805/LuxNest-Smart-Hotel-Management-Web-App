const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const customersRouter = require('./routes/customers');
const staffsRouter = require('./routes/staffs');
const roomsRouter = require('./routes/rooms');
const bookingsRouter = require('./routes/bookings');
const dashboardRouter = require('./routes/dashboard');

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// API routes
app.use('/api/customers', customersRouter);
app.use('/api/staffs', staffsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/dashboard', dashboardRouter);

// health
app.get('/', (req, res) => res.send({ ok: true, message: "Hotel Management API" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Customer: http://localhost:${PORT}/api/customers`);
    console.log(`✅ Staffs: http://localhost:${PORT}/api/staffs`);
    console.log(`✅ Rooms: http://localhost:${PORT}/api/rooms`);
    console.log(`✅ Bookings: http://localhost:${PORT}/api/bookings`);
    console.log(`✅ Dashboard: http://localhost:${PORT}/api/dashboard`);
});
