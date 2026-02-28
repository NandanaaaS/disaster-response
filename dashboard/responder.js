const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const orangeIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});
const alertSound = new Audio("alert.mp3");
alertSound.volume = 0.8;
document.addEventListener(
  "click",
  () => {
    alertSound
      .play()
      .then(() => {
        alertSound.pause();
        alertSound.currentTime = 0;
        console.log("🔓 Audio unlocked");
      })
      .catch(() => {});
  },
  { once: true }
);
let activeRoute = {
  requestID: null,
  victimCoords: null
};

const map = L.map('map').setView([9.93, 76.26], 13);
let routingControl=null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (pos) => {
      responderCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
    },
    (err) => {
      console.log("Location access denied or unavailable");
    },
    {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 10000
    }
  );
}
const markers = {};

fetch('/requests')
  .then(res => res.json())
  .then(data => {
    data.forEach(req => {
      if (!req.coords) return;

      if (req.status === "Resolved") return;

        const icon =
        req.status === "Pending" ? redIcon :
        req.status === "In Progress" ? orangeIcon :
        null;

        const marker = L.marker(
        [req.coords.lat, req.coords.lng],
        icon ? { icon } : {}
        ).addTo(map);
      marker.bindPopup(popupHTML(req));

      markers[req.requestID] = marker;
    });
  });

const socket = io();
socket.on("status-update", ({ requestID, status }) => {
  const marker = markers[requestID];

  if (!marker) return;

  // 🔴 Pending
  if (status === "Pending") {
    marker.setIcon(redIcon);
  }

  // 🟠 In Progress
  if (status === "In Progress") {
    marker.setIcon(orangeIcon);
  }

  // 🟢 Resolved → REMOVE FROM MAP ONLY
  if (status === "Resolved") {
    map.removeLayer(marker);
    delete markers[requestID];
  }

  // Update popup text if open
  const el = document.getElementById(`status-${requestID}`);
  if (el) el.innerText = status;
});
function showToast() {
  const toast = document.getElementById("toast");
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 4000);
}
socket.on('location-update', (data) => {
  const { requestID, coords } = data;

  if (markers[requestID]) {
    markers[requestID].setLatLng([coords.lat, coords.lng]);
  } else {
    markers[requestID] = L.marker([coords.lat, coords.lng]).addTo(map);
  }
  if (activeRoute.requestID === requestID) {
    activeRoute.victimCoords = coords;
    calculateRoute();
  }
});
socket.on("new-request", (req) => {
  console.log("🚨 New Emergency Request:", req);

  // 🔊 Play sound immediately
  alertSound.currentTime = 0;
  alertSound.play().catch(err => console.log("Sound blocked:", err));

  // 🔔 Show non-blocking toast
  showToast();

  // 📍 Add marker instantly
  if (req.coords) {
    const marker = L.marker([req.coords.lat, req.coords.lng],{icon: redIcon}).addTo(map);
    marker.bindPopup(popupHTML(req));
    markers[req.requestID] = marker;
  }
});
function popupHTML(req) {
  return `
    <b>ID:</b> ${req.requestID}<br>
    <b>Type:</b> ${req.type}<br>
    <b>Description:</b> ${req.description || "N/A"}<br>
    <b>Gender:</b> ${req.gender || "N/A"}<br>
    <b>Age:</b> ${req.age || "N/A"}<br>
    <b>Pregnant:</b> ${req.pregnant || "N/A"}<br>
    <b>Status:</b> 
    <span id="status-${req.requestID}">${req.status}</span><br><br>

    <button onclick="updateStatus('${req.requestID}', 'In Progress')">
      🚑 Acknowledge
    </button>
    <button onclick="updateStatus('${req.requestID}', 'Resolved')">
      ✅ Resolved
    </button>
   <button onclick="showRoute(${req.coords.lat}, ${req.coords.lng}, '${req.requestID}')">
    🧭 Route</button>
  `;
}
function updateStatus(requestID, status) {
  fetch(`/requests/${requestID}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
}
function showRoute(vLat, vLng, requestID) {
  activeRoute.requestID = requestID;
  activeRoute.victimCoords = { lat: vLat, lng: vLng };

  calculateRoute();
}
function calculateRoute() {
  if (!responderCoords || !activeRoute.victimCoords) return;

  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [
      L.latLng(responderCoords.lat, responderCoords.lng),
      L.latLng(
        activeRoute.victimCoords.lat,
        activeRoute.victimCoords.lng
      )
    ],
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true
  }).addTo(map);
}
setInterval(() => {
  if (activeRoute.requestID) {
    calculateRoute();
  }
}, 10000); // every 10 sec