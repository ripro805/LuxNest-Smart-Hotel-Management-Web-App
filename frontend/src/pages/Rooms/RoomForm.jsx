import React from 'react';
import styles from './Rooms.module.css';

export default function RoomForm({ editing, onSubmit, onCancel }) {
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <h3>{editing ? 'Edit Room' : 'Add Room'}</h3>
                <form onSubmit={onSubmit}>
                    <div className={styles.formRow}>
                        <label>Room Number</label>
                        <input name="room_number" defaultValue={editing?.room_number || ''} className="input" required />
                    </div>

                    <div className={styles.formRow}>
                        <label>Type</label>
                        <select name="type" defaultValue={editing?.type || 'single'} className="input">
                            <option value="single">single</option>
                            <option value="double">double</option>
                            <option value="suite">suite</option>
                        </select>
                    </div>

                    <div className={styles.formRow}>
                        <label>Status</label>
                        <select name="status" defaultValue={editing?.status || 'available'} className="input">
                            <option value="available">available</option>
                            <option value="booked">booked</option>
                            <option value="occupied">occupied</option>
                            <option value="maintenance">maintenance</option>
                        </select>
                    </div>

                    <div className={styles.formRow}>
                        <label>Price</label>
                        <input name="price" defaultValue={editing?.price || ''} className="input" />
                    </div>

                    <div className={styles.formRow}>
                        <label>Notes</label>
                        <textarea name="notes" defaultValue={editing?.notes || ''} className="input"></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button type="button" className="button" onClick={onCancel}>Cancel</button>
                        <button type="submit" className="button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
