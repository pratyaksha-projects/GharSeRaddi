const mongoose = require('mongoose');

const scrapPriceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['paper', 'plastic', 'metal', 'ewaste', 'glass', 'other'],
      unique: true,
      required: true,
    },
    label: { type: String, required: true },   // "Newspaper / Books"
    labelHindi: { type: String, default: '' }, // "अखबार / किताबें"
    pricePerKg: { type: Number, required: true },
    icon: { type: String, default: '♻️' },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ScrapPrice', scrapPriceSchema);
