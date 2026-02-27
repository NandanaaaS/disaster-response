let latitude = null;
let longitude = null;
let trackingInterval = null;
let statusInterval = null;
let currentRequestId = null;

// Connect to backend Socket.IO
const socket = io();

/* =========================
   LIVE GPS TRACKING
   ========================= */
navigator.geolocation.watchPosition(
  (pos) => {
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;

    const statusEl = document.getElementById("status");
    if (statusEl) {
      statusEl.innerText =
        "Location: " + latitude.toFixed(4) + ", " + longitude.toFixed(4);
    }
  },
  () => {
    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.innerText = "Location access denied ❌";
  },
  {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000,
  }
);

/* =========================
   SAVE LOCATION BUTTON
   ========================= */
function saveLocation() {
  if (latitude && longitude) {
    localStorage.setItem("savedLat", latitude);
    localStorage.setItem("savedLng", longitude);
    document.getElementById("status").innerText = "Location saved to map ✔";
  } else {
    document.getElementById("status").innerText = "Waiting for GPS signal...";
  }
}

/* =========================
   FORM SUBMIT
   ========================= */
const form = document.getElementById("helpForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      alert("Waiting for GPS location...");
      return;
    }

    const requestId = Date.now().toString();
    currentRequestId = requestId;

    const data = {
      requestID: requestId,
      coords: { lat: latitude, lng: longitude },
      type: document.getElementById("type").value,
      description: document.getElementById("desc").value || "No description",
      gender: document.getElementById("gender").value,
      age: document.getElementById("age").value,
      pregnant: document.getElementById("pregnant")?.value || "No",
      status: "Pending",
    };

    document.getElementById("status").innerText = "Sending request...";

    try {
      await fetch("/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Request failed", err);
    }

    document.getElementById("status").innerText =
      "Request Sent! ID: " + requestId;

    startLiveTracking();
    checkStatusLoop();
  });
}

/* =========================
   LIVE TRACKING LOOP
   ========================= */
function startLiveTracking() {
  if (trackingInterval) clearInterval(trackingInterval);

  trackingInterval = setInterval(() => {
    if (!latitude || !longitude || !currentRequestId) return;

    socket.emit("location-update", {
      requestID: currentRequestId,
      coords: { lat: latitude, lng: longitude },
    });
  }, 5000);
}

/* =========================
   STATUS CHECK LOOP
   ========================= */
function checkStatusLoop() {
  if (statusInterval) clearInterval(statusInterval);

  statusInterval = setInterval(async () => {
    if (!currentRequestId) return;

    try {
      // Use backend route: GET /requests/:id
      const res = await fetch(
        `/requests/${currentRequestId}`
      );

      if (!res.ok) return;

      const data = await res.json();
      const el = document.getElementById("requestStatus");

      el.innerText = "Status: " + data.status;

      if (data.status === "Pending") el.style.color = "orange";
      if (data.status === "In Progress") el.style.color = "blue";
      if (data.status === "Resolved") {
        el.style.color = "green";
        clearInterval(trackingInterval);
        clearInterval(statusInterval);
      }
    } catch (err) {
      console.error("Status fetch failed", err);
    }
  }, 3000);
}

/* =========================
   SOCKET.IO STATUS UPDATES
   ========================= */
socket.on("status-update", (data) => {
  if (data.requestID === currentRequestId) {
    const el = document.getElementById("requestStatus");
    el.innerText = "Status: " + data.status;

    if (data.status === "Pending") el.style.color = "orange";
    if (data.status === "In Progress") el.style.color = "blue";
    if (data.status === "Resolved") {
      el.style.color = "green";
      clearInterval(trackingInterval);
      clearInterval(statusInterval);
    }
  }
});

/* =========================
   SAFETY CHECK EVERY 5 MIN
   ========================= */
setInterval(async () => {
  if (!currentRequestId) return;

  const safe = confirm("Are you still in danger?\nOK = YES\nCancel = NO");

  if (!safe) {
    clearInterval(trackingInterval);
    clearInterval(statusInterval);

    document.getElementById("status").innerText =
      "Marked safe. Tracking stopped.";

    try {
      await fetch("/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentRequestId }),
      });
    } catch (err) {
      console.error("Resolve request failed", err);
    }

    currentRequestId = null;
  }
}, 300000);