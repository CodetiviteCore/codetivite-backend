const cron = require('node-cron');
const axios = require('axios');
const url = process.env.BE_HOST;

const healthScheduledCheck = cron.schedule('*/14 * * * *', async () => {
    try {
        const response = await axios.get(url);
        console.log('Response from the endpoint:', response.data);
    } catch (error) {
        console.error('Error making request:', error.message);
    }
});

module.exports = healthScheduledCheck;