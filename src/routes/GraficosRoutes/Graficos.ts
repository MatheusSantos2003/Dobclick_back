import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../datasource";
import { ResponseModel } from "../../models/Response.model";
import { VendaEntity } from "../../entity/Venda";
import { ProdutoEntity } from "../../entity/Produto";

require("dotenv").config();
const express = require("express");
const router = express.Router();


router.post('/obterDadosGraficos', async (req: Request, res: Response) => {
    let response: ResponseModel = new ResponseModel();
    let dataInicialSemana: Date;
    let dataFinalSemana: Date;

    var usuarioId = req.body.usuarioId;



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




    ///////////////////////////////////////////////////////////////
    var vendasDomingo: number = 0;
    var comprasDomingo: number = 0;


    var resultDomingo: Array<any> = await AppDataSource.manager.query(
        'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2'
        , [usuarioId, domingo]
    )


    var resultCompraDomingo: Array<any> = await AppDataSource.manager.query(
        'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
        [usuarioId, domingo]
    )


    resultDomingo.forEach((venda) => {
        vendasDomingo += venda.ValorVenda;
    })

    resultCompraDomingo.forEach((compra) => {
        comprasDomingo += compra.valorTotal;
    });

    var lucroDomingo = vendasDomingo - comprasDomingo;
    ///////////////////////////////////////////////////////////////



    ///////////////////////////////////////////////////////////////
    var vendasSegunda: number = 0;
    var comprasSegunda: number = 0;


    var resultSegunda: Array<any> = await AppDataSource.manager.query(
        'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2'
        , [usuarioId, segunda]
    )


    var resultCompraSegunda: Array<any> = await AppDataSource.manager.query(
        'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
        [usuarioId, segunda]
    )


    resultSegunda.forEach((venda) => {
        vendasSegunda += venda.ValorVenda;
    })

    resultCompraSegunda.forEach((compra) => {
        comprasSegunda += compra.valorTotal;
    });

    var lucroSegunda = vendasSegunda - comprasSegunda;

    ///////////////////////////////////////////////////////////////



    ///////////////////////////////////////////////////////////////
    var vendasTerca: number = 0;
    var comprasTerca: number = 0;


    var resultTerca: Array<any> = await AppDataSource.manager.query(
        'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2'
        , [usuarioId, terca]
    )

    var resultCompraTerca: Array<any> = await AppDataSource.manager.query(
        'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
        [usuarioId, terca]
    )


    resultTerca.forEach((venda) => {
        vendasTerca += venda.ValorVenda;
    })

    resultCompraTerca.forEach((compra) => {
        comprasTerca += compra.valorTotal;
    });

    var lucroTerca = vendasTerca - comprasTerca;

    ///////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////
    var vendasQuarta: number = 0;
    var comprasQuarta: number = 0;


    var resultQuarta: Array<any> = await AppDataSource.manager.query(
        'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2'
        , [usuarioId, quarta]
    )

    var resultCompraQuarta: Array<any> = await AppDataSource.manager.query(
        'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
        [usuarioId, quarta]
    )


    resultQuarta.forEach((venda) => {
        vendasQuarta += venda.ValorVenda;
    })

    resultCompraQuarta.forEach((compra) => {
        comprasQuarta += compra.valorTotal;
    });

    var lucroQuarta = vendasQuarta - comprasQuarta;

    ///////////////////////////////////////////////////////////////



    ///////////////////////////////////////////////////////////////
    var vendasQuinta: number = 0;
    var comprasQuinta: number = 0;


    var resultQuinta: Array<any> = await AppDataSource.manager.query(
        'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2'
        , [usuarioId, quinta]
    )

    var resultComprasQuinta: Array<any> = await AppDataSource.manager.query(
        'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
        [usuarioId, quinta]
    )


    resultQuinta.forEach((venda) => {
        vendasQuinta += venda.ValorVenda;
    })

    resultComprasQuinta.forEach((compra) => {
        comprasQuinta += compra.valorTotal;
    });

    var lucroQuinta = vendasQuinta - comprasQuinta;
    ///////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////
    var vendasSexta: number = 0;
    var comprasSexta: number = 0;


    var resultSexta: Array<any> = await AppDataSource.manager.query(
        'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2'
        , [usuarioId, sexta]
    )

    var resultComprasSexta: Array<any> = await AppDataSource.manager.query(
        'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
        [usuarioId, sexta]
    )


    resultSexta.forEach((venda) => {
        vendasSexta += venda.ValorVenda;
    })

    resultComprasSexta.forEach((compra) => {
        comprasSexta += compra.valorTotal;
    });

    var lucroSexta = vendasSexta - comprasSexta;
    ///////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////
    var vendasSabado: number = 0;
    var comprasSabado: number = 0;


    var resultSabado: Array<any> = await AppDataSource.manager.query(
        'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2'
        , [usuarioId, sabado]
    )

    var resultComprasSabado: Array<any> = await AppDataSource.manager.query(
        'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
        [usuarioId, sabado]
    )


    resultSabado.forEach((venda) => {
        vendasSabado += venda.ValorVenda;
    })

    resultComprasSabado.forEach((compra) => {
        comprasSabado += compra.valorTotal;
    });

    var lucroSabado = vendasSabado - comprasSabado;



    const RetornoGraficoSemanaOptions = [lucroDomingo, lucroSegunda, lucroTerca, lucroQuarta, lucroQuinta, lucroSexta, lucroSabado];


    var produtoComMaiorVendaSemana = await AppDataSource.manager.query('SELECT MAX(vendaProduto.quantidade), vendaProduto."produtoId", venda."usuarioId" FROM public."Venda" venda' +
        ' INNER JOIN public."VendaProduto" vendaProduto ON vendaProduto."vendaId" = venda."Id"' +
        " WHERE venda.datavenda BETWEEN SYMMETRIC $1 AND $2 " +
        ' AND venda."usuarioId" = $3' +
        ' GROUP BY vendaProduto."produtoId",venda."usuarioId" '
        , [domingo, sabado, usuarioId]);



    var IdProduto = produtoComMaiorVendaSemana[0]?.produtoId;

    var resultado: Array<any> = await AppDataSource.manager.query('SELECT produto."descricao",vendaProduto.quantidade  FROM "Produto" produto ' +
        ' INNER JOIN "VendaProduto" vendaProduto ON vendaProduto."produtoId" = produto."Id" ' +
        ' INNER JOIN "Venda" venda ON vendaProduto."vendaId" = venda."Id" ' +
        ' WHERE produto."Id" = $1 AND produto."usuarioId" = $2' +
        ' AND venda.datavenda BETWEEN SYMMETRIC' + " $3 AND $4 ",
        [IdProduto, usuarioId, domingo, sabado]);

    var ProdutoNome: String = resultado[0]?.descricao;

    var Quantidades: Array<number> = resultado.map((res) => {
        return res.quantidade;
    });

    var ProdutoMaisVendidoObject =
    {
        "name": ProdutoNome,
        "data": Quantidades
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var produtoEstoqueCritico: ProdutoEntity = new ProdutoEntity();
    var produtoEstoqueAtencao: ProdutoEntity = new ProdutoEntity();

    var resultProdutosEstoqueBaixo: Array<ProdutoEntity> = await AppDataSource.manager.
        createQueryBuilder()
        .select("*")
        .from(ProdutoEntity, "produto")
        .where("produto.usuarioId = :id", { id: usuarioId }).orderBy("produto.estoque", "ASC").execute();



    var RetornoProdutoEstoqueCritico;
    var RetornoProdutoEstoqueAtencao;

    if (resultProdutosEstoqueBaixo.length > 0) {

        if (resultProdutosEstoqueBaixo.length == 1) {
            produtoEstoqueCritico = resultProdutosEstoqueBaixo[0];
            RetornoProdutoEstoqueCritico = produtoEstoqueCritico;
            RetornoProdutoEstoqueAtencao = null

        } else {
            produtoEstoqueCritico = resultProdutosEstoqueBaixo[0];
            produtoEstoqueAtencao = resultProdutosEstoqueBaixo[1];

            RetornoProdutoEstoqueCritico = produtoEstoqueCritico;
            RetornoProdutoEstoqueAtencao = produtoEstoqueAtencao;
        }


    } else {

        RetornoProdutoEstoqueCritico = null;
        RetornoProdutoEstoqueAtencao = null;

    }


    response.success == true;
    response.message = "Listado!";
    response.data = {
        "GraficoSemana": RetornoGraficoSemanaOptions,
        "MaisVendidoSemana": ProdutoMaisVendidoObject,
        "EstoqueCritico": RetornoProdutoEstoqueCritico,
        "EstoqueAtencao": RetornoProdutoEstoqueAtencao

    }
    res.status(200).send(response);
})





module.exports = router;