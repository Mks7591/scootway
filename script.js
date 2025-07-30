
let map;
let directionsService;
let directionsRenderer;

document.getElementById('getStarted').addEventListener('click', () => {
    document.getElementById('mapSection').style.display = 'block';
    initMap();
});

function initMap() {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: { lat: 48.8566, lng: 2.3522 } // Paris
    });
    directionsRenderer.setMap(map);
}

function calculateRoute() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;

    const request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: true // ⚠️ pour éviter les autoroutes
    };

    directionsService.route(request, (result, status) => {
        if (status == "OK") {
            directionsRenderer.setDirections(result);
        } else {
            alert("Itinéraire introuvable : " + status);
        }
    });
}
