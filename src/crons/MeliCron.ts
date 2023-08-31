import { MeliTask } from "../tasks/MeliTask";

const cron = require('node-cron');

cron.schedule('* * * * *', () => {
    new MeliTask().run();
});