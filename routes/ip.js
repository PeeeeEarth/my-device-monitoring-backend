const express = require('express');
const router = express.Router();
const IPDevice = require('../models/IPDevice');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { name, ip } = req.body;
    if (!name || !ip) {
      return res.status(400).json({ msg: 'Name and IP are required' });
    }

    const newDevice = new IPDevice({
      name,
      ip,
      userId: req.userId,
      status: 'offline',
      lastChecked: new Date(),
    });
    await newDevice.save();

    res.status(201).json(newDevice);
  } catch (err) {
    console.error('Error creating IP device:', err); // Log the error
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const devices = await IPDevice.find({ userId: req.userId });
    res.json(devices);
  } catch (err) {
    console.error('Error fetching IPs:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { name, ip } = req.body;
    if (!name || !ip) {
      return res.status(400).json({ msg: 'Name and IP are required' });
    }

    const device = await IPDevice.findOne({ _id: req.params.id, userId: req.userId });
    if (!device) return res.status(404).json({ msg: 'Device not found' });

    device.name = name;
    device.ip = ip;
    await device.save();

    res.json(device);
  } catch (err) {
    console.error('Error updating IP device:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const device = await IPDevice.findOne({ _id: req.params.id, userId: req.userId });
    if (!device) return res.status(404).json({ msg: 'Device not found' });

    await IPDevice.deleteOne({ _id: req.params.id }); // Use deleteOne instead of remove
    res.json({ msg: 'Device deleted' });
  } catch (err) {
    console.error('Error deleting IP device:', err);
    res.status(500).json({ msg: 'Server error', details: err.message }); // Include error details
  }
});

module.exports = router;