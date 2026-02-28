# Guardian 🎯

## Basic Details
**Team Name:** [Your Team Name]

## Team Members
**Member 1:** Nandana - [Your College Name]

## Hosted Project Link
[https://disaster-response-2.onrender.com](https://disaster-response-2.onrender.com)

## Project Description
Guardian is a real-time emergency response system that connects victims with responders. It uses live GPS tracking and WebSockets to ensure help reaches the exact location as fast as possible.

## The Problem statement
During disasters, communication is chaotic. Victims cannot always explain their location, and responders often lack a real-time "live map" of where help is needed most, leading to wasted time and lost lives.

## The Solution
We solve this by using a dual-interface web app. Victims broadcast their location with one click. Responders see these as live markers on a map and receive instant audio alerts, with automated routing to the victim's GPS coordinates.

## Technical Details

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
