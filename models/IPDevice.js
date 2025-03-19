const mongoose = require('mongoose');

const ipDeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ip: { type: String, required: true, unique: true },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  lastChecked: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('IPDevice', ipDeviceSchema);