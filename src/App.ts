import * as express from "express";
import * as dotenv from "dotenv";
import * as cors from "cors";
import { DataSource } from "typeorm";
import { MongoDatasource, PsqlDatasource } from "./MyDataSoure";
import bodyParser = require("body-parser");
import path = require("path");
import "reflect-metadata";
import { MeliRouter } from "./routes/MeliRouter";
import { CabapropRouter } from "./routes/CabapropRouter";
import { MeliTask } from "./tasks/MeliTask";
import { meliCron } from "./crons/MeliCron";
import { tokenCron } from "./crons/MeliRefreshTokenCron";
import { CabapropTask } from "./tasks/CabapropTask";
import { cabapropCron } from "./crons/CabapropCron";

class App {
  public app: express.Application;
  public corsOptions: cors.CorsOptions;
  public router: express.Router;

  constructor() {
    // set variables
    this.app = express();
    this.router = express.Router();

    // config envirnoment file
    dotenv.config({
      path: path.resolve(__dirname, "../.env"),
    });

    // setting uses
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // initialize resources
    this.initializeRoutes();

    // initialize datasource
    this.initializeDatasource().then(() => {
      this.initalizeCrons();
    }).catch((err) => {
      console.log(`Ocurrió un error al conectarse con la base de datos ${err}`);
    });
  }

  private initializeRoutes(): void {
    this.app.use(bodyParser.json());
    this.app.use("/api/v1/", this.router);
    new MeliRouter().routes(this.router);
    new CabapropRouter().routes(this.router);
  }

  private initalizeCrons(): void {
    meliCron.start();
    cabapropCron.start();
    tokenCron.start();
  }

  private async initializeDatasource(): Promise<void> {
    // initialize postgres
    const PostgresDataSource: DataSource = PsqlDatasource;
    await PostgresDataSource.initialize();

    // initialize mongo
    const MongoDataSource: DataSource = MongoDatasource;
    await MongoDataSource.initialize();
  }

  public listen(): void {
    this.app.listen();
  }
}
export default new App().app;
