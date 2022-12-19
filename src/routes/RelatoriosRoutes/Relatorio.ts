import { Router } from "express";
import * as csv from "fast-csv";
import fs from "fs";
import path from "path";

import { AppDataSource } from "../../datasource";
import { CompraEntity } from "../../entity/Compra";
import { ResponseModel } from "../../models/Response.model";
import { VendaEntity } from "../../entity/Venda";
import { ClienteEntity } from "../../entity/Cliente";
import { FornecedorEntity } from "../../entity/Fornecedor";
import { UsuarioEntity } from "../../entity/Usuario";



const RelatorioRoute = Router();

RelatorioRoute.post("/csv", async (request, response) => {
    const { userId, dataInicial, dataFinal, tipo } = request.body;

    let cliente: ClienteEntity[] = [];
    let fornecedor: FornecedorEntity[] = [];
    let resp = new ResponseModel;
    let queryString, entity;
    let compras;


    const usuario = await AppDataSource.manager.find(UsuarioEntity, { where: { Id: userId } });


    switch (tipo) {
        case "compra":
            queryString = `compra."usuarioId" =  $1 and compra."dataCompra" >= $2 and compra."dataCompra" <= $3`;
            entity = CompraEntity;
            break;
        case "venda":
            queryString = `venda."usuarioId" = $1 and venda."dataVenda" >= $2 and venda."dataVenda" <= $3`;
            entity = VendaEntity;
            break;
        default:
            resp.success = false;
            resp.message = "Erro: tipo de relatório solicitado é inválido";
            resp.data = null;
            return response.json(resp);
    }

    // let compras = await AppDataSource
    //     .createQueryBuilder()
    //     .select("*")
    //     .from(tipo === "compra"? CompraEntity : VendaEntity, tipo)
    //     .where('compra.usuarioId = :id and compra.dataCompra >= :dataInicial and compra.dataCompra <= :dataFinal', { id: userId, dataInicial, dataFinal }).orderBy("compra.dataCompra").execute();

    // let compras = await AppDataSource
    //     .createQueryBuilder()
    //     .select("*")
    //     .from(entity, tipo)
    //     .where(queryString, { id: userId, dataInicial, dataFinal })
    //     .execute();



    if (tipo === "venda") {
        compras = await AppDataSource.manager.query('SELECT * FROM "Venda" venda INNER JOIN "Cliente" cliente ON venda."clienteId" = cliente."Id" WHERE ' + queryString, [userId, dataInicial, dataFinal]);
        cliente = await AppDataSource.manager.find(ClienteEntity, { where: { usuario: usuario } })
    }

    if (tipo === "compra") {
        compras = await AppDataSource.manager.query('SELECT * FROM "Compra" compra INNER JOIN "Fornecedor" fornecedor ON compra."fornecedorId" = fornecedor."Id" WHERE ' + queryString, [userId, dataInicial, dataFinal]);
        fornecedor = await AppDataSource.manager.find(FornecedorEntity, { where: { usuario: usuario } })
    }

    const writeStream = fs.createWriteStream("./src/routes/RelatoriosRoutes/relatorio-compras.csv");


    if (Object.keys(compras).length === 0) {
        resp.success = false;
        resp.message = "Erro: nenhum dado encontrado para o período selecionado";
        resp.data = null;
        response.json(resp);
        return;
    }

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(writeStream).on('end', () => process.exit());

    compras.forEach((compra: Object) => {
        const strCompra = JSON.stringify(compra);
        const jsonCompra = JSON.parse(strCompra);
        console.log(jsonCompra);
        let tempForn = fornecedor.find((x) => x.Id == jsonCompra.fornecedorId);
        let tempCliente = cliente.find((x) => x.Id == jsonCompra.clienteId);



        switch (tipo) {
            case "compra":

                csvStream.write({
                    ID_COMPRA: jsonCompra.Id,
                    DATA_COMPRA: jsonCompra.dataCompraDisplay,
                    DESCRICAO_PRODUTO: jsonCompra.produtoDisplay,
                    QUANTIDADE: jsonCompra.quantidade,
                    VALOR_COMPRA: jsonCompra.valorCompraDisplay,
                    FORMA_PAGAMENTO: jsonCompra.formaPagamento,
                    FORNECEDOR: jsonCompra.descricao,
                    CONTATO_FORNECEDOR: jsonCompra.contato,
                });
                break;
            case "venda":

                csvStream.write({
                    ID_VENDA: jsonCompra.Id,
                    DATA_VENDA: jsonCompra.dataVendaDisplay,
                    DESCRICAO_PRODUTO: jsonCompra.produtoDisplay,
                    QUANTIDADE: jsonCompra.quantidadeDisplay,
                    VALOR_VENDA: jsonCompra.valorTotalDisplay,
                    FORMA_PAGAMENTO: jsonCompra.formaPagamento,
                    CLIENTE: jsonCompra.nome,
                    CONTATO_CLIENTE: jsonCompra.contato,
                });
                break;
            default:
                resp.success = false;
                resp.message = "Erro: tipo de relatório solicitado é inválido";
                resp.data = null;
                return response.json(resp)
        }

    });
    csvStream.end();

    return response.sendFile(path.join(__dirname, "/relatorio-compras.csv"));
});

module.exports = RelatorioRoute;