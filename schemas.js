const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value });
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.warehouseSchema = Joi.object({
    warehouse: Joi.object({
        name: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        capacity: Joi.number().required().min(0),
        inventory: Joi.array().items(Joi.string().escapeHTML()).required(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteItems: Joi.array().items(Joi.string().escapeHTML())
});

module.exports.itemSchema = Joi.object({
    item: Joi.object({
        name: Joi.string().required().escapeHTML(),
        quantity: Joi.number().required().min(0),
        description: Joi.string().required().escapeHTML()
    }).required()
});

module.exports.productSchema = Joi.object({
    product: Joi.object({
        name: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        category: Joi.string().valid('Electronics', 'Clothing', 'Furniture', 'Books', 'Others').required().escapeHTML(),
        price: Joi.number().required().min(1), // Price must be greater than 0
        stock: Joi.number().integer().min(0).required(), // Stock can't be negative
        images: Joi.array().items(Joi.object({
            url: Joi.string().uri().required() // Ensure image URL is valid
        })).optional(),
    }).required()
});

// Schema for validating items in the cart
module.exports.cartItemSchema = Joi.object({
    item: Joi.object({
        productId: Joi.string().required(), // Assuming the product has an ID for the cart
        quantity: Joi.number().required().min(1), // Quantity must be at least 1
    }).required()
});