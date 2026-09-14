jest.mock("../aggregates/reconstruction", () => ({
  reconstructCurrentState: jest.fn(),
}));

const {
  reconstructCurrentState,
} = require("../aggregates/reconstruction");

const {
  queryCurrentState,
} = require("../aggregates/stateQuery");

describe("State Query", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return the reconstructed current state", async () => {
    const currentState = {
      aggregateId: "CNT-001",
      status: "ARRIVED",
      location: "Mumbai Port",
      ship: "MSC-001",
      version: 4,
    };

    reconstructCurrentState.mockResolvedValue(currentState);

    const result = await queryCurrentState("CNT-001");

    expect(reconstructCurrentState).toHaveBeenCalledWith("CNT-001");
    expect(result).toEqual(currentState);
  });

  test("should reject when aggregate ID is missing", async () => {
    await expect(
      queryCurrentState()
    ).rejects.toThrow("Aggregate ID is required");

    expect(reconstructCurrentState).not.toHaveBeenCalled();
  });
});