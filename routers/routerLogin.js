const express = require("express");
const conexion = require("../conexionDB");

const routerLogin = express.Router();
routerLogin.use(express.json());

routerLogin.post("/", async (req,res)=>{
    
    const login = await req.body;

    
    if(login.usuario == "" || login.password == "") {

        res.send(JSON.stringify("Usuario o contraseña incorrecta"));
    } else {

        conexion.logearse(login,res);
    }
    
});


module.exports = routerLogin;