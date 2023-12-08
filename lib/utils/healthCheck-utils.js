const cron = require('node-cron');

const scheduledCheck = cron.schedule('*/14 * * * *', async () => {
  console.log("Server is alive!");
});

module.exports = scheduledCheck;
