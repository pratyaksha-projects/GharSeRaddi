const express = require('express');
const router = express.Router();
const ScrapPrice = require('../models/ScrapPrice');
const { protect, adminOnly } = require('../middleware/auth');

// @route GET /api/prices - Get all active prices (public)
router.get('/', async (req, res) => {
  try {
    const prices = await ScrapPrice.find({ isActive: true });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST /api/prices/seed - Seed default prices (run once)
router.post('/seed', async (req, res) => {
  try {
    const defaults = [
      { category: 'paper', label: 'Newspaper / Books', labelHindi: 'अखबार / किताबें', pricePerKg: 14, icon: '📰', description: 'Old newspapers, magazines, books, cardboard' },
      { category: 'plastic', label: 'Plastic Bottles / Containers', labelHindi: 'प्लास्टिक बोतलें', pricePerKg: 8, icon: '🧴', description: 'PET bottles, plastic containers, bags' },
      { category: 'metal', label: 'Iron / Steel / Aluminium', labelHindi: 'लोहा / एल्युमिनियम', pricePerKg: 28, icon: '⚙️', description: 'Old utensils, rods, cans, aluminium foil' },
      { category: 'ewaste', label: 'E-Waste / Electronics', labelHindi: 'इलेक्ट्रॉनिक कचरा', pricePerKg: 50, icon: '💻', description: 'Old phones, wires, circuit boards, batteries' },
      { category: 'glass', label: 'Glass Bottles / Jars', labelHindi: 'कांच की बोतलें', pricePerKg: 4, icon: '🍶', description: 'Glass bottles, jars, broken glass (packed)' },
      { category: 'other', label: 'Mixed / Other Scrap', labelHindi: 'अन्य कचरा', pricePerKg: 5, icon: '♻️', description: 'Mixed scrap, rubber, wood, textiles' },
    ];
    await ScrapPrice.deleteMany({});
    const prices = await ScrapPrice.insertMany(defaults);
    res.json({ message: 'Prices seeded', prices });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/prices/:id - Update price (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const price = await ScrapPrice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(price);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
