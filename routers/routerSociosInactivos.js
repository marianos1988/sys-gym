const { json } = require("express");
const express = require("express");
const conexion = require("../conexionDB");

const routerSociosInactivos = express.Router();
routerSociosInactivos.use(express.json());

routerSociosInactivos.get("/", async (req,res)=>{

    conexion.generarListaSociosInactivos(res);

});

routerSociosInactivos.post("/activarSocio", async (req,res)=>{

    const {idSocio} = await req.body;
    const idSocioNum = parseInt(idSocio);

    
    conexion.activarSocio(idSocioNum,res);
    
});

routerSociosInactivos.post("/eliminarSocio", async (req,res)=>{

    const datosSocio = await req.body;
    const idSocioNum = parseInt(datosSocio.idSocio);
    const nuevaFecha = new Date();
    conexion.eliminarSocio(idSocioNum,nuevaFecha,datosSocio.idUsuarioQuienElimino,datosSocio.usuarioQuienElimino,res);
});

routerSociosInactivos.post("/buscarDNIoNroSocioInactivo", async (req,res)=>{

    const {dniONroSocioInactivo} = await req.body;
    
    if(validarSoloNumeros(dniONroSocioInactivo)) {

        
        res.send(JSON.stringify(`Debes ingresar un valor correcto en el importe`));
    } else {

        conexion.buscarSocioInactivo(dniONroSocioInactivo,res);
        
    }
});

// Validar campo solo numeros
function validarSoloNumeros(numero) {
    // Valida si se cargo un numero True = No son numeros, False = Son numeros
    let verificaNumero = numero;
    let validar = false;
    for(digito in verificaNumero){
        if(!(verificaNumero[digito] >= 0) && !(verificaNumero[digito] <= 9)) {
            validar = true;
            return validar;
        } 
    }
    return validar;
    
}

module.exports = routerSociosInactivos;