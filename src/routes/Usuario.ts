import "reflect-metadata";
import { Request, Response } from "express";
import { AppDataSource } from "./../datasource";

import { UsuarioEntity } from "../entity/Usuario";

const express = require("express");
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const usuariosResponse = await AppDataSource.manager.find(UsuarioEntity);

  res.send(usuariosResponse);
});

router.post('/adicionar',async (req:Request,res:Response)=>{
   const usuarioAdd =  new UsuarioEntity();

   usuarioAdd.name = req.body.name;

   const response = await AppDataSource.manager.save(usuarioAdd);

   res.send(response);
});

module.exports = router;
