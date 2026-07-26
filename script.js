// ===============================
// Dabido Script
// ===============================

let selectedVehicle = "";
let baseFare = 0;

// Vehicle Select
function selectVehicle(vehicle, fare) {

    selectedVehicle = vehicle;
    baseFare = fare;

    document.querySelectorAll(".vehicle-card").forEach(card => {
        card.classList.remove("active");
    });

    event.currentTarget.classList.add("active");

    document.getElementById("selectedVehicle").innerHTML =
        "Selected : " + vehicle;

    calculateFare();
}

// Fare Calculation
function calculateFare() {

    let pickup = document.getElementById("pickup").value.trim();
    let drop = document.getElementById("drop").value.trim();

    if (pickup === "" || drop === "" || baseFare === 0) {
        document.getElementById("fare").innerHTML =
            "Estimated Fare ₹0";
        return;
    }

    let extra = Math.floor(Math.random() * 120) + 20;

    let total = baseFare + extra;

    document.getElementById("fare").innerHTML =
        "Estimated Fare ₹" + total;
}

// Auto Update Fare
let pickupInput = document.getElementById("pickup");
let dropInput = document.getElementById("drop");

if (pickupInput)
    pickupInput.addEventListener("keyup", calculateFare);

if (dropInput)
    dropInput.addEventListener("keyup", calculateFare);

// Book Ride
function bookRide() {

    let pickup = document.getElementById("pickup").value.trim();
    let drop = document.getElementById("drop").value.trim();

    if (pickup === "") {
        alert("Enter Pickup Location");
        return;
    }

    if (drop === "") {
        alert("Enter Destination");
        return;
    }

    if (selectedVehicle === "") {
        alert("Select Vehicle");
        return;
    }

    let fareText =
        document.getElementById("fare").innerText;

    let ride = {

        vehicle: selectedVehicle,

        pickup: pickup,

        drop: drop,

        fare: fareText,

        status: "Booked",

        date: new Date().toLocaleString()

    };

    let rides =
        JSON.parse(localStorage.getItem("rides")) || [];

    rides.unshift(ride);

    localStorage.setItem("rides",
        JSON.stringify(rides));

    alert("Ride Booked Successfully!");

}

// Profile Save
function saveProfile(name, phone) {

    let profile = {

        name: name,

        phone: phone

    };

    localStorage.setItem("profile",
        JSON.stringify(profile));

}

// Profile Load
function loadProfile() {

    let profile =
        JSON.parse(localStorage.getItem("profile"));

    if (!profile)
        return;

    if (document.getElementById("name"))
        document.getElementById("name").value =
            profile.name;

    if (document.getElementById("phone"))
        document.getElementById("phone").value =
            profile.phone;

}

// Ride History
function loadHistory() {

    let container =
        document.getElementById("history");

    if (!container)
        return;

    let rides =
        JSON.parse(localStorage.getItem("rides")) || [];

    if (rides.length === 0) {

        container.innerHTML =
            "<h3>No Ride History</h3>";

        return;

    }

    let html = "";

    rides.forEach(function(ride) {

        html += `
        <div class="card">

        <h3>${ride.vehicle}</h3>

        <p><b>Pickup:</b> ${ride.pickup}</p>

        <p><b>Drop:</b> ${ride.drop}</p>

        <p><b>${ride.fare}</b></p>

        <p>Status : ${ride.status}</p>

        <small>${ride.date}</small>

        </div>
        `;

    });

    container.innerHTML = html;

}

window.onload = function () {

    loadProfile();

    loadHistory();

};
