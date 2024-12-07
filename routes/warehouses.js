const express = require('express');
const router = express.Router();
const warehouses = require('../controllers/warehouses');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateWarehouse } = require('../middleware');
const Warehouse = require('../models/warehouse'); // Assuming Warehouse is the model

// Route to list all warehouses
router.route('/')
    .get(catchAsync(warehouses.index)) // Get all warehouses
    .post(isLoggedIn, validateWarehouse, catchAsync(warehouses.createWarehouse)); // Create new warehouse

// Route to show form to create a new warehouse
router.get('/new', isLoggedIn, warehouses.renderNewForm);

// Routes for a specific warehouse by ID
router.route('/:id')
    .get(catchAsync(warehouses.showWarehouse)) // Show specific warehouse
    .put(isLoggedIn, isAuthor, validateWarehouse, catchAsync(warehouses.updateWarehouse)) // Update warehouse
    .delete(isLoggedIn, isAuthor, catchAsync(warehouses.deleteWarehouse)); // Delete warehouse

// Route to edit warehouse
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(warehouses.renderEditForm));

module.exports = router;
