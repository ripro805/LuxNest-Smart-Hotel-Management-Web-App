import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiInfo, FiCalendar } from "react-icons/fi";
import { api } from "../../api/api.js";
import styles from "./Guests.module.css";

export default function Guests() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [detail, setDetail] = useState(null);

    // ✅ Load guests and their bookings
    async function load() {
        setLoading(true);
        try {
            const q = {};
            if (search) q.search = search;
            if (statusFilter) q.status = statusFilter;

            const data = await api.fetchCustomers(q);

            // Fetch bookings for each customer
            const withBookings = await Promise.all(
                data.map(async (c) => {
                    try {
                        const detail = await api.getCustomer(c.id);
                        return { ...c, bookings: detail.bookings || [] };
                    } catch (err) {
                        console.error(`Failed to fetch bookings for ${c.id}`, err);
                        return { ...c, bookings: [] };
                    }
                })
            );

            setCustomers(withBookings);
        } catch (err) {
            console.error(err);
            alert("Error fetching customers");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    function openNew() {
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(c) {
        setEditing(c);
        setShowForm(true);
    }

    async function handleDelete(id) {
        if (!confirm("Delete this customer?")) return;
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
            note: form.note.value,
        };
        try {
            if (editing) await api.updateCustomer(editing.id, data);
            else await api.createCustomer(data);
            setShowForm(false);
            await load();
        } catch (err) {
            console.error(err);
            alert("Error saving");
        }
    }

    async function viewDetails(id) {
        try {
            const d = await api.getCustomer(id);
            setDetail(d);
        } catch (err) {
            console.error(err);
            alert("Error fetching details");
        }
    }

    // ✅ Helper function to format ISO date to "YYYY-MM-DD"
    const isoToDateOnly = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        if (Number.isNaN(d.getTime())) return "";
        return d.toISOString().slice(0, 10);
    };

    // ✅ Filter guests by date (checks bookings)
    const filteredCustomers = customers.filter((c) => {
        if (!filterDate) return true;
        if (!c.bookings || c.bookings.length === 0) return false;

        return c.bookings.some((b) => isoToDateOnly(b.start_date) === filterDate);
    });

    return (
        <div className={styles.page}>
            <h2 className={styles.pageTitle}>👥 Guests</h2>

            {/* Controls */}
            <div className={styles.controls}>
                <input
                    className={styles.input}
                    placeholder="Search name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className={styles.input}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All status</option>
                    <option value="booked">Booked</option>
                    <option value="staying">Staying</option>
                    <option value="checked-out">Checked-out</option>
                </select>

                {/* Date Filter */}
                <div className={styles.dateFilter}>
                    <FiCalendar className={styles.calendarIcon} />
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className={styles.dateInput}
                    />
                    {filterDate && (
                        <button
                            onClick={() => setFilterDate("")}
                            className={styles.clearDateBtn}
                        >
                            ✕
                        </button>
                    )}
                </div>

                <button className={styles.primaryBtn} onClick={load}>
                    Search
                </button>
                <div style={{ flex: 1 }} />
                <button className={styles.successBtn} onClick={openNew}>
                    + New Guest
                </button>
            </div>

            {/* List View */}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className={styles.listContainer}>
                    <table className={styles.listTable}>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Start Date</th>
                            <th>Note</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredCustomers.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>
                                    No guests found
                                </td>
                            </tr>
                        ) : (
                            filteredCustomers.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td>{c.email}</td>
                                    <td>{c.phone}</td>
                                    <td>
                      <span className={`${styles.status} ${styles[c.status]}`}>
                        {c.status}
                      </span>
                                    </td>
                                    <td>
                                        {c.bookings && c.bookings.length > 0
                                            ? isoToDateOnly(c.bookings[0].start_date)
                                            : "N/A"}
                                    </td>
                                    <td>{c.note || "-"}</td>
                                    <td>
                                        <FiInfo
                                            className={styles.icon}
                                            title="Details"
                                            onClick={() => viewDetails(c.id)}
                                        />
                                        <FiEdit
                                            className={styles.icon}
                                            title="Edit"
                                            onClick={() => openEdit(c)}
                                        />
                                        <FiTrash2
                                            className={styles.icon}
                                            title="Delete"
                                            onClick={() => handleDelete(c.id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>{editing ? "Edit Customer" : "Add Customer"}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formRow}>
                                <label>Name</label>
                                <input
                                    name="name"
                                    defaultValue={editing?.name || ""}
                                    className={styles.input}
                                    required
                                />
                            </div>
                            <div className={styles.formRow}>
                                <label>Email</label>
                                <input
                                    name="email"
                                    defaultValue={editing?.email || ""}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <label>Phone</label>
                                <input
                                    name="phone"
                                    defaultValue={editing?.phone || ""}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <label>Note</label>
                                <textarea
                                    name="note"
                                    defaultValue={editing?.note || ""}
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className={styles.primaryBtn}>
                                    Save
                                </button>
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
                        <p>
                            <strong>{detail.name}</strong> ({detail.email})
                        </p>
                        <p>Phone: {detail.phone}</p>
                        {detail.note && <p>Note: {detail.note}</p>}
                        <h4>Bookings</h4>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Room</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {detail.bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="5">No bookings</td>
                                </tr>
                            ) : (
                                detail.bookings.map((b) => (
                                    <tr key={b.id}>
                                        <td>{b.id}</td>
                                        <td>
                                            {b.room_number} ({b.room_type})
                                        </td>
                                        <td>
                                            {new Date(b.start_date).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td>
                                            {new Date(b.end_date).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </td>
                                        <td>{b.status}</td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setDetail(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
