let cars = [
    { name: "Corolla", brand: "Toyota", status: "Available", price: 280 },
    { name: "Civic", brand: "Honda", status: "Booked", price: 300 },
];

let bookings = [
    { customer: "Kwame Mensah", car: "Corolla", bookingDate: "2025-07-01", returnDate: "2025-07-10", status: "Confirmed" },
    { customer: "Ama Serwaa", car: "Civic", bookingDate: "2025-07-05", returnDate: "2025-07-12", status: "Returned" },
];

// Dashboard Stats
function updateDashboard() {
    document.getElementById("totalCars").textContent = cars.length;
    document.getElementById("totalBookings").textContent = bookings.length;
    document.getElementById("totalCustomers").textContent = new Set(bookings.map(b => b.customer)).size;
    document.getElementById("availableCars").textContent = cars.filter(c => c.status === "Available").length;
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

carForm.onsubmit = function (e) {
    e.preventDefault();
    const data = { name: carName.value, brand: carBrand.value, status: carStatus.value, price: parseFloat(carPrice.value) };
    const index = carIndex.value;
    if (index === "") cars.push(data);
    else cars[index] = data;
    carModal.style.display = "none";
    renderCars(); updateDashboard();
};

function renderCars() {
    carTableBody.innerHTML = "";
    cars.forEach((car, i) => {
        carTableBody.innerHTML += `
      <tr>
        <td>${car.name}</td><td>${car.brand}</td><td>${car.status}</td><td>${car.price}</td>
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
    carName.value = c.name;
    carBrand.value = c.brand;
    carStatus.value = c.status;
    carPrice.value = c.price;
}
function deleteCar(i) {
    if (confirm("Delete this car?")) {
        cars.splice(i, 1);
        renderCars(); updateDashboard();
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
    const available = cars.filter(c => c.status === "Available" || c.name === selected);
    available.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.name;
        opt.text = c.name;
        if (c.name === selected) opt.selected = true;
        carBooked.appendChild(opt);
    });
}

addBookingBtn.onclick = () => {
    bookingModalTitle.innerText = "Add Booking";
    bookingForm.reset(); bookingIndex.value = "";
    populateAvailableCars();
    bookingModal.style.display = "flex";
};

bookingForm.onsubmit = function (e) {
    e.preventDefault();
    const data = {
        customer: customerName.value,
        car: carBooked.value,
        bookingDate: bookingDate.value,
        returnDate: returnDate.value,
        status: bookingStatus.value
    };
    const index = bookingIndex.value;
    if (index === "") bookings.push(data);
    else bookings[index] = data;
    bookingModal.style.display = "none";
    renderBookings(); updateDashboard();
};

function renderBookings() {
    bookingTableBody.innerHTML = "";
    bookings.forEach((b, i) => {
        bookingTableBody.innerHTML += `
      <tr>
        <td>${b.customer}</td><td>${b.car}</td><td>${b.bookingDate}</td><td>${b.returnDate}</td><td>${b.status}</td>
        <td class="actions">
          <button class="edit" onclick="editBooking(${i})">Edit</button>
          <button class="delete" onclick="deleteBooking(${i})">Delete</button>
        </td>
      </tr>`;
    });
}
function editBooking(i) {
    const b = bookings[i];
    bookingModalTitle.innerText = "Edit Booking";
    bookingIndex.value = i;
    customerName.value = b.customer;
    bookingDate.value = b.bookingDate;
    returnDate.value = b.returnDate;
    bookingStatus.value = b.status;
    populateAvailableCars(b.car);
    bookingModal.style.display = "flex";
}
function deleteBooking(i) {
    if (confirm("Delete this booking?")) {
        bookings.splice(i, 1);
        renderBookings(); updateDashboard();
    }
}

renderCars();
renderBookings();
updateDashboard();
