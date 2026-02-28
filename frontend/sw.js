const CACHE_NAME = "guardian-cache-v1";
const OFFLINE_URL = "offline.html";

// Files to cache for offline use
const FILES_TO_CACHE = [
  OFFLINE_URL,
  "style.css",
  "script.js",
  "../dashboard/responder.html",
  "../dashboard/responder.js",
  "alert.mp3",
  "home.html",
  "index.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Serve offline.html for page navigations if offline
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Serve cached files if available
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        // For missing assets, fallback to offline.html
        if (event.request.headers.get("accept")?.includes("text/html")) {
          return caches.match(OFFLINE_URL);
        }
        return null;
      });
    })
  );
});