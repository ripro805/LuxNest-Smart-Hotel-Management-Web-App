// location: frontend/src/api/roomsApi.js

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export const roomsApi = {
    fetchRooms: (q = {}) => {
        const params = new URLSearchParams(q).toString();
        return request(`/rooms?${params}`);
    },
    getRoom: (id) => request(`/rooms/${id}`),
    createRoom: (d) => request('/rooms', { method: 'POST', body: JSON.stringify(d) }),
    updateRoom: (id, d) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    deleteRoom: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),
};
