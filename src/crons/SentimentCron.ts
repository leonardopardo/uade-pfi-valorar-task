import { SentimentTask } from "../tasks/SentimentTask";

const cron = require('node-cron');

export const sentimentCron = cron.schedule('0 0 * * *', () => {
    new SentimentTask().run();
}, {
    scheduled: false,
});