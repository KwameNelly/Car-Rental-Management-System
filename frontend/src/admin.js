// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';
let authToken = localStorage.getItem('adminToken');
let cars = [];
let bookings = [];
let users = [];

// Check authentication on page load
if (!authToken) {
    window.location.href = '/pages/admin-login.html';
}

// API Helper Functions
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            ...options.headers
        },
        ...options
    };

    // Don't set Content-Type for FormData, let browser handle it
    if (!(options.body instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        alert(`Error: ${error.message}`);
        throw error;
    }
}

// Load data from API
async function loadDashboardData() {
    try {
        // Load cars
        const carsResponse = await apiRequest('/cars');
        cars = carsResponse.data;

        // Load bookings (rentals)
        const bookingsResponse = await apiRequest('/rentals');
        bookings = bookingsResponse.data;

        // Load users
        const usersResponse = await apiRequest('/users');
        users = usersResponse.data;

        // Update admin welcome message
        const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
        const adminWelcome = document.getElementById('adminWelcome');
        if (adminWelcome && adminUser.username) {
            adminWelcome.textContent = `Welcome, ${adminUser.username}`;
        }

        // Update UI
        renderCars();
        renderBookings();
        updateDashboard();

    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

// Dashboard Stats
function updateDashboard() {
    document.getElementById("totalCars").textContent = cars.length;
    document.getElementById("totalBookings").textContent = bookings.length;
    document.getElementById("totalCustomers").textContent = users.length;
    document.getElementById("availableCars").textContent = cars.filter(c => c.availability === 1).length;
}

// CAR MANAGEMENT
const carTableBody = document.getElementById("carTableBody");
const addCarBtn = document.getElementById("addCarBtn");
const carModal = document.getElementById("carModal");
const carForm = document.getElementById("carForm");
const modalTitle = document.getElementById("modalTitle");

const carName = document.getElementById("carName");
const carBrand = document.getElementById("carBrand");
const carStatus = document.getElementById("carStatus");
const carPrice = document.getElementById("carPrice");
const carIndex = document.getElementById("carIndex");
document.getElementById("cancelBtn").onclick = () => carModal.style.display = "none";

addCarBtn.onclick = () => { modalTitle.innerText = "Add Car"; carForm.reset(); carIndex.value = ""; carModal.style.display = "flex"; };

carForm.onsubmit = async function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('make', carBrand.value);
    formData.append('model', carName.value);
    formData.append('year', new Date().getFullYear());
    formData.append('category', 'Sedan');
    formData.append('price_per_day', parseFloat(carPrice.value));
    formData.append('license_plate', `ADMIN${Date.now()}`);
    formData.append('availability', carStatus.value === "Available" ? 1 : 0);
    formData.append('fuel_type', 'Petrol');
    formData.append('transmission', 'Automatic');
    formData.append('seats', 5);

    // Add image if selected
    const imageFile = document.getElementById('carImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    try {
        if (carIndex.value === "") {
            // Create new car
            await apiRequest('/cars', {
                method: 'POST',
                headers: {}, // Remove Content-Type header to let browser set it for FormData
                body: formData
            });
        } else {
            // Update existing car
            const carId = cars[carIndex.value].id;
            await apiRequest(`/cars/${carId}`, {
                method: 'PUT',
                headers: {}, // Remove Content-Type header to let browser set it for FormData
                body: formData
            });
        }

        carModal.style.display = "none";
        await loadDashboardData(); // Reload all data
    } catch (error) {
        console.error('Error saving car:', error);
    }
};

function renderCars() {
    carTableBody.innerHTML = "";
    cars.forEach((car, i) => {
        const status = car.availability === 1 ? "Available" : "Booked";
        carTableBody.innerHTML += `
      <tr>
        <td>${car.model}</td><td>${car.make}</td><td>${status}</td><td>${car.price_per_day}</td>
        <td class="actions">
          <button class="edit" onclick="editCar(${i})">Edit</button>
          <button class="delete" onclick="deleteCar(${i})">Delete</button>
        </td>
      </tr>`;
    });
}
function editCar(i) {
    carModal.style.display = "flex";
    modalTitle.innerText = "Edit Car";
    carIndex.value = i;
    const c = cars[i];
    carName.value = c.model;
    carBrand.value = c.make;
    carStatus.value = c.availability === 1 ? "Available" : "Booked";
    carPrice.value = c.price_per_day;
}

async function deleteCar(i) {
    if (confirm("Delete this car?")) {
        try {
            const carId = cars[i].id;
            await apiRequest(`/cars/${carId}`, {
                method: 'DELETE'
            });
            await loadDashboardData(); // Reload all data
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    }
}

// BOOKING MANAGEMENT
const bookingTableBody = document.getElementById("bookingTableBody");
const addBookingBtn = document.getElementById("addBookingBtn");
const bookingModal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");
const bookingModalTitle = document.getElementById("bookingModalTitle");

const customerName = document.getElementById("customerName");
const carBooked = document.getElementById("carBooked");
const bookingDate = document.getElementById("bookingDate");
const returnDate = document.getElementById("returnDate");
const bookingStatus = document.getElementById("bookingStatus");
const bookingIndex = document.getElementById("bookingIndex");

document.getElementById("cancelBookingBtn").onclick = () => bookingModal.style.display = "none";

function populateAvailableCars(selected = "") {
    carBooked.innerHTML = "";
    const available = cars.filter(c => c.availability === 1 || c.model === selected);
    available.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.id; // Use car ID instead of name
        opt.text = `${c.make} ${c.model}`;
        if (c.model === selected) opt.selected = true;
        carBooked.appendChild(opt);
    });
}

addBookingBtn.onclick = () => {
    bookingModalTitle.innerText = "Add Booking";
    bookingForm.reset(); bookingIndex.value = "";
    populateAvailableCars();
    bookingModal.style.display = "flex";
};

bookingForm.onsubmit = async function (e) {
    e.preventDefault();

    // Find user by name or create a new one
    let userId = users.find(u => u.full_name === customerName.value)?.id;
    if (!userId) {
        // For demo purposes, use first user or create a placeholder
        userId = users.length > 0 ? users[0].id : 1;
    }

    const data = {
        user_id: userId,
        car_id: parseInt(carBooked.value),
        pickup_date: bookingDate.value,
        return_date: returnDate.value,
        pickup_location: "Admin Office",
        return_location: "Admin Office",
        payment_method: "Credit Card",
        notes: `Status: ${bookingStatus.value}`
    };

    try {
        if (bookingIndex.value === "") {
            // Create new booking
            await apiRequest('/rentals', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        } else {
            // Update existing booking
            const bookingId = bookings[bookingIndex.value].id;
            await apiRequest(`/rentals/${bookingId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status: bookingStatus.value.toLowerCase() })
            });
        }

        bookingModal.style.display = "none";
        await loadDashboardData(); // Reload all data
    } catch (error) {
        console.error('Error saving booking:', error);
    }
};

function renderBookings() {
    bookingTableBody.innerHTML = "";
    bookings.forEach((b, i) => {
        // Find car and user details
        const car = cars.find(c => c.id === b.car_id);
        const user = users.find(u => u.id === b.user_id);

        const carName = car ? `${car.make} ${car.model}` : 'Unknown Car';
        const customerName = user ? user.full_name : 'Unknown Customer';

        bookingTableBody.innerHTML += `
      <tr>
        <td>${customerName}</td><td>${carName}</td><td>${b.pickup_date}</td><td>${b.return_date}</td><td>${b.status}</td>
        <td class="actions">
          <button class="edit" onclick="editBooking(${i})">Edit</button>
          <button class="delete" onclick="deleteBooking(${i})">Delete</button>
        </td>
      </tr>`;
    });
}
function editBooking(i) {
    const b = bookings[i];
    const user = users.find(u => u.id === b.user_id);
    const car = cars.find(c => c.id === b.car_id);

    bookingModalTitle.innerText = "Edit Booking";
    bookingIndex.value = i;
    customerName.value = user ? user.full_name : '';
    bookingDate.value = b.pickup_date;
    returnDate.value = b.return_date;
    bookingStatus.value = b.status.charAt(0).toUpperCase() + b.status.slice(1);
    populateAvailableCars(car ? car.model : '');
    bookingModal.style.display = "flex";
}

async function deleteBooking(i) {
    if (confirm("Delete this booking?")) {
        try {
            const bookingId = bookings[i].id;
            await apiRequest(`/rentals/${bookingId}`, {
                method: 'DELETE'
            });
            await loadDashboardData(); // Reload all data
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/pages/admin-login.html';
}

// Add logout event listener
document.addEventListener('DOMContentLoaded', function () {
    const logoutLink = document.querySelector('a[href="#"]:last-child');
    if (logoutLink && logoutLink.textContent.includes('Logout')) {
        logoutLink.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }
});


// Initialize dashboard
loadDashboardData();



document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    window.location.href = "/pages/login.html";
});



const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
if (adminWelcome && adminUser.username) {
    adminWelcome.textContent = `Welcome, ${adminUser.username}`;
}

