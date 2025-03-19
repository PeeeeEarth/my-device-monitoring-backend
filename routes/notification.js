const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const IPDevice = require('../models/IPDevice');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = { userId: req.userId };

    if (status) query.status = status;
    if (startDate) query.timestamp = { ...query.timestamp, $gte: new Date(startDate) };
    if (endDate) query.timestamp = { ...query.timestamp, $lte: new Date(endDate) };

    const notifications = await Notification.find(query).populate('deviceId');
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ msg: 'Server error', details: err.message });
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.userId });
    res.json({ msg: 'Notifications cleared' });
  } catch (err) {
    console.error('Error clearing notifications:', err);
    res.status(500).json({ msg: 'Server error', details: err.message });
  }
});

module.exports = router;