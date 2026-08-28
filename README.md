# 🚢 AuditTrail — Event-Sourced Logistics & Inventory Ledger

<p align="center">

**Immutable Events • CQRS • Event Sourcing • Cryptographic Audit • Historical Reconstruction**

</p>

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge\&logo=node.js)
![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-6%2B-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)

</p>

---

## 📌 Overview

**AuditTrail** is an event-sourced logistics and inventory platform designed for environments where **traceability, data integrity, and historical reconstruction** are critical.

Unlike traditional CRUD systems that overwrite previous state, AuditTrail stores every important business operation as an **immutable, chronological event**.

For example:

```text
CONTAINER_CREATED
        ↓
LOADED_ON_SHIP
        ↓
TEMPERATURE_SPIKE
        ↓
MOVED_TO_PORT
        ↓
ARRIVED_AT_PORT
```

The current state is reconstructed by replaying these events, while optimized read models provide fast queries for the dashboard.

---

## 🎯 Problem Statement

Traditional CRUD:

```text
Inventory = 10
     ↓
UPDATE
     ↓
Inventory = 5

Previous state is lost ❌
```

AuditTrail:

```text
Inventory = 10
     ↓
STOCK_RECEIVED
     ↓
STOCK_UPDATED
     ↓
STOCK_RESERVED
     ↓
Inventory = 5

Complete history preserved ✅
```

This enables organizations to answer:

* What happened?
* When did it happen?
* What was the previous state?
* What is the current state?
* What was the state at a specific time?
* Has the event history been modified?

---

# ✨ Key Features

### 🏗️ Event-Driven Architecture

* Event Sourcing
* CQRS
* Immutable Event Store
* Event Replay
* State Reconstruction
* Optimistic Concurrency Control
* Snapshots

### 🔐 Security & Audit

* SHA-256 Hash Chaining
* Cryptographic Integrity Verification
* JWT Authentication
* Role-Based Access Control (RBAC)
* Tamper-Evident Event History

### 🚢 Logistics

* Container Tracking
* Shipment Timeline
* GPS/Location Tracking
* Temperature Monitoring
* IoT Sensor Simulation
* Automated Alerts

### 📊 Analytics

* Real-Time Dashboard
* Temperature Analytics
* Historical State Comparison
* Time-Travel Reconstruction
* Event Replay
* Forensic Audit Views

### 📄 Reporting

* PDF Audit Reports
* CSV Export
* JSON Export
* Integrity Verification Reports

---

# 📐 Architecture

```text
                         ┌─────────────────────┐
                         │   React Dashboard   │
                         └──────────┬──────────┘
                                    │
                              REST / WebSocket
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Node.js + Express │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
             COMMAND SIDE                      QUERY SIDE
                    │                               │
                    ▼                               │
             Command Handler                        │
                    │                               │
                    ▼                               │
              Validation                            │
                    │                               │
                    ▼                               │
                 OCC Check                          │
                    │                               │
                    ▼                               │
          ┌────────────────────┐                    │
          │  MongoDB Event     │                    │
          │      Store         │                    │
          │                    │                    │
          │ Immutable Events   │                    │
          │ Versioning         │                    │
          │ Hash Chain         │                    │
          └─────────┬──────────┘                    │
                    │                               │
             ┌──────┴──────┐                        │
             │             │                        │
             ▼             ▼                        │
       Event Replay   Projection Worker             │
             │             │                        │
             ▼             ▼                        │
       Aggregate       Read Model ──────────────────┘
             │
             ▼
      Current / Historical
            State
```

---

# 🔄 Event Lifecycle

```text
User Command
     ↓
Command API
     ↓
Validation
     ↓
OCC Check
     ↓
Create Event
     ↓
SHA-256 Hash
     ↓
Append to Event Store
     ↓
Projection Worker
     ↓
Read Model
     ↓
Query API
     ↓
React Dashboard
```

---

# 🔐 Cryptographic Audit Trail

Events can be linked using a SHA-256 hash chain:

```text
Event 1
  │
  └── Hash H1
        ↓
Event 2
  │
  └── Previous Hash = H1
        ↓
Event 3
  │
  └── Previous Hash = H2
        ↓
Event 4
```

If an event is modified, the hash chain verification fails, providing **tamper evidence**.

---

# ⏳ Historical State Reconstruction

AuditTrail can reconstruct the state of a container at a specific point in time.

```text
Created ── Loaded ── Temp Spike ── Arrived
              │
              ▼
       Selected Timestamp
              │
              ▼
       Replay Events
              │
              ▼
     Historical State
```

This allows auditors to inspect what the system's state was at a particular moment.

---

# ⚡ Real-Time Monitoring

Using WebSockets, important events can be displayed instantly.

```text
IoT Sensor
    ↓
Backend
    ↓
Event Store
    ↓
Projection
    ↓
WebSocket
    ↓
React Dashboard
```

Example:

```text
🚨 TEMPERATURE ALERT

Container: CONT-1001
Temperature: 12.8°C
Event: TEMPERATURE_SPIKE
```

---

# 🧱 Technology Stack

| Layer              | Technologies                           |
| ------------------ | -------------------------------------- |
| **Frontend**       | React, Vite, Recharts                  |
| **Backend**        | Node.js, Express.js, Socket.IO         |
| **Database**       | MongoDB, Mongoose                      |
| **Authentication** | JWT, bcrypt, RBAC                      |
| **Architecture**   | CQRS, Event Sourcing, Read Models      |
| **Testing**        | Jest, React Testing Library, Supertest |
| **DevOps**         | Docker, Docker Compose, GitHub Actions |

---

# 📁 Project Structure

```text
AuditTrail/
│
├── backend/
│   ├── src/
│   │   ├── commands/
│   │   ├── queries/
│   │   ├── events/
│   │   ├── aggregates/
│   │   ├── projections/
│   │   ├── auth/
│   │   ├── sensors/
│   │   ├── inventory/
│   │   ├── concurrency/
│   │   └── config/
│   └── tests/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       └── utils/
│
├── docs/
├── scripts/
├── .github/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```



# 🗺️ Roadmap

* [ ] CQRS Command & Query APIs
* [ ] Immutable Event Store
* [ ] Event Replay
* [ ] State Reconstruction
* [ ] Projection Worker
* [ ] Read Models
* [ ] Optimistic Concurrency Control
* [ ] Cryptographic Hash Chain
* [ ] Authentication & RBAC
* [ ] React Forensic Dashboard
* [ ] Temperature Analytics
* [ ] Time-Travel Reconstruction
* [ ] Real-Time Monitoring
* [ ] Audit Reports
* [ ] Docker & CI/CD
* [ ] Production Deployment

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests where applicable
5. Commit your changes
6. Open a Pull Request



# 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">

### 🚢 AuditTrail

**Don't just store the state. Preserve the story behind it.**

</p>
