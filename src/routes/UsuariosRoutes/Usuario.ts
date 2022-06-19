import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../datasource";

import { UsuarioEntity } from "../../entity/Usuario";
import { ResponseModel } from "../../models/Response.model";
import { SelectQueryBuilder } from "typeorm";

const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require("dotenv").config();
const express = require("express");
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const usuariosResponse = await AppDataSource.manager.find(UsuarioEntity);
  res.status(200).send(usuariosResponse);
});

// function verifyToken(req: any, res: Response, next: NextFunction) {
//   if (!req.headers.authorization) {
//     return res.status(401).send("Unauthorized request");
//   }
//   let token = req.headers.authorization.split(' ')[1];
//   if (token === 'null') {
//     return res.status(401).send("Unauthorized request");
//   }
//   let payload = jwt.verify(token, 'secretKey');
//   if (!payload) {
//     return res.status(401).send("Unauthorized request");
//   }
//   req.userId = payload.subject;
//   next();
// }

router.post('/cadastrar', async (req: Request, res: Response) => {
  const usuarioAdd = new UsuarioEntity();
  let retorno: ResponseModel = new ResponseModel;

  const UsuarioFind = await AppDataSource.manager.findOne(UsuarioEntity, { where: { email: req.body.email } });

  if (UsuarioFind?.Id) {

    retorno.message = "Email Já Cadastrado!";
    retorno.success = false;
    res.status(200).send(retorno);
    return;
  }

  usuarioAdd.nome = req.body.nome;
  usuarioAdd.email = req.body.email;

  var senhaSemHash = req.body.senha;


  const hash = bcrypt.hashSync(senhaSemHash, 10);

  usuarioAdd.senha = hash;


  const response = await AppDataSource.manager.save(usuarioAdd);


  //sucesso
  if (response) {

    var payload:UsuarioEntity = {
      Id: response.Id,
      nome: response.nome,
      email: response.email,
    }



    retorno.success = true;
    retorno.data = payload;



    res.status(200).send(retorno);
    return;

  } else {

    retorno.success = false;
    retorno.data = null;
    retorno.message = "Não foi Possivel Adicionar o usuario!";

    res.status(200).send(retorno);

  }
});

router.post('/login', async (req: Request, res: Response) => {
  var response = new ResponseModel();
  const { email, senha } = req.body;


  const UsuarioFind = await AppDataSource.manager.findOne(UsuarioEntity, { where: { email: email } });

  if (UsuarioFind?.Id) {

    // bcrypt.compareSync(senha, UsuarioFind.senha, async (err:any,result:any)=>{
    bcrypt.compare(senha, UsuarioFind.senha).then(function (result: boolean) {
    
      if(result){
        var payload = {
          Id: UsuarioFind.Id,
          nome: UsuarioFind.nome,
          email: UsuarioFind.email
        }
    
        var token = jwt.sign(payload, process.env.SECRETKEY)
    
        response.success = true;
        response.data = token;
        res.status(200).send(response);
        //faz login
      }else{
        response.success = false;
        response.message = "Usuário ou Senha Inválidos";
        response.data = null;
        res.status(200).send(response);
    
      }

    });


   
  } else {
    response.success = false;
    response.message = "Usuário ou Senha Inválidos";
    response.data = null;
    res.status(200).send(response);

    // retorna o erro
  }

});

module.exports = router;
