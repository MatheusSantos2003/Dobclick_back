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

  const user = await AppDataSource.manager.findOne(UsuarioEntity, { where: { Id: userId } });
  var response = new ResponseModel();

  if (isNaN(userId)) {
    response.success = false;
    response.message = "Erro: Usuário Inválido! ";
    response.data = null;
    res.status(200).send(response);
  }

  try {

    // const VendasResponse = await AppDataSource.manager.find(VendaEntity, { where: { usuario: user as UsuarioEntity } });
    const clientes = await AppDataSource.manager.find(ClienteEntity, { where: { usuario: user as UsuarioEntity } });


    const QueryResponse = await AppDataSource.manager.createQueryBuilder().select("venda.Id as vendaId,venda.*,cliente.*").from(VendaEntity, "venda").innerJoin(ClienteEntity, "cliente", "cliente.Id = venda.clienteId ").where(' venda.usuarioId = :id', { id: userId }).execute();



    const dataToReturn: any[] = [];

    for await (const venda of QueryResponse) {


      venda.Id = venda.vendaid;
      dataToReturn.push({ ...venda, "clienteDesc": venda.nome });
    }



    response.success = true;
    response.message = "Listado!";
    response.data = dataToReturn;
    res.status(200).send(response);
    return;
  } catch (error) {
    response.success = false;
    response.message = "Erro: " + error;
    response.data = null;
    // console.log(response);
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


  const usuarioFind = await AppDataSource.manager.findOneOrFail(UsuarioEntity, {
    where: { Id: usuarioId },
  });

  const produtofind = await AppDataSource.manager.findOneOrFail(ProdutoEntity, {
    where: { Id: produtoId },
  });

  const clienteFind = await AppDataSource.manager.findOneOrFail(ClienteEntity, {
    where: { Id: cliente.Id },
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
  VendaAdd.cliente = clienteFind;
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

router.post("/cadastrar-lista", async (req: Request, res: Response) => {
  let response: ResponseModel = new ResponseModel();
  let VendaAdd = new VendaEntity();
  let VendaProdutoAdd = new VendaProdutoEntity();


  const data = req.body.data as any[];


  // console.log(data);
  const dataToAdd: VendaEntity[] = [];

  const usuarioFind = await AppDataSource.manager.find(UsuarioEntity, { where: { Id: data[0].usuarioId } });
  const produtoFind = await AppDataSource.manager.find(ProdutoEntity, { where: { usuario: usuarioFind[0].Id as UsuarioEntity } });
  const clienteFind = await AppDataSource.manager.find(ClienteEntity, { where: { usuario: usuarioFind[0].Id as UsuarioEntity } });


  new Promise<void>(async (resolve, reject) => {

    for await (const dados of data) {
      let clie = clienteFind.find((x) => x.Id === dados.cliente);
      let usu = usuarioFind.find((x) => x.Id === dados.usuarioId);
      let prod = produtoFind.find((x) => x.Id === dados.produtoId);

      VendaAdd = new VendaEntity();
      var dataformatada = moment(dados.datavenda).format('L');
      VendaAdd.datavenda = dados.datavenda;
      VendaAdd.dataVendaDisplay = dataformatada;
      VendaAdd.formaPagamento = Number(dados.formaPag);
      VendaAdd.pagamentoEfetuado = true;
      VendaAdd.valorTotalDisplay = dados.valorTotalDisplay;
      VendaAdd.valorTotal = dados.valorTotal;
      VendaAdd.cliente = clie as ClienteEntity;

      VendaAdd.quantidadeDisplay = String(dados.quantidade);
      VendaAdd.usuario = usu as UsuarioEntity;
      // VendaAdd.produto = prod as ProdutoEntity;
      VendaAdd.produtoDisplay = (prod as ProdutoEntity).descricao;


      const resposta = await AppDataSource.manager.save(VendaAdd);

      if (resposta.Id != null) {

        const vendasGet = await AppDataSource.manager.findOne(VendaEntity, { where: { Id: resposta.Id } });

        VendaProdutoAdd.produto = prod as ProdutoEntity;
        VendaProdutoAdd.quantidade = dados.quantidade;
        VendaProdutoAdd.valorVenda = vendasGet?.valorTotal;
        VendaProdutoAdd.venda = vendasGet as VendaEntity;

        await AppDataSource.manager.save(VendaProdutoAdd);

        (prod as ProdutoEntity).estoque = (prod?.estoque as number) - dados.quantidade;

        await AppDataSource.manager.save(prod as ProdutoEntity);

      }
    }
    resolve();






    // if (resposta.raw != null) {
    //   resolve();
    // } else {
    //   reject();
    // }

  }).then(() => {
    response.success = true;
    response.data = null;
    response.message = "Produto Cadastrado com sucessso!"
    res.status(200).send(response);
    return;
  });
})

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
        // console.log(response);
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

  // console.log(req.body);
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
