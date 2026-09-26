const Event = require('../events/models/Event');

describe('Event Immutability', () => {
  test('should reject updateOne operations', async () => {
    await expect(
      Event.updateOne(
        { aggregateId: 'test-aggregate' },
        { $set: { eventType: 'MODIFIED' } }
      ).exec()
    ).rejects.toThrow('Events are immutable');
  });

  test('should reject updateMany operations', async () => {
    await expect(
      Event.updateMany(
        { aggregateId: 'test-aggregate' },
        { $set: { eventType: 'MODIFIED' } }
      ).exec()
    ).rejects.toThrow('Events are immutable');
  });

  test('should reject findOneAndUpdate operations', async () => {
    await expect(
      Event.findOneAndUpdate(
        { aggregateId: 'test-aggregate' },
        { $set: { eventType: 'MODIFIED' } }
      ).exec()
    ).rejects.toThrow('Events are immutable');
  });

  test('should reject deleteOne operations', async () => {
    await expect(
      Event.deleteOne({
        aggregateId: 'test-aggregate'
      }).exec()
    ).rejects.toThrow('Events are immutable');
  });

  test('should reject deleteMany operations', async () => {
    await expect(
      Event.deleteMany({
        aggregateId: 'test-aggregate'
      }).exec()
    ).rejects.toThrow('Events are immutable');
  });

  test('should reject findOneAndDelete operations', async () => {
    await expect(
      Event.findOneAndDelete({
        aggregateId: 'test-aggregate'
      }).exec()
    ).rejects.toThrow('Events are immutable');
  });
});