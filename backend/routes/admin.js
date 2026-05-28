const express = require('express');
const router = express.Router();
const Pickup = require('../models/Pickup');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// @route GET /api/admin/stats - Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPickups = await Pickup.countDocuments();
    const pendingPickups = await Pickup.countDocuments({ status: 'pending' });
    const completedPickups = await Pickup.countDocuments({ status: 'completed' });
    const revenueData = await Pickup.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$actualEarning' } } },
    ]);
    res.json({
      totalUsers,
      totalPickups,
      pendingPickups,
      completedPickups,
      totalRevenue: revenueData[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/admin/pickups - All pickups
router.get('/pickups', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};
    const pickups = await Pickup.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Pickup.countDocuments(query);
    res.json({ pickups, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route PUT /api/admin/pickups/:id - Update pickup status
router.put('/pickups/:id', async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) return res.status(404).json({ message: 'Pickup not found' });

    const { status, agentName, actualWeight, actualEarning } = req.body;
    pickup.status = status || pickup.status;
    pickup.agentName = agentName || pickup.agentName;

    if (status === 'completed') {
      pickup.actualWeight = actualWeight || 0;
      pickup.actualEarning = actualEarning || 0;
      // Update user earnings
      await User.findByIdAndUpdate(pickup.user, {
        $inc: { totalEarnings: actualEarning || 0, totalPickups: 1 },
      });
    }
    await pickup.save();
    res.json(pickup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route GET /api/admin/users - All users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
