import React from 'react';
import styles from './Rooms.module.css';

export default function RoomDetail({ detail, onClose }) {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>Room {detail.room_number}</h3>
                <p>Type: {detail.type} / Status: {detail.status}</p>
                <h4>Bookings</h4>
                <table className="table">
                    <thead>
                    <tr><th>ID</th><th>Customer</th><th>Start</th><th>End</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                    {detail.bookings.length === 0 ? (
                        <tr><td colSpan="5">No bookings</td></tr>
                    ) : detail.bookings.map(b => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{b.customer_name} ({b.customer_email})</td>
                            <td>{b.start_date}</td>
                            <td>{b.end_date}</td>
                            <td>{b.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <button className="button" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
