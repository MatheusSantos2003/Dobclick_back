import { AppDataSource } from "./datasource";
import express from "express";
import { Request, Response } from "express";
import "reflect-metadata";
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const UsuarioRoute = require("./routes/UsuariosRoutes/Usuario");
const ProdutoRoute = require("./routes/ProdutosRoutes/Produto");

require("dotenv").config();

AppDataSource.initialize().then(async () => {
  const app = express();
  app.use(express.json());
  app.use(cors({origin:"*"}));
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  //rotas
  app.use("/usuarios", UsuarioRoute);
  app.use("/produtos", ProdutoRoute);

  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Olá Mundo!!!");
  });

  const port = process.env.PORT || 3200;
  // start express server
  app.listen(port, () => {
    console.log(`Servidor Rodando na porta ${port}!`);
  });
}).catch((error: any) => console.log(error))


