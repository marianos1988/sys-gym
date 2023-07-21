const { json } = require("express");
const express = require("express");
const conexion = require("../conexionDB");

const routerSociosActivos = express.Router();
routerSociosActivos.use(express.json());

routerSociosActivos.get("/", async (req,res)=>{


    conexion.generarListaSociosActivos(res);

});

routerSociosActivos.post("/buscarDNIoNroSocioActivo", async (req,res)=>{

    const {dniONroSocioActivo} = await req.body;
    
    if(validarSoloNumeros(dniONroSocioActivo)) {

        res.send(JSON.stringify(`Debes ingresar un valor correcto`));
    } else {

        conexion.buscarSocioActivo(dniONroSocioActivo,res);
    }
});

routerSociosActivos.get("/SociosMorosos", async (req,res)=>{

    conexion.generarListaSociosMorososActivos(res);
});

routerSociosActivos.post("/inactivarSocio", async (req,res)=>{

const datos = await req.body;
const idSocioNum = parseInt(datos.idSocio);


conexion.inactivarSocio(idSocioNum,datos.activoOMoroso,res);

});

routerSociosActivos.post("/FichaSocio/", async (req,res)=>{

    const {idSocio} = await req.body;
    
    conexion.verFichaSocio(idSocio,res);
    
});

routerSociosActivos.post("/FichaSocio/FichaSocioEditado", async (req,res)=>{

    const datosSocio = await req.body;
    
    
    if(datosSocio.nombre === "" || datosSocio.nombre.length < 3) {

        res.send(JSON.stringify(`Debes ingresar nombre mayor a 3 digitos`));

    }
    else if(datosSocio.apellido === "" || datosSocio.apellido.length < 3) {

        res.send(JSON.stringify(`Debes ingresar un apellido mayor a 3 digitos`));

    }
    else if(validarSoloNumeros(datosSocio.dni) || datosSocio.dni.length < 7 || datosSocio.dni.length > 12) {

        res.send(JSON.stringify(`Debes ingresar entre 7 y 12 numeros para el dni`));

    }
    else if(validarSoloNumeros(datosSocio.nroSocio) === true || datosSocio.nroSocio.length < 1) {

        res.send(JSON.stringify(`Debes ingresar algun numero en el Nro. de Socio`));

    }
    else if(datosSocio.nroSocio.length > 10) {

        res.send(JSON.stringify(`El maximo es de 10 digitos en nro. de socio`));

    }
    else if(esEmail(datosSocio.correo) == false) {
        
        res.send(JSON.stringify(`Debe ingresar un correo electronico valido`));

    }
    else if(validarSoloNumeros(datosSocio.telefono) == true) {

        res.send(JSON.stringify(`Debes ingresar solo numeros para el telefono`));

    } else if(datosSocio.telefono.length > 12) {

        res.send(JSON.stringify(`El maximo es de 12 digitos en el telefono`));
    }
     else {

        conexion.actualizarFichaSocio(datosSocio,res);
    }
    
});

routerSociosActivos.post("/verFichaPagosActivos", async (req,res)=>{

    const {idSocio} = await req.body;

    conexion.verFichaPagos(idSocio,res);

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

module.exports = routerSociosActivos;