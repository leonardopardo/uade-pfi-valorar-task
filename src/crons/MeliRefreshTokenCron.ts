import { MeliTokenService } from "./../services/MeliTokenService";

const cron = require("node-cron");

export const tokenCron = cron.schedule(
  "0 */5 * * *",
  () => {
    const meliTokenService = new MeliTokenService();
    meliTokenService
      .refreshToken()
      .then((result) => {
        console.log(`Token refreshed ${new Date()}\n${result}`);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  {
    scheduled: false,
  }
);
