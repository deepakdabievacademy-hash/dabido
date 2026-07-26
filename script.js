let selectedVehicle = "bike";

const vehicleBoxes = document.querySelectorAll(".box");

vehicleBoxes.forEach((box) => {
    box.addEventListener("click", () => {

        vehicleBoxes.forEach((b) => b.classList.remove("active"));
        box.classList.add("active");

        selectedVehicle = box.innerText.toLowerCase();

        calculateFare();
    });
});

document.getElementById("vehicle").addEventListener("change", function () {
    selectedVehicle = this.value;
    calculateFare();
});

function calculateFare() {

    let fare = 0;

    switch (selectedVehicle) {

        case "bike":
            fare = 80;
            break;

        case "auto":
            fare = 150;
            break;

        case "cab":
            fare = 250;
            break;

        default:
            fare = 100;
    }

    document.getElementById("fare").innerHTML =
        "Fare ₹" + fare;

    return fare;
}

calculateFare();

function bookRide() {

    const pickup =
        document.getElementById("pickup").value.trim();

    const drop =
        document.getElementById("drop").value.trim();

    if (pickup === "" || drop === "") {

        alert("Please enter pickup and drop location.");

        return;
    }

    const fare = calculateFare();

    const ride = {

        pickup: pickup,

        drop: drop,

        vehicle: selectedVehicle,

        fare: fare,

        date: new Date().toLocaleString()

    };

    let rides =
        JSON.parse(localStorage.getItem("dabidoRides")) || [];

    rides.unshift(ride);

    localStorage.setItem(
        "dabidoRides",
        JSON.stringify(rides)
    );

    alert("Ride Booked Successfully 🚖");

    document.getElementById("pickup").value = "";

    document.getElementById("drop").value = "";

    loadHistory();
}

function loadHistory() {

    const history =
        document.getElementById("history");

    let rides =
        JSON.parse(localStorage.getItem("dabidoRides")) || [];

    if (rides.length === 0) {

        history.innerHTML = "No rides yet.";

        return;
    }

    history.innerHTML = "";

    rides.forEach((ride) => {

        history.innerHTML += `

<div class="item">

<b>${ride.vehicle.toUpperCase()}</b><br>

📍 ${ride.pickup}<br>

🏁 ${ride.drop}<br>

💰 ₹${ride.fare}<br>

🕒 ${ride.date}

</div>

`;

    });

}

loadHistory();
