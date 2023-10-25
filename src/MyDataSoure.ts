import "reflect-metadata";
import * as dotenv from 'dotenv';
import path = require('path');
import { DataSource } from "typeorm";
import { MeliModel } from "./models/MeliModel";
import { MeliTokenModel } from "./models/MeliTokenModel";
import { CabapropModel } from "./models/CabapropModel";

dotenv.config({
  path: path.resolve(__dirname, '../.env')
})

const PsqlDatasource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});

const MongoDatasource = new DataSource({
  type: "mongodb",
  host: process.env.MONGO_HOST,
  port: parseInt(process.env.MONGO_PORT),
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  database: process.env.MONGO_DATABASE,
  synchronize: false,
  logging: false,
  entities: [
    MeliModel,
    CabapropModel,
    MeliTokenModel
  ],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  useUnifiedTopology: true,
});

export { PsqlDatasource, MongoDatasource }