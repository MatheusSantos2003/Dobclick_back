import { DataSource } from "typeorm";
import {CategoriaEntity} from "./entity/Categoria";
import { CompraEntity } from "./entity/Compra";
import { EstoqueEntity } from "./entity/Estoque";
import { MarcaEntity } from "./entity/Marca";
import { ProdutoEntity } from "./entity/Produto";
import { ResetPasswordEntity } from "./entity/ResetPassword";
import { UsuarioEntity } from "./entity/Usuario";
import { VendaEntity } from "./entity/Venda";
import { VendaProdutoEntity } from "./entity/VendaProduto";


require("dotenv").config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host:   process.env.DATABASE_URL || "localhost" ,
  port: 5432,
  username: process.env.DATABASE_USER || "postgres",
  password:  process.env.DATABASE_PWD || "root" ,
  database: process.env.DATABASE_SCHEMANAME || "dobclick"  ,
  synchronize: true,
  logging: false,
  entities: [CategoriaEntity,EstoqueEntity,VendaEntity,UsuarioEntity,VendaProdutoEntity,MarcaEntity,ProdutoEntity,CompraEntity,ResetPasswordEntity],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});


