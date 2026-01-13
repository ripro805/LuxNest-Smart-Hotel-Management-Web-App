import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/staffs`;

// সব staff ডিটেইলস দেখার জন্য
export async function getStaffs() {
    const res = await axios.get(API_BASE_URL);
    return res.data;
}

// নতুন staff add করার জন্য
export async function addStaff(staff) {
    // staff = { name, email, phone, designation, joined_at }
    const res = await axios.post(API_BASE_URL, staff);
    return res.data;
}

// পুরানো staff edit করার জন্য
export async function updateStaff(id, staff) {
    // staff = { name, email, phone, designation, joined_at }
    const res = await axios.put(`${API_BASE_URL}/${id}`, staff);
    return res.data;
}

// পুরানো staff remove করার জন্য
export async function deleteStaff(id) {
    const res = await axios.delete(`${API_BASE_URL}/${id}`);
    return res.data;
}
