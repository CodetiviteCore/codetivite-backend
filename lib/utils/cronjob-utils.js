const cron = require('node-cron');
const axios = require('axios');
const healthCheckUrl = process.env.HEALTHCHECK_URL;

const healthScheduledCheck = cron.schedule('*/1 * * * *', async () => {
    try {
        const response = await axios.get(healthCheckUrl);
        console.log('Response from the endpoint:', response.data);
    } catch (error) {
        console.error('Error making request:', error.message);
    }
});

module.exports = healthScheduledCheck;