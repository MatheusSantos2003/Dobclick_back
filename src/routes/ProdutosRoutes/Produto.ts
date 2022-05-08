import "reflect-metadata";
import { Request, response, Response } from "express";
import { AppDataSource } from "../../datasource";
import { ResponseModel } from "../../models/Response.model";
import { ProdutoEntity } from "../../entity/Produto";

const jwt = require('jsonwebtoken');
require("dotenv").config();
const express = require("express");
const router = express.Router();


router.get("/", async (req: Request, res: Response) => {
    const usuariosResponse = await AppDataSource.manager.find(ProdutoEntity);
    var response = new ResponseModel();
    response.success = true;
    response.message = "Listado!";
    response.data = usuariosResponse;
    res.status(200).send(response);
  });


router.post("/cadastrar", async (req:Request, res: Response) => {
 
    const ProdutoAdd = new ProdutoEntity();
    let retorno: ResponseModel = new ResponseModel;

    //procura se produto com código igual existe
    let produto = await AppDataSource.manager.findOne(ProdutoEntity, { where: { codigo : req.body.data.codigo } });

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
        ProdutoAdd.cor = req.body.data.cor;
        ProdutoAdd.estoque = req.body.data.estoque;
      
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


  module.exports = router;