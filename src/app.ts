import { AppDataSource } from "./datasource";
import express from "express";
import { Request, Response } from "express";
import "reflect-metadata";
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");

const UsuarioRoute = require("./routes/UsuariosRoutes/Usuario");
const ProdutoRoute = require("./routes/ProdutosRoutes/Produto");
const VendasRoute = require("./routes/VendasRoutes/Vendas");
const ComprasRoute = require("./routes/CompraRoutes/Compra");
const GraficosRoute = require("./routes/GraficosRoutes/Graficos");
const RelatorioRoute = require("./routes/RelatoriosRoutes/Relatorio");


require("dotenv").config();

AppDataSource.initialize().then(async () => {
  const app = express();
  app.use(express.json());
  app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
  }));
  app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  //rotas
  app.use("/usuarios", UsuarioRoute);
  app.use("/produtos", ProdutoRoute);
  app.use("/vendas", VendasRoute);
  app.use("/graficos", GraficosRoute);
  app.use("/compras", ComprasRoute);
  app.use("/relatorios", RelatorioRoute);

  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Olá Mundo!!!");
  });

  const port = process.env.PORT || 3200;
  // start express server
  app.listen(port, () => {
    console.log(`Servidor Rodando na porta ${port}!`);
  });
}).catch((error: any) => console.log(error))


