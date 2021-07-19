"use strict"

const express=require("express");
const userController=require("../controllers/user.controller")

var authentication=require("../middlewares/authenticated");

var api=express.Router();
api.get("/ejemplo", authentication.ensureAuth ,userController.ejemplo);
api.post("/registerUser", userController.register);
api.get("/getUsers", userController.getUsers);
api.get("/getUserId/:idUser", userController.getUserID);
api.post("/login", userController.login);
api.post("/editUser/:idUser",authentication.ensureAuth ,userController.editUser);
api.delete("/deleteUser/:idUser",authentication.ensureAuth ,userController.deleteUser);

module.exports=api;