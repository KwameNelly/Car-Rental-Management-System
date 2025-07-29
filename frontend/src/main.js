let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");


menu.onclick = () => {
    menu.classList.toggle('bx-x')
    navbar.classList.toggle('active')

}

window.onscroll = () => {
    menu.classList.remove('bx-x')
    navbar.classList.remove('active')
}

const sr = ScrollReveal({
    distance: '600px',
    duration: 2500,
    delay: 400,
    reset: true
})

sr.reveal('.text', { delay: 200, origin: 'top' })
sr.reveal('.form-container form', { delay: 800, origin: 'left' })
sr.reveal('heading', { delay: 800, origin: 'top' })
sr.reveal('.ride-container .box', { delay: 600, origin: 'top' })
sr.reveal('.services-container .box', { delay: 600, origin: 'top' })
sr.reveal('.about-container .box', { delay: 600, origin: 'top' })
sr.reveal('.reviews-container', { delay: 600, origin: 'top' })
sr.reveal('.newsletter-box', { delay: 600, origin: 'top' })



//javascript for sign in and sign up forms 

const forms = document.querySelector(".forms"),
    pwShowHide = document.querySelectorAll(".eye-icon"),
    links = document.querySelectorAll(".link");


pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");

        pwFields.forEach(password => {
            if (password.type === "password") {
                password.type = "text";
                eyeIcon.classList.replace("bx-hide", "bx-show");
                return;
            }
            password.type = "password"
            eyeIcon.classList.replace("bx-show", "bx-hide");
        })
    })
})


// request from the api 


import { getAllCars } from '../api/carApi.js';
import { createRental } from '../api/rentalApi.js';

document.addEventListener('DOMContentLoaded', async () => {
    const cars = await getAllCars();

    const carList = document.getElementById('carList');
    carList.innerHTML = '';

    cars.forEach(car => {
        const div = document.createElement('div');
        div.innerHTML = `
      <h4>${car.make} ${car.model}</h4>
      <p>Year: ${car.year}</p>
      <p>Status: ${car.status}</p>
      ${car.status === 'available' ? `<button data-id="${car._id}">Rent</button>` : '<em>Not available</em>'}
    `;
        carList.appendChild(div);
    });

    carList.addEventListener('click', async (e) => {
        if (e.target.tagName === 'BUTTON') {
            const carId = e.target.getAttribute('data-id');
            const rentalData = {
                userId: 'demo-user-id',
                carId,
                startDate: '2025-08-01',
                endDate: '2025-08-05'
            };
            const response = await createRental(rentalData);
            alert('Car rented!');
            location.reload();
        }
    });
});
