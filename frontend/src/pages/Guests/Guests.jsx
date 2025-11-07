import React, { useEffect, useState } from 'react';
import { api } from '../../api/api.js';
import styles from './Guests.module.css';
import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';

export default function Guests() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [detail, setDetail] = useState(null);

    async function load() {
        setLoading(true);
        try {
            const q = {};
            if (search) q.search = search;
            if (statusFilter) q.status = statusFilter;
            const data = await api.fetchCustomers(q);
            setCustomers(data);
        } catch (err) {
            console.error(err);
            alert('Error fetching customers');
        } finally { setLoading(false); }
    }

    useEffect(() => { load(); }, []);

    function openNew() { setEditing(null); setShowForm(true); }
    function openEdit(c) { setEditing(c); setShowForm(true); }
    async function handleDelete(id) {
        if (!confirm('Delete this customer?')) return;
        await api.deleteCustomer(id);
        await load();
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const data = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            note: form.note.value
        };
        try {
            if (editing) await api.updateCustomer(editing.id, data);
            else await api.createCustomer(data);
            setShowForm(false);
            await load();
        } catch (err) {
            console.error(err);
            alert('Error saving');
        }
    }
    async function viewDetails(id) {
        try {
            const d = await api.getCustomer(id);
            setDetail(d);
        } catch (err) {
            console.error(err);
            alert('Error fetching details');
        }
    }

    return (
        <div className={styles.page}>
            <h2 className={styles.pageTitle}>👥 Guests</h2>

            {/* Controls */}
            <div className={styles.controls}>
                <input
                    className={styles.input}
                    placeholder="Search name or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className={styles.input}
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="">All status</option>
                    <option value="booked">Booked</option>
                    <option value="staying">Staying</option>
                    <option value="checked-out">Checked-out</option>
                </select>
                <button className={styles.primaryBtn} onClick={load}>Search</button>
                <div style={{ flex: 1 }} />
                <button className={styles.successBtn} onClick={openNew}>+ New Guests</button>
            </div>

            {/* Card Grid */}
            {loading ? <div>Loading...</div> : (
                <div className={styles.cardsContainer}>
                    {customers.map(c => (
                        <div key={c.id} className={styles.customerCard}>
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <strong>{c.name}</strong>
                                    <span className={`${styles.status} ${styles[c.status]}`}>{c.status}</span>
                                </div>
                                <div className={styles.cardBody}>
                                    <small>{c.email}</small>
                                    <p>{c.phone}</p>
                                    {c.note && <p className={styles.note}>{c.note}</p>}
                                </div>
                            </div>
                            <div className={styles.cardActions}>
                                <FiInfo className={styles.icon} title="Details" onClick={() => viewDetails(c.id)} />
                                <FiEdit className={styles.icon} title="Edit" onClick={() => openEdit(c)} />
                                <FiTrash2 className={styles.icon} title="Delete" onClick={() => handleDelete(c.id)} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>{editing ? 'Edit Customer' : 'Add Customer'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <label>Name</label>
                                <input name="name" defaultValue={editing?.name || ''} className={styles.input} required />
                            </div>
                            <div className={styles.formRow}>
                                <label>Email</label>
                                <input name="email" defaultValue={editing?.email || ''} className={styles.input} />
                            </div>
                            <div className={styles.formRow}>
                                <label>Phone</label>
                                <input name="phone" defaultValue={editing?.phone || ''} className={styles.input} />
                            </div>
                            <div className={styles.formRow}>
                                <label>Note</label>
                                <textarea name="note" defaultValue={editing?.note || ''} className={styles.input} />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit" className={styles.primaryBtn}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {detail && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Customer Detail</h3>
                        <p><strong>{detail.name}</strong> ({detail.email})</p>
                        <p>Phone: {detail.phone}</p>
                        {detail.note && <p>Note: {detail.note}</p>}
                        <h4>Bookings</h4>
                        <table className={styles.table}>
                            <thead>
                            <tr><th>ID</th><th>Room</th><th>Start</th><th>End</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                            {detail.bookings.length === 0
                                ? <tr><td colSpan="5">No bookings</td></tr>
                                : detail.bookings.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.id}</td>
                                        <td>{b.room_number} ({b.room_type})</td>
                                        <td>{b.start_date}</td>
                                        <td>{b.end_date}</td>
                                        <td>{b.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={() => setDetail(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
