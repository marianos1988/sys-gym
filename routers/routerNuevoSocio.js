const express = require("express");
const conexion = require("../conexionDB");

const routerNuevoSocio = express.Router();

routerNuevoSocio.use(express.json());


// Cargar nuevo Socio y pago
routerNuevoSocio.post("/", async (req,res)=>{
    
    const nuevoSocioYPago = await req.body;

    const fechaRegistracion = new Date();
    let fechaCumpleanos;
    let mesCumpleanos;


    if(!(nuevoSocioYPago.nuevoSocio.fechaNacimiento == "")) {
        
        fechaCumpleanos = parseInt(nuevoSocioYPago.nuevoSocio.fechaNacimiento.slice(8,10));
        mesCumpleanos = parseInt(nuevoSocioYPago.nuevoSocio.fechaNacimiento.slice(5,7));
        
    } else {
        fechaCumpleanos = null;
        mesCumpleanos = null;
    }



    //Validaciones del socio

    if(nuevoSocioYPago.nuevoSocio.nombre === "" || nuevoSocioYPago.nuevoSocio.nombre.length < 3) {
    
        res.send(JSON.stringify(`Debes ingresar un nombre mayor a 3 digitos`));
        
    }
    else if(nuevoSocioYPago.nuevoSocio.apellido === "" || nuevoSocioYPago.nuevoSocio.apellido.length < 3) {
    
        res.send(JSON.stringify(`Debes ingresar un apellido mayor a 3 digitos`));

    }
    else if(validarSoloNumeros(nuevoSocioYPago.nuevoSocio.dni) || nuevoSocioYPago.nuevoSocio.dni.length < 7 || nuevoSocioYPago.nuevoSocio.dni.length > 12) {
    
        res.send(JSON.stringify(`Debes ingresar entre 7 y 12 numeros para el dni`));

    }
    else if(validarSoloNumeros(nuevoSocioYPago.nuevoSocio.nroSocio) || nuevoSocioYPago.nuevoSocio.nroSocio.length < 1 || nuevoSocioYPago.nuevoSocio.nroSocio.length > 10 ) {
    
        res.send(JSON.stringify(`Debes ingresar algun numero en el Nro. de Socio`));

    }
    else if(nuevoSocioYPago.nuevoSocio.length > 10) {
        
        res.send(JSON.stringify(`El maximo es de 10 digitos en nro. de socio`));

    }
    else if(esEmail(nuevoSocioYPago.nuevoSocio.correo) == false) {
    
        res.send(JSON.stringify(`Debe ingresar un correo electronico valido`));

    }
    else if(validarSoloNumeros(nuevoSocioYPago.nuevoSocio.telefono) == true) {
    
        res.send(JSON.stringify(`Debes ingresar solo numeros para el telefono`));

    }     

    //Validaciones del Pago
    else if(validarSoloNumeros(nuevoSocioYPago.nuevoPago.importe) || nuevoSocioYPago.nuevoPago.importe === "") {

        res.send(JSON.stringify(`Debes ingresar un valor en el importe`));

    }
    else if(nuevoSocioYPago.nuevoPago.mesDePago == "0") {

        res.send(JSON.stringify(`Debes seleccionar un mes correcto`));

    }
    else if(nuevoSocioYPago.nuevoPago.mesDePago !== "01" && nuevoSocioYPago.nuevoPago.mesDePago !== "02" && nuevoSocioYPago.nuevoPago.mesDePago !== "03" && nuevoSocioYPago.nuevoPago.mesDePago !== "04" && nuevoSocioYPago.nuevoPago.mesDePago !== "05" && nuevoSocioYPago.nuevoPago.mesDePago !== "06" && nuevoSocioYPago.nuevoPago.mesDePago !== "07" && nuevoSocioYPago.nuevoPago.mesDePago !== "08" && nuevoSocioYPago.nuevoPago.mesDePago !== "09" && nuevoSocioYPago.nuevoPago.mesDePago !== "10" && nuevoSocioYPago.nuevoPago.mesDePago !== "11" && nuevoSocioYPago.nuevoPago.mesDePago !== "12"){

        res.send(JSON.stringify(`El mes abonado no es el correcto`));
    }
    else if(nuevoSocioYPago.nuevoPago.observacion.length>38){
        
        res.send(JSON.stringify(`Limite de caracteres alcanzado en la observacion`));
    }
    else if(nuevoSocioYPago.nuevoPago.modoDePago !== "Efectivo" && nuevoSocioYPago.nuevoPago.modoDePago !== "Debito" && nuevoSocioYPago.nuevoPago.modoDePago !== "Transferencia") {

        res.send(JSON.stringify(`Elige una opcion correcta en el modo de pago`));
    }
    else {

        conexion.agregarSocioYPago(nuevoSocioYPago.nuevoSocio,nuevoSocioYPago.nuevoPago,fechaRegistracion,fechaCumpleanos,mesCumpleanos,res);
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


// Validar el mail
function esEmail(dato) {

    if(dato == "" || dato == undefined || dato == null) {
        return true;
    } else {
        let patron = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

        return patron.test(dato);
    }

}


module.exports = routerNuevoSocio;
