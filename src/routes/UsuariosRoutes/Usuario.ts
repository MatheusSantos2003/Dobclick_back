import "reflect-metadata";
import { Request, Response } from "express";
import { AppDataSource } from "../../datasource";

import { UsuarioEntity } from "../../entity/Usuario";
import { ResponseModel } from "../../models/Response.model";
import { ResetPasswordEntity } from "../../entity/ResetPassword";

const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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
    res.status(200).send(retorno);
    return;
  }

  usuarioAdd.nome = req.body.nome;
  usuarioAdd.email = req.body.email;

  var senhaSemHash = req.body.senha;
  //adquire a senha, vindo do front end 

  const hash = bcrypt.hashSync(senhaSemHash, 10);

  usuarioAdd.senha = hash;


  const response = await AppDataSource.manager.save(usuarioAdd);


  //sucesso
  if (response) {

    var payload: UsuarioEntity = {
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

      if (result) {
        var payload = {
          Id: UsuarioFind.Id,
          nome: UsuarioFind.nome,
          email: UsuarioFind.email
        }

        var token = jwt.sign(payload, process.env.SECRETKEY || "dobclick2022")

        response.success = true;
        response.data = token;
        res.status(200).send(response);
        //faz login
      } else {
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

router.post('/esqueceu-senha', async (req: Request, res: Response) => {
  const email = req.body.email;
  let retorno: ResponseModel = new ResponseModel;

  const UsuarioFind = await AppDataSource.manager.findOne(UsuarioEntity, { where: { email: email } });

  if (!UsuarioFind?.Id) {
    retorno.message = "Email não Cadastrado";
    retorno.success = false;
    res.status(200).send(retorno);
    return;
  } else {
    try {
      const forgot = new ResetPasswordEntity();

      forgot.userEmail = UsuarioFind.email;
      forgot.userId = UsuarioFind.Id;
      const token = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
      forgot.token = token;
      const result = await AppDataSource.manager.save(forgot);

      if(result){

        let mailTrasporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_TEST_PASS
          }
          
        });

        await mailTrasporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Recuperação de senha - Dobclick",
          text: "Clique no link para recuprerar sua senha: "+process.env.FRONTEND_URL+"/#/recuperar-senha/"+token,
        
        })


        retorno.message = "Sucesso! Verifique seu Email e siga as instruções";
        retorno.success = true;
        retorno.data = result;
        res.status(200).send(retorno);
        return;
      }

    } catch (error) {
      retorno.message = "Houve um erro ao solicitar recuperação de senha";
      retorno.success = false;
      res.status(200).send(retorno);
      return;
    }
  }

});

module.exports = router;
