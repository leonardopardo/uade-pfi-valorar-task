import { MeliTask } from "../tasks/MeliTask";

const cron = require('node-cron');

cron.schedule('0 10 * * *', () => {
    new MeliTask().run();
}, {
    scheduled: true,
    timezone: "America/Buenos_Aires"
});