const BASE_URL = 'http://localhost:3001/api';

// Helper to attach Authorization header if token exists
function getAuthHeaders() {
    const token = localStorage.getItem("authToken"); // ✅ consistent
    return token ? { "Authorization": `Bearer ${token}` } : {};
}

// Handle API response safely
async function handleResponse(res) {
    try {
        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.message || "Request failed", ...data };
        }
        return data;
    } catch (err) {
        return { success: false, message: "Invalid JSON response" };
    }
}

// Get all rentals
export async function getAllRentals() {
    try {
        const res = await fetch(`${BASE_URL}/rentals`, {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            }
        });
        return await handleResponse(res);
    } catch (err) {
        return { success: false, message: err.message };
    }
}

// Create new rental
export async function createRental(rentalData) {
    try {
        const res = await fetch(`${BASE_URL}/rentals`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(rentalData)
        });
        return await handleResponse(res);
    } catch (err) {
        return { success: false, message: err.message };
    }
}

// Check availability
export async function checkAvailability(carId) {
    try {
        const res = await fetch(`${BASE_URL}/rentals/availability?carId=${carId}`, {
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            }
        });
        return await handleResponse(res);
    } catch (err) {
        return { success: false, message: err.message };
    }
}
