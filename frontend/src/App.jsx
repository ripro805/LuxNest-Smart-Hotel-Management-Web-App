import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Customers from './pages/Customers/Customers.jsx';
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
            <div
                style={{
                    flex: 1,
                    padding: 20,
                    marginLeft: collapsed ? 60 : 220, /* auto adjust page width */
                    transition: 'margin-left 0.3s'
                }}
            >
                <main className={`main-content ${collapsed ? 'collapsed' : ''}`}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/staffs" element={<Staffs />} />
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/staying" element={<Staying />} />
                </Routes>
            </main>
            </div>
        </div>
    );
}
