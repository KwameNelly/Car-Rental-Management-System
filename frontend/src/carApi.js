const BASE_URL = 'http://localhost:3001/api';

// Get all cars
export async function getAllCars() {
    const res = await fetch(`${BASE_URL}/cars`);
    return res.json();
}

// Get single car by ID
export async function getCarById(id) {
    const res = await fetch(`${BASE_URL}/cars/${id}`);
    return res.json();
}

// Add new car (admin)
export async function addCar(carData) {
    const res = await fetch(`${BASE_URL}/cars`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData)
    });
    return res.json();
}
