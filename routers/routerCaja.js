const express = require("express");
const conexion = require("../conexionDB");

const routerCaja = express.Router();
routerCaja.use(express.json());

routerCaja.post("/nuevoPago", async (req,res)=>{

    const fechaHoy = new Date();
    const nuevoPago = await req.body;

    if(nuevoPago.concepto === "") {

        res.send(JSON.stringify("Debes ingresar un dato en concepto"));

    }
    else if(nuevoPago.concepto.length > 38) {

        res.send(JSON.stringify("Limite de caracteres alcanzado en el concepto"));
    }
    else if(validarSoloNumeros(nuevoPago.importe) || nuevoPago.importe === "") {

        res.send(JSON.stringify(`Debes ingresar un valor en el importe`));

    }
    else if(nuevoPago.modoDePago !== "Efectivo" && nuevoPago.modoDePago !== "Debito" && nuevoPago.modoDePago !== "Transferencia") {

        res.send(JSON.stringify(`Elige una opcion correcta en el modo de pago`));
    }
    else if(nuevoPago.tipoDePago !== "Ingreso" && nuevoPago.tipoDePago !== "Egreso") {

        res.send(JSON.stringify(`No se valida si es un ingreso o egreso de caja`));
    }
    else { 

        conexion.nuevoPagoCaja(nuevoPago,fechaHoy,res);
    }
});

routerCaja.post("/buscarFecha",async (req,res)=>{

    const datosBuscarFecha = await req.body;
    
    if(datosBuscarFecha.fecha === "") {

        res.send(JSON.stringify("Debes seleccionar una fecha correcta"));
    }
    else {

        conexion.buscarFechaCaja(datosBuscarFecha,res);
    }
});

routerCaja.post("/editarPago/datosModificadosYGuardados",async (req,res)=>{

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
        conexion.actualizarRegistrosPagosCaja(importeAModificarNum,datosRecibidosEditados.observacionAModificar,datosRecibidosEditados.modoDePagoAModificar,datosRecibidosEditados.id,datosRecibidosEditados.fechaInput,datosRecibidosEditados.ingresoOEgreso,res);

    }


});

routerCaja.post("/datosEliminarPago", async(req,res)=>{

    const eliminarIDPago = req.body;
    const fechaEliminarPago = new Date();



    conexion.eliminarRegistroPagosCaja(eliminarIDPago.idPago,fechaEliminarPago,eliminarIDPago.idUsuarioQuienElimino,eliminarIDPago.usuarioQuienElimino,eliminarIDPago.fechaInput,eliminarIDPago.ingresoOEgreso,res);


    
});

// Validar el DNI
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


module.exports = routerCaja;