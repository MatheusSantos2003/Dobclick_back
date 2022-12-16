import "reflect-metadata";
import { Request, response, Response } from "express";
import { AppDataSource } from "../../datasource";
import { ResponseModel } from "../../models/Response.model";
import { ProdutoEntity } from "../../entity/Produto";
import { Equal, In } from "typeorm";
import { UsuarioEntity } from "../../entity/Usuario";
import { VendaEntity } from "../../entity/Venda";
import { VendaProdutoEntity } from "../../entity/VendaProduto";
import moment from "moment";
import "moment/locale/pt-br";
import { ClienteEntity } from "../../entity/Cliente";

const jwt = require("jsonwebtoken");
require("dotenv").config();
const express = require("express");
const router = express.Router();

router.post("/listar", async (req: Request, res: Response) => {
  const userId = Number(req.body.id);

  const user = await AppDataSource.manager.findOne(UsuarioEntity,{where:{Id: userId}});
  var response = new ResponseModel();

  if (isNaN(userId)) {
    response.success = false;
    response.message = "Erro: Usuário Inválido! ";
    response.data = null;
    res.status(200).send(response);
  }

  try {
 
    const VendasResponse = await AppDataSource.manager.find(VendaEntity,{where: {usuario: user as UsuarioEntity}});

    
        
    response.success = true;
    response.message = "Listado!";
    response.data = VendasResponse;
    console.log(VendasResponse);
    res.status(200).send(response);
    return;
  } catch (error) {
    response.success = false;
    response.message = "Erro: " + error;
    response.data = null;
    res.status(200).send(response);
    return;
  }
});

router.post("/cadastrar", async (req: Request, res: Response) => {
  var retorno = new ResponseModel();
  let VendaAdd = new VendaEntity();
  let VendaProdutoAdd = new VendaProdutoEntity();

  const {
    usuarioId,
    datavenda,
    quantidade,
    formaPag,
    cliente,
    produtoId,
    valorTotal,
    valorTotalDisplay,
  } = req.body.data;
  console.log(datavenda);

  const usuarioFind = await AppDataSource.manager.findOneOrFail(UsuarioEntity, {
    where: { Id: usuarioId },
  });

  const produtofind = await AppDataSource.manager.findOneOrFail(ProdutoEntity, {
    where: { Id: produtoId },
  });

  if (produtofind.estoque != null && produtofind?.estoque < quantidade) {
    retorno.success = false;
    retorno.message =
      "Quantidade atual do produto maior do que a quantidade da venda";
    retorno.data = null;
    res.status(200).send(retorno);
    return;
  }

  moment().locale("pt-br");
  var dataformatada = moment(datavenda).format("YYYY/MM/DD");

  var novadata = new Date(datavenda);

  VendaAdd.datavenda = new Date(
    novadata.getTime() - novadata.getTimezoneOffset() * -60000
  );
  VendaAdd.dataVendaDisplay = dataformatada;
  VendaAdd.cliente = cliente;
  // VendaAdd.clienteContato = contatoCliente;
  VendaAdd.formaPagamento = formaPag;
  VendaAdd.usuario = usuarioFind as UsuarioEntity;
  VendaAdd.pagamentoEfetuado = true;
  VendaAdd.produtoDisplay = produtofind?.descricao;
  VendaAdd.quantidadeDisplay = String(quantidade);
  VendaAdd.valorTotal = valorTotal;
  VendaAdd.valorTotalDisplay = valorTotalDisplay;

  const VendaAddResponse = await AppDataSource.manager.save(VendaAdd);

  if (VendaAddResponse?.Id != null) {
    VendaProdutoAdd.produto = produtofind as ProdutoEntity;
    VendaProdutoAdd.quantidade = quantidade;
    VendaProdutoAdd.valorVenda = valorTotal;
    VendaProdutoAdd.venda = VendaAddResponse;

    const VendaProdutoAddResposnse = await AppDataSource.manager.save(
      VendaProdutoAdd
    );

    produtofind.estoque = (produtofind?.estoque as number) - quantidade;

    await AppDataSource.manager.save(produtofind);

    if (VendaProdutoAddResposnse.Id != null) {
      retorno.success = true;
      retorno.message = "Sucesso ao registrar a Venda";
      retorno.data = null;
      res.status(200).send(retorno);
    }
  } else {
    retorno.success = false;
    retorno.message = "Houve um erro ao cadastrar a venda";
    retorno.data = null;
    res.status(200).send(retorno);
    return;
  }
});

router.delete("/delete", async (req: Request, res: Response) => {
  let id = req.body.id;
  let retorno: ResponseModel = new ResponseModel();

  try {
    const firstResponse = await AppDataSource.manager.findOneOrFail(
      VendaEntity,
      { where: { Id: id } }
    );

    const secondResponse = await AppDataSource.manager.findOneOrFail(
      VendaProdutoEntity,
      { where: { venda: Equal(firstResponse) } }
    );

    if (secondResponse.Id != null) {
      await AppDataSource.manager
        .getRepository(VendaProdutoEntity)
        .createQueryBuilder()
        .delete()
        .from(VendaProdutoEntity)
        .where("Id = :Id", { Id: secondResponse.Id })
        .execute();

      const response = await AppDataSource.getRepository(VendaEntity)
        .createQueryBuilder()
        .delete()
        .from(VendaEntity)
        .where("Id = :Id", { Id: id })
        .execute();

      if (response.affected != 0 && response.affected != null) {
        retorno.success = true;
        retorno.message = "Venda Excluída com Sucesso!";

        res.status(200).send(retorno);
        return;
      } else {
        retorno.success = false;
        retorno.message = "Houve um Erro Ao Excluir a Venda!!";
        console.log(response);
        res.status(200).send(retorno);
        return;
      }
    } else {
      const response = await AppDataSource.getRepository(VendaEntity)
        .createQueryBuilder()
        .delete()
        .from(VendaEntity)
        .where("Id = :Id", { Id: id })
        .execute();

      if (response.affected != 0 && response.affected != null) {
        retorno.success = true;
        retorno.message = "Venda Excluída com Sucesso!";

        res.status(200).send(retorno);
        return;
      } else {
        retorno.success = false;
        retorno.message = "Houve um Erro Ao Excluir a Venda!!";
        res.status(200).send(retorno);
        return;
      }
    }
  } catch (error) {
    retorno.success = false;
    retorno.message = "Houve um Erro Ao Excluir a Venda!! " + error;
    res.status(200).send(retorno);
    return;
  }
});

router.delete("/deleteporLista", async (req: Request, res: Response) => {
  let listaids: number[] = req.body.listaids;
  let retorno: ResponseModel = new ResponseModel();

  try {
    const response = await AppDataSource.manager.delete(VendaEntity, {
      Id: In(listaids),
    });

    if (response.affected != 0 && response.affected != null) {
      retorno.success = true;
      retorno.message = "Venda Excluída com Sucesso!";

      res.status(200).send(retorno);
      return;
    } else {
      retorno.success = false;
      retorno.message = "Houve um Erro Ao Excluir a Venda!!";
      res.status(200).send(retorno);
      return;
    }
  } catch (error) {
    retorno.success = false;
    retorno.message = "Houve um Erro Ao Excluir a Venda!! " + error;
    res.status(200).send(retorno);
    return;
  }
});

module.exports = router;
