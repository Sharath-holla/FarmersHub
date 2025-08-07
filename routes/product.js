const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Product = require("../models/product");
const Purchase = require("../models/purchase");



// Utility function for async error handling
const asyncWrap = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Fetch all products or filter by category or search
router.get("/", asyncWrap(async (req, res) => {
    const user = req.user || null; // Fetch user from session if available
    const { category, search } = req.query; // Get category and search from query string

    let products;
    const query = {};

    // Filter by category if provided
    if (category) {
        query.category = new RegExp(`^${category}$`, 'i'); // Matches category regardless of case
    }

    // Search by name or description if provided
    if (search) {
        const regex = new RegExp(search, 'i'); // 'i' for case-insensitive search
        query.$or = [
            { name: regex },
            { description: regex }
        ];
    }

    products = await Product.find(query); // Fetch products based on the constructed query

    res.render("products/index", { products, user, category, search }); // Pass category and search to the view
}));

// Render form to create a new product
router.get("/new", (req, res) => {
    const user = req.user || null;
    const categories = ['Fruits', 'Vegetables', 'Equipment', 'Crop Nutrition', 'Seeds', 'Grains']; // Categories list
    res.render("products/new", { user, categories }); // Pass categories to the form
});

// Show details of a specific product
router.get("/:id", asyncWrap(async (req, res) => {
    const user = req.user || null;
    const product = await Product.findById(req.params.id);
    if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/products");
    }
    res.render("products/show", { product, user });
}));

// Render edit form for a specific product
router.get("/:id/edit", asyncWrap(async (req, res) => {
    const user = req.user || null;
    const product = await Product.findById(req.params.id);
    if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/products");
    }
    const categories = ['Fruits', 'Vegetables', 'Equipment', 'Crop Nutrition', 'Seeds', 'Grains']; // Categories list
    res.render("products/edit", { product, user, categories }); // Pass categories to the edit form
}));

// Show cart
router.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    res.render('cart/index', { cart, total });
});

// Create a new product
router.post("/", asyncWrap(async (req, res) => {
    const product = new Product(req.body.product);
    await product.save();
    req.flash("success", "Product added successfully!");
    res.redirect(`/products/${product._id}`);
}));


router.post('/cart/add', async (req, res) => {
    const productId = req.body.productId;  // Get the productId from the request

    // Log the productId to debug
    console.log("Product ID:", productId); // This will help debug

    // Check if the productId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).send('Invalid Product ID');
    }

    try {
        // Query for the product using the productId
        const product = await Product.findById(productId);

        // If the product doesn't exist
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Add the product to the cart
        if (!req.session.cart) {
            req.session.cart = [];
        }

        const existingItem = req.session.cart.find(item => item._id.toString() === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            req.session.cart.push({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        req.flash('success', `${product.name} added to cart!`);
        res.redirect('/products/cart'); // Redirect to cart page
    } catch (err) {
        console.error("Error adding product to cart:", err);
        res.status(500).send("Internal Server Error");
    }
});



// Update a product
router.put("/:id", asyncWrap(async (req, res) => {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, { ...req.body.product }, { new: true, runValidators: true });
    if (!updatedProduct) {
        req.flash("error", "Product not found");
        return res.redirect(`/products/${id}/edit`);
    }
    req.flash("success", "Product updated successfully!");
    res.redirect(`/products/${updatedProduct._id}`);
}));

// Delete a product
router.delete("/:id", asyncWrap(async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        req.flash("error", "Product not found");
        return res.redirect("/products");
    }
    req.flash("success", "Product deleted successfully!");
    res.redirect("/products");
}));

// Show 'Buy Now' form
router.get("/buy/:id", asyncWrap(async (req, res) => {
    const product = await Product.findById(req.params.id);
    const user = req.user || null;

    if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/products");
    }

    res.render("products/buy", { product, user });
}));

// Handle 'Buy Now' form submission
router.post("/buy/:id", asyncWrap(async (req, res) => {
    const { name, area, location, phone } = req.body;
    const productId = req.params.id;
    const user = req.user || null;

    const product = await Product.findById(productId);
    if (!product) {
        req.flash("error", "Product not found.");
        return res.redirect("/products");
    }

    const purchase = new Purchase({
        user: user ? user._id : null,
        product: product._id,
        customerName: name,
        area,
        location,
        phone
    });
    await purchase.save();

    console.log("=== PURCHASE DETAILS ===");
    console.log("Customer Name:", name);
    console.log("Area:", area);
    console.log("Location:", location);
    console.log("Phone:", phone);
    console.log("Product Name:", product.name);
    console.log("Product ID:", productId);
    console.log("========================");

    req.flash("success", "✅ Product purchased successfully! Your order is under verification and will reach soon.");
    res.redirect(`/products/${productId}`);
}));






module.exports = router;
