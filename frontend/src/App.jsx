import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Guests from './pages/Guests/Guests.jsx';
import Staffs from './pages/Staffs/Staffs.jsx';
import Rooms from './pages/Rooms/Rooms.jsx';
import Booking from './pages/Booking/Booking.jsx';
import Staying from './pages/Staying/Staying.jsx';
import './styles/global.css';

export default function App() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="app-root">
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* 🔹 Page content area */}
            <div className={`main-area ${collapsed ? 'collapsed' : ''}`}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/customers" element={<Guests />} />
                    <Route path="/staffs" element={<Staffs />} />
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/staying" element={<Staying />} />
                </Routes>
            </div>
        </div>
    );
}
