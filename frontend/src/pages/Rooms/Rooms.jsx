import React, { useEffect, useState } from 'react';
import { roomsApi } from '../../api/roomsApi';
import styles from './Rooms.module.css';
import RoomForm from './RoomForm';
import RoomDetail from './RoomDetail';
import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [detail, setDetail] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const q = {};
            if (status) q.status = status;
            if (type) q.type = type;
            if (search) q.search = search;
            const data = await roomsApi.fetchRooms(q);
            setRooms(data);
        } catch (err) {
            console.error(err);
            alert('Error loading rooms');
        } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    async function submit(e) {
        e.preventDefault();
        const form = e.target;
        const payload = {
            room_number: form.room_number.value,
            type: form.type.value,
            status: form.status.value,
            price: parseFloat(form.price.value || 0),
            notes: form.notes.value
        };
        try {
            if (editing) await roomsApi.updateRoom(editing.id, payload);
            else await roomsApi.createRoom(payload);
            setShowForm(false);
            await load();
        } catch (err) { console.error(err); alert('Error saving'); }
    }

    async function remove(id) {
        if (!confirm('Delete room?')) return;
        await roomsApi.deleteRoom(id);
        await load();
    }

    async function viewDetail(id) {
        const r = await roomsApi.getRoom(id);
        setDetail(r);
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>Rooms</h2>

            <div className={styles.filters}>
                <input className={styles.input} placeholder="Search room number or notes" value={search} onChange={e => setSearch(e.target.value)} />
                <select className={styles.input} value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="">All status</option>
                    <option value="available">available</option>
                    <option value="booked">booked</option>
                    <option value="occupied">occupied</option>
                    <option value="maintenance">maintenance</option>
                </select>
                <select className={styles.input} value={type} onChange={e => setType(e.target.value)}>
                    <option value="">All types</option>
                    <option value="single">single</option>
                    <option value="double">double</option>
                    <option value="suite">suite</option>
                </select>
                <button className={styles.button} onClick={load}>Search</button>
                <div className={styles.flexSpacer} />
                <button className={styles.button} onClick={() => { setEditing(null); setShowForm(true); }}>+ New Room</button>
            </div>

            {loading ? <div>Loading...</div> : (
                <div className={styles.cardsContainer}>
                    {rooms.map(r => (
                        <div key={r.id} className={styles.roomCard}>
                            <div className={styles.roomHeader}>
                                <h3>Room {r.room_number}</h3>
                                <span className={`${styles.status} ${styles[r.status]}`}>{r.status}</span>
                            </div>
                            <p><strong>Type:</strong> {r.type}</p>
                            <p><strong>Price:</strong> ${r.price}</p>
                            {r.notes && <p><strong>Notes:</strong> {r.notes}</p>}
                            <div className={styles.cardActions}>
                                <FiInfo className={styles.icon} title="Details" onClick={() => viewDetail(r.id)} />
                                <FiEdit className={styles.icon} title="Edit" onClick={() => { setEditing(r); setShowForm(true); }} />
                                <FiTrash2 className={styles.icon} title="Delete" onClick={() => remove(r.id)} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && <RoomForm editing={editing} onSubmit={submit} onCancel={() => setShowForm(false)} />}
            {detail && <RoomDetail detail={detail} onClose={() => setDetail(null)} />}
        </div>
    );
}
