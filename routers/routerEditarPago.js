const express = require("express");
const conexion = require("../conexionDB");

const routerEditarPago = express.Router();
routerEditarPago.use(express.json());



routerEditarPago.post("/datosModificadosYGuardados", async (req,res)=>{

    const datosRecibidosEditados = await req.body;

    if(validarSoloNumeros(datosRecibidosEditados.importeAModificar) || datosRecibidosEditados.importeAModificar == ""){

        res.send(JSON.stringify(`Debes ingresar un valor correcto en el importe`));

    }
    else if(datosRecibidosEditados.observacionAModificar.length>38){

        res.send(JSON.stringify(`Limite de caracteres alcanzado en la observacion`));

    }
    else if(datosRecibidosEditados.modoDePagoAModificar !== "Efectivo" && datosRecibidosEditados.modoDePagoAModificar !== "Debito" && datosRecibidosEditados.modoDePagoAModificar !== "Transferencia") {

        res.send(JSON.stringify(`Elige una opcion correcta en el modo de pago`));

    }
    else {

    
        let importeAModificarNum = parseInt(datosRecibidosEditados.importeAModificar);
        conexion.actualizarRegistrosPagos(importeAModificarNum,datosRecibidosEditados.observacionAModificar,datosRecibidosEditados.modoDePagoAModificar,datosRecibidosEditados.id,res);

    }



});


routerEditarPago.post("/datosEliminarPago", async(req,res)=>{

    const eliminarIDPago = req.body;
    const fechaEliminarPago = new Date();

    
    conexion.eliminarRegistroPagosSocio(eliminarIDPago.idPago,eliminarIDPago.idSocio,fechaEliminarPago,eliminarIDPago.idUsuarioQuienElimino,eliminarIDPago.usuarioQuienElimino,res);
    
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

module.exports = routerEditarPago;