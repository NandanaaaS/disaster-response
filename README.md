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

Feature 1: Live "Moving" Markers
Instead of static pins, the map uses socket.emit('location-update') to move markers in real-time. If a victim is being moved or is walking, their marker on the responder's map glides to the new coordinates automatically.

Feature 2: Smart Triage System
The responder's dashboard isn't just a map; it's a prioritization tool. Markers are color-coded:

🔴 Red: Pending (Needs immediate attention).

🟠 Orange: In Progress (A responder is on the way).

🟢 Green: Resolved (Victim is safe).

Feature 3: One-Tap Navigation
Responders can click a "Route" button on any victim's popup. The system instantly calculates the distance and draws a polyline path from the responder's current GPS location to the victim's precise coordinates using the OSRM (Open Source Routing Machine).

Feature 4: Audio-Visual Emergency Broadcast
To ensure no emergency is missed, the system uses the Web Audio API. When a new-request socket event is received, a high-priority alert sound plays, and a non-blocking "Toast" notification appears, even if the responder is looking at a different part of the map.

## Implementation

## 📂 Project Structure

A clear overview of the directory hierarchy and the responsibility of each core file.

```text
disaster-response/
├── backend/
│   ├── server.js          # Express server, MongoDB connection & Socket.io logic
│   ├── .env               # Environment variables (Mongo URI, Port)
│   └── package.json       # Backend dependencies & scripts
├── frontend/              # Victim-facing portal
│   ├── home.html          # Landing page
│   ├── index.html         # Emergency request form
│   ├── script.js          # Geolocation tracking & Victim-side Sockets
│   ├── sw.js              # Service Worker for PWA & Offline caching
│   ├── style.css          # Global styling
│   └── offline.html       # Fallback page for network failures
└── dashboard/             # Responder-facing Command Center
    ├── responder.html     # Interactive Map UI (Leaflet.js)
    ├── responder.js       # Map logic, Real-time markers & Routing
    └── alert.mp3          # Emergency notification sound
```

### Installation
```bash
cd backend
npm install
### Run
# To start the server in production mode
npm start
```
### Project Documentation
![WhatsApp Image 2026-02-28 at 08 05 55](https://github.com/user-attachments/assets/8db5c0ac-e5f3-42ce-8c49-4137a7b51f68) 
Home page
![WhatsApp Image 2026-02-28 at 08 05 54](https://github.com/user-attachments/assets/7f8931f4-818c-4bea-9e3e-2e9c26de3bac) 
Home page without internet
![WhatsApp Image 2026-02-28 at 08 04 57](https://github.com/user-attachments/assets/e84ea1b8-0431-494a-a4c6-08cf82bc46a2) 
Responder Dashboard with route to a help request
![WhatsApp Image 2026-02-28 at 08 04 56](https://github.com/user-attachments/assets/c5acb852-9754-4777-bf0f-7f6a26fd15a5) 
Form to request help

🌐API Documentation

The backend provides a RESTful API to manage emergency requests and state persistence.

**Base URL:** `https://disaster-response-2.onrender.com`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/requests` | Fetches all active emergency requests from MongoDB. |
| **POST** | `/requests` | Creates a new emergency alert with victim metadata. |
| **PATCH** | `/requests/:id/status` | Updates request state (`Pending` -> `In Progress` -> `Resolved`). |
| **GET** | `/requests/:id` | Retrieves details for a specific unique Request ID. |

### Sample Status Update (PATCH)
**Request Body:**
```json
{
  "status": "In Progress"
}
```
### Project Demo
[https://drive.google.com/drive/folders/1VY5jaID9HVQ1rH3v7BlSsMboPJI0Wc6R](https://drive.google.com/drive/folders/1VY5jaID9HVQ1rH3v7BlSsMboPJI0Wc6R)
In this demonstration, we showcase a Disaster Response system designed to connect victims and responders efficiently. The video highlights the following features:

Home Page Navigation: Users can navigate to the Victim page, Responder page, and access the Offline page when there’s no internet.

Victim Emergency Requests: Victims can submit help requests with location details, which are sent in real-time to the system.

Responder Dashboard: Responders can view nearby emergencies, access victim details, and take action on requests.

Request Status Updates: Victims receive live updates from responders about the status of their requests.

Completion Handling: Once a responder marks a request as rescued, the corresponding location is removed from the system to avoid clutter.

Offline Page: Displays relevant information or guidance when the user is offline, ensuring usability without internet.

Geolocation Feature: The system automatically detects user location using the Browser Geolocation API to provide accurate nearby emergency data.

Real-Time Updates: The dashboard updates dynamically with incoming requests, ensuring quick response.

Mobile Compatibility: The interface is responsive, working seamlessly on mobile and desktop devices.

Deployment Ready: The frontend is hosted on Netlify, and the backend is integrated with Node.js/Express and MongoDB Atlas.

The video demonstrates the workflow from submitting an emergency request as a victim, monitoring request status updates, responders taking action, and successfully completing requests, highlighting real-time updates, offline support, and user-friendly design.

### Team Contributions
Nandana- Developed backend using Node.js & Express, integrated MongoDB Atlas, implemented real-time updates with Socket.io, and managed server deployment, Developed frontend for the responser dashboard
Aida- Developed the responsive frontend of a Disaster Response system with interactive maps, geolocation-based emergency tracking, and real-time updates. Implemented user interfaces for victims and responders, integrated with a Node.js backend, and ensured smooth API communication.Ensured seamless user experience
