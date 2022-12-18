import { DataSource } from "typeorm";
import { ClienteEntity } from "./entity/Cliente";
import { CompraEntity } from "./entity/Compra";
import { FornecedorEntity } from "./entity/Fornecedor";
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
  entities: [VendaEntity,UsuarioEntity,VendaProdutoEntity,MarcaEntity,ProdutoEntity,CompraEntity,ResetPasswordEntity,ClienteEntity,FornecedorEntity],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});


