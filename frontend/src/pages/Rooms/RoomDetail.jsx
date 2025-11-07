import React from "react";
import styles from "./Rooms.module.css";

export default function RoomDetail({ detail, onClose }) {
    const fmt = (s) => {
        if (!s) return "N/A";
        try {
            const d = new Date(s);
            return d.toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return s;
        }
    };

    return (
        <div className={styles.modal} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ marginTop: 0, color: "#dbeafe" }}>
                    Room {detail?.room_number || ""}
                </h3>
                <p style={{ color: "#9fb7ff", marginTop: 4 }}>
                    Type: {detail?.type || "-"} &nbsp; / &nbsp; Status:{" "}
                    <span style={{ textTransform: "capitalize" }}>{detail?.status || "-"}</span>
                </p>

                <h4 style={{ color: "#9fb7ff", marginTop: 12 }}>Bookings</h4>

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {!detail?.bookings || detail.bookings.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center", padding: 14 }}>
                                No bookings
                            </td>
                        </tr>
                    ) : (
                        detail.bookings.map((b) => (
                            <tr key={b.id}>
                                <td>{b.id}</td>
                                <td>
                                    {b.customer_name || b.customer_email
                                        ? `${b.customer_name || "-"} (${b.customer_email || "-"})`
                                        : "-"}
                                </td>
                                <td>{fmt(b.start_date)}</td>
                                <td>{fmt(b.end_date)}</td>
                                <td style={{ textTransform: "capitalize" }}>{b.status}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                    <button className={styles.closeButton} onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
