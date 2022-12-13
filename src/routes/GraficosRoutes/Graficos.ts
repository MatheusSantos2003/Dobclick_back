import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../datasource";
import { ResponseModel } from "../../models/Response.model";
import { VendaEntity } from "../../entity/Venda";
import { ProdutoEntity } from "../../entity/Produto";
import { DateUtils } from '../../utils/dateUtils'


require("dotenv").config();
const dateUtils = new DateUtils();
const express = require("express");
const router = express.Router();

router.post("/obterDadosGraficos", async (req: Request, res: Response) => {
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
    'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2',
    [usuarioId,dateUtils.convertToYYYYMMDD(domingo)]
  );
  
  
  

  var resultCompraDomingo: Array<any> = await AppDataSource.manager.query(
    'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
    [usuarioId, dateUtils.convertToYYYYMMDD(domingo)]
  );


  resultDomingo.forEach((venda) => {
    vendasDomingo += venda.ValorVenda;
  });

  resultCompraDomingo.forEach((compra) => {
    comprasDomingo += compra.valorTotal;
  });

  var lucroDomingo = vendasDomingo - comprasDomingo;
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  var vendasSegunda: number = 0;
  var comprasSegunda: number = 0;

  var resultSegunda: Array<any> = await AppDataSource.manager.query(
    'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2',
    [usuarioId, dateUtils.convertToYYYYMMDD(segunda)]
  );

  var resultCompraSegunda: Array<any> = await AppDataSource.manager.query(
    'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
    [usuarioId, dateUtils.convertToYYYYMMDD(segunda)]
  );

  resultSegunda.forEach((venda) => {
    vendasSegunda += venda.ValorVenda;
  });

  resultCompraSegunda.forEach((compra) => {
    comprasSegunda += compra.valorTotal;
  });

  var lucroSegunda = vendasSegunda - comprasSegunda;

  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  var vendasTerca: number = 0;
  var comprasTerca: number = 0;

  var resultTerca: Array<any> = await AppDataSource.manager.query(
    'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2',
    [usuarioId, dateUtils.convertToYYYYMMDD(terca)]
  );

  var resultCompraTerca: Array<any> = await AppDataSource.manager.query(
    'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
    [usuarioId, dateUtils.convertToYYYYMMDD(terca)]
  );

  resultTerca.forEach((venda) => {
    vendasTerca += venda.ValorVenda;
  });


  resultCompraTerca.forEach((compra) => {
    comprasTerca += compra.valorCompra;
  });



  var lucroTerca = vendasTerca - comprasTerca;

  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  var vendasQuarta: number = 0;
  var comprasQuarta: number = 0;

  var resultQuarta: Array<any> = await AppDataSource.manager.query(
    'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2',
    [usuarioId, dateUtils.convertToYYYYMMDD(quarta)]
  );

  var resultCompraQuarta: Array<any> = await AppDataSource.manager.query(
    'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
    [usuarioId, dateUtils.convertToYYYYMMDD(quarta)]
  );

  resultQuarta.forEach((venda) => {
    vendasQuarta += venda.ValorVenda;
  });

  resultCompraQuarta.forEach((compra) => {
    comprasQuarta += compra.valorTotal;
  });

  var lucroQuarta = vendasQuarta - comprasQuarta;

  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  var vendasQuinta: number = 0;
  var comprasQuinta: number = 0;

  var resultQuinta: Array<any> = await AppDataSource.manager.query(
    'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2',
    [usuarioId, dateUtils.convertToYYYYMMDD(quinta)]
  );

  var resultComprasQuinta: Array<any> = await AppDataSource.manager.query(
    'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
    [usuarioId, dateUtils.convertToYYYYMMDD(quinta)]
  );

  resultQuinta.forEach((venda) => {
    vendasQuinta += venda.ValorVenda;
  });

  resultComprasQuinta.forEach((compra) => {
    comprasQuinta += compra.valorTotal;
  });

  var lucroQuinta = vendasQuinta - comprasQuinta;
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  var vendasSexta: number = 0;
  var comprasSexta: number = 0;

  var resultSexta: Array<any> = await AppDataSource.manager.query(
    'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2',
    [usuarioId, dateUtils.convertToYYYYMMDD(sexta)]
  );

  var resultComprasSexta: Array<any> = await AppDataSource.manager.query(
    'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
    [usuarioId, dateUtils.convertToYYYYMMDD(sexta)]
  );

  resultSexta.forEach((venda) => {
    vendasSexta += venda.ValorVenda;
  });

  resultComprasSexta.forEach((compra) => {
    comprasSexta += compra.valorTotal;
  });

  var lucroSexta = vendasSexta - comprasSexta;
  ///////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////
  var vendasSabado: number = 0;
  var comprasSabado: number = 0;

  var resultSabado: Array<any> = await AppDataSource.manager.query(
    'SELECT "venda"."datavenda" AS "venda_datavenda", "venda"."valorTotal" AS "ValorVenda", "venda"."Id" AS "venda_Id" FROM "Venda" "venda" WHERE "venda"."usuarioId" = $1 AND "venda"."datavenda"::date = $2',
    [usuarioId, dateUtils.convertToYYYYMMDD(sabado)]
  );

  var resultComprasSabado: Array<any> = await AppDataSource.manager.query(
    'SELECT * FROM "Compra" compra WHERE compra."usuarioId" = $1 AND compra."dataCompra"::date = $2 ',
    [usuarioId, dateUtils.convertToYYYYMMDD(sabado)]
  );

  resultSabado.forEach((venda) => {
    vendasSabado += venda.ValorVenda;
  });

  resultComprasSabado.forEach((compra) => {
    comprasSabado += compra.valorTotal;
  });

  var lucroSabado = vendasSabado - comprasSabado;

  const RetornoGraficoSemanaOptions = [
    lucroDomingo,
    lucroSegunda,
    lucroTerca,
    lucroQuarta,
    lucroQuinta,
    lucroSexta,
    lucroSabado,
  ];


  var produtoComMaiorVendaSemana = await AppDataSource.manager.query(
    'SELECT MAX(vendaProduto.quantidade), vendaProduto."produtoId", venda."usuarioId" FROM public."Venda" venda' +
      ' INNER JOIN public."VendaProduto" vendaProduto ON vendaProduto."vendaId" = venda."Id"' +
      " WHERE venda.datavenda BETWEEN SYMMETRIC $1 AND $2 " +
      ' AND venda."usuarioId" = $3' +
      ' GROUP BY vendaProduto."produtoId",venda."usuarioId" ',
    [domingo, sabado, usuarioId]
  );

  var IdProduto = produtoComMaiorVendaSemana[0]?.produtoId;

  var query = 'SELECT produto."descricao",vendaProduto.quantidade, venda.datavenda  FROM "Produto" produto ' +
  ' INNER JOIN "VendaProduto" vendaProduto ON vendaProduto."produtoId" = produto."Id" ' +
  ' INNER JOIN "Venda" venda ON vendaProduto."vendaId" = venda."Id" ' +
  ' WHERE produto."Id" = $1 AND produto."usuarioId" = $2' +
  " AND venda.datavenda BETWEEN SYMMETRIC" +
  " $3 AND $4 ";



  var resultado: Array<any> = await AppDataSource.manager.query(query,
    [IdProduto, usuarioId, domingo, sabado]
  );

  // console.log(new Date(resultado[0].datavenda).getDate() === domingo.getDate());
  let arraySemana = [0,0,0,0,0,0,0];
  resultado.map((value)=>{

    if(new Date(value.datavenda).getDate() === domingo.getDate()){
      arraySemana[0] += Number(value.quantidade);
    }

    if(new Date(value.datavenda).getDate() === segunda.getDate()){
      arraySemana[1] += Number(value.quantidade);
    }

    if(new Date(value.datavenda).getDate() === terca.getDate()){
      arraySemana[2] += Number(value.quantidade);
    }

    if(new Date(value.datavenda).getDate() === quarta.getDate()){
      arraySemana[3] += Number(value.quantidade);
    }

    if(new Date(value.datavenda).getDate() === quinta.getDate()){
      arraySemana[4] += Number(value.quantidade);
    }

    if(new Date(value.datavenda).getDate() === sexta.getDate()){
      arraySemana[5] += Number(value.quantidade);
    }

    if(new Date(value.datavenda).getDate() === sabado.getDate()){
      arraySemana[6] += Number(value.quantidade);
    }




  });



  var ProdutoNome: String = resultado[0]?.descricao;

  // var Quantidades: Array<number> = resultado.map((res) => {
  //   return res.quantidade;
  // });

  var ProdutoMaisVendidoObject = {
    name: ProdutoNome,
    data: arraySemana,
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  var produtoEstoqueCritico: ProdutoEntity = new ProdutoEntity();
  var produtoEstoqueAtencao: ProdutoEntity = new ProdutoEntity();

  var resultProdutosEstoqueBaixo: Array<any> =
    await AppDataSource.manager.query(
      'SELECT * FROM (SELECT prod.* FROM "Produto" prod) as resultado WHERE  ' +
        ' resultado."usuarioId" = $1',
      [usuarioId]
    );

  resultProdutosEstoqueBaixo.map((res) => {
    res.porcentagem = (res.estoque / res.estoqueTotal) * 100;
    res.porcentagem = Number(res.porcentagem.toFixed(2));
  });

  // createQueryBuilder()
  // .select('*,(produto.estoque * produto."estoqueTotal")/100 as porcentagem')
  // .from(ProdutoEntity, "produto")
  // .where("produto.usuarioId = :id", { id: usuarioId }).orderBy("produto.estoque", "ASC").execute();

  var RetornoProdutoEstoqueCritico;
  var RetornoProdutoEstoqueAtencao;

  if (resultProdutosEstoqueBaixo.length > 0) {
    if (resultProdutosEstoqueBaixo.length == 1) {
      produtoEstoqueCritico = resultProdutosEstoqueBaixo[0];
      RetornoProdutoEstoqueCritico = produtoEstoqueCritico;
      RetornoProdutoEstoqueAtencao = null;
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
    GraficoSemana: RetornoGraficoSemanaOptions,
    MaisVendidoSemana: ProdutoMaisVendidoObject,
    EstoqueCritico: RetornoProdutoEstoqueCritico,
    EstoqueAtencao: RetornoProdutoEstoqueAtencao,
  };
  res.status(200).send(response);
});

module.exports = router;
