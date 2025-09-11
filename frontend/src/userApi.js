const BASE_URL = 'http://localhost:3001/api';

// Register
export async function registerUser(userData) {
    const res = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    const data = await res.json();

    // If a token is returned, save it
    if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.full_name || userData.full_name);
    }

    return data;
}

// Login
export async function loginUser(credentials) {
    const res = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    const data = await res.json();

    // If a token is returned, save it
    if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.full_name);
    }

    return data;
}

// Get profile
export async function getUserProfile() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/users/profile`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    return res.json();
}
