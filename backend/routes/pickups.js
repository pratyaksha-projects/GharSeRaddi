const express = require('express');
const router = express.Router();
const Pickup = require('../models/Pickup');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route POST /api/pickups - Book a new pickup
router.post('/', protect, async (req, res) => {
  try {
    const { scrapItems, scheduledDate, scheduledTimeSlot, pickupAddress, notes } = req.body;
    const pickup = await Pickup.create({
      user: req.user._id,
      scrapItems,
      scheduledDate,
      scheduledTimeSlot,
      pickupAddress,
      notes,
    });
    res.status(201).json(pickup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/pickups/my - Get logged-in user's pickups
router.get('/my', protect, async (req, res) => {
  try {
    const pickups = await Pickup.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(pickups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/pickups/:id - Get single pickup
router.get('/:id', protect, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id).populate('user', 'name email phone');
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });
    res.json(pickup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/pickups/:id/cancel - Cancel a pickup
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });
    if (pickup.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (pickup.status === 'completed')
      return res.status(400).json({ message: 'Cannot cancel completed pickup' });
    pickup.status = 'cancelled';
    await pickup.save();
    res.json({ message: 'Pickup cancelled', pickup });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
