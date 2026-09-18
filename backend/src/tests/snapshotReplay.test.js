jest.mock("../snapshots/Snapshot", () => ({
  findOne: jest.fn(),
}));

jest.mock("../events/services/eventStore", () => ({
  getEventsForAggregate: jest.fn(),
}));

jest.mock("../aggregates/container/containerAggregate", () => ({
  replay: jest.fn(),
}));

jest.mock("../aggregates/container/containerReducer", () => ({
  applyEvent: jest.fn(),
}));

jest.mock("../utils/logger", () => ({
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}));

const Snapshot = require("../snapshots/Snapshot");

const {
  getEventsForAggregate,
} = require("../events/services/eventStore");

const {
  replay,
} = require("../aggregates/container/containerAggregate");

const {
  applyEvent,
} = require("../aggregates/container/containerReducer");

const logger = require("../utils/logger");

const {
  rebuildFromSnapshot,
} = require("../snapshots/snapshotService");


describe("Snapshot-Based Replay", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  test(
    "should rebuild state from snapshot and apply later events",
    async () => {

      const snapshot = {
        aggregateId: "CNT-001",
        version: 3,
        state: {
          id: "CNT-001",
          status: "LOADED",
          location: "Warehouse-A",
          ship: "MSC-001",
          temperature: null,
          version: 3,
          metadata: {},
        },
      };


      const events = [
        {
          _id: "event-1",
          aggregateId: "CNT-001",
          version: 1,
          eventType: "CONTAINER_CREATED",
          payload: {
            location: "Warehouse-A",
          },
        },

        {
          _id: "event-2",
          aggregateId: "CNT-001",
          version: 2,
          eventType: "LOADED_ON_SHIP",
          payload: {
            ship: "MSC-001",
          },
        },

        {
          _id: "event-3",
          aggregateId: "CNT-001",
          version: 3,
          eventType: "MOVED",
          payload: {
            location: "Mumbai Port",
          },
        },

        {
          _id: "event-4",
          aggregateId: "CNT-001",
          version: 4,
          eventType: "ARRIVED_AT_PORT",
          payload: {
            location: "Mumbai Port",
          },
        },

        {
          _id: "event-5",
          aggregateId: "CNT-001",
          version: 5,
          eventType: "TEMPERATURE_SPIKE",
          payload: {
            temperature: 12.8,
          },
        },
      ];


      const stateAfterEvent4 = {
        ...snapshot.state,
        status: "ARRIVED",
        location: "Mumbai Port",
        version: 4,
      };


      const finalState = {
        ...stateAfterEvent4,
        status: "ALERT",
        temperature: 12.8,
        version: 5,
      };


      Snapshot.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(snapshot),
        }),
      });


      getEventsForAggregate.mockResolvedValue(events);


      applyEvent
        .mockReturnValueOnce(stateAfterEvent4)
        .mockReturnValueOnce(finalState);


      const result = await rebuildFromSnapshot("CNT-001");


      expect(Snapshot.findOne).toHaveBeenCalledWith({
        aggregateId: "CNT-001",
      });


      expect(getEventsForAggregate).toHaveBeenCalledWith(
        "CNT-001",
        null
      );


      expect(applyEvent).toHaveBeenCalledTimes(2);


      expect(applyEvent).toHaveBeenNthCalledWith(
        1,
        snapshot.state,
        events[3]
      );


      expect(applyEvent).toHaveBeenNthCalledWith(
        2,
        stateAfterEvent4,
        events[4]
      );


      expect(result).toEqual(finalState);


      expect(replay).not.toHaveBeenCalled();
    }
  );


  test(
    "should ignore events at or before the snapshot version",
    async () => {

      const snapshot = {
        aggregateId: "CNT-002",
        version: 3,
        state: {
          id: "CNT-002",
          status: "LOADED",
          location: "Warehouse-A",
          version: 3,
          metadata: {},
        },
      };


      const events = [
        {
          _id: "event-1",
          aggregateId: "CNT-002",
          version: 1,
          eventType: "CONTAINER_CREATED",
          payload: {},
        },

        {
          _id: "event-2",
          aggregateId: "CNT-002",
          version: 2,
          eventType: "LOADED_ON_SHIP",
          payload: {},
        },

        {
          _id: "event-3",
          aggregateId: "CNT-002",
          version: 3,
          eventType: "MOVED",
          payload: {},
        },

        {
          _id: "event-4",
          aggregateId: "CNT-002",
          version: 4,
          eventType: "ARRIVED_AT_PORT",
          payload: {
            location: "Mumbai Port",
          },
        },
      ];


      const finalState = {
        ...snapshot.state,
        status: "ARRIVED",
        location: "Mumbai Port",
        version: 4,
      };


      Snapshot.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(snapshot),
        }),
      });


      getEventsForAggregate.mockResolvedValue(events);


      applyEvent.mockReturnValue(finalState);


      const result = await rebuildFromSnapshot("CNT-002");


      expect(applyEvent).toHaveBeenCalledTimes(1);


      expect(applyEvent).toHaveBeenCalledWith(
        snapshot.state,
        events[3]
      );


      expect(result).toEqual(finalState);
    }
  );


  test(
    "should replay the complete event stream when no snapshot exists",
    async () => {

      const events = [
        {
          _id: "event-1",
          aggregateId: "CNT-003",
          version: 1,
          eventType: "CONTAINER_CREATED",
          payload: {
            location: "Warehouse-A",
          },
        },

        {
          _id: "event-2",
          aggregateId: "CNT-003",
          version: 2,
          eventType: "LOADED_ON_SHIP",
          payload: {
            ship: "MSC-001",
          },
        },
      ];


      const rebuiltState = {
        id: "CNT-003",
        status: "LOADED",
        location: "Warehouse-A",
        ship: "MSC-001",
        version: 2,
      };


      Snapshot.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null),
        }),
      });


      getEventsForAggregate.mockResolvedValue(events);


      replay.mockReturnValue(rebuiltState);


      const result = await rebuildFromSnapshot("CNT-003");


      expect(getEventsForAggregate).toHaveBeenCalledWith(
        "CNT-003"
      );


      expect(replay).toHaveBeenCalledWith(events);


      expect(result).toEqual(rebuiltState);


      expect(applyEvent).not.toHaveBeenCalled();
    }
  );


  test(
    "should fall back to full replay when snapshot lookup fails",
    async () => {

      const events = [
        {
          _id: "event-1",
          aggregateId: "CNT-004",
          version: 1,
          eventType: "CONTAINER_CREATED",
          payload: {
            location: "Warehouse-A",
          },
        },
      ];


      const rebuiltState = {
        id: "CNT-004",
        status: "CREATED",
        location: "Warehouse-A",
        version: 1,
      };


      Snapshot.findOne.mockImplementation(() => {
        throw new Error(
          "Snapshot database unavailable"
        );
      });


      getEventsForAggregate.mockResolvedValue(events);


      replay.mockReturnValue(rebuiltState);


      const result = await rebuildFromSnapshot("CNT-004");


      expect(result).toEqual(rebuiltState);


      expect(replay).toHaveBeenCalledWith(events);


      expect(logger.error).toHaveBeenCalledWith(
        "Failed to get snapshot: Snapshot database unavailable"
      );
    }
  );


  test(
    "should return null when event retrieval fails after snapshot lookup",
    async () => {

      const snapshot = {
        aggregateId: "CNT-005",
        version: 3,
        state: {
          id: "CNT-005",
          status: "LOADED",
          version: 3,
          metadata: {},
        },
      };


      Snapshot.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(snapshot),
        }),
      });


      getEventsForAggregate.mockRejectedValue(
        new Error("Event Store unavailable")
      );


      const result = await rebuildFromSnapshot("CNT-005");


      expect(result).toBeNull();


      expect(logger.error).toHaveBeenCalledWith(
        "Failed to rebuild from snapshot: Event Store unavailable"
      );
    }
  );

});