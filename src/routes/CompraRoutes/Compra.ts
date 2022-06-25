import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../datasource";
import { ResponseModel } from "../../models/Response.model";
import { CompraEntity } from "../../entity/Compra";
import { UsuarioEntity } from "../../entity/Usuario";
import { ProdutoEntity } from "../../entity/Produto";
import moment from "moment";
import "moment/locale/pt-br";

require("dotenv").config();
const express = require("express");
const router = express.Router();


router.post("/cadastrar", async (req: Request, res: Response) => {
    let response: ResponseModel = new ResponseModel();
    let CompraAdd = new CompraEntity();

    const { dataCompra, pagamentoEfetuado, formaPagamento, valorTotal, valorCompra, fornecedor, fornecedorContato, quantidade, usuarioId, produtoId } = req.body.data;

    try {
        const usuarioFind = await AppDataSource.manager.findOneOrFail(UsuarioEntity, { where: { Id: usuarioId } });
        const produtoFind = await AppDataSource.manager.findOneOrFail(ProdutoEntity, { where: { Id: produtoId } });

        moment().locale('pt-br');
        var dataformatada = moment(dataCompra).format('L');

        CompraAdd.dataCompra = dataCompra;
        CompraAdd.dataCompraDisplay = dataformatada;
        CompraAdd.formaPagamento = formaPagamento;
        CompraAdd.pagamentoEfetuado = pagamentoEfetuado;
        CompraAdd.valorTotal = valorTotal;
        CompraAdd.valorTotalDisplay = String(valorTotal);1
        CompraAdd.valorCompra = valorCompra;
        CompraAdd.fornecedor = fornecedor;
        CompraAdd.fornecedorContato = fornecedorContato;
        CompraAdd.quantidade = quantidade;
        CompraAdd.usuario = usuarioFind;
        CompraAdd.produto = produtoFind;
        CompraAdd.produtoDisplay = produtoFind.descricao;

        console.log(CompraAdd);

        await AppDataSource.manager.save(CompraAdd);

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










module.exports = router;
