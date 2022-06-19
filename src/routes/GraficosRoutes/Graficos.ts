import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../datasource";
import { ResponseModel } from "../../models/Response.model";
import { VendaEntity } from "../../entity/Venda";

require("dotenv").config();
const express = require("express");
const router = express.Router();


router.post('/obterDadosGraficos', async (req: Request, res: Response) => {
    let response: ResponseModel = new ResponseModel();
    let dataInicialSemana: Date;
    let dataFinalSemana: Date;

    // var usuarioId = req.body.data.usuarioId;

    var usuarioId = 3;

    var DataAtual = new Date();


    // se a data atual for domingo
    if (DataAtual.getDay() == 0) {
        dataInicialSemana = new Date(DataAtual);
        dataFinalSemana = new Date(DataAtual);
        dataFinalSemana.setDate(dataFinalSemana.getDate() + 6);
        //   res.status(200).send({ "dataInicial": dataInicialSemana, "dataFinal": dataFinalSemana });
    } else {
        //se nao for
        var first = new Date();
        var last = new Date();
        var quantidadeASubtrair = DataAtual.getDay();
        first.setDate(DataAtual.getDate() - quantidadeASubtrair);
        last.setDate(first.getDate() + 6);
        dataInicialSemana = first;
        dataFinalSemana = last;
        // res.status(200).send({ "dataInicial": dataInicialSemana, "dataFinal": dataFinalSemana });
    }

    var domingo = new Date();
    var segunda = new Date();
    var terca = new Date();
    var quarta = new Date();
    var quinta = new Date();
    var sexta = new Date();
    var sabado = new Date();

    domingo = dataInicialSemana;
    segunda.setDate(dataInicialSemana.getDate() + 1);
    terca.setDate(dataInicialSemana.getDate() + 2);
    quarta.setDate(dataInicialSemana.getDate() + 3);
    quinta.setDate(dataInicialSemana.getDate() + 4);
    sexta.setDate(dataInicialSemana.getDate() + 5);
    sabado = dataFinalSemana;



    var vendasDomingo:number = 0;
    var comprasDomingo:number = 0;


    var resultDomingo: Array<any> = await  AppDataSource.manager.query(
        'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2'
        ,[usuarioId,domingo]
    )

    var resultCompraDomingo: Array<any> = await AppDataSource.manager.query(
        'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
        [usuarioId,domingo]
    )
        
    resultDomingo.forEach((venda)=>{
            vendasDomingo += venda.ValorVenda;
        })

        resultCompraDomingo.forEach((compra)=>{
            comprasDomingo += compra.valorTotal;
        })


    res.status(200).send({"vendasDomingo":vendasDomingo,"comprasDomingo":comprasDomingo})

    // res.status(200).send(
    //     {
    //         "domingo": domingo,
    //         "segunda": segunda,
    //         "terça":terca,
    //         "quarta":quarta,
    //         "quinta":quinta,
    //         "sexta":sexta,
    //         "sábado":sabado
    //     }
    //     );




})





module.exports = router;