// location: frontend/src/api/api.js

const API_BASE = 'http://localhost:5000/api';

async function request(path, opts = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...opts,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
    }
    return res.json();
}

export const api = {
    // customers
    fetchCustomers: (q = {}) => {
        const params = new URLSearchParams(q).toString();
        return request(`/customers?${params}`);
    },
    getCustomer: (id) => request(`/customers/${id}`),
    createCustomer: (data) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
    updateCustomer: (id, data) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCustomer: (id) => request(`/customers/${id}`, { method: 'DELETE' }),

    // staffs
    fetchStaffs: (q = {}) => {
        const params = new URLSearchParams(q).toString();
        return request(`/staffs?${params}`);
    },
    createStaff: (d) => request('/staffs', { method: 'POST', body: JSON.stringify(d) }),
    updateStaff: (id, d) => request(`/staffs/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    deleteStaff: (id) => request(`/staffs/${id}`, { method: 'DELETE' }),

    // rooms
    fetchRooms: (q = {}) => {
        const params = new URLSearchParams(q).toString();
        return request(`/rooms?${params}`);
    },
    getRoom: (id) => request(`/rooms/${id}`),
    createRoom: (d) => request('/rooms', { method: 'POST', body: JSON.stringify(d) }),
    updateRoom: (id, d) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    deleteRoom: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),

    // bookings
    fetchBookings: (q = {}) => {
        const params = new URLSearchParams(q).toString();
        return request(`/bookings?${params}`);
    },
    createBooking: (d) => request('/bookings', { method: 'POST', body: JSON.stringify(d) }),
    checkinBooking: (id) => request(`/bookings/${id}/checkin`, { method: 'POST' }),
    checkoutBooking: (id) => request(`/bookings/${id}/checkout`, { method: 'POST' }),
};
