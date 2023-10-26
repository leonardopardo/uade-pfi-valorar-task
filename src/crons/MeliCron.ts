import { MeliTask } from "../tasks/MeliTask";
import { MeliProcessorTask } from "../tasks/MeliProcessorTask";

const cron = require('node-cron');

export const meliCron = cron.schedule('0 0 * * *', () => {
    new MeliTask().run();
    new MeliProcessorTask().run();
}, {
    scheduled: false,
});