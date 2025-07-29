const BASE_URL = 'http://localhost:3001/api';

// Get all rentals
export async function getAllRentals() {
    const res = await fetch(`${BASE_URL}/rentals`);
    return res.json();
}

// Create new rental
export async function createRental(rentalData) {
    const res = await fetch(`${BASE_URL}/rentals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rentalData)
    });
    return res.json();
}

// Check availability
export async function checkAvailability(carId) {
    const res = await fetch(`${BASE_URL}/rentals/availability?carId=${carId}`);
    return res.json();
}
