import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiUserPlus, FiBox, FiCalendar, FiCheckSquare, FiMenu } from 'react-icons/fi';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { to: '/', label: 'Dashboard', icon: <FiHome /> },
        { to: '/customers', label: 'Guests', icon: <FiUsers /> },
        { to: '/staffs', label: 'Staffs', icon: <FiUserPlus /> },
        { to: '/rooms', label: 'Rooms', icon: <FiBox /> },
        { to: '/booking', label: 'Booking', icon: <FiCalendar /> },
        { to: '/staying', label: 'Staying', icon: <FiCheckSquare /> },
    ];

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
            <div className={styles.top}>
                <div className={styles.brand}>{!collapsed ? 'Luxnest' : ''}</div>
                <button className={styles.toggleBtn} onClick={() => setCollapsed(!collapsed)}>
                    <FiMenu />
                </button>
            </div>
            <nav className={styles.nav}>
                {menuItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => isActive ? styles.active : ''}
                    >
                        <div className={styles.icon}>{item.icon}</div>
                        {!collapsed && <span className={styles.label}>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
