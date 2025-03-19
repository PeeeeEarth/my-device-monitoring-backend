const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'IPDevice', required: true },
  status: { type: String, enum: ['online', 'offline'], required: true },
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Notification', notificationSchema);