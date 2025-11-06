import React, { useEffect, useState } from 'react';
import styles from "./Booking.module.css";
import { fetchAvailableRooms, fetchCustomers, createBooking } from '../../api/bookingsApi.js';

export default function Booking() {
    const [rooms, setRooms] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customerType, setCustomerType] = useState('existing'); // 'existing' or 'new'

    const loadData = async () => {
        setLoading(true);
        try {
            const [rs, cs] = await Promise.all([fetchAvailableRooms(), fetchCustomers()]);
            setRooms(rs);
            setCustomers(cs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const roomId = parseInt(form.room.value);
        const start = form.start_date.value;
        const end = form.end_date.value;

        let customer;
        if(customerType === 'existing') {
            const customerId = form.customer.value;
            if(!customerId) { alert('Select a customer'); return; }
            customer = { id: customerId };
        } else {
            customer = {
                name: form.new_name.value,
                email: form.new_email.value,
                phone: form.new_phone.value
            };
        }

        try {
            await createBooking({ customer, room_id: roomId, start_date: start, end_date: end });
            alert('Booking Successful');
            setShowForm(false);
            setCustomerType('existing'); // reset
            loadData();
        } catch (err) {
            console.error(err);
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>📅 Booking</h2>

            <div className={styles.actions}>
                <button className={styles.button} onClick={() => setShowForm(true)}>+ New Booking</button>
            </div>

            <div className={styles.card}>
                <h4>Available Rooms</h4>
                {loading ? <div>Loading...</div> : (
                    <table className={styles.table}>
                        <thead>
                        <tr><th>ID</th><th>Room</th><th>Type</th><th>Price</th></tr>
                        </thead>
                        <tbody>
                        {rooms.map(r => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.room_number}</td>
                                <td>{r.type}</td>
                                <td>{r.price}</td>
                            </tr>
                        ))}
                        {rooms.length === 0 && (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No rooms available</td></tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>

            {showForm && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>New Booking</h3>

                        {/* Toggle Tabs */}
                        <div className={styles.tabContainer}>
                            <button
                                className={`${styles.tabButton} ${customerType === 'existing' ? styles.activeTab : ''}`}
                                onClick={() => setCustomerType('existing')}
                                type="button"
                            >Existing Customer</button>
                            <button
                                className={`${styles.tabButton} ${customerType === 'new' ? styles.activeTab : ''}`}
                                onClick={() => setCustomerType('new')}
                                type="button"
                            >New Customer</button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {customerType === 'existing' && (
                                <div className={styles.formRow}>
                                    <label>Customer</label>
                                    <select name="customer" className={styles.input} defaultValue="">
                                        <option value="">Select customer</option>
                                        {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                                    </select>
                                </div>
                            )}

                            {customerType === 'new' && (
                                <>
                                    <div className={styles.formRow}><label>Name</label><input name="new_name" className={styles.input} required /></div>
                                    <div className={styles.formRow}><label>Email</label><input name="new_email" type="email" className={styles.input} required /></div>
                                    <div className={styles.formRow}><label>Phone</label><input name="new_phone" className={styles.input} required /></div>
                                </>
                            )}

                            <div className={styles.formRow}>
                                <label>Room</label>
                                <select name="room" className={styles.input} required>
                                    <option value="">Select room</option>
                                    {rooms.map(r => <option key={r.id} value={r.id}>{r.room_number} ({r.type}) - {r.price}</option>)}
                                </select>
                            </div>

                            <div className={styles.formRow}>
                                <label>Start Date</label>
                                <input name="start_date" type="date" className={styles.input} required />
                            </div>

                            <div className={styles.formRow}>
                                <label>End Date</label>
                                <input name="end_date" type="date" className={styles.input} required />
                            </div>

                            <div className={styles.formActions}>
                                <button type="button" className={styles.button} onClick={() => { setShowForm(false); setCustomerType('existing'); }}>Cancel</button>
                                <button type="submit" className={styles.button}>Book</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
