const express = require('express');
const router = express.Router();
const projectionQueryController = require('../controllers/projectionQueryController');
const projectionValidation = require('../middleware/projectionValidation');

/**
 * Projection Query Routes (Member 4)
 * 
 * Secure HTTP endpoints for querying read models.
 */
router.get('/containers', (req, res, next) => projectionValidation.validateQueryParams(req, res, next), (req, res, next) => projectionQueryController.getAllContainers(req, res, next));
router.get('/containers/:id', (req, res, next) => projectionValidation.validateContainerId(req, res, next), (req, res, next) => projectionQueryController.getContainerById(req, res, next));
router.get('/inventory', (req, res, next) => projectionQueryController.getInventory(req, res, next));

module.exports = router;
