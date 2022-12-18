import { Router } from "express";
import * as csv from "fast-csv";
import fs from "fs";
import path from "path";

import { AppDataSource } from "../../datasource";
import { CompraEntity } from "../../entity/Compra";
import { ResponseModel } from "../../models/Response.model";
import { VendaEntity } from "../../entity/Venda";



const RelatorioRoute = Router();

RelatorioRoute.post("/csv", async (request, response) => {
    const {userId, dataInicial, dataFinal, tipo } = request.body;

    let resp = new ResponseModel;
    let queryString, entity;

    switch(tipo){
        case "compra":
            queryString = `compra.usuarioId = :id and compra.dataCompra >= :dataInicial and compra.dataCompra <= :dataFinal`;
            entity = CompraEntity;
            break;
        case "venda":
            queryString = `venda.usuarioId = :id and venda.dataVenda >= :dataInicial and venda.dataVenda <= :dataFinal`;
            entity = VendaEntity;
            break;
        default:
            resp.success = false;
            resp.message = "Erro: tipo de relatório solicitado é inválido";
            resp.data = null;
            return response.json(resp)
    }

    // let compras = await AppDataSource
    //     .createQueryBuilder()
    //     .select("*")
    //     .from(tipo === "compra"? CompraEntity : VendaEntity, tipo)
    //     .where('compra.usuarioId = :id and compra.dataCompra >= :dataInicial and compra.dataCompra <= :dataFinal', { id: userId, dataInicial, dataFinal }).orderBy("compra.dataCompra").execute();

    let compras = await AppDataSource
        .createQueryBuilder()
        .select("*")
        .from(entity, tipo)
        .where(queryString, { id: userId, dataInicial, dataFinal })
        .execute();
    
    const writeStream = fs.createWriteStream("./src/routes/RelatoriosRoutes/relatorio-compras.csv");

    if(Object.keys(compras).length === 0) {
        resp.success = false;
        resp.message = "Erro: nenhum dado encontrado para o período selecionado";
        resp.data = null;
        return response.json(resp)
    }

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(writeStream).on('end', () => process.exit());

    compras.forEach((compra:Object) => {
        const strCompra = JSON.stringify(compra);
        const jsonCompra = JSON.parse(strCompra);

        csvStream.write({ 
            ID_COMPRA: jsonCompra.Id,
            DATA_COMPRA: jsonCompra.dataCompraDisplay,
            DESCRICAO_PRODUTO: jsonCompra.produtoDisplay,
            QUANTIDADE: jsonCompra.quantidade,
            VALOR_COMPRA: jsonCompra.valorCompraDisplay,
            FORMA_PAGAMENTO: jsonCompra.formaPagamento,
            FORNECEDOR: jsonCompra.fornecedor,
            CONTATO_FORNECEDOR: jsonCompra.fornecedorContato,
        });
    });
    csvStream.end();

    return response.sendFile(path.join(__dirname, "/relatorio-compras.csv"));
});

module.exports = RelatorioRoute;