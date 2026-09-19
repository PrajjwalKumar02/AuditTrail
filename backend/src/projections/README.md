# Member 4 - Projections & Read Models Module

## Overview
The Projections Module implements the **Read Model** side of the CQRS (Command Query Responsibility Segregation) pattern for the **AuditTrail** Event-Sourced Logistics Ledger.

While raw domain events are appended immutably to the Event Store, the Projection Engine consumes these events in real-time and projects them into optimized MongoDB Read Models (`ContainerReadModel` & `InventoryReadModel`) for fast HTTP query responses.

---

## Architecture Components

1. **Read Models (`/models`)**:
   - `ContainerReadModel`: Holds latest container state (location, status, temperature, temperature alerts, versioning, last event details).
   - `InventoryReadModel`: Tracks inventory items, stock levels, and container assignments.

2. **Projection Handlers (`/handlers`)**:
   - `containerProjectionHandler`: Handles container creation events.
   - `locationProjectionHandler`: Handles GPS movements and port arrival events.
   - `statusProjectionHandler`: Handles status lifecycle transitions (`CREATED`, `IN_TRANSIT`, `LOADED_ON_SHIP`, `DELIVERED`).
   - `temperatureProjectionHandler`: Processes IoT temperature readings and triggers `ALERT_SPIKE` flags.
   - `versionProjectionHandler`: Ensures sequence version ordering.

3. **Projection Service (`/services/projectionService.js`)**:
   - Central projection dispatcher, metrics recorder (`getProjectionMetrics`), and projection reset controller (`resetProjections`).

4. **Background Projection Worker (`/workers`)**:
   - `projectionWorker.js`: Asynchronous `EventEmitter` background worker.
   - `workerEventListener.js`: Lifecycle and event listeners for real-time projection updates.

5. **Dead Letter Queue & Retries (`/dlq`)**:
   - `dlqHandler.js`: Captures failed/malformed events to prevent worker pipeline crashes.
   - `retryMechanism.js`: Automatic exponential backoff retry engine for pending DLQ items.

6. **Query API (`/controllers` & `/routes`)**:
   - `GET /api/projections/containers`: Fetch all container read models.
   - `GET /api/projections/containers/:id`: Fetch specific container by aggregateId.
   - `GET /api/projections/inventory`: Query inventory read model stock.

---

## Unit Testing
Run projection unit tests:
```bash
npm test -- --testPathPattern=projections
```
