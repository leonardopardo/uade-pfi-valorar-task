import { MeliTask } from "../tasks/MeliTask";

const cron = require('node-cron');

export const task = cron.schedule('*/10 * * * *', () => {
    new MeliTask().run();
}, {
    scheduled: false,
});