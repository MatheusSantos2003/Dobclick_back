import express from "express";
import {Request, Response} from "express";
import "reflect-metadata";
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

require('dotenv').config();

// create and setup express app
const app = express();
app.use(express.json());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());





app.get('/', (req: Request,res : Response)=>{
    res.status(200).send("Olá Mundo!!!");
});


const port = process.env.PORT || 3000;
// start express server
app.listen(port,  ()=>{
    console.log(`Servidor Rodando na porta ${port}!`);
});