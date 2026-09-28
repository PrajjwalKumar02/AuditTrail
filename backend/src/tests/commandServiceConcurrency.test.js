const {
  createContainer,
  loadContainer,
  moveContainer,
  arriveContainer,
  temperatureSpike
} = require("../commands/services/commandService");

const { appendEvent } = require("../events/services/eventStore");
const { checkExpectedVersion } = require("../concurrency/optimisticConcurrency");

jest.mock("../events/services/eventStore", () => ({
  appendEvent: jest.fn()
}));

jest.mock("../concurrency/optimisticConcurrency", () => ({
  checkExpectedVersion: jest.fn()
}));

describe("Command Service - Optimistic Concurrency", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    checkExpectedVersion.mockResolvedValue(1);

    appendEvent.mockResolvedValue({
      aggregateId: "CNT-001",
      eventType: "TEST_EVENT",
      version: 2
    });
  });

  test("createContainer checks version zero before appending", async () => {
    await createContainer({
      aggregateId: "CNT-001",
      location: "Warehouse-A",
      userId: "USER-001",
      userRole: "operator"
    });

    expect(checkExpectedVersion).toHaveBeenCalledWith("CNT-001", 0);
    expect(appendEvent).toHaveBeenCalledTimes(1);
  });

  test("loadContainer checks the expected version", async () => {
    await loadContainer({
      aggregateId: "CNT-001",
      ship: "MSC-001",
      location: "Warehouse-A",
      expectedVersion: 3,
      userId: "USER-001"
    });

    expect(checkExpectedVersion).toHaveBeenCalledWith("CNT-001", 3);
    expect(appendEvent).toHaveBeenCalledTimes(1);
  });

  test("moveContainer checks the expected version", async () => {
    await moveContainer({
      aggregateId: "CNT-001",
      location: "Mumbai Port",
      expectedVersion: 4,
      userId: "USER-001"
    });

    expect(checkExpectedVersion).toHaveBeenCalledWith("CNT-001", 4);
    expect(appendEvent).toHaveBeenCalledTimes(1);
  });

  test("arriveContainer checks the expected version", async () => {
    await arriveContainer({
      aggregateId: "CNT-001",
      location: "Mumbai Port",
      expectedVersion: 5,
      userId: "USER-001"
    });

    expect(checkExpectedVersion).toHaveBeenCalledWith("CNT-001", 5);
    expect(appendEvent).toHaveBeenCalledTimes(1);
  });

  test("temperatureSpike checks the expected version", async () => {
    await temperatureSpike({
      aggregateId: "CNT-001",
      temperature: 12.8,
      expectedVersion: 6,
      userId: "USER-001"
    });

    expect(checkExpectedVersion).toHaveBeenCalledWith("CNT-001", 6);
    expect(appendEvent).toHaveBeenCalledTimes(1);
  });

  test("does not append an event when OCC check fails", async () => {
    const conflict = new Error("Optimistic concurrency conflict");
    conflict.statusCode = 409;

    checkExpectedVersion.mockRejectedValue(conflict);

    await expect(
      moveContainer({
        aggregateId: "CNT-001",
        location: "Mumbai Port",
        expectedVersion: 2,
        userId: "USER-001"
      })
    ).rejects.toThrow("Optimistic concurrency conflict");

    expect(appendEvent).not.toHaveBeenCalled();
  });
});
