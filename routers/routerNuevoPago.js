const express = require("express");
const conexion = require("../conexionDB");

const routerNuevoPago = express.Router();

routerNuevoPago.use(express.json());


routerNuevoPago.post("/", async (req,res) =>{

    const { dni } = await req.body;
    conexion.buscarDniParaPagos(dni,dni,res);
  

});

routerNuevoPago.post("/registrarPago", async (req,res)=>{
    const datosPago  = await req.body.objetoPago;


    const fechaRegistracionPago = new Date();

    if(validarSoloNumeros(datosPago.importePago) || datosPago.importePago === "") {

        res.send(JSON.stringify(`Debes ingresar un valor en el importe`));

    }
    else if(datosPago.mesDePago == "0") {

        res.send(JSON.stringify(`Debes seleccionar un mes correcto`));

    }
    else if(datosPago.mesDePago !== "01" && datosPago.mesDePago !== "02" && datosPago.mesDePago !== "03" && datosPago.mesDePago !== "04" && datosPago.mesDePago !== "05" && datosPago.mesDePago !== "06" && datosPago.mesDePago !== "07" && datosPago.mesDePago !== "08" && datosPago.mesDePago !== "09" && datosPago.mesDePago !== "10" && datosPago.mesDePago !== "11" && datosPago.mesDePago !== "12" && datosPago.mesDePago !== "13"){

        res.send(JSON.stringify(`El mes abonado no es el correcto`));
    }
    else if(fechaRegistracionPago.getMonth()+1 !== 12 && datosPago.mesDePago == "13") {

        res.send(JSON.stringify(`El mes abonado no es el correctoo`));
    }
    else if(datosPago.modoDePago !== "Efectivo" && datosPago.modoDePago !== "Debito" && datosPago.modoDePago !== "Transferencia") {

        res.send(JSON.stringify(`Elige una opcion correcta en el modo de pago`));
    }
    
    else {

    conexion.registrarPago(datosPago.idSocioPago,datosPago.importePago,datosPago.modoDePago,fechaRegistracionPago,datosPago.mesDePago,datosPago.observacionPago,datosPago.eliminado,res);
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

module.exports = routerNuevoPago;