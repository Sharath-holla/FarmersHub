const mongoose = require('mongoose');

const technologySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,  // Ensure title is always provided
  },
  description: {
    type: String,
    required: true,  // Ensure description is always provided
  },
  salientFeatures: {
    type: [String],  // Array of strings
    required: true,  // Ensure at least one feature is provided
  },
  benefits: [String],
  cost: {
    type: String,
    default: 'Not specified',  // Default value for cost
  },
  developer: {
    name: {
      type: String,  // Ensure developer's name is provided
    },
    organization: String,
  },
  contactDetails: {
    director: String,
    email: {
      type: String,
      
    },
    address: String,
    website: String,
  },
});

const Technology = mongoose.model('Technology', technologySchema);
module.exports = Technology;
