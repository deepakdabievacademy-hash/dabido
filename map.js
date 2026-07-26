// ===============================
// Dabido Map
// Leaflet + GPS
// ===============================

let map;
let currentMarker;

// Initialize Map
function initMap() {

    map = L.map("map").setView([28.6139, 77.2090], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    getCurrentLocation();

}

// Current GPS Location
function getCurrentLocation() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        function(position) {

            let lat = position.coords.latitude;
            let lng = position.coords.longitude;

            map.setView([lat, lng], 16);

            if (currentMarker) {

                map.removeLayer(currentMarker);

            }

            currentMarker = L.marker([lat, lng]).addTo(map);

            currentMarker.bindPopup("📍 You are here").openPopup();

            reverseLocation(lat, lng);

        },

        function() {

            alert("Unable to get current location.");

        }

    );

}

// Reverse Location (Demo)
function reverseLocation(lat, lng) {

    let pickup = document.getElementById("pickup");

    if (pickup) {

        pickup.value =
            lat.toFixed(5) + ", " + lng.toFixed(5);

    }

}

// Refresh GPS
function refreshLocation() {

    getCurrentLocation();

}

// Map Click
function enableMapClick() {

    map.on("click", function(e) {

        let lat = e.latlng.lat;
        let lng = e.latlng.lng;

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup("Destination")
            .openPopup();

        let drop = document.getElementById("drop");

        if (drop) {

            drop.value =
                lat.toFixed(5) + ", " + lng.toFixed(5);

        }

        if (typeof calculateFare === "function") {

            calculateFare();

        }

    });

}

// Start
window.addEventListener("load", function() {

    if (document.getElementById("map")) {

        initMap();

        enableMapClick();

    }

});
