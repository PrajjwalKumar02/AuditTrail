const ContainerReadModel = require('../models/ContainerReadModel');
const InventoryReadModel = require('../models/InventoryReadModel');

/**
 * Projection Query Controller (Member 4 - Item #16)
 * 
 * Provides fast HTTP GET query API endpoints for fetching container and inventory read models.
 */
class ProjectionQueryController {
  /**
   * GET /api/projections/containers
   * Fetch all container read model states
   */
  async getAllContainers(req, res, next) {
    try {
      const { status, location } = req.query;
      const filter = {};

      if (status) filter.status = status;
      if (location) filter.currentLocation = location;

      const containers = await ContainerReadModel.find(filter).sort({ updatedAt: -1 });
      return res.status(200).json({
        success: true,
        data: containers,
        message: 'Containers fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/projections/containers/:id
   * Fetch container state by containerId
   */
  async getContainerById(req, res, next) {
    try {
      const { id } = req.params;
      const container = await ContainerReadModel.findOne({ containerId: id });

      if (!container) {
        return res.status(404).json({ success: false, error: 'Container read model not found' });
      }

      return res.status(200).json({
        success: true,
        data: container,
        message: 'Container details fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/projections/inventory
   * Fetch inventory read models
   */
  async getInventory(req, res, next) {
    try {
      const { containerId } = req.query;
      const filter = containerId ? { containerId } : {};

      const inventory = await InventoryReadModel.find(filter).sort({ updatedAt: -1 });
      return res.status(200).json({
        success: true,
        data: inventory,
        message: 'Inventory read models fetched successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProjectionQueryController();
