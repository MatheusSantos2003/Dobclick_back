import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../datasource";
import { ResponseModel } from "../../models/Response.model";
import { CompraEntity } from "../../entity/Compra";
import { UsuarioEntity } from "../../entity/Usuario";
import { ProdutoEntity } from "../../entity/Produto";

require("dotenv").config();
const express = require("express");
const router = express.Router();


router.post("/cadastrar", async (req: Request, res: Response) => {
    let response: ResponseModel = new ResponseModel();
    let CompraAdd = new CompraEntity();

    const {dataCompra, pagamentoEfetuado, formaPagamento, valorTotal, valorCompra, fornecedor, fornecedorContato, quantidade, usuarioId, produtoId} = req.body.data;

    try {
        const usuarioFind = await AppDataSource.manager.findOneOrFail(UsuarioEntity, { where: { Id: usuarioId } });
        const produtoFind = await AppDataSource.manager.findOneOrFail(ProdutoEntity, { where: { Id: produtoId } });


        CompraAdd.dataCompra = dataCompra;
        CompraAdd.formaPagamento = formaPagamento;
        CompraAdd.pagamentoEfetuado = pagamentoEfetuado;
        CompraAdd.valorTotal = valorTotal;
        CompraAdd.valorCompra = valorCompra;
        CompraAdd.fornecedor = fornecedor;
        CompraAdd.fornecedorContato = fornecedorContato;
        CompraAdd.quantidade = quantidade;
        CompraAdd.usuario = usuarioFind;
        CompraAdd.produto = produtoFind;

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
})










module.exports = router;
