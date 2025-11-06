// location: frontend/src/api/customersApi.js
const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchCustomers(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/customers?${query}`);
    if (!res.ok) throw new Error("Failed to fetch customers");
    return res.json();
}

export async function getCustomer(id) {
    const res = await fetch(`${API_BASE_URL}/customers/${id}`);
    if (!res.ok) throw new Error("Failed to fetch customer");
    return res.json();
}

export async function createCustomer(data) {
    const res = await fetch(`${API_BASE_URL}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create customer");
    return res.json();
}

export async function updateCustomer(id, data) {
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update customer");
    return res.json();
}

export async function deleteCustomer(id) {
    const res = await fetch(`${API_BASE_URL}/customers/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete customer");
    return res.json();
}
