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
app.use(cors());
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
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
app.listen(PORT, () => console.log(`✅ Customer: http://localhost:5000/api/customers`));
app.listen(PORT, () => console.log(`✅ Staffs: http://localhost:5000/api/staffs`));
app.listen(PORT, () => console.log(`✅ Rooms: http://localhost:5000/api/rooms`));
app.listen(PORT, () => console.log(`✅ Bookings: http://localhost:5000/api/bookings`));
app.listen(PORT, () => console.log(`✅ Dashboard: http://localhost:5000/api/dashboard`));
