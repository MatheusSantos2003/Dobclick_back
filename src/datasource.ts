import { DataSource } from "typeorm";
import { UsuarioEntity } from "./entity/Usuario";

require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_URL || "localhost",
  port: 5432,
  username: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PWD || "root",
  database: process.env.DATABASE_SCHEMANAME || "dobclick",
  synchronize: true,
  logging: false,
  entities: [UsuarioEntity],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});

