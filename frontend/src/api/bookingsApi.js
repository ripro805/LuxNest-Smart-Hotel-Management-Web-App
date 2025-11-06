import { api } from './api.js';


export async function fetchAvailableRooms() {
    return api.fetchRooms({ status: 'available' });
}

export async function fetchCustomers() {
    return api.fetchCustomers({});
}

export async function createBooking(data) {
    return api.createBooking(data);
}
