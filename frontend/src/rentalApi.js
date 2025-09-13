const BASE_URL = 'http://localhost:3001/api';

// ✅ Helper to attach Authorization header if token exists
function getAuthHeaders() {
    const token = localStorage.getItem("authToken");
    return token ? { "Authorization": `Bearer ${token}` } : {};
}

// ✅ Handle API response safely
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

/* =====================
   RENTAL API FUNCTIONS
   ===================== */

// Get all rentals (Admin only)
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

// Create new rental (Authenticated users)
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

// ✅ FIXED: Check availability (Public)
export async function checkAvailability(carId) {
    try {
        const res = await fetch(`${BASE_URL}/rentals/check-availability/${carId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return await handleResponse(res);
    } catch (err) {
        return { success: false, message: err.message };
    }
}

// Get rental by ID (Owner or Admin)
export async function getRentalById(id) {
    try {
        const res = await fetch(`${BASE_URL}/rentals/${id}`, {
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

// Get rentals by user ID (Owner or Admin)
export async function getRentalsByUser(userId) {
    try {
        const res = await fetch(`${BASE_URL}/rentals/user/${userId}`, {
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

// Get rentals by status (Admin)
export async function getRentalsByStatus(status) {
    try {
        const res = await fetch(`${BASE_URL}/rentals/status/${status}`, {
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

// Update rental status (Admin only)
export async function updateRentalStatus(id, status) {
    try {
        const res = await fetch(`${BASE_URL}/rentals/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify({ status })
        });
        return await handleResponse(res);
    } catch (err) {
        return { success: false, message: err.message };
    }
}

// Update payment status (Admin only)
export async function updatePaymentStatus(id, paymentStatus) {
    try {
        const res = await fetch(`${BASE_URL}/rentals/${id}/payment`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify({ paymentStatus })
        });
        return await handleResponse(res);
    } catch (err) {
        return { success: false, message: err.message };
    }
}

// Delete rental (Admin only)
export async function deleteRental(id) {
    try {
        const res = await fetch(`${BASE_URL}/rentals/${id}`, {
            method: "DELETE",
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
