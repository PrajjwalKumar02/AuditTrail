const express = require('express');
const router = express.Router();
const projectionQueryController = require('../controllers/projectionQueryController');

/**
 * Projection Query Routes (Member 4 - Item #16)
 */
router.get('/containers', (req, res, next) => projectionQueryController.getAllContainers(req, res, next));
router.get('/containers/:id', (req, res, next) => projectionQueryController.getContainerById(req, res, next));
router.get('/inventory', (req, res, next) => projectionQueryController.getInventory(req, res, next));

module.exports = router;
