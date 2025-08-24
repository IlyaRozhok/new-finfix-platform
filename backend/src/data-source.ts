import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { envFileMap } from "./shared/envFileMap";

require("dotenv").config({
  path: envFileMap[process.env.NODE_ENV || "development"],
});

export default new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: +(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  database: process.env.POSTGRES_DB || "finfix",
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: false,
});
