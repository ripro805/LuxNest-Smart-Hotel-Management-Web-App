import React, { useEffect, useState } from 'react';
import { api } from '../../api.js';
import { FaCalendarAlt } from 'react-icons/fa';
import styles from './Staying.module.css';

export default function Staying() {
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    async function load() {
        setLoading(true);
        try {
            const data = await api.fetchBookings();
            const filtered = data.filter(b => b.status === 'booked' || b.status === 'staying');
            setList(filtered);
        } catch (err) {
            console.error(err);
            alert('Error loading bookings');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function doCheckIn(id) {
        if (!confirm('Proceed to check-in?')) return;
        await api.checkinBooking(id);
        await load();
    }

    async function doCheckOut(id) {
        if (!confirm('Proceed to check-out?')) return;
        await api.checkoutBooking(id);
        await load();
    }

    // Filter logic
    const displayed = list.filter(item => {
        if (filter && item.status !== filter) return false;
        if (search) {
            const s = search.toLowerCase();
            if (!item.customer_name.toLowerCase().includes(s) && !(item.room_number || '').toLowerCase().includes(s)) {
                return false;
            }
        }
        if (selectedDate) {
            const start = new Date(item.start_date).toISOString().split('T')[0];
            if (start !== selectedDate) return false;
        }
        return true;
    });

    return (
        <div className={styles.container}>
               <h2 className={styles.title}>
                <span className={styles.emoji}>🏨</span> Staying
            </h2>


            <div className={styles.controls}>
                <input
                    className={styles.input}
                    placeholder="🔍 Search by name or room"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select className={styles.input} value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="">All</option>
                    <option value="booked">Booked</option>
                    <option value="staying">Staying</option>
                </select>

                <div className={styles.datePicker}>
                    <FaCalendarAlt className={styles.icon} />
                    <input
                        type="date"
                        className={styles.dateInput}
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                    />
                </div>

                <button className={styles.button} onClick={load}>🔄 Refresh</button>
            </div>

            <div className={styles.card}>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Room</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {displayed.map(b => (
                            <tr key={b.id}>
                                <td>{b.id}</td>
                                <td>{b.customer_name}</td>
                                <td>{b.room_number}</td>
                                <td>{b.start_date}</td>
                                <td>{b.end_date}</td>
                                <td>
                                        <span className={`${styles.status} ${styles[b.status]}`}>
                                            {b.status}
                                        </span>
                                </td>
                                <td>
                                    {b.status === 'booked' && (
                                        <button
                                            className={`${styles.actionBtn} ${styles.checkin}`}
                                            onClick={() => doCheckIn(b.id)}
                                        >
                                            Check-in
                                        </button>
                                    )}
                                    {b.status === 'staying' && (
                                        <button
                                            className={`${styles.actionBtn} ${styles.checkout}`}
                                            onClick={() => doCheckOut(b.id)}
                                        >
                                            Check-out
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {displayed.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', opacity: 0.7 }}>
                                    No records found
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
