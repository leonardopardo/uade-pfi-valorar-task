import { CabapropTask } from "../tasks/CabapropTask";
import { MeliTask } from "../tasks/MeliTask";

const cron = require('node-cron');

export const cabapropCron = cron.schedule('0 0 * * *', () => {
    new CabapropTask().run();
}, {
    scheduled: false,
});