const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const FoodSecurity = require("../models/foodsecurity");
const { isLoggedIn } = require('../middleware');

// Utility: Validate MongoDB ObjectId
const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid ID format" });
    }
    next();
};

// Utility: Async wrapper
function asyncWrap(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

// Route: List or search
router.get("/", asyncWrap(async (req, res) => {
    const { search } = req.query;
    let records;

    if (search && search.trim().length >= 1) {
        const regex = new RegExp(search, 'i');
        records = await FoodSecurity.find({
            $or: [
                { title: regex },
                { description: regex }
            ]
        });
    } else {
        records = await FoodSecurity.find();
    }

    res.render("foodsecurity/index", { technologies: records, search });
}));

// Route: New form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("foodsecurity/new");
});

// Route: Show one
router.get("/:id", validateObjectId, asyncWrap(async (req, res) => {
    const tech = await FoodSecurity.findById(req.params.id);
    if (!tech) return res.status(404).send("Record not found");
    res.render("foodsecurity/show", { technology: tech });
}));

// Route: Edit form
router.get("/:id/edit", isLoggedIn, validateObjectId, asyncWrap(async (req, res) => {
    const tech = await FoodSecurity.findById(req.params.id);
    if (!tech) return res.status(404).send("Record not found");
    res.render("foodsecurity/edit", { technology: tech });
}));

// Route: Create
router.post("/", isLoggedIn, asyncWrap(async (req, res) => {
    const { technology } = req.body;
    const newTech = new FoodSecurity(technology);
    await newTech.save();
    res.redirect(`/foodsecurity/${newTech._id}`);
}));

// Route: Update
router.put("/:id", isLoggedIn, validateObjectId, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const { technology } = req.body;
    const updated = await FoodSecurity.findByIdAndUpdate(id, technology, {
        new: true, runValidators: true
    });
    if (!updated) return res.status(404).send("Record not found");
    res.redirect(`/foodsecurity/${updated._id}`);
}));

// Route: Delete
router.delete("/:id", isLoggedIn, validateObjectId, asyncWrap(async (req, res) => {
    const { id } = req.params;
    const deleted = await FoodSecurity.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send("Record not found");
    res.redirect("/foodsecurity");
}));

module.exports = router;
