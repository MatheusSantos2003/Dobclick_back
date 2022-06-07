import { DataSource } from "typeorm";
import CategoriaEntity from "./entity/Categoria";
import { EstoqueEntity } from "./entity/Estoque";
import { MarcaEntity } from "./entity/Marca";
import { ProdutoEntity } from "./entity/Produto";
import { UsuarioEntity } from "./entity/Usuario";


require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username:  "postgres",
  password:  "root",
  database:  "dobclick",
  synchronize: true,
  logging: false,
  entities: [CategoriaEntity,EstoqueEntity,MarcaEntity,ProdutoEntity,UsuarioEntity],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});


