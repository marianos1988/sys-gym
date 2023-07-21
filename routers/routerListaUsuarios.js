const express = require("express");
const conexion = require("../conexionDB");

const routerListaUsuarios = express.Router();
routerListaUsuarios.use(express.json());

routerListaUsuarios.get("/", async (req,res)=>{

    conexion.generarListaUsuarios(res); 
    
});

routerListaUsuarios.post("/editarPass", async (req,res)=>{

    const passUsuario = await req.body;

    if(!(passUsuario.passwordNueva === passUsuario.passwordRepetida)) {

        res.send(JSON.stringify(`Las contraseñas no son iguales`));

    }
    else if(passUsuario.passwordActual == "" || passUsuario.passwordNueva == "" || passUsuario.passwordRepetida == "") {

        res.send(JSON.stringify("Completa todos los campos de contraseñas"));
    }
    else {

        conexion.actualizarPassUsuario(passUsuario.passwordActual,passUsuario.passwordNueva,passUsuario.id,res);
    }
});

module.exports = routerListaUsuarios;