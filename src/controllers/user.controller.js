"use strict"

const User=require("../modelos/user.model");
const bcrypt=require("bcrypt-nodejs");
const jwt= require("../service/jwt");
const userModel = require("../modelos/user.model");

function ejemplo(req, res){
    res.status(200).send({mesaje:"Hola soy un ejemplo "})
}

function register(req, res){
    var userModel = new User();
    var params = req.body;
    if(params.usuario && params.email && params.password){
        userModel.nombre= params.nombre;
        userModel.usuario=params.usuario;
        userModel.email=params.email;
        userModel.rol="rol_usuario"
        userModel.image=null;

        User.find({$or: [
            {usuario:userModel.usuario},
            {email:userModel.email}
        ]}).exec((err, UsersFind)=>{
            if(err) return res.status(500).send({mesaje:"Error en la petición"})

            if(UsersFind && UsersFind.length>=1){
                return res.status(500).send({mesaje: "El usuario ya existe"})
            }else {
                bcrypt.hash(params.password, null, null, (err,encryptpass)=>{
                    userModel.password=encryptpass;
                    userModel.save((err,saveUser)=>{
                        if(saveUser){
                            res.status(200).send(saveUser)
                        }
                    })
                })
            }
        })
    }
}

function getUsers(req, res){
    //User.find().exec((err,obtainedUsers)=>{})
    User.find((err,obtainedUsers)=>{
        if(err) return res.status(500).send({mesaje: "Error al obtener usuarios"});
        if(!obtainedUsers) return res.status(500).send({mesaje: "Error al consultar usuarios"});
        return res.status(200).send(obtainedUsers);
    })
}

function getUserID(req, res){
    var idUser=req.params.idUser;
    User.findById(idUser, (err, obtainedUser)=>{
       if(err) return res.status(500).send({mesaje: "Error al obtener usuarios"});
       if(!obtainedUser) return res.status(500).send({mesaje: "Error al obtener usuarios"});
       console.log(obtainedUser.usuario);
       console.log(obtainedUser.email);
       return res.status(200).send(obtainedUser);
    })
}

function login(req,res){
    var params= req.body;
    userModel.findOne({ email: params.email}, (err, obtainedUser)=>{
        if(err) return res.status(500).send({mesaje:"Error en la petición"});
        if(obtainedUser){
            bcrypt.compare(params.password, obtainedUser.password,(err,correctPass)=>{
                if(correctPass){
                    if(params.getToken === "true"){
                        return res.status(200).send({
                            token: jwt.createToken(obtainedUser)
                        });
                    } else{
                        obtainedUser.password=undefined;
                        return res.status(200).send({obtainedUser});
                    }
                }else{
                    return res.status(404).send({mesaje: "El usuario no se ha podido identificar"})
                }
            })
        }else{
            return res.status(404).send({mesaje: "El usuario no ha podido ingresar"})
        }
    })
}

function editUser(req, res){
    var idUser=req.params.idUser;
    var params= req.body;
    //Bloquear Password
    delete params.password;

    if(idUser !=req.user.sub){
        return res.status(500).send({mesaje: "No posees los permisos necesarios"});
    }
    User.findByIdAndUpdate(idUser, params, {new:true}, (err, updateUser)=>{
        if(err) return res.status(500).send({mesaje: "Error en la petición"});
        if(!updateUser) return res.status(500).send({mesaje: "No se pudo actualizar el usuario"});
        return res.status(200).send({updateUser});
    })
}

function deleteUser(req, res) {
    const idUser=req.params.idUser;
    if(idUser !=req.user.sub){
        return res.status(500).send({mesaje:"No posee los permisos necesarios"});
    }
    User.findByIdAndDelete(idUser,(err, removedUser)=>{
        if(err) return res.status(500).send({mesaje:"Error en la petición al eliminar"});
        if(!removedUser) return res.status(500).send({mesaje:"Error al eliminar usuario"});
        return res.status(200).send({removedUser});
    })
}

module.exports={
    ejemplo,
    register,
    getUsers,
    getUserID,
    login,
    editUser,
    deleteUser
}