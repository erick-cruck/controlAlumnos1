"use strict"

const mongoose = require("mongoose");
const app = require("./app");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/ControlAlumnosDB", {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("Se encuentra conectado a la Base de Datos");

    app.listen(3000, function () {
        console.log("El Servidor esta arracando en el puerto 3000");
    })

}).catch(err => console.log(err));

