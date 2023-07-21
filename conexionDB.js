const express = require("express");
const app = express();
const cors = require("cors"); 
const crypto = require("crypto");

// Le manda request (solicitudes el frontend)
app.use(
    express.urlencoded({
        extended: true
    }) 
);
 
app.use(express.json({
    type: "*/*" 
}));
 
app.use(cors());

// Importar funcionalidades de mysql
const mysql = require("mysql");
const { query } = require("express");

// Establece parametros de la conexion
const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "scapegym"
});

const abrirConexion = ()=>{
    console.log("Abro la conexion a la DB");
    // Verifica si se establece correctamente la conexion a la Base de Datos
            conexion.connect(err => {
            if(err) throw `Error de conexion: ${err}`;
            else console.log("Conectado a la Base de Datos");
        });
}

const cerrarConexion = ()=>{ 
    console.log("Cierro conexion DB");
    conexion.end();

}

// Logearse al sistema
function logearse(login,resultado) {


    let query = `SELECT id,usuario,password FROM usuarios WHERE usuario = ?`;
    conexion.query(query,[login.usuario],(err,res,filed)=>{
        
        if(err)
            throw err;   
        
        if(res.length == 0) {

            resultado.send(JSON.stringify("El usuario no existe"));
        
        } else {
            
            res.forEach(ele=>{

                // Encripta el password en SHA2 con libreria crypto
                const hash = crypto.createHash("sha256").update(login.password).digest("hex");
                const hashDB = ele.password;
    
    
                    if(hashDB === hash){

                        const usuarioLogin = {
                            idUsuario:ele.id,
                            usuario: ele.usuario
                            
                        }


                        let datosParaEnviar = [];
                        let socioCumpleanos = {};
                        let listaSocioCumpleanos = [];
                        const fechaHoy = new Date();
                        const mesDeHoy = fechaHoy.getMonth()+1;
                        const fechaDeHoy = fechaHoy.getDate();

                        let query2 = `SELECT id_socio, nombres, apellidos FROM socios WHERE fecha_cumpleanos = ? AND mes_cumpleanos = ? AND estado = true`;
                        conexion.query(query2,[fechaDeHoy,mesDeHoy],(erro,resul)=>{
                            if(erro)
                                throw erro;
                            resul.forEach(el=>{

                                socioCumpleanos = {
                                    idSocio : el.id_socio,
                                    nombre : el.nombres,
                                    apellido: el.apellidos

                                }
                                listaSocioCumpleanos.push(socioCumpleanos);

                            });
                            datosParaEnviar = [usuarioLogin,listaSocioCumpleanos];
                            resultado.send(JSON.stringify(datosParaEnviar));
                        });

                    }
                    else{
                        resultado.send(JSON.stringify("Contraseña incorrecta"));
                    }
     
            });
            
        }

    });

}



 // Dar de alta socio Nuevo
 const agregarSocioYPago = (nuevoSocio,nuevoPago,fechaAlta,fechaCumpleanos,mesCumpleanos,resultado) => {
    

        // Busca si existe un Numero de DNI
        let nroDNIEncontrado;
        let query = 'SELECT dni FROM socios WHERE dni = ?';
        conexion.query(query,[nuevoSocio.dni], (err, res, _filed)=>{
            if(err) 
                throw err;
            res.forEach(res=>{

                nroDNIEncontrado = res.dni;

            });
    
            if(!(nroDNIEncontrado === undefined)){

                resultado.send(JSON.stringify(`El dni ya existe`));

            } else {

                // Busca si existe un Numero de socio
                let nroSocioEncontrado;
                let query = 'SELECT nro_socio FROM socios WHERE nro_socio = ?';
                conexion.query(query,[nuevoSocio.nroSocio], (err, res, _filed)=>{
                    if(err) 
                        throw err;
                    res.forEach(res=>{

                        nroSocioEncontrado = res.nro_socio;

                    });

                    if(!(nroSocioEncontrado === undefined)){

                        resultado.send(JSON.stringify(`El nro. de socio ya existe`));
        
                    } else {

                        if(nuevoSocio.telefono == "" || nuevoSocio.telefono == undefined || nuevoSocio.telefono == null) {
                            nuevoSocio.telefono = undefined;
                        }
                        // Guarda el socio registrado 
                        let dniNumero = parseInt(nuevoSocio.dni);
                        let nroSocioNumero = parseInt(nuevoSocio.nroSocio);
                        let query = 'INSERT INTO socios (nro_socio, nombres, apellidos, dni, domicilio, mail, telefono, fecha_nacimiento, fecha_cumpleanos, mes_cumpleanos, fecha_registracion, eliminado, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                        conexion.query(query, [nroSocioNumero, nuevoSocio.nombre, nuevoSocio.apellido, dniNumero, nuevoSocio.domicilio, nuevoSocio.correo, nuevoSocio.telefono,nuevoSocio.fechaNacimiento,fechaCumpleanos, mesCumpleanos, fechaAlta, nuevoSocio.eliminado, nuevoSocio.estado], (error, resu, _filed) => {
                            if (error)
                                throw error;
                            console.log(resu);

                            // Identifica el id de socio nuevo
                            var idSocio;
                            setTimeout(()=>{
                                let query2 = `SELECT id_socio FROM socios WHERE nro_socio = ? AND dni = ?`;
                                conexion.query(query2,[nroSocioNumero,dniNumero],(erro,resul)=>{
                                    if(erro)
                                        throw erro;
                                    resul.forEach(element=>{
                                        idSocio = element.id_socio

                                    });

                                // Registra el pago
                                let importeNum = parseInt(nuevoPago.importe);
                                let nuevaCuotaMensual = `${fechaAlta.getFullYear()}-${(fechaAlta.getMonth()+1)}-01 00:00:00`;

                                let query3 = 'INSERT INTO pagos (id_socio, importe, modo_de_pago, fecha_de_pago_completo, cuota_mensual, observacion, eliminado) VALUES (?, ?, ?, ?, ?, ?, ?)';
                                conexion.query(query3,[idSocio,importeNum,nuevoPago.modoDePago,fechaAlta,nuevaCuotaMensual, nuevoPago.observacion, nuevoPago.eliminado],(err,resu,filed)=>{
                                    if(err)
                                        throw err;
                                    console.log(resu);
                                    resultado.send(JSON.stringify(`El socio y la cuota fueron dados alta`));
                                });
                                    });
                            },500);

                        });


                    }
                });

            }
    
        });


    }


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


// Buscar Dni para Cargar Pago y busca los registros de pagos
const buscarDniParaPagos = (dni,nroSocio,res) => {
    const fechaRegistracionPago = new Date();
    const datosParaEnviarPagos = [];

    let dataSocio = {};
    let query = 'SELECT id_socio,nombres,apellidos,dni,nro_socio FROM socios WHERE dni = ? OR nro_socio = ? AND eliminado = false';
    let db = conexion.query(query,[dni,nroSocio],(error,resultado,_filed) => {
        if(error)
            throw error;
        resultado.map(element => {
            
            dataSocio = { 
                idSocio : element.id_socio,
                nombres : element.nombres,
                apellidos : element.apellidos,
                dni : element.dni,
                nroSocio: element.nro_socio,
                fechaRegistracionPago : fechaRegistracionPago

            } 
        });
        datosParaEnviarPagos.push(dataSocio);

        
        let query2 = `SELECT id_pago, fecha_de_pago_completo, cuota_mensual, importe, modo_de_pago, observacion FROM pagos WHERE id_socio = ? AND eliminado = false ORDER BY  cuota_mensual DESC`;
        let listaDataPagos = [];
        let dataPagos = {};
        conexion.query(query2,[dataSocio.idSocio],(error,resultado,_filed)=>{
            if(error)
                throw error;
            resultado.forEach(res => {
                const fechaCuotaMensual = new Date(res.cuota_mensual);
                let mesDePago = (identificarNumeroMes(fechaCuotaMensual.getMonth()+1));
                let anoDePago = fechaCuotaMensual.getFullYear();
                let mesYAnoDePago = `${mesDePago} ${anoDePago}`;
                let fechaDePagoCompleto = armarFechaParaMostar(res.fecha_de_pago_completo);
                dataPagos = {
                    idPago: res.id_pago,
                    fechaDePago: fechaDePagoCompleto,
                    cuotaMensual: mesYAnoDePago,
                    importe: res.importe,
                    modoDePago: res.modo_de_pago,
                    observacion: res.observacion
                }
                listaDataPagos.push(dataPagos);
            });
            datosParaEnviarPagos.push(listaDataPagos);


            res.send(JSON.stringify(datosParaEnviarPagos));
            
        });

        
        
    });
}





// Guarda el pago mensual del soscio
//Buscar manera de registrar idSocio
const registrarPago = (idSocio,importe,modoDePago,fechaDePagoCompleto,mesDePago,observacion,eliminado,respuesta) => {
    

        let validarMesDePago;
        let cuotaMensual;
        if(mesDePago === "13" ) {
            cuotaMensual = new Date(`${fechaDePagoCompleto.getFullYear()+1}-01-01 00:00:000`);
        } else{
            cuotaMensual = new Date(`${fechaDePagoCompleto.getFullYear()}-${mesDePago}-01 00:00:000`);
        }

        // cuotaMensual.setDate(cuotaMensual.getDate()+1);


        //Hacer la consulta si existe un registro de pago
        let queryConsulta = `SELECT id_pago FROM pagos WHERE id_socio = ? AND cuota_mensual = ? AND eliminado = false;`;
        conexion.query(queryConsulta,[idSocio,cuotaMensual],(err,res,filed)=>{
            if(err)
                throw err;
            res.forEach(element => {

                validarMesDePago = element.id_pago;   
            });


            if(validarMesDePago == null) {

                //Si no existe un registro con mismo mes y año se carga el dato
                let query = 'INSERT INTO pagos (id_socio, importe, modo_de_pago, fecha_de_pago_completo, cuota_mensual, observacion, eliminado) VALUES (?, ?, ?, ?, ?, ?, ?)';
                conexion.query(query,[idSocio,parseInt(importe),modoDePago,fechaDePagoCompleto,cuotaMensual, observacion, eliminado],(err,res,filed)=>{
                    if(err)
                        throw err;
                    console.log(res);
                
                    //Actualizar la lista de registros por id Socio
                    let envioRespuestaPagos = [];
                    let listaRegistrosPagos = [];
                    let registroPagos = {};
                    let query2 = 'SELECT id_pago, fecha_de_pago_completo, cuota_mensual, importe, modo_de_pago, observacion FROM pagos WHERE id_socio = ? AND eliminado = false ORDER BY cuota_mensual DESC';
                    conexion.query(query2,[idSocio],(err,resu,filed)=>{
                        if(err)
                            throw err;
                        resu.forEach(res=>{
 
                            const fechaCuotaMensual = new Date(res.cuota_mensual);
                            let mesDePago = (identificarNumeroMes(fechaCuotaMensual.getMonth()+1));
                            let anoDePago = fechaCuotaMensual.getFullYear();
                            let mesYAnoDePago = `${mesDePago} ${anoDePago}`;
                            let fechaDePago = armarFechaParaMostar(res.fecha_de_pago_completo)
                            registroPagos = {
                                
                                idPago: res.id_pago,
                                fechaDePago: fechaDePago,
                                cuotaMensual: mesYAnoDePago,
                                importe: res.importe,
                                modoDePago:res.modo_de_pago,
                                observacion: res.observacion
                            }
                            listaRegistrosPagos.push(registroPagos);
                        });
                        envioRespuestaPagos = [`El pago ha sido registrado`,listaRegistrosPagos];
                        

                        respuesta.send(JSON.stringify(envioRespuestaPagos));
                    });
            
            });
            
            } else {

                let respuestaEnvioSinDatos = [`Ya existe un registro con el mismo mes y año`,null];
                respuesta.send(JSON.stringify(respuestaEnvioSinDatos));
            }
        });
    


}





const actualizarRegistrosPagos = (importe,observacion,modoDePago,id,resultado) => {
    let query = `UPDATE pagos SET importe = ?, observacion = ?, modo_de_pago = ? WHERE id_pago = ?`;
    conexion.query(query,[importe,observacion,modoDePago,id],(err,res,filed)=>{
        if(err)
            throw err;
        let objeto = [{
            importe: importe,
            modoDePago: modoDePago,
            observacion: observacion
        },`Se han modificados los datos correctamente`];
        resultado.send(JSON.stringify(objeto));
    });
}

const actualizarRegistrosPagosCaja = (importe,observacion,modoDePago,id,fechaInput,ingresoOegreso,resultado) => {
    let query = `UPDATE caja SET importe = ?, concepto = ?, modo_de_pago = ? WHERE id_caja = ?`;
    conexion.query(query,[importe,observacion,modoDePago,id],(err,res,filed)=>{
        if(err)
            throw err;


        if(ingresoOegreso === `Ingreso`) {

            let query = `
            SELECT importe
            FROM caja
            WHERE fecha_de_pago = ? AND tipo_de_caja = ? AND eliminado = false;
            `;
            conexion.query(query,[fechaInput,ingresoOegreso],(erro,resu)=>{
                if(erro)
                    throw erro;
    

                let totalImporte = 0; 
                resu.forEach(ele=>{

                    totalImporte += ele.importe;

                });
                
                let query2 = `
                SELECT importe
                FROM pagos 
                WHERE  fecha_de_pago_completo = ? AND eliminado = false
                `;
        
                conexion.query(query2,[fechaInput],(err,res)=>{
        
                    if(err)
                        throw err;
        
                    res.forEach(el=>{
        
                        totalImporte += el.importe;

                    });

                    resultado.send(JSON.stringify(totalImporte));
        
                });
    
            });
        
        }
        else if(ingresoOegreso === `Egreso`) {
    
            let query2 = `
            SELECT importe
            FROM caja
            WHERE fecha_de_pago = ? AND tipo_de_caja = ? AND eliminado = false;
            `;
            conexion.query(query2,[fechaInput,ingresoOegreso],(erro,resu)=>{
                if(erro)
                    throw erro;
    
                let totalImporte = 0; 
                resu.forEach(ele=>{

                    totalImporte += ele.importe;

                });
                
                    resultado.send(JSON.stringify(totalImporte));
    
            });
        }

    });

}

const eliminarRegistroPagosSocio = (idPago,idSocio,fechaEliminarPago,idUsuarioQuienElimino,usuarioQuienElimino,resultado) => {
    let query = `UPDATE pagos SET eliminado = true, fecha_eliminado = ?, id_quien_elimino = ?, usuario_quien_elimino = ?  WHERE id_pago = ?`;
    conexion.query(query,[fechaEliminarPago,idUsuarioQuienElimino,usuarioQuienElimino,idPago],(err,res,filed)=>{
        if(err)
            throw err;
        else console.log(res);

        let datosParaEnviar = [];
        let listaRegistrosPagos = [];
        let registroPagos = {};
        let query2 = 'SELECT id_pago, fecha_de_pago_completo, cuota_mensual, importe, modo_de_pago, observacion FROM pagos WHERE id_socio = ? AND eliminado = false ORDER BY cuota_mensual DESC';
        conexion.query(query2,[idSocio],(err,res,filed)=>{
            if(err)
                throw err;
            res.forEach(res=>{
                let mesDePago = (identificarNumeroMes(res.cuota_mensual.getMonth()+1));
                let anoDePago = res.cuota_mensual.getFullYear();
                let mesYAnoDePago = `${mesDePago} ${anoDePago}`;
                registroPagos = {
                    idPago : res.id_pago,
                    fechaDePago: res.fecha_de_pago_completo,
                    cuotaMensual: mesYAnoDePago,
                    importe: res.importe,
                    modoDePago: res.modo_de_pago,
                    observacion: res.observacion
                }
                listaRegistrosPagos.push(registroPagos);
            });

            if(listaRegistrosPagos.length === 0)  {
                listaRegistrosPagos = "0";
            }
            datosParaEnviar = [`El pago ha sido eliminado`,listaRegistrosPagos];

            
            resultado.send(JSON.stringify(datosParaEnviar));
        });

    });
    
}





// Lista general de socios Activos
const generarListaSociosActivos = (respuesta,mensaje,activoOMoroso)=> {

    let listaSociosActivos = [];
    let objetoSocioActivo = {};
    let query = `
    SELECT s.id_socio, s.nombres, s.apellidos, s.estado, s.fecha_registracion, s.fecha_reactivacion, MAX(p.id_pago) AS ulti_id_pago, MAX(p.cuota_mensual) AS ulti_cuota_mensual
    FROM pagos p, socios s
    WHERE p.id_socio = s.id_socio AND s.estado = true AND p.eliminado = false
    GROUP BY s.id_socio
    ORDER BY RAND()
    LIMIT 150;`;
    conexion.query(query,(err,res,_filed)=>{
        if(err)
            throw err;

        res.forEach(element => {
            
            let fechaCorrecta;
            if(element.fecha_reactivacion === null) {
                fechaCorrecta = new Date(element.fecha_registracion);
            } else {
                fechaCorrecta = new Date(element.fecha_reactivacion);
            }

            let fechaCuotaMensual = new Date(element.ulti_cuota_mensual);

            let fechaMorosidad;
            if(fechaCuotaMensual.getMonth()+1 === 12) {
                fechaCuotaMensual.setMonth(1);
                fechaMorosidad = new Date(`${fechaCuotaMensual.getFullYear()+1}-${fechaCuotaMensual.getMonth(0)}-${fechaCorrecta.getDate()}`);
                

            } else {

                fechaMorosidad = new Date(`${fechaCuotaMensual.getFullYear()}-${fechaCuotaMensual.getMonth()+2}-${fechaCorrecta.getDate()}`);
            }


            let situacionMora = detectarSituacionYMorosidad(fechaMorosidad);

            let fechaAccesoHasta = armarFechaParaMostar(fechaMorosidad);

            objetoSocioActivo = {
                idSocio : element.id_socio,
                nombres : element.nombres,
                apellidos : element.apellidos,
                estado: element.estado,
                ultiIDPago : element.ulti_id_pago,
                ultimaFechaDePago: fechaAccesoHasta,
                situacion : situacionMora.situacion,
                morosidad : situacionMora.morisidad,
                color: situacionMora.color,
                inactivarSocio: situacionMora.inactivarSocio
            }
        
           listaSociosActivos.push(objetoSocioActivo);
           
        });


        let listaYMensaje = [listaSociosActivos,mensaje,activoOMoroso];
        respuesta.send(JSON.stringify(listaYMensaje));


    });

}

//Lista de socios Activos y Morosos
function generarListaSociosMorososActivos(respuesta,activoOMoroso) {
    
    let listaSociosActivos = [];
    let objetoSocioActivo = {};
    let query = `
    SELECT s.id_socio, s.nombres, s.apellidos, s.estado, s.fecha_registracion, s.fecha_reactivacion, MAX(p.id_pago) AS ulti_id_pago, MAX(p.cuota_mensual) AS ulti_cuota_mensual
    FROM pagos p, socios s
    WHERE p.id_socio = s.id_socio AND s.estado = true AND p.eliminado = false
    GROUP BY s.id_socio
    `;

    conexion.query(query,(err,res,_filed)=>{
        if(err)
            throw err;
        res.forEach(element=>{
        
            let fechaCorrecta;
            if(element.fecha_reactivacion === null) {
                fechaCorrecta = new Date(element.fecha_registracion);
            } else {
                fechaCorrecta = new Date(element.fecha_reactivacion);
            }

            let fechaCuotaMensual = new Date(element.ulti_cuota_mensual);

            let fechaMorosidad;
            if(fechaCuotaMensual.getMonth()+1 === 12) {
                fechaCuotaMensual.setMonth(1);
                fechaMorosidad = new Date(`${fechaCuotaMensual.getFullYear()+1}-${fechaCuotaMensual.getMonth(0)}-${fechaCorrecta.getDate()}`);
                

            } else {

                fechaMorosidad = new Date(`${fechaCuotaMensual.getFullYear()}-${fechaCuotaMensual.getMonth()+2}-${fechaCorrecta.getDate()}`);
            }

            let situacionMora = detectarSituacionYMorosidad(fechaMorosidad);

            if(situacionMora.color == `rojo`) {

                let fechaAccesoHasta = armarFechaParaMostar(fechaMorosidad);

                objetoSocioActivo = {
                    idSocio : element.id_socio,
                    nombres : element.nombres,
                    apellidos : element.apellidos,
                    estado: element.estado,
                    ultiIDPago : element.ulti_id_pago,
                    ultimaFechaDePago: fechaAccesoHasta,
                    situacion : situacionMora.situacion,
                    morosidad : situacionMora.morisidad,
                    color: situacionMora.color,
                    inactivarSocio: situacionMora.inactivarSocio
                }
            
               listaSociosActivos.push(objetoSocioActivo);
            }
        
        });

        if(listaSociosActivos.length > 0) {
            
            let respues = [listaSociosActivos,"El socio ha sido inactivado",activoOMoroso]
            respuesta.send(respues);

        } else {

            respuesta.send(JSON.stringify(`No se han encontrado socios morosos`));
        }

    });
}

// Buscar Socio Activo Por DNI o Nro Socio
function buscarSocioActivo(dniONroSocio,resultado) {

    let query = `
    SELECT s.id_socio, s.nombres, s.apellidos, s.estado, s.fecha_registracion, s.fecha_reactivacion, MAX(p.id_pago) AS ulti_id_pago, MAX(p.cuota_mensual) AS ulti_cuota_mensual
    FROM pagos p, socios s
    WHERE (s.dni = ? OR s.nro_socio = ?) AND s.id_socio = p.id_socio AND s.estado = true AND p.eliminado = false
    GROUP BY s.id_socio;`;


    
    let objetoSocioActivo = {};
    conexion.query(query,[dniONroSocio,dniONroSocio],(err,resu,_filed)=>{
        if(err)
            throw err;
        resu.forEach(element=>{

            let fechaCorrecta;
            if(element.fecha_reactivacion === null) {
                fechaCorrecta = new Date(element.fecha_registracion);
            } else {
                fechaCorrecta = new Date(element.fecha_reactivacion);
            }

            let fechaCuotaMensual = new Date(element.ulti_cuota_mensual);

            let fechaMorosidad;
            if(fechaCuotaMensual.getMonth()+1 === 12) {
                fechaCuotaMensual.setMonth(1);
                fechaMorosidad = new Date(`${fechaCuotaMensual.getFullYear()+1}-${fechaCuotaMensual.getMonth(0)}-${fechaCorrecta.getDate()}`);
                

            } else {

                fechaMorosidad = new Date(`${fechaCuotaMensual.getFullYear()}-${fechaCuotaMensual.getMonth()+2}-${fechaCorrecta.getDate()}`);
            }

            let situacionMora = detectarSituacionYMorosidad(fechaMorosidad);

            let fechaAccesoHasta = armarFechaParaMostar(fechaMorosidad);

            objetoSocioActivo = {
                idSocio : element.id_socio,
                nombres : element.nombres,
                apellidos : element.apellidos,
                estado: element.estado,
                ultiIDPago : element.ulti_id_pago,
                ultimaFechaDePago: fechaAccesoHasta,
                situacion : situacionMora.situacion,
                morosidad : situacionMora.morisidad,
                color: situacionMora.color,
                inactivarSocio: situacionMora.inactivarSocio
            }
        
           objetoSocioActivo;
        });

        
        if(objetoSocioActivo.idSocio == undefined) {

            resultado.send(JSON.stringify("Socio Inactivo o inexistente"));
        } else {

            resultado.send(JSON.stringify(objetoSocioActivo));
        }
    });

}

function detectarSituacionYMorosidad(ultimaCuota) {

    const fechaDeHoy = new Date();
    

    let diferenciaDias = Math.floor((fechaDeHoy - ultimaCuota)/1000/60/60/24);
  
    let situacionYMora = {};

    if(diferenciaDias <= 0) {
        situacionYMora = {
            situacion : `Al dia`,
            morisidad : `0 dias`,
            color : `verde`,
            inactivarSocio: false
        }
    } else {

        let color;
        let situacion;
        let inactivarSocio;
        
        if(diferenciaDias > 0  && diferenciaDias <= 15) {
            color = `amarillo`;
            situacion = `En Mora`;
            inactivarSocio = false;
        } else {
            color = `rojo`;
            situacion = `Pagar cuota`;
            inactivarSocio = true;
        }
        situacionYMora = {
            situacion : situacion,
            morisidad : `${(diferenciaDias)} dias`,
            color : color,
            inactivarSocio : inactivarSocio
        }
    }

    return situacionYMora;

}

detectarSituacionYMorosidad(new Date("2023-12-01"));
// Identificar numero de Mes Pago 
function identificarNumeroMes(numero) {
    
    switch(numero) {

        case 1: return "Enero";
        case 2: return "Febrero";        
        case 3: return "Marzo";        
        case 4: return "Abril";        
        case 5: return "Mayo";        
        case 6: return "Junio";        
        case 7: return "Julio";        
        case 8: return "Agosto";        
        case 9: return "Septiembre";        
        case 10: return "Octubre";
        case 11: return "Noviembre";
        case 12: return "Diciembre";
     
    }
}

function inactivarSocio(idSocio,activoOMoroso,resultado) {

    
    let query = `UPDATE socios SET estado = false WHERE id_socio = ?`;
    conexion.query(query,[idSocio],(err,resu,_filed)=>{
        if(err)
            throw err;
        else console.log(resu);

        if(activoOMoroso === "Activo") {
            generarListaSociosActivos(resultado,"El socio ha sido inactivado",activoOMoroso);
        }
        else if(activoOMoroso === "Moroso") {
            generarListaSociosMorososActivos(resultado,activoOMoroso)
        }


        

    });
}
 
function verFichaSocio(idSocio,resultado) {
   let query = `SELECT id_socio, nombres, apellidos, dni, nro_socio, mail, telefono, domicilio, fecha_nacimiento, fecha_registracion, fecha_reactivacion FROM socios WHERE id_socio = ?`;

   conexion.query(query,[idSocio],(err,resu,_filed)=>{
    if(err)
        throw err;

    resu.forEach(ele=>{


        const fechaAlta = new Date(ele.fecha_registracion);
        const fechaNacimiento = new Date(ele.fecha_nacimiento);
        const fechaReactivacion = new Date(ele.fecha_reactivacion);
        let fechaReactivacionEdit = "";

        if(!(ele.fecha_reactivacion === null)) {

            let fechaReactivacionFecha = fechaReactivacion.getDate();
            if(fechaReactivacionFecha >= 1 && fechaReactivacionFecha < 10){
                fechaReactivacionFecha = `0${fechaReactivacionFecha}`;
            }
            let fechaReactivacionMes = fechaReactivacion.getMonth() + 1;
            if(fechaReactivacionMes >= 1 && fechaReactivacionMes < 10){
                fechaReactivacionMes = `0${fechaReactivacionMes}`;
            }
            let fechaReactivacionAno = fechaReactivacion.getFullYear();
            fechaReactivacionEdit = `${fechaReactivacionFecha}/${fechaReactivacionMes}/${fechaReactivacionAno}`;
        }
        let fechaNacimientoEdit;

        if(ele.fecha_nacimiento === `0000-00-00`) {

            fechaNacimientoEdit = ``;

        } else {

            let fechaNacimientoFecha = fechaNacimiento.getDate();
            if(fechaNacimientoFecha >= 1 && fechaNacimientoFecha < 10){
                fechaNacimientoFecha = `0${fechaNacimientoFecha}`;
            }

            let fechaNacimientoMes = fechaNacimiento.getMonth() + 1;
            if(fechaNacimientoMes >= 1 && fechaNacimientoMes < 10){
                fechaNacimientoMes = `0${fechaNacimientoMes}`;
            }

            let fechaNacimientoAno = fechaNacimiento.getFullYear();
            fechaNacimientoEdit = `${fechaNacimientoFecha}/${fechaNacimientoMes}/${fechaNacimientoAno}`;
        }


        let fechaAltaFecha = fechaAlta.getDate();
        if(fechaAltaFecha >= 1 && fechaAltaFecha < 10){
            fechaAltaFecha = `0${fechaAltaFecha}`;
        }
        let fechaAltaMes = fechaAlta.getMonth() + 1;
        if(fechaAltaMes >= 1 && fechaAltaMes < 10){
            fechaAltaMes = `0${fechaAltaMes}`;
        }



        let fechaAltaAno = fechaAlta.getFullYear();

        const fechaAltaEdit = `${fechaAltaFecha}/${fechaAltaMes}/${fechaAltaAno}`;



        let objetoFichaSocio = {
            idSocio: ele.id_socio,
            nombre: ele.nombres,
            apellido: ele.apellidos,
            dni: ele.dni,
            nroSocio: ele.nro_socio,
            correo: ele.mail,
            telefono: ele.telefono,
            domicilio: ele.domicilio,
            fechaNacimientoEdit: fechaNacimientoEdit,
            fechaNacimiento: ele.fecha_nacimiento,
            fechaAlta: fechaAltaEdit,
            fechaReactivacion : fechaReactivacionEdit
        }

        resultado.send(objetoFichaSocio);
        
    });


   });
}

function actualizarFichaSocio(datosSocio,resultado) {

    
    let idSocio = parseInt(datosSocio.idSocio);
    let dni = parseInt(datosSocio.dni);
    let nroSocio = parseInt(datosSocio.nroSocio);
    let telefono;
    let fechaCumpleanos;
    let mesCumpleanos;

    if(datosSocio.fechaNacimiento === ``) {
        datosSocio.fechaNacimiento = `00-00-0000`;
        fechaCumpleanos = null;
        mesCumpleanos = null;
    } else {
        
        fechaCumpleanos = parseInt(datosSocio.fechaNacimiento.slice(8,10));
        mesCumpleanos = parseInt(datosSocio.fechaNacimiento.slice(5,7));
    }

    

    if(datosSocio.telefono == "" || datosSocio.telefono == undefined || datosSocio.telefono == null) {
        datosSocio.telefono = undefined;
    } else {
         telefono = parseInt(datosSocio.telefono);
    }



    let existeDNI = false;
    existeNroSocio = false;    
    let queryDNI = `SELECT dni, id_socio FROM socios WHERE dni = ?`;
    conexion.query(queryDNI,[dni],(erro,resu,filed)=>{
        if(erro)
            throw erro;
        resu.forEach(ele=>{
            if(!(ele.dni === undefined) && !(ele.id_socio == idSocio)) {
                existeDNI = true;
            }
        });
        if(existeDNI) {
            resultado.send(JSON.stringify(`El numero de DNI ya existe`));
        } else {
            let queryNroSocio = `SELECT nro_socio, id_socio FROM socios WHERE nro_socio = ?`;
                conexion.query(queryNroSocio,[nroSocio],(err,res,filedd)=>{
                    if(err)
                        throw err;
                    res.forEach(el=>{
                        if(!(el.nro_socio === undefined) && !(el.id_socio == idSocio)) {
                            existeNroSocio = true;
                        }
                    });
                    if(existeNroSocio) {
                        resultado.send(JSON.stringify(`El numero de socio ya existe`));
                    } else {
                        let query = `UPDATE socios SET nombres = ?, apellidos = ?, dni = ?, nro_socio = ?, mail = ?, telefono = ?, domicilio = ?, fecha_nacimiento = ?, fecha_cumpleanos = ?, mes_cumpleanos = ? WHERE id_socio = ?`;
                        conexion.query(query,[datosSocio.nombre,datosSocio.apellido,dni,nroSocio,datosSocio.correo,telefono,datosSocio.domicilio,datosSocio.fechaNacimiento,fechaCumpleanos, mesCumpleanos ,idSocio],(error,resul,fileddd)=>{
                            if(error)
                                throw error;
                            console.log(resul);
                            
                            resultado.send(JSON.stringify(`Se ha actualizado la ficha del socio`,datosSocio.dni));
                        });
                    }
                });        
        }
    });


}

// Lista general de socios Inactivos
const generarListaSociosInactivos = (respuesta,mensaje)=> {

    let listaSociosActivos = [];
    let objetoSocioActivo = {};
    let query = `
    SELECT s.id_socio, s.nombres, s.apellidos, s.estado, s.fecha_registracion, s.fecha_reactivacion, MAX(p.id_pago) AS ulti_id_pago, MAX(p.cuota_mensual) AS ulti_cuota_mensual
    FROM pagos p, socios s 
    WHERE p.id_socio = s.id_socio AND s.estado = false AND p.eliminado = false AND s.eliminado = false
    GROUP BY s.id_socio
    ORDER BY RAND()
    LIMIT 150`;
    conexion.query(query,(err,res,_filed)=>{
        if(err)
            throw err;

        res.forEach(element => {
                   
            let fechaCorrecta;
            if(element.fecha_reactivacion === null) {
                fechaCorrecta = new Date(element.fecha_registracion);
            } else {
                fechaCorrecta = new Date(element.fecha_reactivacion);
            }


            let fechaCuotaMensual = new Date(element.ulti_cuota_mensual);

            let fechaMorosidad;
            if(fechaCuotaMensual.getMonth()+1 === 12) {
                fechaCuotaMensual.setMonth(1);
                fechaMorosidad = new Date(`${fechaCuotaMensual.getFullYear()+1}-${fechaCuotaMensual.getMonth(0)}-${fechaCorrecta.getDate()}`);
                

            } else {

                fechaMorosidad = new Date(`${fechaCuotaMensual.getFullYear()}-${fechaCuotaMensual.getMonth()+2}-${fechaCorrecta.getDate()}`);
            }
            let situacionMora = detectarSituacionYMorosidad(fechaMorosidad);

            let fechaAccesoHasta = armarFechaParaMostar(fechaMorosidad);

            objetoSocioActivo = {
                idSocio : element.id_socio,
                nombres : element.nombres,
                apellidos : element.apellidos,
                estado: element.estado,
                ultiIDPago : element.ulti_id_pago,
                ultimaFechaDePago: fechaAccesoHasta,
                situacion : situacionMora.situacion,
                morosidad : situacionMora.morisidad,
                color: situacionMora.color
            }
        
           listaSociosActivos.push(objetoSocioActivo);
           
        });
        
        let listaYMensaje = [listaSociosActivos,mensaje];
        respuesta.send(JSON.stringify(listaYMensaje));


    });

}

function activarSocio(idSocio,resultado) {

    const fechaReactivacion = new Date();
    let query = `UPDATE socios SET estado = true, fecha_reactivacion = ? WHERE id_socio = ?;`;
    conexion.query(query,[fechaReactivacion,idSocio],(err,resu,_filed)=>{
        if(err)
            throw err;
        else console.log(resu);

        generarListaSociosInactivos(resultado,"El socio ha sido activado");

    });
}

function eliminarSocio(idSocio,fechaEliminado,idUsuarioQuienElimino,usuarioQuienElimino,resultado) {

    
    let query = `UPDATE socios SET eliminado = true, fecha_eliminado = ?, id_quien_elimino = ?, usuario_quien_elimino = ? WHERE id_socio = ? AND eliminado = false;`;
    conexion.query(query,[fechaEliminado,idUsuarioQuienElimino,usuarioQuienElimino,idSocio],(err,res,filed)=>{
        if(err)
            throw err;
        
            generarListaSociosInactivos(resultado,"El socio ha sido eliminado");
    });
}

function buscarSocioInactivo(dniONroSocio,resultado) {

    let query = `
    SELECT s.id_socio, s.nombres, s.apellidos, s.estado, s.fecha_registracion, s.fecha_reactivacion, MAX(p.id_pago) AS ulti_id_pago, MAX(p.cuota_mensual) AS ulti_cuota_mensual
    FROM pagos p, socios s
    WHERE (s.dni = ? OR s.nro_socio = ?) AND s.id_socio = p.id_socio AND s.estado = false AND p.eliminado = false
    GROUP BY s.id_socio;`;

    
    let objetoSocioActivo = {};
    conexion.query(query,[dniONroSocio,dniONroSocio],(err,resu,_filed)=>{
        if(err)
            throw err;
        resu.forEach(element=>{

            let fechaCorrecta;
            if(element.fecha_reactivacion === null) {
                fechaCorrecta = new Date(element.fecha_registracion);
            } else {
                fechaCorrecta = new Date(element.fecha_reactivacion);
            }

            let fechaCuotaMensual = new Date(element.ulti_cuota_mensual);

            let fechaMorosidad;
            
            if(fechaCuotaMensual.getMonth()+1 === 12) {
                fechaCuotaMensual.setMonth(1);
                fechaMorosidad = new Date(`${fechaCuotaMensual.getFullYear()+1}-${fechaCuotaMensual.getMonth(0)}-${fechaCorrecta.getDate()}`);
            } else {

                fechaMorosidad = new Date(`${fechaCuotaMensual.getFullYear()}-${fechaCuotaMensual.getMonth()+2}-${fechaCorrecta.getDate()}`);
            }

            let situacionMora = detectarSituacionYMorosidad(fechaMorosidad);

            let fechaAccesoHasta = armarFechaParaMostar(fechaMorosidad);


            objetoSocioActivo = {
                idSocio : element.id_socio,
                nombres : element.nombres,
                apellidos : element.apellidos,
                estado: element.estado,
                ultiIDPago : element.ulti_id_pago,
                ultimaFechaDePago: fechaAccesoHasta,
                situacion : situacionMora.situacion,
                morosidad : situacionMora.morisidad,
                color: situacionMora.color
            }
        
           objetoSocioActivo;
        });

        
        if(objetoSocioActivo.idSocio == undefined) {

            resultado.send(JSON.stringify("Socio activo o inexistente"));
        } else {

            resultado.send(JSON.stringify(objetoSocioActivo));
        }
    });

}

function generarListaUsuarios(resultado) {

    let listaUsuarios = [];
    let usuario = {};
    let query = `SELECT id, usuario FROM usuarios`;
    conexion.query(query,(err,res)=>{

        res.forEach(ele=>{
            usuario = {
                id: ele.id,
                usuario: ele.usuario
            }
            listaUsuarios.push(usuario);
        });

        resultado.send(JSON.stringify(listaUsuarios))
    });
}

function actualizarPassUsuario(passActual,passNueva,id,resultado) {

    let usuarioPassword = "";
    let query = `SELECT id, password FROM usuarios WHERE id = ?`;
    conexion.query(query,[id],(err,res)=>{
        if(err)
            throw err;
        res.forEach(ele => {
            usuarioPassword = ele.password;
        });

        const hash = crypto.createHash("sha256").update(passActual).digest("hex");

        if(!(usuarioPassword === hash)) {
            
            resultado.send(JSON.stringify(`La contraseña actual es incorrecta`));

        } else {

            const hash2 = crypto.createHash("sha256").update(passNueva).digest("hex");
            let query2 = `UPDATE usuarios SET password = ? WHERE id = ?`;
            conexion.query(query2,[hash2,id],(erro,resu)=>{
                if(erro)
                    throw erro;
                console.log(resu);
                resultado.send(JSON.stringify(`La contraseña se cambio correctamente`));
            });
        }
    })
}

function verFichaPagos(idSocio,resultado) {

    const fechaRegistracionPago = new Date();
    const datosParaEnviarPagos = [];
    let dataSocio = {};
    let query = 'SELECT id_socio,nombres,apellidos,dni,nro_socio FROM socios WHERE id_socio = ? AND eliminado = false';
    conexion.query(query,[idSocio],(err,resul,_filed) => {
        if(err)
            throw err;
        resul.forEach(element => {            
            dataSocio = { 
                idSocio : element.id_socio,
                nombres : element.nombres,
                apellidos : element.apellidos,
                dni : element.dni,
                nroSocio: element.nro_socio,
                fechaRegistracionPago : fechaRegistracionPago
            } 
        });
        datosParaEnviarPagos.push(dataSocio);

        
        let query2 = `SELECT id_pago, fecha_de_pago_completo, cuota_mensual, importe, modo_de_pago, observacion FROM pagos WHERE id_socio = ? AND eliminado = false ORDER BY  cuota_mensual DESC`;
        let listaDataPagos = [];
        let dataPagos = {};
        conexion.query(query2,[dataSocio.idSocio],(error,resu,_filed)=>{
            if(error)
                throw error;
            resu.forEach(res => {
                let fechaCuotaMensual = new Date(res.cuota_mensual);
                let mesDePago = (identificarNumeroMes(fechaCuotaMensual.getMonth()+1));
                let anoDePago = fechaCuotaMensual.getFullYear();
                let mesYAnoDePago = `${mesDePago} ${anoDePago}`;
                let fechaDePago = armarFechaParaMostar(res.fecha_de_pago_completo)

                dataPagos = {
                    idPago: res.id_pago,
                    fechaDePago: fechaDePago,
                    cuotaMensual: mesYAnoDePago,
                    importe: res.importe,
                    modoDePago: res.modo_de_pago,
                    observacion: res.observacion
                }
                listaDataPagos.push(dataPagos);
            });
            datosParaEnviarPagos.push(listaDataPagos);
            
  
            resultado.send(JSON.stringify(datosParaEnviarPagos));
            
        });

        
        
    });
}

const nuevoPagoCaja = (datosPago,fechaAlta,resultado) => {

    let importeNum = parseInt(datosPago.importe);

    let query = `INSERT INTO caja (concepto, importe, modo_de_pago, fecha_de_pago, tipo_de_caja, eliminado) VALUES (?, ?, ?, ?, ?, ?)`
    conexion.query(query,[datosPago.concepto,importeNum,datosPago.modoDePago,fechaAlta,datosPago.tipoDePago, false],(err,res)=>{

        if(err)
            throw err;
        resultado.send(JSON.stringify(`El pago de la caja se cargó correctamente`));
    });
} 

const buscarFechaCaja = (datosFecha,resultado,actualizar) =>{

    if(datosFecha.tipoDePago === `Ingreso`) {

        let query = `
        SELECT id_caja, concepto, importe, modo_de_pago, fecha_de_pago
        FROM caja
        WHERE fecha_de_pago = ? AND tipo_de_caja = ? AND eliminado = false;
        `;
        conexion.query(query,[datosFecha.fecha,datosFecha.tipoDePago],(erro,resu)=>{
            if(erro)
                throw erro;

            let registroPagoSocio = {};
            let listaRegistrosPagosSocios = [];
            let totalImporte = 0; 
            resu.forEach(ele=>{
                const fecha = new Date(ele.fecha_de_pago);
                const fechaMostrar = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
                registroPagoSocio = {
                    fecha: fechaMostrar,
                    socioOConcepto: ele.concepto,
                    nroSocio: `--------`,
                    importe: ele.importe,
                    modoDePago: ele.modo_de_pago,
                    idPago: ele.id_caja,
                }

                totalImporte += ele.importe;
                listaRegistrosPagosSocios.push(registroPagoSocio);
            });
            
            let query2 = `
            SELECT p.fecha_de_pago_completo, p.importe, p.modo_de_pago, s.nombres, s.apellidos, s.nro_socio
            FROM pagos p
            INNER JOIN socios s
            ON p.id_socio = s.id_socio
            WHERE  fecha_de_pago_completo = ? AND p.eliminado = false
            `;
    
            conexion.query(query2,[datosFecha.fecha],(err,res)=>{
    
                if(err)
                    throw err;
    
                res.forEach(el=>{
                    const fecha = new Date(el.fecha_de_pago_completo);
                    const fechaMostrar2 = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
    
                    registroPagoSocio = {
                        fecha: fechaMostrar2,
                        socioOConcepto: `${el.nombres} ${el.apellidos}`,
                        nroSocio: el.nro_socio,
                        importe: el.importe,
                        modoDePago: el.modo_de_pago,
                        idPago: undefined
                    }
    
                    totalImporte += el.importe;
                    listaRegistrosPagosSocios.push(registroPagoSocio);
                });
                
                if(listaRegistrosPagosSocios.length === 0) {

                    resultado.send(JSON.stringify(`No existen registros del dia seleccionado`));
                }
                else {
                    
                    if(actualizar) {
                        resultado.send(JSON.stringify(totalImporte));
                    }
                    const arregloEnviar = [listaRegistrosPagosSocios,totalImporte,datosFecha.tipoDePago];
                    resultado.send(JSON.stringify(arregloEnviar));
                }
    
            });

        });




    }
    else if(datosFecha.tipoDePago === `Egreso`) {

        let query2 = `
        SELECT id_caja, concepto, importe, modo_de_pago, fecha_de_pago
        FROM caja
        WHERE fecha_de_pago = ? AND tipo_de_caja = ? AND eliminado = false;
        `;
        conexion.query(query2,[datosFecha.fecha,datosFecha.tipoDePago],(erro,resu)=>{
            if(erro)
                throw erro;

            let registroPagoSocio = {};
            let listaRegistrosPagosSocios = [];
            let totalImporte = 0; 
            resu.forEach(ele=>{
                const fecha = new Date(ele.fecha_de_pago);
                const fechaMostrar2 = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
                registroPagoSocio = {
                    fecha: fechaMostrar2,
                    socioOConcepto: ele.concepto,
                    nroSocio: `--------`,
                    importe: ele.importe,
                    modoDePago: ele.modo_de_pago,
                    idPago: ele.id_caja,
                }

                totalImporte += ele.importe;
                listaRegistrosPagosSocios.push(registroPagoSocio);
            });
            
            if(listaRegistrosPagosSocios.length === 0) {

                resultado.send(JSON.stringify(`No existen registros del dia seleccionado`));
            }
            else {

                const arregloEnviar = [listaRegistrosPagosSocios,totalImporte,datosFecha.tipoDePago];
                resultado.send(JSON.stringify(arregloEnviar));
            }

        });
    }

    
}

const eliminarRegistroPagosCaja = (idPago,fechaEliminarPago,idUsuarioQuienElimino,usuarioQuienElimino,fechaInput,ingresoOEgreso,resultado) => {
    let registroPagoSocio = {};
    let listaRegistrosPagosSocios = [];
    let totalImporte = 0;


    if(ingresoOEgreso === `Ingreso`) {

        let query = `
            UPDATE caja 
            SET eliminado = true, fecha_eliminado = ?, id_quien_elimino = ?, usuario_quien_elimino = ?  
            WHERE id_caja = ? AND tipo_de_caja = ? 
        `;
        conexion.query(query,[fechaEliminarPago,idUsuarioQuienElimino,usuarioQuienElimino,idPago,ingresoOEgreso],(err,res,filed)=>{


            if(err)
                throw err;

                let query2 = `
                SELECT id_caja, concepto, importe, modo_de_pago, fecha_de_pago
                FROM caja
                WHERE fecha_de_pago = ? AND tipo_de_caja = ? AND eliminado = false
                `;

                conexion.query(query2,[fechaInput,ingresoOEgreso],(erro,resu)=>{
                    if(erro)
                        throw erro;
        
 
                    resu.forEach(ele=>{
                        const fecha = new Date(ele.fecha_de_pago);
                        const fechaMostrar = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
                        registroPagoSocio = {
                            fecha: fechaMostrar,
                            socioOConcepto: ele.concepto,
                            nroSocio: `--------`,
                            importe: ele.importe,
                            modoDePago: ele.modo_de_pago,
                            idPago: ele.id_caja,
                        }
        
                        totalImporte += ele.importe;
                        listaRegistrosPagosSocios.push(registroPagoSocio);
                    });

                        let query3 = `
                        SELECT p.fecha_de_pago_completo, p.importe, p.modo_de_pago, s.nombres, s.apellidos, s.nro_socio
                        FROM pagos p
                        INNER JOIN socios s
                        ON p.id_socio = s.id_socio
                        WHERE fecha_de_pago_completo = ? AND p.eliminado = false
                        `;          
                        conexion.query(query3,[fechaInput],(erro,resul)=>{
                
                            if(erro)
                                throw erro;
                
                            resul.forEach(el=>{
                                const fecha = new Date(el.fecha_de_pago_completo);
                                const fechaMostrar2 = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
                
                                registroPagoSocio = {
                                    fecha: fechaMostrar2,
                                    socioOConcepto: `${el.nombres} ${el.apellidos}`,
                                    nroSocio: el.nro_socio,
                                    importe: el.importe,
                                    modoDePago: el.modo_de_pago,
                                    idPago: undefined
                                }
                
                                totalImporte += el.importe;
                                listaRegistrosPagosSocios.push(registroPagoSocio);
                            });


                            if(listaRegistrosPagosSocios.length === 0) {
        
                                resultado.send(JSON.stringify(`No existen registros del dia seleccionado`));
                            }
                            else {
    
                                const arregloEnviar = [listaRegistrosPagosSocios,totalImporte,ingresoOEgreso];
                                resultado.send(JSON.stringify(arregloEnviar));
                            }

                        });

                });
    
        });
    }
    else if(ingresoOEgreso === `Egreso`) {

        let query = `
        UPDATE caja 
        SET eliminado = true, fecha_eliminado = ?, id_quien_elimino = ?, usuario_quien_elimino = ?  
        WHERE id_caja = ? AND tipo_de_caja = ? 
    `;
    conexion.query(query,[fechaEliminarPago,idUsuarioQuienElimino,usuarioQuienElimino,idPago,ingresoOEgreso],(err,res,filed)=>{

        if(err)
            throw err;

        let query2 = `
        SELECT id_caja, concepto, importe, modo_de_pago, fecha_de_pago
        FROM caja
        WHERE fecha_de_pago = ? AND tipo_de_caja = ? AND eliminado = false;
        `;

        conexion.query(query2,[fechaInput,ingresoOEgreso],(erro,resu)=>{
            if(erro)
                throw erro;

            let registroPagoSocio = {};
            let listaRegistrosPagosSocios = [];
            let totalImporte = 0; 
            resu.forEach(ele=>{
                const fecha = new Date(ele.fecha_de_pago);
                const fechaMostrar2 = `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
                registroPagoSocio = {
                    fecha: fechaMostrar2,
                    socioOConcepto: ele.concepto,
                    nroSocio: `--------`,
                    importe: ele.importe,
                    modoDePago: ele.modo_de_pago,
                    idPago: ele.id_caja,
                }

                totalImporte += ele.importe;
                listaRegistrosPagosSocios.push(registroPagoSocio);
            });
            
            if(listaRegistrosPagosSocios.length === 0) {
        
                resultado.send(JSON.stringify(`No existen registros del dia seleccionado`));
            }
            else {

                const arregloEnviar = [listaRegistrosPagosSocios,totalImporte,ingresoOEgreso];
                resultado.send(JSON.stringify(arregloEnviar));
            }

        });
    });
    }
   
}

function armarFechaParaMostar(date) {
    
    let fecha = date.getDate();
    let mes = date.getMonth()+1;
    let ano = date.getFullYear();
    if(date.getDate() < 10) {
        fecha = `0${date.getDate()}`;
    }
    if(date.getMonth()+1 < 10) {
        mes = `0${date.getMonth()+1}`;
    }
    const fechaCompleta = `${fecha}/${mes}/${ano}`;
    return fechaCompleta;
    
}



module.exports = {

    abrirConexion,
    agregarSocioYPago,
    cerrarConexion,
    logearse,
    buscarDniParaPagos,
    registrarPago,
    actualizarRegistrosPagos,
    actualizarRegistrosPagosCaja,
    eliminarRegistroPagosSocio,
    generarListaSociosActivos,
    generarListaSociosMorososActivos,
    buscarSocioActivo,
    inactivarSocio,
    verFichaSocio,
    actualizarFichaSocio,
    generarListaSociosInactivos,
    activarSocio,
    eliminarSocio,
    buscarSocioInactivo,
    generarListaUsuarios,
    actualizarPassUsuario,
    verFichaPagos,
    nuevoPagoCaja,
    buscarFechaCaja,
    eliminarRegistroPagosCaja

}