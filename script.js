let map, directionsService, directionsRenderer;
let startInput, endInput, alertBox;

function initMap() {
  // Initialisation carte centrée sur La Ville-du-Bois par défaut
  const defaultPos = { lat: 48.6283, lng: 2.2663 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: defaultPos,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map: map });

  startInput = document.getElementById("start");
  endInput = document.getElementById("end");
  alertBox = document.getElementById("alert");

  // Autocomplete Google Places
  const options = { types: ["address"] };
  new google.maps.places.Autocomplete(startInput, options);
  new google.maps.places.Autocomplete(endInput, options);

  document.getElementById("routeBtn").addEventListener("click", () => {
    calculateAndDisplayRoute();
  });

  // Optionnel : géolocalisation automatique pour départ
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        startInput.value = "Ma position actuelle";
        new google.maps.Marker({
          position: pos,
          map: map,
          title: "Votre position",
        });
        map.setCenter(pos);
      },
      () => {
        console.log("Géolocalisation refusée ou indisponible");
      }
    );
  }
}

function calculateAndDisplayRoute() {
  alertBox.textContent = "";
  let start = startInput.value.trim();
  let end = endInput.value.trim();

  if (!start) {
    alertBox.textContent = "Veuillez saisir une adresse de départ.";
    return;
  }
  if (!end) {
    alertBox.textContent = "Veuillez saisir une adresse d'arrivée.";
    return;
  }

  if (start.toLowerCase() === "ma position actuelle" && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        requestRoute(pos, end);
      },
      () => {
        alertBox.textContent = "Impossible de récupérer votre position.";
      }
    );
  } else {
    requestRoute(start, end);
  }
}

function requestRoute(start, end) {
  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true,
      avoidHighways: true,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
        alertBox.textContent = "";
      } else {
        alertBox.textContent = "Itinéraire introuvable : " + status;
      }
    }
  );
}
