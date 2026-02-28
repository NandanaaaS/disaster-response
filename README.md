# Guardian 🎯

## Basic Details
**Team Name:** [Your Team Name]

**Team Members**
* **Member 1:** Nandana - [Your College Name]
* **Member 2:** [Name] - [College]

## Hosted Project Link
[https://disaster-response-2.onrender.com](https://disaster-response-2.onrender.com)

## Project Description
Guardian is a real-time disaster response platform that allows victims to broadcast emergency requests with live GPS coordinates. It provides responders with a centralized dashboard featuring live mapping and automated routing to reach victims faster.

## The Problem Statement
During disasters, communication is chaotic. Victims often cannot describe their exact location, and rescue teams lack a synchronized way to track multiple emergencies simultaneously, leading to inefficient response times.

## The Solution
We solve this by using WebSockets for instant data transmission and Leaflet maps for visual coordination. Our system includes a Service Worker for offline resilience and a live tracking loop that updates the responder on the victim's movements in real-time.

## Technical Details

### Technologies/Components Used

**For Software:**
* **Languages used:** JavaScript (ES6+), HTML5, CSS3
* **Frameworks used:** Express.js, Node.js
* **Libraries used:** Socket.io, Leaflet.js, Leaflet-Routing-Machine, MongoDB Driver
* **Tools used:** VS Code, Git, Render, MongoDB Atlas

## Features

* **Real-time Emergency Broadcasting:** Victims can send SOS alerts with one click.
* **Live GPS Tracking:** Continuous location updates sent via Socket.io to rescuers.
* **Responder Dashboard:** An interactive map that plots all active "Pending" and "In Progress" requests.
* **Intelligent Routing:** Automatically calculates the fastest route from the responder's current location to the victim.
* **Offline Resilience:** PWA features (Service Worker) to ensure the interface remains accessible during network drops.

## Implementation

### Installation
```bash
# Navigate to the backend folder
cd backend

# Install all dependencies
npm install
