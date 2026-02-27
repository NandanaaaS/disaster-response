const CACHE_NAME = "guardian-cache-v1";
const OFFLINE_URL = "offline.html";

// Files to cache for offline use
const FILES_TO_CACHE = [
  OFFLINE_URL,
  "style.css", // optional, if you have separate CSS
  "script.js", // optional
  // Add any other assets needed for offline.html
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (!navigator.onLine) {
    // If offline, respond with offline.html for navigation requests
    if (event.request.mode === "navigate") {
      event.respondWith(
        caches.match(OFFLINE_URL)
      );
      return;
    }
  }

  // Otherwise, try network first, fallback to cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});