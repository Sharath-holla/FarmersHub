const express = require('express');
const router = express.Router();
const products = require('../controllers/products'); // Assuming products controller
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateProduct } = require('../middleware'); // Ensure you have these middleware
const Product = require('../models/product'); // Assuming Product is the model

// Route to list all products
router.route('/')
    .get(catchAsync(products.index)) // Get all products
    .post(isLoggedIn, validateProduct, catchAsync(products.createProduct)); // Create new product

// Route to show form to create a new product
router.get('/new', isLoggedIn, products.renderNewForm);

// Routes for a specific product by ID
router.route('/:id')
    .get(catchAsync(products.showProduct)) // Show specific product
    .put(isLoggedIn, isAuthor, validateProduct, catchAsync(products.updateProduct)) // Update product
    .delete(isLoggedIn, isAuthor, catchAsync(products.deleteProduct)); // Delete product

// Route to edit product
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(products.renderEditForm));

module.exports = router;
