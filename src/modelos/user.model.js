const mongoose =require("mongoose");
var Schema = mongoose.Schema;

var UsuariosSchema = Schema({
    nombre:String,
    curso:String,
    password: String
},{ collection: 'alumnos', UsuariosSchema});


module.exports = mongoose.model("alumnos", UserSchema);