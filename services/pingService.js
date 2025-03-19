const ping = require('ping');
const IPDevice = require('../models/IPDevice');
const TelegramBot = require('node-telegram-bot-api');
const Notification = require('../models/Notification'); // Import Notification model
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

const checkStatus = async () => {
  const devices = await IPDevice.find();
  for (const device of devices) {
    const res = await ping.promise.probe(device.ip);
    const newStatus = res.alive ? 'online' : 'offline';

    if (device.status !== newStatus) {
      device.status = newStatus;
      device.lastChecked = new Date();
      await device.save();

      console.log(`Status changed for ${device.name} (${device.ip}) to ${newStatus}`);
      const message = `${device.name} (${device.ip}) is now ${newStatus}`;
      bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message).catch((err) => {
        console.error('Telegram error:', err.message);
      });

      // Save notification to database
      const notification = new Notification({
        deviceId: device._id,
        status: newStatus,
        userId: device.userId,
      });
      await notification.save();

      if (newStatus === 'offline') {
        const offlineInterval = setInterval(async () => {
          const updatedDevice = await IPDevice.findById(device._id);
          if (updatedDevice.status === 'online') {
            clearInterval(offlineInterval);
            console.log(`Device ${updatedDevice.name} is back online`);
            bot.sendMessage(
              process.env.TELEGRAM_CHAT_ID,
              `${updatedDevice.name} (${updatedDevice.ip}) is back online`
            ).catch((err) => console.error('Telegram error:', err.message));

            // Save online notification
            const onlineNotification = new Notification({
              deviceId: updatedDevice._id,
              status: 'online',
              userId: updatedDevice.userId,
            });
            await onlineNotification.save();
          } else {
            console.log(`Device ${updatedDevice.name} still offline`);
            bot.sendMessage(
              process.env.TELEGRAM_CHAT_ID,
              `${updatedDevice.name} (${updatedDevice.ip}) is still offline`
            ).catch((err) => console.error('Telegram error:', err.message));
          }
        }, 180000);
      }
    }
  }
};

const startPingService = () => {
  setInterval(checkStatus, 30000);
  console.log('Ping service started');
};

module.exports = { startPingService, checkStatus };