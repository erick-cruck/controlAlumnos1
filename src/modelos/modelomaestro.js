const mongooes = require("mongoose");
var Schema = mongooes.Schema;

var modelomaestro = Schema({
    nombre: String,
    password: String,
    rol: String,
    cursos: [{
        nombrecursos: String,
        cantidad: Number
    }]
})

module.exports = mongooes.model("Maestro", modelomaestro)