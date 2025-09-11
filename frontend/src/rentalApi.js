const BASE_URL = 'http://localhost:3001/api';

// Helper to attach Authorization header if token exists
function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
}

// Get all rentals
export async function getAllRentals() {
    const res = await fetch(`${BASE_URL}/rentals`, {
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        }
    });
    return res.json();
}

// Create new rental
export async function createRental(rentalData) {
    const res = await fetch(`${BASE_URL}/rentals`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        },
        body: JSON.stringify(rentalData)
    });
    return res.json();
}

// Check availability
export async function checkAvailability(carId) {
    const res = await fetch(`${BASE_URL}/rentals/availability?carId=${carId}`, {
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders()
        }
    });
    return res.json();
}
