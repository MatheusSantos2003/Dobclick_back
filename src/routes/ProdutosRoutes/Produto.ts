import "reflect-metadata";
import { Request, response, Response } from "express";
import { AppDataSource } from "../../datasource";
import { ResponseModel } from "../../models/Response.model";
import { ProdutoEntity } from "../../entity/Produto";
import { In } from "typeorm";
import { UsuarioEntity } from "../../entity/Usuario";

const jwt = require('jsonwebtoken');
require("dotenv").config();
const express = require("express");
const router = express.Router();


router.post("/listar", async (req: Request, res: Response) => {
  const userId = Number(req.body.id);
  var response = new ResponseModel();

  if(isNaN(userId)){
    response.success = false;
    response.message = "Erro: Usuário Inválido! " ;
    response.data = null;
    res.status(200).send(response);
  }

  try {
    const usuariosResponse = await AppDataSource.createQueryBuilder().select("*").from(ProdutoEntity, "produto").where(' produto.usuarioId = :id', { id: userId }).orderBy("produto.codigo").execute();
    response.success = true;
    response.message = "Listado!";
    response.data = usuariosResponse;
    res.status(200).send(response);
  } catch (error) {
    response.success = false;
    response.message = "Erro: " + error;
    response.data = null;
    res.status(200).send(response);
  }
});

router.get("/consultar/:id", async (req: Request, res: Response) => {
  let id = Number(req.params.id);
  let retorno: ResponseModel = new ResponseModel;

  try {

    const produto = await AppDataSource.manager.findOne(ProdutoEntity, { where: { Id: id } });

    if (produto?.Id) {

      retorno.success = true;
      retorno.data = produto;
      retorno.message = "Sucesso!";
      console.log(retorno.data);
      res.status(200).send(retorno);
      return;

    } else {

      retorno.success = false;
      retorno.message = "Não Foi Possivel Encontrar o Produto!";
      res.status(200).send(retorno);
      return;

    }

  } catch (error) {

    retorno.success = false;
    retorno.message = "Não Foi Possivel Encontrar o Produto!";
    res.status(200).send(retorno);
    return;

  }
});


router.put("/editar", async (req: Request, res: Response) => {
  const ProdutoEdit = new ProdutoEntity();
  let retorno: ResponseModel = new ResponseModel;

  try {

    ProdutoEdit.Id = Number(req.body.data.Id);
    ProdutoEdit.codigo = req.body.data.codigo;
    ProdutoEdit.descricao = req.body.data.descricao;
    ProdutoEdit.tamanho = req.body.data.tamanho;
    ProdutoEdit.genero = req.body.data.genero;
    ProdutoEdit.marca = req.body.data.marca;
    ProdutoEdit.cor = req.body.data.cor;
    ProdutoEdit.estoque = req.body.data.estoque;
    ProdutoEdit.fornecedorId = Number(req.body.data.fornecedorId);


    const response = await AppDataSource.manager.update(ProdutoEntity, { Id: ProdutoEdit.Id }, ProdutoEdit);

    if (response.affected != 0 && response.affected != null) {

      retorno.success = true;
      retorno.message = "Produto Editado com Sucesso!";
      res.status(200).send(retorno);
      return;

    } else {

      retorno.success = false;
      retorno.message = "Não foi possível editar o Produto!";
      res.status(200).send(retorno);
      return;

    }
  } catch (error) {
    retorno.success = false;
    retorno.message = "Não foi possível editar o Produto! " + error;
    res.status(200).send(retorno);
    return;
  }


});


router.post("/cadastrar", async (req: Request, res: Response) => {

  const ProdutoAdd = new ProdutoEntity();
  let retorno: ResponseModel = new ResponseModel;

  //procura se produto com código igual existe
  let usuario = await AppDataSource.manager.findOne(UsuarioEntity, { where: { Id: req.body.data.usuarioId } })
  let produto: ProdutoEntity | null = await AppDataSource.createQueryBuilder().select("produto").from(ProdutoEntity,"produto")
  .where("produto.codigo = :cod",{cod: req.body.data.codigo}).andWhere("produto.usuarioId = :id",{id: usuario?.Id}).getOne();


  
  // //req.body.data.codigousuario
  if (produto?.Id) {

    retorno.message = "Código de produto já Cadastrado!!!";
    retorno.success = false;
    res.status(200).send(retorno);
    return;

  }

  try {
    ProdutoAdd.codigo = req.body.data.codigo;
    ProdutoAdd.descricao = req.body.data.descricao;
    ProdutoAdd.tamanho = req.body.data.tamanho;
    ProdutoAdd.genero = req.body.data.genero;
    ProdutoAdd.marca = req.body.data.marca;
    ProdutoAdd.cor = req.body.data.cor;
    ProdutoAdd.estoque = req.body.data.estoque;
    ProdutoAdd.fornecedorId = req.body.data.fornecedorId;
    ProdutoAdd.usuario = usuario;
      
        const response = await AppDataSource.manager.save(ProdutoAdd);

    if (response) {

      retorno.success = true;
      retorno.data = response;
      retorno.message = "Produto Cadastrado com sucessso!"
      res.status(200).send(retorno);
      return;

    } else {

      retorno.success = false;
      retorno.data = null;
      retorno.message = "Não foi Possivel Adicionar o Produto!";

      res.status(200).send(retorno);
      return;

    }
  } catch (error) {
    res.status(200).send(error);
    return;
  }




});


router.delete("/", async (req: Request, res: Response) => {
  let id = req.body.id;
  let retorno: ResponseModel = new ResponseModel;

  try {

    const response = await AppDataSource.getRepository(ProdutoEntity).createQueryBuilder().delete().from(ProdutoEntity)
      .where("Id = :Id", { Id: id })
      .execute()

    if (response.affected != 0 && response.affected != null) {
      retorno.success = true;
      retorno.message = "Produto Excluído com Sucesso!";

      res.status(200).send(retorno);
      return;
    } else {
      retorno.success = false;
      retorno.message = "Houve um Erro Ao Excluir o Produto!!";
      res.status(200).send(retorno);
      return;
    }

  } catch (error) {
    retorno.success = false;
    retorno.message = "Houve um Erro Ao Excluir o Produto!! " + error;
    res.status(200).send(retorno);
    return;
  }
});

router.delete("/deletarPorLista", async (req: Request, res: Response) => {
  let listaids: number[] = req.body.listaids;
  let retorno: ResponseModel = new ResponseModel;

  try {

    const response = await AppDataSource.manager.delete(ProdutoEntity, { Id: In(listaids) });

    if (response.affected != 0 && response.affected != null) {

      retorno.success = true;
      retorno.message = "Produto Excluído com Sucesso!";

      res.status(200).send(retorno);
      return;

    } else {

      retorno.success = false;
      retorno.message = "Houve um Erro Ao Excluir o Produto!!";
      res.status(200).send(retorno);
      return;

    }
  } catch (error) {

    retorno.success = false;
    retorno.message = "Houve um Erro Ao Excluir o Produto!! " + error;
    res.status(200).send(retorno);
    return;

  }
});


module.exports = router;