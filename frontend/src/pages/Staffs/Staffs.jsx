import { useEffect, useState } from "react";
import styles from "./Staffs.module.css";
import {
    getStaffs,
    addStaff,
    updateStaff,
    deleteStaff,
} from "../../api/staffsApi.js";

export default function Staffs() {
    const [staffs, setStaffs] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        designation: "staff",
        joined_at: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadStaffs();
    }, []);

    async function loadStaffs() {
        const data = await getStaffs();
        setStaffs(data);
    }

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleAddClick() {
        setFormData({
            name: "",
            email: "",
            phone: "",
            designation: "staff",
            joined_at: "",
        });
        setEditingId(null);
        setShowForm(true);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (editingId) {
            await updateStaff(editingId, formData);
        } else {
            await addStaff(formData);
        }
        setShowForm(false);
        loadStaffs();
    }

    function handleEdit(staff) {
        setFormData({
            name: staff.name,
            email: staff.email,
            phone: staff.phone,
            designation: staff.designation,
            joined_at: staff.joined_at?.split("T")[0] || "",
        });
        setEditingId(staff.id);
        setShowForm(true);
    }

    async function handleDelete(id) {
        if (window.confirm("Are you sure you want to delete this staff?")) {
            await deleteStaff(id);
            loadStaffs();
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Staff Management</h2>
            <button className={styles.addBtn} onClick={handleAddClick}>
                + Add Staff
            </button>

            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Designation</th>
                    <th>Joined At</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {staffs.map((s) => (
                    <tr key={s.id}>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{s.phone}</td>
                        <td>{s.designation}</td>
                        <td>{s.joined_at}</td>
                        <td>
                            <button
                                className={styles.editBtn}
                                onClick={() => handleEdit(s)}
                            >
                                Edit
                            </button>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => handleDelete(s.id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                {staffs.length === 0 && (
                    <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                            No staff found
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {showForm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>{editingId ? "Edit Staff" : "Add Staff"}</h3>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                            <select
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                            >
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                                <option value="cleaner">Cleaner</option>
                                <option value="guard">Guard</option>
                            </select>
                            <input
                                type="date"
                                name="joined_at"
                                value={formData.joined_at}
                                onChange={handleChange}
                            />
                            <div className={styles.formActions}>
                                <button type="submit" className={styles.saveBtn}>
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={() => setShowForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
