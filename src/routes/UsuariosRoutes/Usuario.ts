import "reflect-metadata";
import { Request, Response } from "express";
import { AppDataSource } from "../../datasource";

import { UsuarioEntity } from "../../entity/Usuario";
import { ResponseModel } from "../../models/Response.model";

const jwt = require('jsonwebtoken');
require("dotenv").config();
const express = require("express");
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const usuariosResponse = await AppDataSource.manager.find(UsuarioEntity);
  res.status(200).send(usuariosResponse);
});

router.post('/cadastrar', async (req: Request, res: Response) => {
  const usuarioAdd = new UsuarioEntity();
  let retorno: ResponseModel = new ResponseModel;

  const UsuarioFind = await AppDataSource.manager.findOne(UsuarioEntity, { where: { email: req.body.email } });

  if (UsuarioFind?.Id) {

    retorno.message = "Email Já Cadastrado!";
    retorno.success = false;
    res.status(500).send(retorno);
    return;
  }

  usuarioAdd.nome = req.body.nome;
  usuarioAdd.email = req.body.email;
  usuarioAdd.senha = req.body.senha;

  const response = await AppDataSource.manager.save(usuarioAdd);


  //sucesso
  if (response) {

    retorno.success = true;
    retorno.data = response;

    res.status(200).send(retorno);

  } else {

    retorno.success = false;
    retorno.data = null;
    retorno.message = "Não foi Possivel Adicionar o usuario!";

    res.status(500).send(retorno);

  }
});

router.post('/login', async (req: Request, res: Response) => {
  var response = new ResponseModel();
  const { email, senha } = req.body;

  const UsuarioFind = await AppDataSource.manager.findOne(UsuarioEntity, { where: { email: email, senha: senha } });

  if (UsuarioFind?.Id) {

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

  } else {
    response.success = false;
    response.message = "Usuário não econtrado!!";
    response.data = null;
    res.status(500).send(response);
    // retorna o erro
  }

});

module.exports = router;
