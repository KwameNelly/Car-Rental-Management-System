const BASE_URL = 'http://localhost:3001/api';

// Register
export async function registerUser(userData) {
    const res = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return res.json();
}

// Login
export async function loginUser(credentials) {
    const res = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    return res.json();
}

// Get profile
export async function getUserProfile(token) {
    const res = await fetch(`${BASE_URL}/users/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.json();
}
