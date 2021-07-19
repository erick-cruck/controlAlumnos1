"use strict"

//Variables Globales
const express = require("express");
const app = express();
const bodyParser = require("body-parser")

//Importaciones Rutas
const ruta = require("./src/rutas/rutas");

//Middlewars
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())



//Carga de rutas
app.use("/api", ruta );

//Exportar
module.exports = app;