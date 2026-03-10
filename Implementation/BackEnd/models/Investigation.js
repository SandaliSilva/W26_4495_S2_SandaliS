const mongoose = require('mongoose');

const InvestigationSchema = new mongoose.Schema({
  // Section 1-3: Basic Info
  incidentDate: { type: Date, required: true },
  location: { type: String, required: true },
  incidentType: { 
    type: String, 
    enum: ['Injury', 'Near Miss', 'Fatal', 'Serious Injury'], 
    required: true 
  },

  // Section 8: Witnesses
  witnesses: [{
    name: String,
    statement: String
  }],

  // Section 11: The Narrative (AI will help clean this up later)
  sequenceOfEvents: { type: String, required: true },

  // Section 12-13: Contributing Factors
  unsafeConditions: [String],
  unsafeActs: [String],

  // Section 15: Full Investigation (Root Cause)
  rootCauseAnalysis: { type: String },
  
  // Status tracking for your automation engine
  reportStatus: { 
    type: String, 
    enum: ['Draft', 'Preliminary_Ready', 'Full_Complete'], 
    default: 'Draft' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Investigation', InvestigationSchema);