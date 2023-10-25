import { MeliTask } from "../tasks/MeliTask";

const cron = require('node-cron');

export const meliCron = cron.schedule('0 0 * * *', () => {
    new MeliTask().run();
}, {
    scheduled: false,
});