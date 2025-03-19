const express = require('express');
const router = express.Router();
const IPDevice = require('../models/IPDevice');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const devices = (await IPDevice.find({ userId: req.userId }).lean()) || [];

    // Calculate stats
    const onlineCount = devices.filter((d) => d.status === 'online').length;
    const offlineCount = devices.length - onlineCount;
    const total = devices.length;
    const avgUptime = total > 0 ? (onlineCount / total) * 100 : 0;

    // Mock historical data (replace with actual history collection if implemented)
    const history = Array.from({ length: 24 }, (_, i) => ({
      timestamp: new Date(Date.now() - i * 30 * 60 * 1000).toISOString(),
      onlineCount: Math.floor(Math.random() * (onlineCount + 1)),
    })).reverse();

    res.json({
      devices,
      stats: { total, online: onlineCount, offline: offlineCount, avgUptime },
      history,
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ msg: 'Server error', details: err.message });
  }
});

module.exports = router;