const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    name: String,
    area: String,
    location: String,
    phone: String,
    status: {
        type: String,
        default: "Pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Purchase', purchaseSchema);