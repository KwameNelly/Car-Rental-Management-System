const BASE_URL = 'http://localhost:3001/api';

// Helper to attach Authorization header if token exists
function getAuthHeaders() {
    const token = localStorage.getItem("authToken"); // ✅ consistent everywhere
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

// User signup
export async function signup(userData) {
    try {
        const res = await fetch(`${BASE_URL}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
        return await handleResponse(res);
    } catch (err) {
        return { success: false, message: err.message };
    }
}

// User login
export async function login(credentials) {
    try {
        const res = await fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        });
        const data = await handleResponse(res);

        // ✅ Store token if login successful
        if (data.success && data.data && data.data.token) {
            localStorage.setItem("authToken", data.data.token);
            localStorage.setItem("user", JSON.stringify(data.data.user)); // optional
            console.log("Token saved:", data.data.token); // debug log
        } else {
            console.warn("No token found in response:", data);
        }

        return data;
    } catch (err) {
        return { success: false, message: err.message };
    }
}


// Logout (clear token)
export function logout() {
    localStorage.removeItem("authToken"); // ✅ clears auth
    return { success: true, message: "Logged out successfully" };
}
