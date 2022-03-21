import "reflect-metadata";
import { Request, Response } from "express";
import { AppDataSource } from "../../datasource";

import { UsuarioEntity } from "../../entity/Usuario";
import { ResponseModel } from "../../models/Response.model";

const express = require("express");
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const usuariosResponse = await AppDataSource.manager.find(UsuarioEntity);
  res.status(200).send(usuariosResponse);
});

router.post('/cadastrar',async (req:Request,res:Response)=>{
   const usuarioAdd =  new UsuarioEntity();

   const UsuarioFind = await AppDataSource.manager.findOne(UsuarioEntity,{where:{email:req.body.email}});

  if(UsuarioFind?.Id){
    var resposta = new ResponseModel();
    resposta.message = "Email Já Cadastrado!";
    resposta.success = false;
    res.status(500).send(resposta);
    return;
  }

   usuarioAdd.nome = req.body.nome;
   usuarioAdd.email = req.body.email;
   usuarioAdd.senha = req.body.senha;

   const response = await AppDataSource.manager.save(usuarioAdd);

   res.status(200).send(response);
});

router.post('/login',async (req:Request,res:Response)=>{

  const {email,senha} = req.body;

  const UsuarioFind = await AppDataSource.manager.findOne(UsuarioEntity,{where:{email:email,senha:senha}});

  if(UsuarioFind?.Id){

    //faz login

  }else{
    // retorna o erro
  }

});

module.exports = router;
