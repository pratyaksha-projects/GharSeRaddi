const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scrapItems: [
      {
        category: {
          type: String,
          enum: ['paper', 'plastic', 'metal', 'ewaste', 'glass', 'other'],
          required: true,
        },
        estimatedWeight: { type: Number, required: true }, // in kg
        pricePerKg: { type: Number, required: true },
        estimatedEarning: { type: Number },
      },
    ],
    totalEstimatedWeight: { type: Number, default: 0 },
    totalEstimatedEarning: { type: Number, default: 0 },
    actualWeight: { type: Number, default: 0 },
    actualEarning: { type: Number, default: 0 },
    scheduledDate: { type: Date, required: true },
    scheduledTimeSlot: {
      type: String,
      enum: ['9AM-12PM', '12PM-3PM', '3PM-6PM'],
      required: true,
    },
    pickupAddress: {
      street: String,
      city: String,
      pincode: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    agentName: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Auto-calculate estimated earning per item
pickupSchema.pre('save', function (next) {
  let totalWeight = 0;
  let totalEarning = 0;
  this.scrapItems.forEach((item) => {
    item.estimatedEarning = item.estimatedWeight * item.pricePerKg;
    totalWeight += item.estimatedWeight;
    totalEarning += item.estimatedEarning;
  });
  this.totalEstimatedWeight = totalWeight;
  this.totalEstimatedEarning = totalEarning;
  next();
});

module.exports = mongoose.model('Pickup', pickupSchema);
