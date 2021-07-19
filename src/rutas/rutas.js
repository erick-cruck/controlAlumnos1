"use strict"

//Exportaciones
const express = require("express");
const ControllerMaestro = require("../controladores/controladormaestro");

//Middlewars
var md_autentication = require("../middlewares/authenticated")

//Rutas localhost:3000/api/<funcion>
var api = express.Router();
api.get("/ejemplomodelomaestro",md_autentication.ensureAuth, ControllerMaestro.ejemplo);
api.get("/controlmaestro", ControllerMaestro.controlmaestro);
api.post("/agregarusuario", ControllerMaestro.agregar);
api.post("/eliminarUsuario", ControllerMaestro.eliminar);
api.post("/eliminarCursos", ControllerMaestro.eliminarCursos);
api.post("/editarPerfil", ControllerMaestro.editarperfil)
api.post("/editarperfil", ControllerMaestro.editarperfil);
api.post("/editarcursos", ControllerMaestro.editarcursos);
api.post("/login", ControllerMaestro.login);
api.get("/vertodo", ControllerMaestro.vertodo);



module.exports = api;