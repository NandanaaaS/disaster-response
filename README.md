# Guardian 🎯

## Basic Details
**Team Name:** Sarvam Coding

## Team Members
**Member 1:** Nandana S - Model Engineering College
**Member 2:** Aida Elizabeth Saju - Model Engineering College

## Hosted Project Link
[https://disaster-response-2.onrender.com](https://disaster-response-2.onrender.com)

## Project Description
Guardian is a full-stack, real-time disaster management and emergency coordination platform designed to bridge the critical "information gap" during life-threatening situations. Unlike standard reporting tools, Guardian functions as a live bridge between victims and responders by utilizing bi-directional WebSocket communication and Geospatial mapping.

The system is split into two specialized interfaces:

The Victim Interface: A mobile-responsive portal designed for high-stress usability. It captures precise GPS coordinates via the Geolocation API and allows victims to specify emergency types (Medical, Fire, Flood) and personal vitals (Age, Gender, Pregnancy status).

The Responder Command Center: A centralized dashboard that provides a "Tactical View" of all active incidents using Leaflet.js. It features instant audio-visual alerting and an automated navigation engine that calculates the most efficient route to victims in real-time.

## The Problem statement
In the wake of natural disasters or sudden accidents, two major failures occur:

The Localization Failure: Victims under stress often cannot articulate their exact location, especially in unfamiliar or devastated areas where landmarks are gone.

The Latency Failure: Traditional emergency reporting (calls/SMS) is linear and slow. Emergency dispatchers often lack a unified, visual map of concurrent incidents, making it impossible to prioritize high-risk victims (e.g., elderly or pregnant individuals) effectively.

## The Solution
Guardian addresses these failures through three core technological pillars:

Real-Time Synchronization: Using Socket.io, the platform eliminates the need for page refreshes. As soon as a victim moves or their status changes, the Responder’s map marker moves instantly on the dashboard.

Intelligent Triage: By collecting specific metadata (age/gender/condition), the system allows responders to prioritize their efforts based on the vulnerability of the victim.

Network Resilience (PWA): Leveraging Service Workers, the application remains accessible even in areas with intermittent connectivity. If a user loses signal, the application serves an offline-ready interface which gives the  from the local cache, ensuring the UI doesn't crash during a crisis.

## Technical Details
### Architecture Overview:
Guardian follows a Client-Server-Database architecture. The backend acts as a real-time message broker using WebSockets to ensure sub-second latency between a victim's request and the responder's alert.

### Technologies/Components Used
**For Software:**
- **Languages used:** JavaScript (ES6+), HTML5, CSS3
- **Frameworks used:** Node.js, Express.js
- **Libraries used:** Socket.io (Real-time), Leaflet.js (Mapping), MongoDB Driver, dotenv
- **Tools used:** VS Code, Git, Render (Hosting), MongoDB Atlas

## Features
- **Feature 1: Live GPS Tracking:** Continuous coordinate updates from victim to responder.
- **Feature 2: Real-time Alerts:** Instant audio and toast notifications for responders when a new request is made.
- **Feature 3: Offline Resilience:** Service Worker integration to provide an "Offline Mode" page if the network fails.
- **Feature 4: Automated Routing:** Built-in navigation that draws the shortest path between the responder and the victim.

## Implementation

### Installation
```bash
cd backend
npm install
