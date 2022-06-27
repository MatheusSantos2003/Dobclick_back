import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../datasource";
import { ResponseModel } from "../../models/Response.model";
import { CompraEntity } from "../../entity/Compra";
import { UsuarioEntity } from "../../entity/Usuario";
import { ProdutoEntity } from "../../entity/Produto";
import moment from "moment";
import "moment/locale/pt-br";
import { In } from "typeorm";

require("dotenv").config();
const express = require("express");
const router = express.Router();


router.post("/cadastrar", async (req: Request, res: Response) => {
    let response: ResponseModel = new ResponseModel();
    let CompraAdd = new CompraEntity();

    const { dataCompra, formaPagamento, valorCompra,valorCompraDisplay, fornecedor, fornecedorContato, quantidade, usuarioId, produtoId } = req.body.data;

    try {
        const usuarioFind = await AppDataSource.manager.findOneOrFail(UsuarioEntity, { where: { Id: usuarioId } });
        const produtoFind = await AppDataSource.manager.findOneOrFail(ProdutoEntity, { where: { Id: produtoId } });

        moment().locale('pt-br');
        var dataformatada = moment(dataCompra).format('L');

        CompraAdd.dataCompra = dataCompra;
        CompraAdd.dataCompraDisplay = dataformatada;
        CompraAdd.formaPagamento = formaPagamento;
        CompraAdd.pagamentoEfetuado = true;
        CompraAdd.valorCompraDisplay = valorCompraDisplay;
        CompraAdd.valorCompra = valorCompra;
        CompraAdd.fornecedor = fornecedor;
        CompraAdd.fornecedorContato = fornecedorContato;
        CompraAdd.quantidade = quantidade;
        CompraAdd.usuario = usuarioFind;
        CompraAdd.produto = produtoFind;
        CompraAdd.produtoDisplay = produtoFind.descricao;

        await AppDataSource.manager.save(CompraAdd);

        var valuetoAdd: number = Number(quantidade);
        produtoFind.estoque = produtoFind.estoque as number;
        produtoFind.estoque = produtoFind.estoque  += valuetoAdd;

        await AppDataSource.manager.save(produtoFind);

        response.success = true;
        response.message = "Cadastrado!";
        response.data = "Cadastrado";

        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        response.success = false;
        response.message = "Houve um erro ao Cadastrar a Compra!";
        response.data = null;

        res.status(200).send(response);
    }
});

router.post('/listar', async (req: Request, res: Response) => {
    let response = new ResponseModel();
    var usuarioId = req.body.usuarioId;

    try {
        const usuario = await AppDataSource.manager.findOneOrFail(UsuarioEntity, { where: { Id: usuarioId } });

        const resultado = await AppDataSource.manager.find(CompraEntity, { where: { usuario: usuario } });


        response.success = true;
        response.data = resultado;
        response.message = "listado com sucesso!";  
        res.status(200).send(response);
    } catch (error) {

        response.success = false;
        response.data = null;
        response.message = "Erro! "+error;
        res.status(200).send(response);
    }
});

router.delete('/delete', async (req:Request, res:Response) => {   
    let id = req.body.id;
    let retorno: ResponseModel = new ResponseModel;
  
    try {
  
      const response = await AppDataSource.getRepository(CompraEntity).createQueryBuilder().delete().from(CompraEntity)
        .where("Id = :Id", { Id: id })
        .execute()
  
      if (response.affected != 0 && response.affected != null) {
        retorno.success = true;
        retorno.message = "Compra Excluído com Sucesso!";
  
        res.status(200).send(retorno);
        return;
      } else {
        retorno.success = false;
        retorno.message = "Houve um Erro Ao Excluir a Compra!!";
        res.status(200).send(retorno);
        return;
      }
  
    } catch (error) {
      retorno.success = false;
      retorno.message = "Houve um Erro Ao Excluir a Compra!! " + error;
      res.status(200).send(retorno);
      return;
    }
 });

 router.delete('/deleteporLista', async (req:Request, res:Response) => {   

    let listaids: number[] = req.body.listaids;
  let retorno: ResponseModel = new ResponseModel;

  try {

    const response = await AppDataSource.manager.delete(CompraEntity, { Id: In(listaids) });

    if (response.affected != 0 && response.affected != null) {

      retorno.success = true;
      retorno.message = "Compra Excluída com Sucesso!";

      res.status(200).send(retorno);
      return;

    } else {

      retorno.success = false;
      retorno.message = "Houve um Erro Ao Excluir a Compra!!";
      res.status(200).send(retorno);
      return;

    }
  } catch (error) {

    retorno.success = false;
    retorno.message = "Houve um Erro Ao Excluir a Compra!! " + error;
    res.status(200).send(retorno);
    return;

  }

});







module.exports = router;
