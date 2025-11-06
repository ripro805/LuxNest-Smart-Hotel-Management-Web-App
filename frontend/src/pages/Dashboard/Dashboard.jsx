import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboardApi.js';
import styles from './Dashboard.module.css';
import { FiUsers, FiHome, FiCheckCircle, FiClock, FiShoppingCart, FiActivity } from 'react-icons/fi';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        dashboardApi.getOverview()
            .then(d => {
                setData(d);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className={styles.loading}>Loading...</div>;
    if (!data) return <div className={styles.error}>No data</div>;

    const cards = [
        { title: "Total Rooms", value: data.total_rooms, color: "#3498db", icon: <FiHome /> },
        { title: "Available", value: data.available_rooms, color: "#2ecc71", icon: <FiCheckCircle /> },
        { title: "Booked", value: data.booked_rooms, color: "#f1c40f", icon: <FiShoppingCart /> },
        { title: "Occupied", value: data.occupied_rooms, color: "#e74c3c", icon: <FiActivity /> },
        { title: "Currently Staying", value: data.staying_customers, color: "#9b59b6", icon: <FiClock /> },
        { title: "Total Customers", value: data.total_customers, color: "#34495e", icon: <FiUsers /> },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>📊 Dashboard Overview</h2>
            <div className={styles.grid}>
                {cards.map((c, idx) => (
                    <div key={idx} className={styles.card} style={{ borderLeftColor: c.color }}>
                        <div className={styles.cardIcon}>{c.icon}</div>
                        <h3>{c.title}</h3>
                        <p>{c.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
