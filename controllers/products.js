const Product = require('../models/product');

// Render all products
module.exports.index = async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('products/index', { products });
    } catch (error) {
        req.flash('error', 'Error loading products!');
        res.redirect('products/index');
    }
};

// Render the new product form
module.exports.renderNewForm = (req, res) => {
    res.render('products/new');
};

// Create a new product
module.exports.createProduct = async (req, res, next) => {
    try {
        // Create a new product document
        const product = new Product(req.body.product);
        product.author = req.user._id; // Set the author of the product to the current user

        // Save the product to the database
        await product.save();

        req.flash('success', 'Successfully created a new product!');
        res.redirect(`/products/${product._id}`);
    } catch (error) {
        next(error);
    }
};

// Show a specific product
module.exports.showProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        req.flash('error', 'Product not found');
        return res.redirect('/products');
    }
    res.render('products/show', { product });
};

// Render the edit form for a product
module.exports.renderEditForm = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            req.flash('error', 'Cannot find that product!');
            return res.redirect('/products');
        }
        res.render('products/edit', { product });
    } catch (error) {
        req.flash('error', 'Error loading edit form!');
        res.redirect('/products');
    }
};

// Update a product
module.exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, { ...req.body.product }, { new: true });
        await product.save();
        req.flash('success', 'Successfully updated product!');
        res.redirect(`/products/${product._id}`);
    } catch (error) {
        req.flash('error', 'Error updating product!');
        res.redirect(`/products/${req.params.id}/edit`);
    }
};

// Delete a product
module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted product!');
        res.redirect('/products');
    } catch (error) {
        req.flash('error', 'Error deleting product!');
        res.redirect('/products');
    }
};
