import "reflect-metadata";
import { Request, response, Response } from "express";
import { AppDataSource } from "../../datasource";
import { ResponseModel } from "../../models/Response.model";
import { ProdutoEntity } from "../../entity/Produto";
import { In } from "typeorm";
import { UsuarioEntity } from "../../entity/Usuario";
import { VendaEntity } from "../../entity/Venda";
import { VendaProdutoEntity } from "../../entity/VendaProduto";
import moment from 'moment';
import "moment/locale/pt-br";

const jwt = require('jsonwebtoken');
require("dotenv").config();
const express = require("express");
const router = express.Router();

router.post("/listar", async (req: Request, res: Response) => {
    const userId = Number(req.body.id);
    var response = new ResponseModel();

    if (isNaN(userId)) {
        response.success = false;
        response.message = "Erro: Usuário Inválido! ";
        response.data = null;
        res.status(200).send(response);
    }

    try {
        const VendasResponse = await AppDataSource.createQueryBuilder().select("*").from(VendaEntity, "venda").where(' venda.usuarioId = :id', { id: userId }).orderBy("venda.Id").execute();

        response.success = true;
        response.message = "Listado!";
        response.data = VendasResponse;
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


router.post('/cadastrar', async (req: Request, res: Response) => {
    var retorno = new ResponseModel();
    let VendaAdd = new VendaEntity();
    let VendaProdutoAdd = new VendaProdutoEntity();

    const { usuarioId, datavenda, quantidade, formaPag, cliente, contatoCliente, produtoId, valorTotal, valorTotalDisplay } = req.body.data;

    const usuarioFind = await AppDataSource.manager.findOne(UsuarioEntity, { where: { Id: usuarioId } });

    const produtofind = await AppDataSource.manager.findOne(ProdutoEntity, { where: { Id: produtoId } });


    moment().locale('pt-br');
    var dataformatada = moment(datavenda).format('L');


    VendaAdd.datavenda = new Date(datavenda);
    VendaAdd.dataVendaDisplay = dataformatada;
    VendaAdd.cliente = cliente;
    VendaAdd.clienteContato = contatoCliente;
    VendaAdd.formaPagamento = formaPag;
    VendaAdd.usuario = usuarioFind as UsuarioEntity;
    VendaAdd.pagamentoEfetuado = true;
    VendaAdd.produtoDisplay = produtofind?.descricao;
    VendaAdd.quantidadeDisplay = String(quantidade);
    VendaAdd.valorTotal = valorTotal
    VendaAdd.valorTotalDisplay = valorTotalDisplay;

    const VendaAddResponse = await AppDataSource.manager.save(VendaAdd);

    if (VendaAddResponse?.Id != null) {



        VendaProdutoAdd.produto = produtofind as ProdutoEntity;
        VendaProdutoAdd.quantidade = quantidade;
        VendaProdutoAdd.valorVenda = valorTotal;
        VendaProdutoAdd.venda = VendaAddResponse;

        const VendaProdutoAddResposnse = await AppDataSource.manager.save(VendaProdutoAdd);

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
        res.status(200).send(retorno)
        return;
    }
});

router.delete('/delete', async (req: Request, res: Response) => {

});

router.delete('/deleporLista', async (req: Request, res: Response) => {

});

module.exports = router;