import "reflect-metadata";
import { Request, Response } from "express";
import { AppDataSource } from "../../datasource";

import { UsuarioEntity } from "../../entity/Usuario";
import { ResponseModel } from "../../models/Response.model";
import { ResetPasswordEntity } from "../../entity/ResetPassword";
import { ClienteEntity } from "../../entity/Cliente";
import { In } from "typeorm";
import { FornecedorEntity } from "../../entity/Fornecedor";

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

      if (result) {

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
          text: "Clique no link para recuprerar sua senha: " + process.env.FRONTEND_URL + "/#/recuperar-senha/" + token,

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

router.post('/validar-recuperar-senha', async (req: Request, res: Response) => {
  let response: ResponseModel = new ResponseModel();
  const token = req.body.token;

  const TokenFound = await AppDataSource.manager.findOne(ResetPasswordEntity, { where: { token: token } });

  if (TokenFound) {
    response.success = true;
    response.data = TokenFound;
    response.message = "Token Valido!";
    res.status(200).send(response);
    return;
  } else {
    response.success = false;
    response.data = false;
    response.message = "Token Invalido!";
    res.status(200).send(response);
    return;
  }

});

router.put('/trocar-senha', async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  let retorno: ResponseModel = new ResponseModel;

  let UsuarioFind = await AppDataSource.manager.findOne(UsuarioEntity, { where: { email: email } });

  if (UsuarioFind) {
    var senhaSemHash = senha;
    //adquire a senha, vindo do front end 

    const hash = bcrypt.hashSync(senhaSemHash, 10);

    UsuarioFind.senha = hash;


    const userResult = await AppDataSource.manager.update(UsuarioEntity, { Id: UsuarioFind.Id }, UsuarioFind);
    if (userResult) {
      retorno.success = true;
      retorno.data = userResult;
      retorno.message = "Senha alterada com successo!";
      res.status(200).send(retorno);
      return;
    } else {
      retorno.success = false;
      retorno.message = "Houve um Erro ao alterar a senha";
      res.status(200).send(retorno);
      return;
    }

  } else {
    retorno.success = false;
    retorno.data = null;
    retorno.message = "Email não Cadastrado";
    res.status(200).send(retorno);
    return;
  }

});

router.post('/cadastrar-cliente', async (req: Request, res: Response) => {
  let response: ResponseModel = new ResponseModel();
  const { nome, contato, userId } = req.body;

  const novoCliente = new ClienteEntity();

  const User = await AppDataSource.manager.findOne(UsuarioEntity, { where: { Id: userId } });


  if (User) {
    novoCliente.nome = nome;
    novoCliente.contato = contato;
    novoCliente.usuario = User;

    const created = await AppDataSource.manager.save(novoCliente);
    if (created) {
      response.success = true;
      response.data = created;
      response.message = "Cliente criado com sucesso!";
      res.status(200).send(response);
      return;
    } else {
      response.success = false;
      response.data = false;
      response.message = "Erro ao criar cliente";
      res.status(200).send(response);
      return;
    }

  } else {
    response.success = false;
    response.data = false;
    response.message = "Usuário não encontrado";
    res.status(200).send(response);
    return;
  }



})

router.put('/editar-cliente', async (req: Request, res: Response) => {
  const { IdEdit, nomeEdit, contatoEdit, usuarioId } = req.body;
  let response = new ResponseModel();



  const user = await AppDataSource.manager.findOne(UsuarioEntity, { where: { Id: usuarioId } });

  const client = await AppDataSource.manager.findOne(ClienteEntity, { where: { Id: Number(IdEdit) } });

  if (client && user) {
    let edit = new ClienteEntity();
    edit.Id = client.Id;
    edit.nome = nomeEdit;
    edit.contato = contatoEdit;
    edit.usuario = user;

    const result = await AppDataSource.manager.update(ClienteEntity, edit.Id, edit);

    if (result.affected != 0 && result.affected != null) {
      response.success = true;
      response.data = edit;
      response.message = "Cliente editado com sucesso!";
      res.status(200).send(response);
      return;
    } else {
      response.success = false;
      response.data = false;
      response.message = "Erro ao editar cliente";
      res.status(200).send(response);
      return;
    }

  }else{
    response.success = false;
    response.data = false;
    response.message = "Cliente / Usuário não encontrado";
    res.status(200).send(response);
    return;
  }

});

router.delete('/deletar-cliente',async (req:Request,res:Response) => {
  const {id} = req.body;
  let response = new ResponseModel();

  const cliente = await AppDataSource.manager.findOne(ClienteEntity, { where:{Id: id} });

  if(cliente){

    const result = await AppDataSource.manager.delete(ClienteEntity,{Id:id});

    if(result.affected!= 0 && result.affected!= null){
      response.success = true;
      response.data = null;
      response.message = "Cliente deletado com sucesso!";
      res.status(200).send(response);
      return;
    }else{
      response.success = false;
      response.data = null;
      response.message = "Erro ao deletar cliente";
      res.status(200).send(response);
      return;
    }

  }else{
    response.success = false;
    response.data = null;
    response.message = "Cliente não encontrado";
    res.status(200).send(response);
    return;
  }


})

router.delete('/deletar-lista-cliente', async (req:Request,res:Response) =>{
  let listaids: number[] = req.body.listaids;
  let retorno: ResponseModel = new ResponseModel;

  try {

    const response = await AppDataSource.manager.delete(ClienteEntity, { Id: In(listaids) });

    if (response.affected != 0 && response.affected != null) {

      retorno.success = true;
      retorno.message = "Cliente Excluído com Sucesso!";

      res.status(200).send(retorno);
      return;

    } else {

      retorno.success = false;
      retorno.message = "Houve um Erro Ao Excluir os Clientes!!";
      res.status(200).send(retorno);
      return;

    }
  } catch (error) {

    retorno.success = false;
    retorno.message = "Houve um Erro Ao Excluir os Clientes!! " + error;
    res.status(200).send(retorno);
    return;

  }
});

router.get('/listar-clientes/:id', async (req: Request, res: Response) => {
  let id = Number(req.params.id);
  let retorno: ResponseModel = new ResponseModel;


  const User = await AppDataSource.manager.findOne(UsuarioEntity, { where: { Id: id } });

  if (User) {
    const clientArray = await AppDataSource.manager.find(ClienteEntity, { where: { usuario: User } });


    retorno.success = true;
    retorno.data = clientArray;
    retorno.message = "Clientes encontrados com sucesso!";
    res.status(200).send(retorno);
    return;
  } else {
    retorno.success = false;
    retorno.data = null;
    retorno.message = "Clientes não encontrados";
    res.status(200).send(retorno);
    return;
  }
});

// region Fornecedor
router.post('/cadastrar-fornecedor', async (req: Request, res: Response) => {
  let response: ResponseModel = new ResponseModel();
  const { nome, contato, userId } = req.body;

  const novoFornecedor = new FornecedorEntity();

  const User = await AppDataSource.manager.findOne(UsuarioEntity, { where: { Id: userId } });


  if (User) {
    novoFornecedor.descricao = nome;
    novoFornecedor.contato = contato;
    novoFornecedor.usuario = User;

    const created = await AppDataSource.manager.save(novoFornecedor);
    if (created) {
      response.success = true;
      response.data = created;
      response.message = "Fornecedor criado com sucesso!";
      res.status(200).send(response);
      return;
    } else {
      response.success = false;
      response.data = false;
      response.message = "Erro ao criar Fornecedor";
      res.status(200).send(response);
      return;
    }

  } else {
    response.success = false;
    response.data = false;
    response.message = "Usuário não encontrado";
    res.status(200).send(response);
    return;
  }



})

router.put('/editar-fornecedor', async (req: Request, res: Response) => {
  const { IdEdit, nomeEdit, contatoEdit, usuarioId } = req.body;
  let response = new ResponseModel();



  const user = await AppDataSource.manager.findOne(UsuarioEntity, { where: { Id: usuarioId } });

  const forn = await AppDataSource.manager.findOne(FornecedorEntity, { where: { Id: Number(IdEdit) } });

  if (forn && user) {
    let edit = new FornecedorEntity();
    edit.Id = forn.Id;
    edit.descricao = nomeEdit;
    edit.contato = contatoEdit;
    edit.usuario = user;

    const result = await AppDataSource.manager.update(FornecedorEntity, edit.Id, edit);

    if (result.affected != 0 && result.affected != null) {
      response.success = true;
      response.data = edit;
      response.message = "Fornecedor editado com sucesso!";
      res.status(200).send(response);
      return;
    } else {
      response.success = false;
      response.data = false;
      response.message = "Erro ao editar Fornecedor";
      res.status(200).send(response);
      return;
    }

  }else{
    response.success = false;
    response.data = false;
    response.message = "Fornecedor / Usuário não encontrado";
    res.status(200).send(response);
    return;
  }

});

router.delete('/deletar-fornecedor',async (req:Request,res:Response) => {
  const {id} = req.body;
  let response = new ResponseModel();

  const cliente = await AppDataSource.manager.findOne(FornecedorEntity, { where:{Id: id} });

  if(cliente){

    const result = await AppDataSource.manager.delete(FornecedorEntity,{Id:id});

    if(result.affected!= 0 && result.affected!= null){
      response.success = true;
      response.data = null;
      response.message = "Fornecedor deletado com sucesso!";
      res.status(200).send(response);
      return;
    }else{
      response.success = false;
      response.data = null;
      response.message = "Erro ao deletar Fornecedor";
      res.status(200).send(response);
      return;
    }

  }else{
    response.success = false;
    response.data = null;
    response.message = "Fornecedor não encontrado";
    res.status(200).send(response);
    return;
  }


})

router.delete('/deletar-lista-fornecedor', async (req:Request,res:Response) =>{
  let listaids: number[] = req.body.listaids;
  let retorno: ResponseModel = new ResponseModel;

  try {

    const response = await AppDataSource.manager.delete(FornecedorEntity, { Id: In(listaids) });

    if (response.affected != 0 && response.affected != null) {

      retorno.success = true;
      retorno.message = "Fornecedor Excluído com Sucesso!";

      res.status(200).send(retorno);
      return;

    } else {

      retorno.success = false;
      retorno.message = "Houve um Erro Ao Excluir os Fornecedores!!";
      res.status(200).send(retorno);
      return;

    }
  } catch (error) {

    retorno.success = false;
    retorno.message = "Houve um Erro Ao Excluir os Fornecedores!! " + error;
    res.status(200).send(retorno);
    return;

  }
});

router.get('/listar-fornecedor/:id', async (req: Request, res: Response) => {
  let id = Number(req.params.id);
  let retorno: ResponseModel = new ResponseModel;


  const User = await AppDataSource.manager.findOne(UsuarioEntity, { where: { Id: id } });

  if (User) {
    const clientArray = await AppDataSource.manager.find(FornecedorEntity, { where: { usuario: User } });


    retorno.success = true;
    retorno.data = clientArray;
    retorno.message = "Clientes encontrados com sucesso!";
    res.status(200).send(retorno);
    return;
  } else {
    retorno.success = false;
    retorno.data = null;
    retorno.message = "Clientes não encontrados";
    res.status(200).send(retorno);
    return;
  }
});



module.exports = router;
