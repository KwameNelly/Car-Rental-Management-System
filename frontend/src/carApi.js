const BASE_URL = 'http://localhost:3001/api';

// Helper to attach Authorization header if token exists
function getAuthHeaders() {
    const token = localStorage.getItem("authToken"); // ✅ consistent with rentalApi.js
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

// Get all cars
export async function getAllCars() {
    try {
        const res = await fetch(`${BASE_URL}/cars`, {
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

// Get car by ID
export async function getCarById(carId) {
    try {
        const res = await fetch(`${BASE_URL}/cars/${carId}`, {
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

// Create a car (admin only)
export async function createCar(carData) {
    try {
        const res = await fetch(`${BASE_URL}/cars`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(carData)
        });
        return await handleResponse(res);
    } catch (err) {
        return { success: false, message: err.message };
    }
}

// Update a car (admin only)
export async function updateCar(carId, carData) {
    try {
        const res = await fetch(`${BASE_URL}/cars/${carId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(carData)
        });
        return await handleResponse(res);
    } catch (err) {
        return { success: false, message: err.message };
    }
}

// Delete a car (admin only)
export async function deleteCar(carId) {
    try {
        const res = await fetch(`${BASE_URL}/cars/${carId}`, {
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
