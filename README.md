# Upchar — Intelligent & Accessible Healthcare Platform

> **Upchar** is a modern, full-stack healthcare web application designed to bridge the gap between patients, local community health workers (ASHA), pharmacies, and certified medical specialists. It features an advanced AI diagnostic engine, real-time medicine tracking, district-level resource mapping, and secure profile management.

---

## 🚀 Key Features

* **AI Diagnostic Engine**: Intelligent preliminary symptom analysis to guide patients quickly and accurately before clinical escalation.
* **ASHA & Rural Community Support**: Tailored tools for community health workers to locate open hospital beds, specialist availability, and manage local health camps.
* **Live Pharmacy Radar**: Real-time stock signals from local pharmacies ensuring patients never chase an empty medicine shelf.
* **Teleconsultation Suite**: Face-to-face video consultations with certified specialists optimized for accessibility.
* **Cloud-Optimized Profile Storage**: Secure profile picture storage via Google Drive API integrated cleanly with MongoDB using lightweight File IDs.
* **Location Auto-Detection**: Instant geolocation-based address filling for districts, blocks, and villages using reverse geocoding.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework**: React.js (Vite)
* **Routing**: React Router DOM
* **Styling**: Tailwind CSS
* **Icons**: Google Material Symbols

### **Backend & Database**
* **Server**: Node.js, Express.js
* **Database**: MongoDB & Mongoose
* **Cloud Storage**: Google Apps Script & Google Drive API (for optimized media handling)

---

## 📂 Project Architecture

```text
upchar/
├── backend/                  # Node.js & Express Server
│   ├── controller/           # Auth and business logic handlers
│   ├── models/               # Mongoose database schemas
│   └── index.js              # Server entry point & route bindings
│
└── frontend/                 # React Vite Client
    ├── src/
    │   ├── components/       # Reusable UI widgets (Sidebar, Navbar, Modals, Snackbar)
    │   ├── pages/            # Dashboard, Authentication, Teleconsultation, Search
    │   └── App.jsx           # Main application routing wrapper
    └── package.json
