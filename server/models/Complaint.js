const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    type: {
      type: String,
      enum: ['complaint', 'inquiry', 'feedback', 'request'],
      default: 'complaint',
    },
    status: {
      type: String,
      enum: ['open', 'assigned', 'resolved', 'closed'],
      default: 'open',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate complaintId if not present
complaintSchema.pre('save', async function (next) {
  if (!this.complaintId) {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit number
    this.complaintId = `COMP-${randomNum}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
