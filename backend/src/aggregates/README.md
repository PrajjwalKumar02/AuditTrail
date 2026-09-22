\# AuditTrail Aggregate \& Event Replay Engine



\## Overview



The Aggregate and Event Replay Engine reconstructs container state from

immutable events stored in the Event Store.



The engine follows the event-sourcing flow:



Event Store → Replay Events → Aggregate State → Current/Historical State



Instead of storing every state change as the primary source of truth, the

system applies events in sequence to reconstruct the state of a container.



\---



\## Module Responsibilities



The aggregate module is responsible for:



\- Defining container aggregate state

\- Creating the initial aggregate state

\- Applying events through reducers

\- Validating replay event streams

\- Ordering events by version

\- Replaying events

\- Reconstructing current state

\- Querying aggregate state

\- Reading aggregate event history

\- Reconstructing historical state

\- Calculating state at a timestamp

\- Supporting snapshot-based reconstruction

\- Validating replay behavior through automated tests

\- Measuring replay performance



\---



\## Aggregate State



The container aggregate maintains state including:



\- Container ID

\- Current location

\- Current status

\- Assigned ship

\- Temperature

\- Aggregate version

\- Created timestamp

\- Updated timestamp

\- Event metadata



The initial container state is created through the container state module.



A new aggregate starts with version `0` and an initial `CREATED` status.



\---



\## Event Reducer



The container reducer applies one event to the current aggregate state.



Supported event types include:



\- `CONTAINER\_CREATED`

\- `LOADED\_ON\_SHIP`

\- `MOVED`

\- `ARRIVED\_AT\_PORT`

\- `TEMPERATURE\_SPIKE`

\- `CONTAINER\_DAMAGED`

\- `CONTAINER\_INSPECTED`

\- `CONTAINER\_DELAYED`



The reducer creates a new state object rather than mutating the original

aggregate state directly.



\### Example Event



```js

{

&#x20; aggregateId: "CNT-001",

&#x20; eventType: "CONTAINER\_CREATED",

&#x20; payload: {

&#x20;   aggregateId: "CNT-001",

&#x20;   location: "Warehouse-A"

&#x20; },

&#x20; version: 1,

&#x20; timestamp: "2026-09-08T10:00:00.000Z"

}

