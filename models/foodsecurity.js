const mongoose = require('mongoose');

const foodSecuritySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  salientFeatures: {
    type: [String],
    required: true,
  },
  benefits: [String],
  cost: {
    type: String,
    default: 'Not specified',
  },
  developer: {
    name: {
      type: String,
    },
    organization: String,
  },
  contactDetails: {
    director: String,
    email: String,
    address: String,
    website: String,
  },
});

// ✅ This name should match your route's logic
const FoodSecurity = mongoose.model('FoodSecurity', foodSecuritySchema);

module.exports = FoodSecurity;
