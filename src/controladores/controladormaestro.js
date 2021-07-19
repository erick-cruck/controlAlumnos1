"use strict"

//Importaciones
const Maestro = require("../modelos/modelomaestro");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");

//Funcion Ejemplo
function ejemplo(req, res){
    res.status(200).send({mensaje: `Hola soy el ejemplo modelo maestro`})
}

//Funcion agregar
function controlmaestro(req, res){
    var modeloMaestro = Maestro();
    modeloMaestro.nombre = "Maestro";
    modeloMaestro.password = "123456";
    modeloMaestro.rol = "Maestro";

    if(modeloMaestro.nombre == "Maestro" && modeloMaestro.password == "123456"){
        res.status(200).send({mensaje: `conectado como controlador maestro`})
    }else{
        res.status(200).send({mensaje: `error, no estas conectado a la base de datos`})
    }
}


function agregar(req, res){
    var usuarioModel = new Maestro();
    var params = req.body;

    if(params.nombre && params.password){
        usuarioModel.nombre = params.nombre;
        usuarioModel.rol = params.rol
        if(params.rol){
            if(usuarioModel.rol = "Estudiante"){
                if(usuarioModel.cantidad < 3){
                    usuarioModel.nombrecursos = params.nombrecursos;
                }
            }else{
                if(usuarioModel.rol = "Maestro"){
                    usuarioModel.nombrecursos = params.nombrecursos;
                }else{
                    res.status(200).send({mensaje: `no tienes un rol autorizado`})
                }
            }
        }else{
            res.status(200).send({mensaje: `complete requisitos para registrar el usuario`})
        }


        Maestro.find({$or:[
            {usuario: usuarioModel.usuario}
        ]}).exec((err, usuariosEncontrados) => {
            if(err) return res.status(500).send({mensaje: "Erro en la peticion del usuario"})

            if(usuariosEncontrados && usuariosEncontrados.length >= 1){
                return res.status(500).send({mensaje: "El usuario ya existe"})
            }else{
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada) =>{
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, usuarioGuardado) =>{
                        if(err) return res.status(500).send({mensaje: "Error al guardar el Usuario"})

                        if(usuarioGuardado){
                            res.status(200).send(usuarioGuardado)
                        }else{
                            res.status(404).send({mensaje: "No se ha podido registrar el usuario"});
                        }
                    })

                })
            }

        })
    }else{
        res.status(200).send({mensaje: `complete requisitos para registrar el usuario`})
    }
}




function vertodo(req, res){
    Maestro.find((err, usuariosEncontrados)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion de obtener Usuario"})
        if(!usuariosEncontrados) return res.status(500).send({mensaje: "Error en la consulta de usuarios"})
        return res.status(200).send({usuariosEncontrados})
    })

}
    
function eliminar(req, res){
    var usuarioModel = new Maestro();
    var params = req.body;
    var idUsuario = req.params.idUsuario
    usuarioModel.findById(idUsuario, (err, usuariosEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion del usuario"})
        if(!usuariosEncontrado) return res.status(500).send({mensaje: "Error al Obtener los datos del Usuario"});
        if(usuarioModel.rol = "Estudiante"){
            usuarioModel.remove(idUsuario);
        }else{
            if(usuarioModel.rol = "Maestro"){
                usuarioModel.remove(idUsuario);
            }
        }
    })
}

function eliminarCursos(req, res){
    var usuarioModel = new Maestro();
    var params = req.body;
    if(usuarioModel.rol = "Maestro"){
        var idUsuario = req.params.idUsuario;
        var cursos = req.params.cursos
    userModel.findById(idUsuario, (err, usuariosEncontrado)=>{
        if(err) return res.status(500).send({mensaje: "Error en la peticion del usuario"})
        if(!usuariosEncontrado) return res.status(500).send({mensaje: "Error al Obtener los datos del Usuario"});

        if(usuarioModel.cursos = cursos){
            userModel.remove(cursos);
        }else{
            res.status(200).send({mensaje: 'no exite el curso que trata de eliminar'})
        }
    })
    }else{
        res.status(200).send({mensaje: 'no podes eliminar tu curso porque no tienes el rol necesario'})
    }

}

function editarperfil(req, res){
    var usuarioModel = new Maestro();
    var params = req.body;
    var idUsuario = params.idUsuario;
    if(idUsuario==0){
        userModel.findById(idUsuario, (err, usuariosEncontrado)=>{
            if(err) return res.status(500).send({mensaje: "Error en la peticion del usuario"})
            if(!usuariosEncontrado) return res.status(500).send({mensaje: "Error al Obtener los datos del Usuario"});
            userModel.nombre = params.nombre;
            userModel.password = params.password;
        })
    }
}

function editarcursos(req, res){
    var usuarioModel = new Maestro();
    var params = req.body;
    var idUsuario = params.idUsuario;
    if(idUsuario==0){
        userModel.findById(idUsuario, (err, usuariosEncontrado)=>{
            if(err) return res.status(500).send({mensaje: "Error en la peticion del usuario"})
            if(!usuariosEncontrado) return res.status(500).send({mensaje: "Error al Obtener los datos del Usuario"});
            userModel.cursos = params.cursos;
        })
    }
}

function login(req, res){
    var params = req.body;

    Maestro.findOne({ nombre: params.nombre}, (err, usuariosEncontrado) =>{
        if (err) return res.status(500).send({mensaje: "Error en la peticion"});

        if(usuariosEncontrado){
            bcrypt.compare(params.password, usuariosEncontrado.password, (err, passCorrecta)=>{
                if(passCorrecta){
                    if(params.obtenerToken === "true"){
                        return res.status(200).send({
                            token: jwt.createToken(usuariosEncontrado)
                        });
                    }else{
                        usuariosEncontrado.password = undefined;
                        return res.status(200).send({usuariosEncontrado})
                    }
                }else{
                    return res.status(404).send({mensaje: "El usuario no se pudo encontrar"})
                }
            })
        }else{
            return res.status(404).send({mensaje: "El usuario no ha podido ingresar"})
        }
    })
}


module.exports = {
    ejemplo,
    controlmaestro,
    agregar,
    vertodo,
    eliminar,
    eliminarCursos,
    editarperfil,
    editarcursos,
    login
}
