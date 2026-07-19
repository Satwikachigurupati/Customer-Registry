const mongoose = require('mongoose');

const customFieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a camelCase name'],
      trim: true,
    },
    label: {
      type: String,
      required: [true, 'Please add a display label'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['text', 'number', 'date', 'boolean'],
      default: 'text',
    },
    target: {
      type: String,
      enum: ['customer', 'complaint'],
      required: [true, 'Please specify target: customer or complaint'],
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique name per target
customFieldSchema.index({ name: 1, target: 1 }, { unique: true });

module.exports = mongoose.model('CustomField', customFieldSchema);
