// location: frontend/src/api/dashboardApi.js
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

export const dashboardApi = {
    getOverview: () => request('/dashboard'),
};
