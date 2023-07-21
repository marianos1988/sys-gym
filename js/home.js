
/* ----------------------------- Modulo Login ------------------------ */
const modal = document.querySelector(".modal");
const seccion = document.querySelector(".seccion");



mostrarPantallaLogin();


// Cartel Modal
function ejecutarCartelModal(mensaje) { 
    modal.innerHTML = "";
    const cartelModal = document.createElement("DIV");
    cartelModal.setAttribute("class","background-modal");
    cartelModal.innerHTML = `

    <div class="cartel-modal">
        <h2>${mensaje}</h2>
        <button class="custom-btn btn-3" id="boton-aceptar-modal"><span>Aceptar</span></button>
    </div>
    `;

    modal.appendChild(cartelModal);
    
    document.querySelector("#boton-aceptar-modal").addEventListener("click",()=>{modal.removeChild(cartelModal)});
}


function mostrarPantallaLogin() {

    
    seccion.innerHTML = "";
    document.querySelector(".display-usuario").textContent = `Desconectado: Sin usuario`;
    const contenedor = document.createElement("DIV");
    contenedor.setAttribute("class", "contenedor");
    contenedor.innerHTML = `
            <div class="contenedor-general-login contenedor-login2" id="contenedor-login-general">
                <div class="contenedor-login">
                    <div class="titulo-login">Ingresar al sistema</div>
                    <form class="form-login" method="post">
                        <div class="detalles_personales-login">
                            <div class="input-box-login">
                                <span class="detalle">Usuario</span>
                                <input type="text" name="Usuario" placeholder="Ingresar usuario" id="usuario-login" required>
                            </div>
                            <div class="input-box-login">
                                <span class="detalle">contraseña</span>
                                <input type="password" name="Contraseña" placeholder="Ingresar contraseña" id="password-login" required><i class="fa-sharp fa-solid fa-eye-slash ver-pass"></i>
                            </div>
                            <div class="btn-nuevo-socio">
                                <button type="submit" class="custom-btn btn-3" id="boton-conectar-login"><span>Conectar</span></button>
                                <div class="sector-loader-login">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
    `;

    seccion.appendChild(contenedor);

    // Boton logearse
    document.querySelector("#boton-conectar-login").addEventListener("click", async(e)=>{
    
        e.preventDefault();
    
        let objetoHeaderLogin = {
                
            method : "POST",
            body : JSON.stringify({
                usuario: document.querySelector("#usuario-login").value,
                password: document.querySelector("#password-login").value
            }),
            headers : {
                "Content-type" : "application/json"
            }
        }

        document.querySelector(".sector-loader-login").innerHTML = `<div class="loader-login"></div>`;
        
        const JSONDatosLogin = await fetch("http://localhost:3000/login",objetoHeaderLogin);
        const datosLogin = await JSONDatosLogin.json();


        document.querySelector(".sector-loader-login").innerHTML = ``;
    
        if(datosLogin === `Usuario o contraseña incorrecta`) {
    
            ejecutarCartelModal(datosLogin);
        }
        else if(datosLogin === `El usuario no existe`) {
    
            ejecutarCartelModal(datosLogin);
        }
        else if(datosLogin === `Contraseña incorrecta`) {
    
            ejecutarCartelModal(datosLogin);
        }
        else {
                    

            seccion.innerHTML="";
            document.querySelector(".display-usuario").textContent = `Conectado: ${datosLogin[0].usuario[0].toLocaleUpperCase()+datosLogin[0].usuario.slice(1,50)}`;


            const nav = document.createElement("DIV");
            nav.setAttribute("class","nav-bar");
            nav.innerHTML = `
                <input type="checkbox" id="check">
                <label for="check">
                    <i class="fas fa-bars barra" id="barra"></i>
                    <i class="fas fa-times cancel" id="cancel"></i>
                </label>
                <div class="sidebar"> 
                    <header><img src="img/logoscape.jpg" alt="Logo" class="logo" id="logo"></header>
                    <ul>
                        <li class="modulo-nuevo-socio"><i class="fa-sharp fa-solid fa-plus"></i>Nuevo Socio</li>
                        <li class="no-pointer modulo-buscar-socio"><i class="fa-solid fa-magnifying-glass"></i>Buscar Socios
                            <ul>
                                <li class="modulo-activos"><i class="fa-solid fa-person-arrow-up-from-line"></i>Activos</li>
                                <li class="modulo-inactivos"><i class="fa-solid fa-person-arrow-down-to-line"></i>Inactivos</li>
                            </ul>
                        </li>
                        <li class="modulo-pagos"><i class="fa-solid fa-money-bill"></i>Pagos</li>
                        <li class="modulo-caja"><i class="fa-solid fa-sack-dollar"></i>Caja</li>
                        <li class="modulo-usuarios"><i class="fa-solid fa-user"></i>Usuarios</li>
                        <li class="modulo-desconectar"><i class="fa-solid fa-arrow-right-from-bracket"></i>Salir</li>
                    </ul> 
                </div>
            `;
            document.querySelector(".nav-general").appendChild(nav);

            generarListaCumpleanos();


    
            /* --------------------- Barra de Menu y Ventanas -------------------- */
            const contenedorGeneral = document.querySelector(".contenedor-general");
            const sidebar = document.querySelector(".sidebar");
            const abrirSidebar = document.getElementById("barra");
            const cerrarSidebar = document.getElementById("cancel");

            modoResponsive();
    
    
    
            function ejecutarCartelModalConfirmarModificarPago(mensaje,id,pagoVieneDe,fechaInput,ingresoOEgreso) {
    
    
                
                const cartelModal = document.createElement("DIV");
                cartelModal.setAttribute("class","background-modal");
                cartelModal.innerHTML = `
    
                <div class="cartel-modal">
                    <h2>${mensaje}</h2>
                    <div class="cartel-modal__botones">
                        <button class="custom-btn btn-3" id="boton-guardar-modal" value="true"><span>Guardar</span></button>
                        <button class="custom-btn btn-3" id="boton-cancelar-modal" value="false"><span>Cancelar</span></button>
                    </div>
                </div>
                `;
    
                modal.appendChild(cartelModal);
    
                if(document.querySelector("#boton-registrar-pago")) {

                    document.querySelector("#boton-registrar-pago").classList.replace("btn-inactivo-registrar-pago","btn-activo-registrar-pago");
                }
    
                
                document.querySelector("#boton-guardar-modal").addEventListener("click", async ()=>{
    
                    modal.removeChild(cartelModal);  
                    sessionStorage.setItem("estasEditandoPago",false);
                    
                    document.querySelector(`#sector-cargar-pagos-${id}`).innerHTML = `<div class="loader-pagos-opciones"></div>`;
                    try{

    
                        if(pagoVieneDe === `Socio`){

                            let objetoHeaderDatosEditadosPagos =
                            {
                                
                                method : "POST",
                                body : JSON.stringify({
                                    id : id,
                                    importeAModificar : sessionStorage.getItem("importeAModificar"),
                                    observacionAModificar : sessionStorage.getItem("observacionAModificar"),
                                    modoDePagoAModificar : sessionStorage.getItem("modoDePagoAModificar")
                                }),
                                headers : {
                                    "Content-type" : "application/json"
                                }
                            }

                            const confirmarEditarPagoJSON = await fetch(`http://localhost:3000/editarPago/datosModificadosYGuardados`,objetoHeaderDatosEditadosPagos);
    
                            const confirmarEditarPago = await confirmarEditarPagoJSON.json();

                            document.querySelector(`#sector-cargar-pagos-${id}`).innerHTML = ``;

                            if(confirmarEditarPago == `Debes ingresar un valor correcto en el importe`) {
        
                                ejecutarCartelModal(confirmarEditarPago);
                                document.querySelector(`#editar-${id}`).classList.replace("btn-activo","btn-inactivo");
                                document.querySelector(`#guardar-${id}`).classList.replace("btn-inactivo","btn-activo");
                                document.querySelector(`#eliminar-${id}`).classList.replace(`btn-activo`,`btn-inactivo`);
                                document.querySelector(`#importe-${id}`).contentEditable = true;
                                document.querySelector(`#importe-${id}`).style.color="#bbb";         
                                document.querySelector(`#observacion-${id}`).contentEditable = true;
                                document.querySelector(`#observacion-${id}`).style.color="#bbb";
                                
                            }
                            else if(confirmarEditarPago == `Limite de caracteres alcanzado en la observacion`) {
        
                                ejecutarCartelModal(confirmarEditarPago);
                                document.querySelector(`#editar-${id}`).classList.replace("btn-activo","btn-inactivo");
                                document.querySelector(`#guardar-${id}`).classList.replace("btn-inactivo","btn-activo");
                                document.querySelector(`#eliminar-${id}`).classList.replace(`btn-activo`,`btn-inactivo`);
                                document.querySelector(`#importe-${id}`).contentEditable = true;
                                document.querySelector(`#importe-${id}`).style.color="#bbb";       
                                document.querySelector(`#observacion-${id}`).contentEditable = true;
                                document.querySelector(`#observacion-${id}`).style.color="#bbb";
                            }
                            else if(confirmarEditarPago == `Elige una opcion correcta en el modo de pago`) {
                                    
                                ejecutarCartelModal(confirmarEditarPago);
                                document.querySelector(`#editar-${id}`).classList.replace("btn-activo","btn-inactivo");
                                document.querySelector(`#guardar-${id}`).classList.replace("btn-inactivo","btn-activo");
                                document.querySelector(`#eliminar-${id}`).classList.replace(`btn-activo`,`btn-inactivo`);
                                document.querySelector(`#importe-${id}`).contentEditable = true;
                                document.querySelector(`#importe-${id}`).style.color="#bbb";       
                                document.querySelector(`#observacion-${id}`).contentEditable = true;
                                document.querySelector(`#observacion-${id}`).style.color="#bbb";
                            }
                            else {
        
                                document.querySelector(`#importe-${id}`).textContent = `$${confirmarEditarPago[0].importe}`;
                                document.querySelector(`#observacion-${id}`).textContent = `${confirmarEditarPago[0].observacion}`;
                                document.querySelector(`#modo-pago-${id}`).textContent = `${confirmarEditarPago[0].modoDePago}`;
                                ejecutarCartelModal(confirmarEditarPago[1]);
                                limpiezaSessionStorage();
                            }
                        }
                        else if(pagoVieneDe === `Caja`) {

                            let objetoHeaderDatosEditadosPagos =
                            {
                                
                                method : "POST",
                                body : JSON.stringify({
                                    id : id,
                                    importeAModificar : sessionStorage.getItem("importeAModificar"),
                                    observacionAModificar : sessionStorage.getItem("observacionAModificar"),
                                    modoDePagoAModificar : sessionStorage.getItem("modoDePagoAModificar"),
                                    fechaInput: fechaInput,
                                    ingresoOEgreso: ingresoOEgreso
                                }),
                                headers : {
                                    "Content-type" : "application/json"
                                }
                            }

                            let importeAModificar = sessionStorage.getItem("importeAModificar");

                            const confirmarEditarPagoJSON = await fetch(`http://localhost:3000/caja/editarPago/datosModificadosYGuardados`,objetoHeaderDatosEditadosPagos);
    
                            const confirmarEditarPago = await confirmarEditarPagoJSON.json();


                            document.querySelector(`#sector-cargar-pagos-${id}`).innerHTML = ``;
                            if(confirmarEditarPago == `Debes ingresar un valor correcto en el importe`) {

        
                                ejecutarCartelModal(confirmarEditarPago);
                                document.querySelector(`#editar-${id}`).classList.replace("btn-activo","btn-inactivo");
                                document.querySelector(`#guardar-${id}`).classList.replace("btn-inactivo","btn-activo");
                                document.querySelector(`#eliminar-${id}`).classList.replace(`btn-activo`,`btn-inactivo`);
                                document.querySelector(`#importe-${id}`).contentEditable = true;
                                document.querySelector(`#importe-${id}`).style.color="#bbb";         
                                document.querySelector(`#observacion-${id}`).contentEditable = true;
                                document.querySelector(`#observacion-${id}`).style.color="#bbb";
                                
                            }
                            else if(confirmarEditarPago == `Limite de caracteres alcanzado en la observacion`) {
        
                                ejecutarCartelModal(confirmarEditarPago);
                                document.querySelector(`#editar-${id}`).classList.replace("btn-activo","btn-inactivo");
                                document.querySelector(`#guardar-${id}`).classList.replace("btn-inactivo","btn-activo");
                                document.querySelector(`#eliminar-${id}`).classList.replace(`btn-activo`,`btn-inactivo`);
                                document.querySelector(`#importe-${id}`).contentEditable = true;
                                document.querySelector(`#importe-${id}`).style.color="#bbb";       
                                document.querySelector(`#observacion-${id}`).contentEditable = true;
                                document.querySelector(`#observacion-${id}`).style.color="#bbb";
                            }
                            else if(confirmarEditarPago == `Elige una opcion correcta en el modo de pago`) {
                                    
                                ejecutarCartelModal(confirmarEditarPago);
                                document.querySelector(`#editar-${id}`).classList.replace("btn-activo","btn-inactivo");
                                document.querySelector(`#guardar-${id}`).classList.replace("btn-inactivo","btn-activo");
                                document.querySelector(`#eliminar-${id}`).classList.replace(`btn-activo`,`btn-inactivo`);
                                document.querySelector(`#importe-${id}`).contentEditable = true;
                                document.querySelector(`#importe-${id}`).style.color="#bbb";       
                                document.querySelector(`#observacion-${id}`).contentEditable = true;
                                document.querySelector(`#observacion-${id}`).style.color="#bbb";
                            }
                            else {
        
                                document.querySelector(`#importe-${id}`).textContent = `$${importeAModificar}`;
                                if(document.querySelector(`.total-caja-ingreso span`)) {
                                    document.querySelector(`.total-caja-ingreso span`).textContent = `$${confirmarEditarPago}`;
                                }
                                if(document.querySelector(`.total-caja-egreso span`)) {
                                    document.querySelector(`.total-caja-egreso span`).textContent = `$${confirmarEditarPago}`;
                                }
                                
                                ejecutarCartelModal(`Se han modificados los datos correctamente`);
                                limpiezaSessionStorage();
                            }

                        }

                    
                    } catch(e) {
    
                        console.log(e);
                        ejecutarCartelModal(`No esta ejecutado el servicio de NodeJS`);
                    }
    
                });
    
                document.querySelector("#boton-cancelar-modal").addEventListener("click",async ()=>{
                    
                    modal.removeChild(cartelModal);
                    sessionStorage.setItem("estasEditandoPago",false);
    
                    const importeActual = sessionStorage.getItem("importeActual");
                    const observacionActual = sessionStorage.getItem("observacionActual");
                    const modoDePagoActual = sessionStorage.getItem("modoDePagoActual");
                    document.querySelector(`#importe-${id}`).textContent = `$${importeActual}`;
                    document.querySelector(`#observacion-${id}`).textContent = observacionActual;
                    document.querySelector(`#modo-pago-${id}`).textContent = modoDePagoActual;
                    limpiezaSessionStorage();
    
                });
    
    
    
            }
    
            function ejecutarCartelModalConfirmarEliminarPago(mensaje,idPago,idSocio,vieneDe,fechaInput,ingresoOEgreso) {
    
    
                
                const cartelModal = document.createElement("DIV");
                cartelModal.setAttribute("class","background-modal");
                cartelModal.innerHTML = `
    
                <div class="cartel-modal">
                    <h2>${mensaje}</h2>
                    <div class="cartel-modal__botones">
                        <button class="custom-btn btn-3" id="boton-eliminar-modal" value="true"><spnoan>Eliminar</span></button>
                        <button class="custom-btn btn-3" id="boton-cancelar-modal" value="false"><span>Cancelar</span></button>
                    </div>
                </div>
                `;
    
                modal.appendChild(cartelModal);
    
                
                document.querySelector("#boton-eliminar-modal").addEventListener("click", async ()=>{
                    
                    document.querySelector(`#sector-cargar-pagos-${idPago}`).innerHTML = `<div class="loader-pagos-opciones"></div>`;
    
                    if(vieneDe === "Socio") {

                        try{
    
                            let objetoHeaderEliminarPagoSocio = 
                            
                            {
                                
                                method : "POST",
                                body : JSON.stringify({
                                    idPago : idPago,
                                    idSocio : idSocio,
                                    idUsuarioQuienElimino: datosLogin[0].idUsuario,
                                    usuarioQuienElimino: datosLogin[0].usuario
                                }),
                                headers : {
                                    "Content-type" : "application/json"
                                }
                            }
                            
                            const confirmarEliminarPagoJSON = await fetch(`http://localhost:3000/editarPago/datosEliminarPago`,objetoHeaderEliminarPagoSocio);
        
                            const confirmarEliminarPago = await confirmarEliminarPagoJSON.json();
                            
                            actualizarListaRegistrosDePago(confirmarEliminarPago[1],idSocio);
                            
                            modal.removeChild(cartelModal);
        
                            ejecutarCartelModal(confirmarEliminarPago[0]);
                            
                        } catch(e) {
                            console.log(e);
                            mensaje = `No esta ejecutado el servicio de NodeJS`;
                            ejecutarCartelModal(mensaje);
                        }    
                    }
                    else if(vieneDe === `Caja`) {
                        
                        try {

                            let objetoHeaderEliminarPagoCaja = 
                            
                            {
                                
                                method : "POST",
                                body : JSON.stringify({
                                    idPago : idPago,
                                    fechaInput: fechaInput,
                                    ingresoOEgreso: ingresoOEgreso,
                                    idUsuarioQuienElimino: datosLogin[0].idUsuario,
                                    usuarioQuienElimino: datosLogin[0].usuario
                                }),
                                headers : {
                                    "Content-type" : "application/json"
                                }
                            }



                            const JSONconfirmarEliminarPagoCaja = await fetch(`http://localhost:3000/caja/datosEliminarPago`,objetoHeaderEliminarPagoCaja);
                            const confirmarEditarPagoCaja = await JSONconfirmarEliminarPagoCaja.json();


                            listarRegistrosPagosCaja(confirmarEditarPagoCaja,fechaInput);


                        } catch(e) {

                            console.log(e);
                            mensaje = `No esta ejecutado el servicio de NodeJS`;
                            ejecutarCartelModal(mensaje);
                        }     
                    }
 
                });
    
                document.querySelector("#boton-cancelar-modal").addEventListener("click",()=>{
                    
                    modal.removeChild(cartelModal);
    
                });
    
            }
    
            function ejecutarCartelModalEditarFichaSocio(datosSocio,activoOInactivo) {
    
                
    
                const cartelModal = document.createElement("DIV");
                cartelModal.setAttribute("class","background-modal");
                cartelModal.innerHTML = `
    
                <div class="cartel-modal">
                    <h2>¿Quieres actualizar los cambios?</h2>
                    <div class="cartel-modal__botones">
                        <button class="custom-btn btn-3" id="boton-guardar-modal" value="true"><span>Guardar</span></button>
                        <button class="custom-btn btn-3" id="boton-cancelar-modal" value="false"><span>Cancelar</span></button>
                    </div>
                </div>
                `;
    
    
                modal.appendChild(cartelModal);
    
                document.querySelector("#boton-guardar-modal").addEventListener("click", usarBotonGuardarFichaSocio);
    
                async function usarBotonGuardarFichaSocio() {
                    

                    modal.innerHTML =``;

                    
                    const nombreFichaSocio = document.querySelector("#nombre-ficha-socio").textContent;
                    const apellidoFichaSocio = document.querySelector("#apellido-ficha-socio").textContent;
                    const dniFichaSocio = document.querySelector("#dni-ficha-socio").textContent;
                    const nroSocioFichaSocio = document.querySelector("#nroSocio-ficha-socio").textContent;
                    const correoFichaSocio = document.querySelector("#correo-ficha-socio").textContent;
                    const telefonoFichaSocio = document.querySelector("#telefono-ficha-socio").textContent;
                    const domicilioFichaSocio = document.querySelector("#domicilio-ficha-socio").textContent;
                    const fechaNacimientoFichaSocio = document.querySelector("#input-fecha-nacimiento").value;

                    
    
    
                    
                    // Validar Campos
                    let mensaje;
    
                    if(nombreFichaSocio === "" || nombreFichaSocio.length < 3) {
    
                        modal.innerHTML = "";
                        mensaje = `Debes ingresar nombre mayor a 3 digitos`;
                        ejecutarCartelModal(mensaje);
    
                    } 
                    else if(apellidoFichaSocio === "" || apellidoFichaSocio.length < 3) {
    
                        modal.innerHTML = "";
                        mensaje = `Debes ingresar un apellido mayor a 3 digitos`;
                        ejecutarCartelModal(mensaje);
    
                    }
                    else if(validarSoloNumeros(dniFichaSocio) || dniFichaSocio.length < 7 || dniFichaSocio.length > 12) {
    
                        modal.innerHTML = "";
                        mensaje = `Debes ingresar entre 7 y 12 numeros para el dni`;
                        ejecutarCartelModal(mensaje);
    
                    }
                    else if(validarSoloNumeros(nroSocioFichaSocio) === true || nroSocioFichaSocio.length < 1) {
    
                        modal.innerHTML = "";
                        mensaje = `Debes ingresar algun numero en el Nro. de Socio`;
                        ejecutarCartelModal(mensaje);
    
                    }
                    else if(nroSocioFichaSocio.length > 10) {
                        mensaje = `El maximo es de 10 digitos en nro. de socio`;
                        ejecutarCartelModal(mensaje);
                    }
                    else if(esEmail(correoFichaSocio) == false) {
                        
                        modal.innerHTML = "";
                        mensaje = `Debe ingresar un correo electronico valido`;
                        ejecutarCartelModal(mensaje); 
    
                    }
                    else if(validarSoloNumeros(telefonoFichaSocio) == true) {
    
                        modal.innerHTML = "";
                        mensaje = `Debes ingresar solo numeros para el telefono`;
                        ejecutarCartelModal(mensaje); 
    
                    }
                    else if(telefonoFichaSocio.length > 12){
    
                        mensaje = `El maximo es de 12 digitos en el telefono`;
                        ejecutarCartelModal(mensaje)
                    }
                    else {
                        
                        
                        //Guardar datos en objeto
                        let objetoHeaderFichaSocioEditado =
                        {
                            
                            method : "POST",
                            body : JSON.stringify({
    
                                idSocio: datosSocio.idSocio,
                                nombre : nombreFichaSocio,
                                apellido : apellidoFichaSocio,
                                dni : dniFichaSocio,
                                correo : correoFichaSocio,
                                telefono : telefonoFichaSocio,
                                nroSocio : nroSocioFichaSocio,
                                domicilio : domicilioFichaSocio,
                                fechaNacimiento : fechaNacimientoFichaSocio
    
                            }),
                            headers : {
                                "Content-type" : "application/json"
                            }
                        }
    
                        try {
                            
                            document.querySelector(".sector-loader-ver-ficha-socios").innerHTML= `<div class="loader-ver-ficha-socios"></div>`;
    
                            const JSONFichaSocioEditado = await fetch(`http://localhost:3000/buscarSociosActivos/FichaSocio/FichaSocioEditado`,objetoHeaderFichaSocioEditado);
    
                            const fichaSocioEditado = await JSONFichaSocioEditado.json();
        
    
                            if(fichaSocioEditado === `Debes ingresar nombre mayor a 3 digitos`) {
                                ejecutarCartelModal(fichaSocioEditado);
                            }
                            else if(fichaSocioEditado === `Debes ingresar un apellido mayor a 3 digitos`) {
                                ejecutarCartelModal(fichaSocioEditado);
                            }
                            else if(fichaSocioEditado === `Debes ingresar entre 7 y 12 numeros para el dni`) {
                                ejecutarCartelModal(fichaSocioEditado);
                            }
                            else if(fichaSocioEditado === `El numero de DNI ya existe`) {
                                ejecutarCartelModal(fichaSocioEditado);
                            }
                            else if(fichaSocioEditado === `Debes ingresar algun numero en el Nro. de Socio`) {
                                ejecutarCartelModal(fichaSocioEditado);
                            }
                            else if(fichaSocioEditado === `El maximo es de 10 digitos en nro. de socio`) {
                                ejecutarCartelModal(fichaSocioEditado);
                            }
                            else if(fichaSocioEditado === `El numero de socio ya existe`) {
                                ejecutarCartelModal(fichaSocioEditado);
                            }
                            else if(fichaSocioEditado === `Debe ingresar un correo electronico valido`) {
                                ejecutarCartelModal(fichaSocioEditado);
                            }
                            else if(fichaSocioEditado === `Debes ingresar solo numeros para el telefono`) {
                                ejecutarCartelModal(fichaSocioEditado);
    
                            }
                            else if(fichaSocioEditado ===  `El maximo es de 12 digitos en el telefono`) {
                                ejecutarCartelModal(fichaSocioEditado);
                            }
                            
                            else {
                                
                                document.querySelector("#nombre-ficha-socio").contentEditable = false;
                                document.querySelector("#apellido-ficha-socio").contentEditable = false;
                                document.querySelector("#dni-ficha-socio").contentEditable = false;
                                document.querySelector("#nroSocio-ficha-socio").contentEditable = false;
                                document.querySelector("#correo-ficha-socio").contentEditable = false;
                                document.querySelector("#telefono-ficha-socio").contentEditable = false;
                                document.querySelector("#domicilio-ficha-socio").contentEditable = false;
                    
                                document.querySelector("#nombre-ficha-socio").style.color="#000";
                                document.querySelector("#apellido-ficha-socio").style.color="#000";
                                document.querySelector("#dni-ficha-socio").style.color="#000";
                                document.querySelector("#nroSocio-ficha-socio").style.color="#000";
                                document.querySelector("#correo-ficha-socio").style.color="#000";
                                document.querySelector("#telefono-ficha-socio").style.color="#000";
                                document.querySelector("#domicilio-ficha-socio").style.color="#000";
                                


    
                                document.querySelector("#dni-ficha-socio").textContent = fichaSocioEditado[1];
                                
                                
                                await verFichaSocio(datosSocio.idSocio,activoOInactivo);
    
                            }
                            
                        } catch(e) {
    
                            console.log(e);
                            mensaje = `No esta ejecutado el servicio de NodeJS`;
                            ejecutarCartelModal(mensaje);
                        }
    
                    }
    
                }
    
                document.querySelector("#boton-cancelar-modal").addEventListener("click",()=>{
    
                    modal.removeChild(cartelModal);
    
                    
                    document.querySelector("#nombre-ficha-socio").contentEditable = false;
                    document.querySelector("#apellido-ficha-socio").contentEditable = false;
                    document.querySelector("#dni-ficha-socio").contentEditable = false;
                    document.querySelector("#nroSocio-ficha-socio").contentEditable = false;
                    document.querySelector("#correo-ficha-socio").contentEditable = false;
                    document.querySelector("#telefono-ficha-socio").contentEditable = false;
                    document.querySelector("#domicilio-ficha-socio").contentEditable = false;
                    
    
                    document.querySelector("#nombre-ficha-socio").style.color="#000";
                    document.querySelector("#apellido-ficha-socio").style.color="#000";
                    document.querySelector("#dni-ficha-socio").style.color="#000";
                    document.querySelector("#nroSocio-ficha-socio").style.color="#000";
                    document.querySelector("#correo-ficha-socio").style.color="#000";
                    document.querySelector("#telefono-ficha-socio").style.color="#000";
                    document.querySelector("#domicilio-ficha-socio").style.color="#000";
    
                    document.querySelector("#nombre-ficha-socio").textContent = datosSocio.nombre;
                    document.querySelector("#apellido-ficha-socio").textContent = datosSocio.apellido;
                    document.querySelector("#dni-ficha-socio").textContent = datosSocio.dni;
                    document.querySelector("#nroSocio-ficha-socio").textContent = datosSocio.nroSocio;
                    document.querySelector("#correo-ficha-socio").textContent = datosSocio.correo;
                    document.querySelector("#telefono-ficha-socio").textContent = datosSocio.telefono;
                    document.querySelector("#domicilio-ficha-socio").textContent = datosSocio.domicilio;


                    const fechaNacimiento = new Date(datosSocio.fechaNacimiento);


                    let fechaNacimientoFecha = fechaNacimiento.getDate();
                    if(fechaNacimientoFecha >= 1 && fechaNacimientoFecha < 10){
                        fechaNacimientoFecha = `0${fechaNacimientoFecha}`;
                    }
                    let fechaNacimientoMes = fechaNacimiento.getMonth() + 1;
                    if(fechaNacimientoMes >= 1 && fechaNacimientoMes < 10){
                        fechaNacimientoMes = `0${fechaNacimientoMes}`;
                    }
                    let fechaNacimientoAno = fechaNacimiento.getFullYear();
                    const fechaNacimientoEdit = `${fechaNacimientoFecha}/${fechaNacimientoMes}/${fechaNacimientoAno}`;
                    document.querySelector("#fecha-nacimiento-ficha-socio").textContent = fechaNacimientoEdit;


    
                    document.querySelector(".grupo-botones-ficha-socio").outerHTML = `
                        <div class="grupo-botones-ficha-socio">
                            <button type="submit" class="custom-btn btn-3" id="boton-volver-ficha-socio"><span>Volver</span></button>
                            <button type="submit" class="custom-btn btn-3 btn-editar-ficha-socio" id="boton-editar-ficha-socio"><span>Editar Socio</span></button>
                        </div>
                    `;
    
                    document.querySelector("#boton-editar-ficha-socio").addEventListener("click", async ()=>{
                        usarBotonEditarFichaSocio(datosSocio,activoOInactivo);
                    });
                    document.querySelector("#boton-volver-ficha-socio").addEventListener("click", async ()=>{
                        if(activoOInactivo === "Activo") {
                            await abrirModuloActivos();
                        }
                        else if(activoOInactivo === "Moroso") {
                            await abrirModuloActivosMorosos();
                        }
                        else if(activoOInactivo === "Inactivo") {
                            await abrirModuloInactivos();
                        }

                    });
    
                });
            }

            function ejecutarCartelModalConfirmarEditarPass(mensaje,id) {
    
                modal.innerHTML="";
                
                const cartelModal = document.createElement("DIV");
                cartelModal.setAttribute("class","background-modal");
                cartelModal.innerHTML = `
    
                <div class="cartel-modal">
                    <h2>${mensaje}</h2>
                    <div class="cartel-modal__botones">
                        <button class="custom-btn btn-3" id="boton-guardar-modal" value="true"><span>Guardar</span></button>
                        <button class="custom-btn btn-3" id="boton-cancelar-modal" value="false"><span>Cancelar</span></button>
                    </div>
                </div>
                `;
    
                modal.appendChild(cartelModal);
    
         
                document.querySelector("#boton-guardar-modal").addEventListener("click", async ()=>{
    
                    modal.removeChild(cartelModal);  
                    sessionStorage.setItem("estasEditandoPass",false);
                    
                    const passActual = document.querySelector(`#pass-actual-${id}`).value;
                    const passNueva = document.querySelector(`#pass-nueva-${id}`).value;
                    const passRepetida = document.querySelector(`#pass-repetida-${id}`).value;

                    if(!(passNueva === passRepetida)) {

                        ejecutarCartelModal(`Las contraseñas no son iguales`);

                    }
                    else if(passActual == "" || passNueva == "" || passRepetida == "") {

                        ejecutarCartelModal("Completa todos los campos de contraseñas");
                    } else {

                        document.querySelector(`#sector-cargar-usuarios-${id}`).innerHTML = `<div class="loader-usuarios-opciones"></div>`;

                        try{
                            
                            let objetoHeaderDatosEditarPass =
                            {
                                
                                method : "POST",
                                body : JSON.stringify({
                                    id : id,
                                    passwordActual : passActual,
                                    passwordNueva : passNueva,
                                    passwordRepetida : passRepetida
                                }),
                                headers : {
                                    "Content-type" : "application/json"
                                }
                            }
        
                            const JSONconfirmarEditarPass = await fetch(`http://localhost:3000/ListaUsuarios/editarPass`,objetoHeaderDatosEditarPass);
        
                            const confirmarEditarPass = await JSONconfirmarEditarPass.json();

                            document.querySelector(`#sector-cargar-usuarios-${id}`).innerHTML = ``;

                            if(confirmarEditarPass === `Las contraseñas no son iguales`) {

                                ejecutarCartelModal(confirmarEditarPass);
                            }
                            else if(confirmarEditarPass === "Completa todos los campos de contraseñas") {

                                ejecutarCartelModal(confirmarEditarPass);

                            }
                            else if(confirmarEditarPass === `La contraseña actual es incorrecta`) {

                                ejecutarCartelModal(confirmarEditarPass);
                            }
                            else {     

                                await abrirModuloUsuarios();
                                
                                ejecutarCartelModal(confirmarEditarPass);
                            }
              
                        } catch(e) {
                            console.log(e);
                            ejecutarCartelModal(`No esta ejecutado el servicio de NodeJS`);
                        }
                    }
                    

    
                });
    
                document.querySelector("#boton-cancelar-modal").addEventListener("click",async ()=>{

                    document.querySelector(`#pass-actual-${id}`).style.maxWidth = "187px";
                    document.querySelector(`#pass-nueva-${id}`).style.maxWidth = "187px";
                    document.querySelector(`#pass-repetida-${id}`).style.maxWidth = "187px";
                    document.querySelector(`#pass-actual-${id}`).style.maxHeight = "25px";
                    document.querySelector(`#pass-nueva-${id}`).style.maxHeight = "25px";
                    document.querySelector(`#pass-repetida-${id}`).style.maxHeight = "25px";

                    document.querySelector(`#editar-usuario-${id}`).classList.replace("btn-inactivo-usuarios","btn-activo-usuarios");
                    document.querySelector(`#guardar-usuario-${id}`).classList.replace("btn-activo-usuarios","btn-inactivo-usuarios");

                    document.querySelector(`#pass-actual-${id}`).style.color="#000";
                    document.querySelector(`#pass-nueva-${id}`).style.color="#000";
                    document.querySelector(`#pass-repetida-${id}`).style.color="#000";

                    document.querySelector(`#pass-actual-${id}`).setAttribute("disabled","true");
                    document.querySelector(`#pass-nueva-${id}`).setAttribute("disabled","true");
                    document.querySelector(`#pass-repetida-${id}`).setAttribute("disabled","true");
                    
                    modal.removeChild(cartelModal);
                    sessionStorage.setItem("estasEditandoPass",false);
                    limpiezaSessionStorage();

                    document.querySelector(`#pass-actual-${id}`).setAttribute("placeholder","********");
                    document.querySelector(`#pass-nueva-${id}`).setAttribute("placeholder","********");
                    document.querySelector(`#pass-repetida-${id}`).setAttribute("placeholder","********");
    
                });
    
            }
    
            abrirSidebar.addEventListener("click",abrirMenu);
            cerrarSidebar.addEventListener("click",cerrarMenu);
    
            //Fondo de pantalla actualizar tamaño
    
            window.addEventListener("resize",()=>{
                contenedorGeneral.classList.remove("fondo-de-pantalla");
                contenedorGeneral.classList.add("fondo-de-pantalla");
            });
            /* ---------------------- Variables de Sesion ------------------ */
    
            // Variable para usar en el botn Editar registro de pago
            sessionStorage.setItem("estasEditandoPago",false);
    

            /* --------------------- Modulo Nuevo Socio------------------ */
    
            const moduloNuevoSocio = document.querySelector(".modulo-nuevo-socio");


    
            moduloNuevoSocio.addEventListener("click",()=>{
                
                crearHTMLNuevoSocio("","","","","","","","");
              

            });
    
                
            /* --------------------- Modulo Buscar Activos ------------------ */
    
            document.querySelector(".modulo-activos").addEventListener("click",abrirModuloActivos);
    
    
            async function abrirModuloActivos() {
    
                seccion.innerHTML = ``;
                sessionStorage.setItem("estasEditandoPago","false");
                limpiezaSessionStorage();

                let HTMLBuscarActivo = `
                <div class="contenedor-activos">
                    <div class="buscador">
                        <input type="text" placeholder="Ingrese DNI /N° de socio" required id="buscar-dni-o-nrosocio-activo">
                        <div class="boton-buscar-activos" id="btn-buscar-socios-activos">
                            <i class="fa fa-search"></i>
                        </div>
                        <div class="sector-loader-socios-activos"></div>
                    </div>
                    <div class="socios-morosos-activos"></div>
                    <div class="registro-historial-activos">
                        <table class="registro-historial">
                            <tr class="columnas">
                                <th>Socio</th>
                                <th>Acesso Hasta</th>
                                <th>Estado</th>
                                <th>Situacion</th>
                                <th>Morosidad</th>
                                <th>Accion</th>
                            </tr>
                        </table>
                    </div>
                </div>
                `;

                const contenedor = document.createElement("DIV");
                contenedor.setAttribute("class","contenedor");
                contenedor.innerHTML = HTMLBuscarActivo;
                seccion.appendChild(contenedor);
                
                try{
                    
                    document.querySelector(".sector-loader-socios-activos").innerHTML = `<div class="loader-socios-activos"></div>`;
                    const JSONlistaSociosActivos = await fetch('http://localhost:3000/buscarSociosActivos');
                    const listaSociosActivos = await JSONlistaSociosActivos.json();
                    document.querySelector(".sector-loader-socios-activos").innerHTML = ``;

                    // Probar Tardansa de carga de datos
                    // setInterval(()=>{
                        actualizarListaSociosActivos(listaSociosActivos[0],"Activo");
                    // },3000);
                     
                    //Buscar socios activos con la lupa
                    document.querySelector("#btn-buscar-socios-activos").addEventListener("click",buscarSocioActivo);

                    // Boton Morosos
                    document.querySelector(".socios-morosos-activos").innerHTML = `
                    <button type="submit" class="custom-btn btn-3" id="boton-buscar-morosos-activos"><span>Solo Morosos</span></button>
                    <div class="sector-loader-socios--morosos-activos"></div>
                    `;

                    document.querySelector("#boton-buscar-morosos-activos").addEventListener("click",buscarSociosMorososActivos);

                    
                    async function buscarSocioActivo() {
                        

                        try {
                            
                            const dniONroSocioActivo = document.querySelector("#buscar-dni-o-nrosocio-activo").value;
                            if(validarSoloNumeros(dniONroSocioActivo)){
    
                                ejecutarCartelModal(`Debes ingresar un valor correcto`);
    
                            } else {
                                
                                //Icono cargando activo
                                document.querySelector(".sector-loader-socios-activos").innerHTML = `<div class="loader-nuevo-socio"></div>`;
                                let objetoHeaderSocioActivo =
                                {
                                    
                                    method : "POST",
                                    body : JSON.stringify({
                                        dniONroSocioActivo
                                    }),
                                    headers : {
                                        "Content-type" : "application/json"
                                    }
                                }


                                
                                const JSONBuscarSocioActivo = await fetch('http://localhost:3000/buscarSociosActivos/buscarDNIoNroSocioActivo',objetoHeaderSocioActivo);
    
                                const buscarSocioActivo = await JSONBuscarSocioActivo.json();

                                //Icono cargando Desactivado
                                document.querySelector(".sector-loader-socios-activos").innerHTML = ``;
                                
                                if(buscarSocioActivo === `Debes ingresar un valor correcto`) {
    
                                    ejecutarCartelModal(buscarSocioActivo);
    
                                } else if(buscarSocioActivo == `Socio Inactivo o inexistente`) {
    
                                    ejecutarCartelModal(buscarSocioActivo);
    
                                } else {
                                    let inactivarSocioActivo;
                                    if(buscarSocioActivo.inactivarSocio === true) {
                                        inactivarSocioActivo = `
                                        <i class="fa-solid fa-person-arrow-down-to-line accion-inactivar btn-activo-activos" id="socio-activo-inactivar-${buscarSocioActivo.idSocio}" title="Inactivar"></i>
                                        `;
                                    }
                                    else if(buscarSocioActivo.inactivarSocio === false) {
                                        inactivarSocioActivo = `
                                        <i class="fa-solid fa-person-arrow-down-to-line accion-inactivar btn-inactivo-activos" id="socio-activo-inactivar-${buscarSocioActivo.idSocio}" title="Inactivar"></i>
                                        `;
                                    }
                        
                                    let socioActivo = `
                                    <table class="registro-historial">
                                        <tr class="columnas">
                                            <th>Socio</th>
                                            <th>Acceso hasta</th>
                                            <th>Estado</th>
                                            <th>Situacion</th>
                                            <th>Morosidad</th>
                                            <th>Accion</th>
                                        </tr>
                                        <tr>
                                            <td>${buscarSocioActivo.nombres} ${buscarSocioActivo.apellidos}</td>
                                            <td>${buscarSocioActivo.ultimaFechaDePago}</td>
                                            <td>Activo</td>
                                            <td class="mora-${buscarSocioActivo.color}">${buscarSocioActivo.situacion}</td>
                                            <td class="mora-${buscarSocioActivo.color}">${buscarSocioActivo.morosidad}</td>
                                            <td class="accion">
                                                <i class="fa-solid fa-money-bill btn-activo-activos" title="Pagos" id="socio-activo-pagos-${buscarSocioActivo.idSocio}"></i>
                                                ${inactivarSocioActivo}
                                                <i class="fa-solid fa-user accion-ver-ficha btn-activo-activos" title="Ficha socio" id="socio-activo-ficha-${buscarSocioActivo.idSocio}"></i>
                                            </td>
                                            <td class="td-cargando">
                                                <div class="sector-loader-socios-activos-opciones" id="sector-cargar-socios-activos-${buscarSocioActivo.idSocio}">
                                                </div>
                                            </td>

                                        </tr>
                                    </table>
                                    `;
    
                                    
                                    document.querySelector(".registro-historial-activos").innerHTML = "";                
                                    document.querySelector(".registro-historial-activos").innerHTML = socioActivo;
    
                                    // Boton inactivar
                                    document.querySelector(`#socio-activo-inactivar-${buscarSocioActivo.idSocio}`).addEventListener("click",()=>{

                                        if(document.querySelector(`#socio-activo-inactivar-${buscarSocioActivo.idSocio}`).classList.contains("btn-activo-activos")) {
                                            console.log("asd")
                                            inactivarSocio(buscarSocioActivo.idSocio,"Activo");
                                        }

                                        
                                    });
    
                                    // Boton Ficha Socio
                                    document.querySelector(`#socio-activo-ficha-${buscarSocioActivo.idSocio}`).addEventListener("click",async ()=>{
                                        verFichaSocio(buscarSocioActivo.idSocio,"Activo");
                                    });

                                    //Boton Ficha Pagos
                                    document.querySelector(`#socio-activo-pagos-${buscarSocioActivo.idSocio}`).addEventListener("click",async()=>{
                                        verFichaPagos(buscarSocioActivo.idSocio);
                                    });
    
                                }
    
                            }
    
                        } catch(e) {
                            console.log(e);
                            mensaje = `No esta ejecutado el servicio de NodeJS`;
                            ejecutarCartelModal(mensaje);
                        }
    
                    }


    
                } catch(e) {
    
                    console.log(e);
                    mensaje = `No esta ejecutado el servicio de NodeJS`;
                    ejecutarCartelModal(mensaje);
                }
    
            }
    
    
    
    
            /* --------------------- Modulo Buscar Inactivos ------------------ */
    
    
            document.querySelector(".modulo-inactivos").addEventListener("click",abrirModuloInactivos);
    
            async function abrirModuloInactivos() {
                
                seccion.innerHTML=``;
                sessionStorage.setItem("estasEditandoPago","false");
                limpiezaSessionStorage();

                let HTMLBuscarInactivo = `
                <div class="contenedor-inactivos">
                    <div class="buscador">
                        <input type="text" placeholder="Ingrese DNI /N° de socio" required id="buscar-dni-o-nrosocio-inactivo">
                        <div class="boton-buscar-inactivos" id="btn-buscar-socios-inactivos">
                            <i class="fa fa-search"></i>
                        </div>
                        <div class="sector-loader-socios-inactivos">
                            <div class="loader-socios-inactivos"></div>
                        </div>
                    </div>
                    <div class="registro-historial-inactivos">
                        <table class="registro-historial" id="tabla-inactivos">
                            <tr class="columnas">
                                <th>Socio</th>
                                <th>Acceso hasta</th>
                                <th>Estado</th>
                                <th>Situacion</th>
                                <th>Morosidad</th>
                                <th>Accion</th>
                            </tr>
                        </table>
                    </div>
                </div>
                `;

                const contenedor = document.createElement("DIV");
                contenedor.setAttribute("class","contenedor");
                contenedor.innerHTML = HTMLBuscarInactivo;
                seccion.appendChild(contenedor);
                document.querySelector(".sector-loader-socios-inactivos").innerHTML = `<div class="loader-socios-inactivos"></div>`;

                try {
    
                    const JSONlistaSociosInactivos = await fetch('http://localhost:3000/buscarSociosInactivos');
                    const listaSociosInactivos = await JSONlistaSociosInactivos.json();

                        actualizarListaSociosInactivos(listaSociosInactivos[0]);
    
                } catch(e) {
                    console.log(e);
                    mensaje = `No esta ejecutado el servicio de NodeJS`;
                    ejecutarCartelModal(mensaje);
                }
    
                // Buscar socio inactivo con la lupa
                document.querySelector("#btn-buscar-socios-inactivos").addEventListener("click", buscarSocioInactivo)
                

                async function buscarSocioInactivo() {
                    

                    try {
    
                        const dniONroSocioInactivo = document.querySelector("#buscar-dni-o-nrosocio-inactivo").value;
                        if(validarSoloNumeros(dniONroSocioInactivo)){
    
                            ejecutarCartelModal(`Debes ingresar un valor correcto en el importe`);
    
                        } else {

                            //Icono cargando activo
                            document.querySelector(".sector-loader-socios-inactivos").innerHTML = `<div class="loader-socios-inactivos"></div>`;

                            let objetoHeaderSocioInactivo =
                            {
                                
                                method : "POST",
                                body : JSON.stringify({
                                    dniONroSocioInactivo
                                }),
                                headers : {
                                    "Content-type" : "application/json"
                                }
                            }
                            const JSONBuscarSocioInactivo = await fetch('http://localhost:3000/buscarSociosInactivos/buscarDNIoNroSocioInactivo',objetoHeaderSocioInactivo);
    
                            const buscarSocioInactivo = await JSONBuscarSocioInactivo.json();

                            //Icono cargando Desactivado
                            document.querySelector(".sector-loader-socios-inactivos").innerHTML = ``;
    
                            if(buscarSocioInactivo === `Debes ingresar un valor correcto en el importe`) {
    
                                ejecutarCartelModal(buscarSocioInactivo);
                            }
                            else if(buscarSocioInactivo === `Socio activo o inexistente`) {
    
                                ejecutarCartelModal(buscarSocioInactivo);
                            }
                            else {
    
                                let socioInactivo = `
                                <table class="registro-historial">
                                    <tr class="columnas">
                                        <th>Socio</th>
                                        <th>Acceso hasta</th>
                                        <th>Estado</th>
                                        <th>Situacion</th>
                                        <th>Morosidad</th>
                                        <th>Accion</th>
                                    </tr>
                                    <tr>
                                        <td>${buscarSocioInactivo.nombres} ${buscarSocioInactivo.apellidos}</td>
                                        <td>${buscarSocioInactivo.ultimaFechaDePago}</td>
                                        <td>Activo</td>
                                        <td>${buscarSocioInactivo.situacion}</td>
                                        <td>${buscarSocioInactivo.morosidad}</td>
                                        <td class="accion">
                                            <i class="fa-solid fa-person-arrow-up-from-line btn-activo-inactivos accion-activar" title="Activar socio" id="socio-inactivo-activar-${buscarSocioInactivo.idSocio}"></i>
                                            <i class="fa-solid fa-trash btn-activo-inactivos accion-eliminar" title="Eliminar" id="socio-inactivo-eliminar-${buscarSocioInactivo.idSocio}"></i>
                                            <i class="fa-solid fa-user btn-activo-inactivos accion-ver-ficha" title="Ficha socio" id="socio-inactivo-ficha-${buscarSocioInactivo.idSocio}"></i>
                                        </td>
                                        <td class="td-cargando">
                                            <div class="sector-loader-socios-inactivos-opciones" id="sector-cargar-socios-inactivos-${buscarSocioInactivo.idSocio}">
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                `;
    
                                document.querySelector(".registro-historial-inactivos").innerHTML = "";                
                                document.querySelector(".registro-historial-inactivos").innerHTML = socioInactivo;
    
                                //Boton Activar socio inactivo
                                document.querySelector(`#socio-inactivo-activar-${buscarSocioInactivo.idSocio}`).addEventListener("click",()=>{
                                    activarSocio(buscarSocioInactivo.idSocio);
                                });
    
                                //Boton eliminar Socio Inactivo
                                document.querySelector(`#socio-inactivo-eliminar-${buscarSocioInactivo.idSocio}`).addEventListener("click", ()=>{
                                    eliminarSocioInactivo(buscarSocioInactivo.idSocio);
                                });
    
                                // Boton ver ficha socio inactivo
                                document.querySelector(`#socio-inactivo-ficha-${buscarSocioInactivo.idSocio}`).addEventListener("click",async ()=>{
                                    await verFichaSocio(buscarSocioInactivo.idSocio,"Inactivo");
                                })
                            }
                        }   
                    } catch(e) {
    
                        console.log(e);
                        mensaje = `No esta ejecutado el servicio de NodeJS`;
                        ejecutarCartelModal(mensaje);
                    }
                }
            }
    
            /* --------------------- Modulo Pagos ------------------ */
    
            const moduloPagos = document.querySelector(".modulo-pagos");
            const fechaHoy = new Date("2023-12-05");
            let HTMLPagos;
            if(fechaHoy.getMonth()+1 === 12){
                let eneroNuevo = `Enero ${fechaHoy.getFullYear()+1}`; 
                HTMLPagos = `
                <div class="contenedor-pagos">
                    <div class="buscador">
                        <input type="text" id="buscar-dni" placeholder="Ingrese DNI /N° de socio" required>
                        <div class="boton-buscar-pagos" id="btn-buscar">
                            <i class="fa fa-search"></i>
                        </div>
                        <div class="sector-loader-buscar-pago">
                        </div>
                    </div>
                    <div class="ingresar-nuevo-pago">
                        <table class="tabladatospersonales">
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Dni</th>
                                <th>Nr. Socio</th>
                            </tr>
                            <tr class="pagos-datos-socio">
                                <td>--------</td>
                                <td>--------</td>
                                <td>--------</td>
                                <td>--------</td>
                            </tr>
                        </table>   
                        <div class="ingresarpago">
                            <form action="#" method="#" autocomplete="off">
                                <div class="carga-pago">
                                <div class="input-box">
                                    <label>Fecha</label>
                                    <div class="fecha-de-pago">        </div>
                                </div>
                                <div class="input-box">
                                    <label>Importe</label>
                                    <input type="number" name="Importe">
                                </div>
                                <div class="input-box">
                                    <label>Mes Abonado</label>
                                        <select class="select-mes-pago">
                                            <option disabled selected>Selecione</option>
                                            <option>Enero</option>
                                            <option>Febrero</option>
                                            <option>Marzo</option>
                                            <option>Abril</option>
                                            <option>Mayo</option>
                                            <option>Junio</option>
                                            <option>Julio</option>
                                            <option>Agosto</option>
                                            <option>Septiembre</option>
                                            <option>Octubre</option>
                                            <option>Noviembre</option>
                                            <option>Diciembre</option>
                                            <option>${eneroNuevo}</option>
                                        </select>
                                </div>
                                <div class="input-box">
                                    <label>Concepto / Observacion</label>
                                    <input type="text" name="Observacion">
                                </div>
                                <div class="input-box">
                                    <label>Modo de pago</label>
                                    <div class="grupo-radio-pago">
                                        <div class="grupo-radio-h4">
                                            <input type="radio" name="Forma pago" value="Efectivo" class="input-radio" id="modo-de-pago">
                                            <h4>Efectivo</h4>
                                        </div>
                                        <div class="grupo-radio-h4">
                                            <input type="radio" name="Forma pago" value="Debito" class="input-radio" id="modo-de-pago">
                                            <h4>Debito</h4>
                                        </div>
                                        <div class="grupo-radio-h4">
                                            <input type="radio" name="Forma pago" value="Transferencia" class="input-radio" id="modo-de-pago">
                                            <h4>Transferencia</h4>
                                        </div>
                                    </div>
                                </div>
                            </form>  
                        </div>
                        <table class="historial-pagos">
                            <tr class="columnas">
                                <th>Fecha</th>
                                <th>Cuota/Mes/Año</th>
                                <th>Importe</th>
                                <th>Modo de Pago</th>
                                <th class="concepto">Concepto</th>
                                <th>Accion</th>
                            </tr>
                            <tr>
                                <td class="td-pagos">--------</td>
                                <td class="td-pagos">--------</td>
                                <td class="td-pagos">--------</td>
                                <td class="td-pagos">--------</td>
                                <td class="td-pagos concepto">---------------</td>
                                <td class="accion">
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
        
                `;
            } else {
                HTMLPagos = `
                <div class="contenedor-pagos">
                    <div class="buscador">
                        <input type="text" id="buscar-dni" placeholder="Ingrese DNI /N° de socio" required>
                        <div class="boton-buscar-pagos" id="btn-buscar">
                            <i class="fa fa-search"></i>
                        </div>
                        <div class="sector-loader-buscar-pago">
                        </div>
                    </div>
                    <div class="ingresar-nuevo-pago">
                        <table class="tabladatospersonales">
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Dni</th>
                                <th>Nr. Socio</th>
                            </tr>
                            <tr class="pagos-datos-socio">
                                <td>--------</td>
                                <td>--------</td>
                                <td>--------</td>
                                <td>--------</td>
                            </tr>
                        </table>   
                        <div class="ingresarpago">
                            <form action="#" method="#" autocomplete="off">
                                <div class="carga-pago">
                                <div class="input-box">
                                    <label>Fecha</label>
                                    <div class="fecha-de-pago">        </div>
                                </div>
                                <div class="input-box">
                                    <label>Importe</label>
                                    <input type="number" name="Importe">
                                </div>
                                <div class="input-box">
                                    <label>Mes Abonado</label>
                                        <select class="select-mes-pago">
                                            <option disabled selected>Selecione</option>
                                            <option>Enero</option>
                                            <option>Febrero</option>
                                            <option>Marzo</option>
                                            <option>Abril</option>
                                            <option>Mayo</option>
                                            <option>Junio</option>
                                            <option>Julio</option>
                                            <option>Agosto</option>
                                            <option>Septiembre</option>
                                            <option>Octubre</option>
                                            <option>Noviembre</option>
                                            <option>Diciembre</option>
                                        </select>
                                </div>
                                <div class="input-box">
                                    <label>Concepto / Observacion</label>
                                    <input type="text" name="Observacion">
                                </div>
                                <div class="input-box">
                                    <label>Modo de pago</label>
                                    <div class="grupo-radio-pago">
                                        <div class="grupo-radio-h4">
                                            <input type="radio" name="Forma pago" value="Efectivo" class="input-radio" id="modo-de-pago">
                                            <h4>Efectivo</h4>
                                        </div>
                                        <div class="grupo-radio-h4">
                                            <input type="radio" name="Forma pago" value="Debito" class="input-radio" id="modo-de-pago">
                                            <h4>Debito</h4>
                                        </div>
                                        <div class="grupo-radio-h4">
                                            <input type="radio" name="Forma pago" value="Transferencia" class="input-radio" id="modo-de-pago">
                                            <h4>Transferencia</h4>
                                        </div>
                                    </div>
                                </div>
                            </form>  
                        </div>
                        <table class="historial-pagos">
                            <tr class="columnas">
                                <th>Fecha</th>
                                <th>Cuota/Mes/Año</th>
                                <th>Importe</th>
                                <th>Modo de Pago</th>
                                <th class="concepto">Concepto</th>
                                <th>Accion</th>
                            </tr>
                            <tr>
                                <td class="td-pagos">--------</td>
                                <td class="td-pagos">--------</td>
                                <td class="td-pagos">--------</td>
                                <td class="td-pagos">--------</td>
                                <td class="td-pagos concepto">---------------</td>
                                <td class="accion">
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
        
                `;
            }


    
            moduloPagos.addEventListener("click",()=>{
    
                seccion.innerHTML = ``;
                const contenedor = document.createElement("DIV");
                contenedor.setAttribute("class","contenedor");
                contenedor.innerHTML = HTMLPagos;
                seccion.appendChild(contenedor);
                sessionStorage.setItem("estasEditandoPago","false");
                limpiezaSessionStorage();
    
                
                let dniABuscar;
                const campoDNI = document.getElementById("buscar-dni");
                campoDNI.addEventListener("keyup",()=>{
            
                    dniABuscar = parseInt(campoDNI.value);
                    
                });
    
                // Buscas el dni o nro. de socio con la lupa
                document.getElementById("btn-buscar").addEventListener("click",()=>{
    
                    if(validarSoloNumeros(campoDNI.value)) {
                        
                        ejecutarCartelModal("ingresa un dni o un nro. de socio correcto");
    
                    } else {
    
                        //Busca el dni en la base de datos
                        buscarDNIBackend(dniABuscar);
                        campoDNI.value = "";
                        dniABuscar = "";
    
    
                    }
    
                    async function buscarDNIBackend(dni) {
    
                        document.querySelector(".sector-loader-buscar-pago").innerHTML = `<div class="loader-buscar-pago"></div>`;
                        let objetoHeaderNuevoPago =
                        {
                            
                            method : "POST",
                            body : JSON.stringify({
                                dni : dni
                            }),
                            headers : {
                                "Content-type" : "application/json"
                            }
                        } 
    
                        try {
    
                            // Se carga el numero de DNI o Socio
                            const enviarDNI = await fetch("http://localhost:3000/nuevoPago",objetoHeaderNuevoPago);
    
                            let data = await enviarDNI.json();
                            

                            document.querySelector(".sector-loader-buscar-pago").innerHTML = ``;

                            if(data[0].dni === undefined) {
    
                                ejecutarCartelModal("No se encuentra el DNI o el nro. de socio");
    
                            } else {
                                sessionStorage.setItem("estasEditandoPago","false");
                                let HTMLPreListaHistorialPagos;
                                if(data[1].length === 0) {
                                    HTMLPreListaHistorialPagos =`<tr class="columnas">
                                            <th>Fecha</th>
                                            <th>Cuota/Mes/Año</th>
                                            <th>Importe</th>
                                            <th>Modo de Pago</th>
                                            <th class="concepto">Concepto</th>
                                            <th>Accion</th>
                                        </tr>
                                        <tr>
                                            <td class="td-pagos">--------</td>
                                            <td class="td-pagos">--------</td>
                                            <td class="td-pagos">--------</td>
                                            <td class="td-pagos">--------</td>
                                            <td class="td-pagos concepto">---------------</td>
                                            <td class="accion"></td>
                                        </tr>
                                    `;
                                } else {
    
    
                                    HTMLPreListaHistorialPagos = `<tr class="columnas">
                                    <th>Fecha</th>
                                    <th>Cuota/Mes/Año</th>
                                    <th>Importe</th>
                                    <th>Modo de Pago</th>
                                    <th class="concepto">Concepto</th>
                                    <th>Accion</th>
                                </tr>`;
    
    
                                }
                                

                                let HTMLMesDePago;

                                if(fechaHoy.getMonth()+1 === 12 ) {

                                    const eneroNuevo = `Enero ${fechaHoy.getFullYear()+1}`;
                                    HTMLMesDePago = `
                                    <select class="select-mes-pago">
                                        <option disabled selected value="0">Selecione</option>
                                        <option value="01">Enero</option>
                                        <option value="02">Febrero</option>
                                        <option value="03">Marzo</option>
                                        <option value="04">Abril</option>
                                        <option value="05">Mayo</option>
                                        <option value="06">Junio</option>
                                        <option value="07">Julio</option>
                                        <option value="08">Agosto</option>
                                        <option value="09">Septiembre</option>
                                        <option value="10">Octubre</option>
                                        <option value="11">Noviembre</option>
                                        <option value="12">Diciembre</option>
                                        <option value="13">${eneroNuevo}</option>
                                    </select>
                                `;
                                } else {

                                    HTMLMesDePago = `
                                    <select class="select-mes-pago">
                                        <option disabled selected value="0">Selecione</option>
                                        <option value="01">Enero</option>
                                        <option value="02">Febrero</option>
                                        <option value="03">Marzo</option>
                                        <option value="04">Abril</option>
                                        <option value="05">Mayo</option>
                                        <option value="06">Junio</option>
                                        <option value="07">Julio</option>
                                        <option value="08">Agosto</option>
                                        <option value="09">Septiembre</option>
                                        <option value="10">Octubre</option>
                                        <option value="11">Noviembre</option>
                                        <option value="12">Diciembre</option>
                                    </select>
                                `;
                                }

                                const HTMLIngresarNuevoPago = `
                                <table class="tabladatospersonales">
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Apellido</th>
                                        <th>Dni</th>
                                        <th>Nr. Socio</th>
                                    </tr>
                                    <tr class="pagos-datos-socio">
                                        <td>${data[0].nombres}</td>
                                        <td>${data[0].apellidos}</td>
                                        <td>${data[0].dni}</td>
                                        <td>${data[0].nroSocio}</td>
                                    </tr>
                                </table>   
                                <div class="ingresarpago">
                                    <form action="#" method="#" autocomplete="off">
                                        <div class="carga-pago">
                                        <div class="input-box">
                                            <label>Fecha</label>
                                            <div class="fecha-de-pago">${data[0].fechaRegistracionPago.slice(0,10)}</div>
                                        </div>
                                        <div class="input-box">
                                            <label>Importe</label>
                                            <input type="number" name="Importe" class="importe-pago">
                                        </div>
                                        <div class="input-box">
                                            <label>Mes Abonado</label>
                                            ${HTMLMesDePago}
                                        </div>
                                        <div class="input-box">
                                            <label>Concepto / Observacion</label>
                                            <input type="text" name="Observacion" class="observacion-pago">
                                        </div>
                                        <div class="input-box">
                                            <label>Modo de pago</label>
                                            <div class="grupo-radio-pago">
                                                <div class="grupo-radio-h4">
                                                    <input type="radio" name="Forma pago" value="Efectivo" class="input-radio" id="modo-de-pago">
                                                    <h4>Efectivo</h4>
                                                </div>
                                                <div class="grupo-radio-h4">
                                                    <input type="radio" name="Forma pago" value="Debito" class="input-radio" id="modo-de-pago">
                                                    <h4>Debito</h4>
                                                </div>
                                                <div class="grupo-radio-h4">
                                                    <input type="radio" name="Forma pago" value="Transferencia" class="input-radio" id="modo-de-pago">
                                                    <h4>Transferencia</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </form>  
                                </div>
                                
                                <table class="historial-pagos">

                                </table>
                                <div class="boton-registrar-pago">
                                    <button type="submit" class="custom-btn btn-3 btn-activo-registrar-pago" id="boton-registrar-pago"><span>Registrar Pago</span></button>
                                    <div class="sector-loader-registrar-pago">
                                    </div>
                                </div>

                            `;
 
                            document.querySelector(".ingresar-nuevo-pago").innerHTML = "";
    
                            document.querySelector(".ingresar-nuevo-pago").innerHTML = HTMLIngresarNuevoPago;
    
                            actualizarListaRegistrosDePago(data[1],data[0].idSocio);
    
    
    
                            //Boton registra Pago
                            document.getElementById("boton-registrar-pago").addEventListener("click",()=>{
                                registrarPago(data);
                            });
    
                            

                            }
                            
                        } catch(e) {
                            console.log(e);
                            mensaje = `No esta ejecutado el servicio de NodeJS`;
                            ejecutarCartelModal(mensaje);
    
                        }
                        
                    }
                });
    
            });
            
            // -------------------------- Modulo Caja --------------------------------

            document.querySelector(".modulo-caja").addEventListener("click",abrirModuloCaja);

            // -------------------------- Modulo Usuarios ------------------------------

            document.querySelector(".modulo-usuarios").addEventListener("click",abrirModuloUsuarios);

                
            
            async function abrirModuloUsuarios() {

                seccion.innerHTML = "";
                limpiezaSessionStorage();




                const JSONListaUsuarios = await fetch(`http://localhost:3000/ListaUsuarios`);
                const listaUsuarios = await JSONListaUsuarios.json();
                let elUsuario = "";
                let laListaUsuarios = "";
                listaUsuarios.forEach(ele=>{
                    elUsuario = `
                    <tr>
                        <td>${ele.usuario[0].toLocaleUpperCase()+ele.usuario.slice(1,30)}</td>
                        <td><input type="password" placeholder="********" class="password-usuarios" id="pass-actual-${ele.id}" required></td>
                        <td><input type="password" placeholder="********" class="password-usuarios" id="pass-nueva-${ele.id}" required></td>
                        <td><input type="password" placeholder="********" class="password-usuarios" id="pass-repetida-${ele.id}" required></td>
                        <td class="accion-usuarios">
                            <i class="fa-solid fa-pencil btn-usuarios accion-editar-usuarios btn-activo-usuarios" title="Editar" id="editar-usuario-${ele.id}"></i>
                            <i class="fa-solid fa-floppy-disk btn-usuarios accion-guardar-usuarios btn-inactivo-usuarios" id="guardar-usuario-${ele.id}" title="Guardar"></i>
                            <i class="fa-sharp fa-solid fa-eye-slash accion-verpass-usuarios btn-inactivo-usuarios" title="Ver Contraseña" id="verpass-usuario-${ele.id}"></i>
                        </td>
                        <td class="td-cargando">
                            <div class="sector-loader-usuarios-opciones" id="sector-cargar-usuarios-${ele.id}">

                            </div>
                        </td>
                    </tr>  
                    `;
                    laListaUsuarios += elUsuario;
                })

                const contenedor = document.createElement("DIV");
                contenedor.setAttribute("class","contenedor-usuarios");
                contenedor.innerHTML = `
                <div class="grupo-titulo">
                    <div class="titulo-usuarios">Lista de Usuarios</div>   
                </div>      
                <table class="lista-usuarios">
                        <tbody>
                            <tr class="columnas-usuarios">
                                <th>Usuario</th>
                                <th>Contraseña Actual</th>
                                <th>Nueva Contraseña</th>
                                <th>Repetir Contraseña</th>
                            </tr>            
                            ${laListaUsuarios}
                        </tbody>
                </table>
                `;

                seccion.appendChild(contenedor);


                // evita que alteren el campo
                const passwordUsuarios = document.querySelectorAll(".password-usuarios");
                passwordUsuarios.forEach(ele=>{
                    ele.setAttribute("disabled","true");
                });

                //Botones editar contraseña
                const btnEditarPassUsuarios = document.querySelectorAll(".accion-editar-usuarios");
                btnEditarPassUsuarios.forEach(ele=>{
                    ele.addEventListener("click",()=>{
                        editarPassUsuario(ele.id.slice(15,25));
                    });
                });

                //Botones guardar contraseña
                const btnGuardarPassUsuario = document.querySelectorAll(".accion-guardar-usuarios");
                btnGuardarPassUsuario.forEach(ele=>{
                    ele.addEventListener("click",()=>{
                        guardarPassUsuario(ele.id.slice(16,26));
                        
                    });
                });

                //Botones Ver Pass
                const btnVerPassUsuarios = document.querySelectorAll(".accion-verpass-usuarios");
                btnVerPassUsuarios.forEach(ele=>{
                    ele.addEventListener("click", ()=>{
                        verPassUsuario(ele.id.slice(16,26));
                    })
                })
            }

            // --------------------------- Modulo Salir -------------------------------- 


            document.querySelector(".modulo-desconectar").addEventListener("click",()=>{

    
                mostrarPantallaLogin();
                document.querySelector(".nav-general").removeChild(nav);
                limpiezaSessionStorage();

            });

            // -------------------------- Funciones Generales --------------------------
            
            function abrirMenu() {  
                
                sidebar.style.left="0px";
                cerrarSidebar.style.left="225px";
            
                let respuesta = seccion.hasChildNodes();
                if(respuesta) {
                    try{
                        document.querySelector(".contenedor").style.transform = "translateX(80px)";
                        document.querySelector(".contenedor").style.transition = "all .3s";
                        if(document.querySelector(".contenedor-cumpleanos")) {
                            document.querySelector(".contenedor-cumpleanos").style.transform = "translateX(-80px)"; 
                        }


                    } catch{}
    
                }
    
            
            }
    
            function cerrarMenu() {
    
                sidebar.style.left="-270px";
                cerrarSidebar.style.left="-195px";
    
                let respuesta = seccion.hasChildNodes();
                if(respuesta) {
                    try {
                        document.querySelector(".contenedor").style.transform = "translateX(-120px)";
                        document.querySelector(".contenedor").style.transition = "all .3s";
                        if(document.querySelector(".contenedor-cumpleanos")) {
                            document.querySelector(".contenedor-cumpleanos").style.transform = "translateX(120px)"; 
                        }
                    }catch{}

                }
    
            }

            // Modo Responsive
            function modoResponsive() {
                const barraResponsive = document.querySelector(".barra");
                const cancelResponsive = document.querySelector(".cancel");
                const mm = matchMedia("(max-width: 700px)");
                
                    mm.addEventListener("change",()=>{
                        
                        
                            if(mm.matches){
            
                                try{
                                    contenedorGeneral.classList.replace("contenedor-general","contenedor-general-responsive");
                                    sidebar.classList.replace("sidebar","sidebar-responsive");
                                    barraResponsive.classList.replace("barra","barra-responsive");
                                    cancelResponsive.classList.replace("cancel","cancel-responsive");
                                    document.querySelector(".modulo-nuevo-socio").innerHTML = `<i class="fa-sharp fa-solid fa-plus"></i>`;
                                    document.querySelector(".modulo-buscar-socio").innerHTML=`
                                    <i class="fa-solid fa-magnifying-glass"></i>
                                    <ul>
                                        <li class="modulo-activos"><i class="fa-solid fa-person-arrow-up-from-line"></i></li>
                                        <li class="modulo-inactivos"><i class="fa-solid fa-person-arrow-down-to-line"></i></li>
                                    </ul>
                                    `;
                                    document.querySelector(".modulo-pagos").innerHTML= `<i class="fa-solid fa-money-bill"></i>`;
                                    document.querySelector(".modulo-caja").innerHTML= `<i class="fa-solid fa-sack-dollar"></i>`;
                                    document.querySelector(".modulo-usuarios").innerHTML=` <i class="fa-solid fa-user"></i>`;
                                    document.querySelector(".modulo-desconectar").innerHTML = `<i class="fa-solid fa-arrow-right-from-bracket"></i>`;
                                    document.querySelector("#logo").classList.replace("logo","logo-responsive");
                                         
                                    cerrarSidebar.style.visibility = "hidden";
                                    
                    
                                    // Abrir Modulo Activos
                                    document.querySelector(".modulo-activos").addEventListener("click",abrirModuloActivos);
                    
                                    // Abrir Modulo Inactivos
                                    document.querySelector(".modulo-inactivos").addEventListener("click",abrirModuloInactivos);
                                } catch {}

                                
                
                            } else {
                                try{
                                    abrirSidebar.style.left = "20px"
                                    contenedorGeneral.classList.replace("contenedor-general-responsive","contenedor-general");
                                    sidebar.classList.replace("sidebar-responsive","sidebar");
                                    barraResponsive.classList.replace("barra-responsive","barra");
                                    cancelResponsive.classList.replace("cancel-responsive","cancel");
                                    document.querySelector(".modulo-nuevo-socio").innerHTML = `<i class="fa-sharp fa-solid fa-plus"></i>Nuevo Socio`;
                                    document.querySelector(".modulo-buscar-socio").innerHTML=`<i class="fa-solid fa-magnifying-glass"></i>Buscar Socio`;
                                    document.querySelector(".modulo-buscar-socio").innerHTML=`
                                    <i class="fa-solid fa-magnifying-glass"></i>Buscar Socios
                                    <ul>
                                        <li class="modulo-activos"><i class="fa-solid fa-person-arrow-up-from-line"></i>Activos</li>
                                        <li class="modulo-inactivos"><i class="fa-solid fa-person-arrow-down-to-line"></i>Inactivos</li>
                                    </ul>
                                    `;
                                    document.querySelector(".modulo-pagos").innerHTML= `<i class="fa-solid fa-money-bill"></i>Pagos`;
                                    document.querySelector(".modulo-caja").innerHTML= `<i class="fa-solid fa-sack-dollar"></i></i>Caja`;
                                    document.querySelector(".modulo-usuarios").innerHTML=` <i class="fa-solid fa-user"></i>Usuarios`;
                                    document.querySelector(".modulo-desconectar").innerHTML = `<i class="fa-solid fa-arrow-right-from-bracket"></i>Salir`;
                                    document.querySelector("#logo").classList.replace("logo-responsive","logo");
                                    cerrarSidebar.style.visibility = "visible";
                    
                                    // Abrir Modulo Activos
                                    document.querySelector(".modulo-activos").addEventListener("click",abrirModuloActivos);
                    
                                    // Abrir Modulo Inactivos
                                    document.querySelector(".modulo-inactivos").addEventListener("click",abrirModuloInactivos);
                                } catch {}

                            }        
                    }); 
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
    
    
            function limpiezaSessionStorage(){
                //Datos PAgos
                sessionStorage.removeItem("importeActual");
                sessionStorage.removeItem("observacionActual");
                sessionStorage.removeItem("importeAModificar");
                sessionStorage.removeItem("observacionAModificar");
                sessionStorage.removeItem("estasEditandoPago");
                sessionStorage.removeItem("modoDePagoAModificar");
    
                
                //Datos Usuario
                sessionStorage.removeItem("estasEditandoPassUsuario");
            }


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


            function generarReportePersonalizado(array,fechaInput,total,ingresoOEgreso) {


                let tipoDeCaja = "";
                if(ingresoOEgreso === `Ingreso`) {
                    tipoDeCaja = `Ingresos`
                }
                else if(ingresoOEgreso === `Egreso`) {
                    tipoDeCaja = `Egresos`
                }
                let fechaInputFinal = fechaInput.split("-"); // año-mes-dia
                let fechaReporte = `${fechaInputFinal[2]}/${fechaInputFinal[1]}/${fechaInputFinal[0]}`;
                let fechaNombreArchivo = `${fechaInputFinal[2]}${fechaInputFinal[1]}${fechaInputFinal[0]}`;

                //Reporte personalizado
                        var props = {
                            outputType: jsPDFInvoiceTemplate.OutputType.Save,
                            returnJsPDFDocObject: true,
                            fileName: `${ingresoOEgreso}${fechaNombreArchivo}`, //Edito
                            orientationLandscape: false,
                            compress: true,
                            logo: {
                                src: "http://localhost/escapegym/project/img/logoscape.jpg",
                                type: 'JPG', //optional, when src= data:uri (nodejs case)
                                width: 53.33, //aspect ratio = width/height
                                height: 26.66,
                                margin: {
                                    top: 0, //negative or positive num, from the current position
                                    left: 0 //negative or positive num, from the current position
                                }
                            },
                            business: {
                                name: `Caja ${tipoDeCaja} fecha ${fechaReporte}`,
                            },
                            contact: {
                                name: "Detalle reporte:",
                            },
                            invoice: {
                                label: "Total: $",
                                num: `${total}`,
                                headerBorder: false,
                                tableBodyBorder: false,
                                header: [
                                {
                                    title: "#", 
                                    style: { 
                                        width: 15
                                    } 
                                }, 
                                { 
                                    title: "Nro. Socio",
                                    style: {
                                        width: 45
                                    } 
                                }, 
                                { 
                                    title: "Concepto",
                                    style: {
                                        width: 75
                                    } 
                                }, 
                                { title: "Modo de pago",
                                    style: { 
                                        width: 22
                                    }
                                },
                                { title: ""},
                                { title: ""},
                                { 
                                    title: "Importe",
                                    style: {
                                        width: 15
                                    }
                                }
                                ],
                                table: Array.from(Array(array.length), (item, index)=>([
                                    index + 1,
                                    array[index][0],
                                    array[index][1],
                                    array[index][2],
                                    "",
                                    "",
                                    `$${array[index][5]}`
                                ])),

                                // let arrays = [
                                //     [1123,"Mariano Nicolas Szencis Yans","Transferencia","","",20000],
                                //     [2333,"Jorge Lopez","Efectivo","","",5000],
                                //     [2333,"Cuota Diaria","Debito","","",5000]
                                // ]
                                additionalRows: [{
                                    col1: 'Total:',
                                    col2: '145,250.50',
                                    col3: 'ALL',
                                    style: {
                                        fontSize: 17 //optional, default 12
                                    }
                                },
                                {
                                    col1: 'VAT:',
                                    col2: '20',
                                    col3: '%',
                                    style: {
                                        fontSize: 16 //optional, default 12
                                    }
                                },
                                {
                                    col1: 'SubTotal:',
                                    col2: '116,199.90',
                                    col3: 'ALL',
                                    style: {
                                        fontSize: 12 //optional, default 12
                                    }
                                }],
                                invDescLabel: "",
                                invDesc: "",
                            },
                            footer: {
                                text: "",
                            },
                            pageEnable: true,
                            pageLabel: "Pagina ",
                        };

                return props;
            }

            function generarListaCumpleanos() {

                if(datosLogin[1].length>0) {

                    seccion.innerHTML = ``;
                    let socioCumpleaños = "";
                    let listaSocioCumpleaños = "";
                    datosLogin[1].forEach(ele=>{
                        socioCumpleaños = `
                        <div class="box-socio-cumple">
                            <span class="detalle-cumple">- ${ele.nombre} ${ele.apellido}</span>
                            <button class="custom-btn-cumple btn-3-cumple accion-ficha-cumple" id="ver-socio-cumple-${ele.idSocio}" value="true"><span>Ficha</span></button>
                            <div class="sector-loader-ficha-cumple-opciones" id="sector-cargar-socios-activos-${ele.idSocio}">
                            </div>
                        </div>
                        `;
                        listaSocioCumpleaños += socioCumpleaños;
                    });
                    const contenedor = document.createElement("DIV");
                    contenedor.setAttribute("class","contenedor");
                    contenedor.innerHTML = `
        
                    <div class="contenedor-cumpleanos">
                        <div class="titulo-cumpleanos">Hoy es el cumpleaños de:</div>
                        ${listaSocioCumpleaños}
                    </div>
                    `;
        
                    seccion.appendChild(contenedor);
    
                    // Boton ficha cumple
                    const btnFichaCumple = document.querySelectorAll(".accion-ficha-cumple");
    
                    btnFichaCumple.forEach(element=>{
    
                        element.addEventListener("click",()=>{
                            verFichaSocio(element.id.slice(17,25),"Cumpleanos");
                        });
                    });
    
                }
            }
            

            function crearHTMLNuevoSocio(nombre,apellido,dni,nroSocio,correo,telefono,domicilio,fechaNacimiento,nuevoPago) {

                const fechaHoySocioNuevo = new Date();
                const fechaEnCampo = `${fechaHoySocioNuevo.getDate()}/${(fechaHoySocioNuevo.getMonth()+1)}/${fechaHoySocioNuevo.getFullYear()}`;

                const HTMLNuevoSocio = `
                    <div class="contenedor-nuevo-socio">
                        <div class="titulo">Registro de Socio</div>
                        <form class="form-nuevo-socio">
                            <div class="detalles_personales">
                                <div class="input-box">
                                    <span class="detalle">Nombres</span>
                                    <input type="text" name="Nombre" placeholder="Ingresar nombres" id="nombre" value="${nombre}" required>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">Apellidos</span>
                                    <input type="text" name="Apellido" placeholder="Ingresar apellidos" id="apellido" value="${apellido}" required>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">DNI</span>
                                    <input type="text" name="Dni" placeholder="Ingresar n° de documento" id="dni" value="${dni}" required>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">Numero de Socio</span>
                                    <input type="text" name="Nro. Socio" id="nroSocio" placeholder="Ingresar n° de socio" value="${nroSocio}" required>
                                </div>                
        
                                <div class="input-box">
                                    <span class="detalle">Mail</span>
                                    <input type="email" name="Correo" multipe placeholder="Ingresar correo electronico" id="correo" value="${correo}" required>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">Contacto</span>
                                    <input type="tel" name="Telefono" placeholder="Ingresar n° de telefono" id="telefono" value="${telefono}" required>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">Domicilio</span>
                                    <input type="text" name="Domicilio" placeholder="Ingresar domicilio" id="domicilio" value="${domicilio}" required>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">Fecha Nacimiento</span>
                                    <input type="date" name="Fecha Nacimiento" id="fecha-nacimiento" value="${fechaNacimiento}" required>
                                </div>
                                <div class="input-box fecha-alta">
                                    <span class="detalle">Fecha de Alta</span>
                                    <div class="campo-fecha-alta" name="Fecha de alta" id="fecha-alta-nuevo-socio">${fechaEnCampo}</div>
                                </div>
                                <div class="input-box">
                                </div>
                                <div class="btn-nuevo-socio">
                                    <button type="submit" class="custom-btn btn-3" id="boton-registrar-socio"><span>Ir a Pagos</span></button>
                                </div>
                            </div>
                        </form>
                    </div>
                `;

                seccion.innerHTML = ``;
                const contenedor = document.createElement("DIV");
                contenedor.setAttribute("class","contenedor");
                contenedor.innerHTML = HTMLNuevoSocio;
                seccion.appendChild(contenedor);
                sessionStorage.setItem("estasEditandoPago","false");
                limpiezaSessionStorage();

                // Boton ir a Pagos
                document.getElementById("boton-registrar-socio").addEventListener("click",(e)=>{
                    e.preventDefault();

                    const nombre = document.getElementById("nombre").value;
                    const apellido = document.getElementById("apellido").value;
                    const dni = document.getElementById("dni").value;
                    const nroSocio = document.getElementById("nroSocio").value;
                    const correo = document.getElementById("correo").value;
                    const telefono = document.getElementById("telefono").value;
                    const domicilio = document.getElementById("domicilio").value;
                    const fechaNacimiento = document.querySelector("#fecha-nacimiento").value;
                    
                    

                    if(nombre === "" || nombre.length < 3) {
    
                        ejecutarCartelModal(`Debes ingresar un nombre mayor a 3 digitos`);
        
                    } 
                    else if(apellido === "" || apellido.length < 3) {
        
                        ejecutarCartelModal(`Debes ingresar un apellido mayor a 3 digitos`);
        
                    }
                    else if(validarSoloNumeros(dni) || dni.length < 7 || dni.length > 12) {
        
                        ejecutarCartelModal(`Debes ingresar entre 7 y 12 numeros para el dni`);
        
                    }
                    else if(validarSoloNumeros(nroSocio) === true || nroSocio.length < 1) {
        
                        ejecutarCartelModal(`Debes ingresar algun numero en el Nro. de Socio`);
        
                    }
                    else if(nroSocio.length > 10) {
                        ejecutarCartelModal(`El maximo es de 10 digitos en nro. de socio`);
                    }
                    
                    else if(esEmail(correo) == false) {
                    
                        ejecutarCartelModal(`Debe ingresar un correo electronico valido`); 
        
                    }
                    else if(validarSoloNumeros(telefono) == true) {
        
                        ejecutarCartelModal(`Debes ingresar solo numeros para el telefono`);

                    }
                     else {
        
                        //Guardar datos en objeto
                        const nuevoSocio = {
                            nombre : nombre,
                            apellido : apellido,
                            dni : dni,
                            domicilio : domicilio,
                            correo : correo,
                            telefono : telefono,
                            nroSocio : nroSocio,
                            estado : true,
                            fechaNacimiento: fechaNacimiento,
                            eliminado : false
                        }

                        if(nuevoPago === undefined){
                            crearHTMLNuevoPago(nuevoSocio,fechaEnCampo,"","","");

                        } else {
                            crearHTMLNuevoPago(nuevoSocio,fechaEnCampo,nuevoPago.importe,nuevoPago.observacion,nuevoPago.modoDePago);

                        }                             
                    }

                });
            }

            function crearHTMLNuevoPago(nuevoSocio,fechaAlta,importe,observacion,modoPago) {
                
                const fecha = new Date();
                const mesDePago = fecha.getMonth()+1;
                const detectarMesAbonado = (mes)=>{
                    
                    let HTMLMesAbonado;

                    if(mes == 1) {
                        HTMLMesAbonado = `
                        <select class="select-mes-pago" disabled="true">
                            <option disabled value="0">Selecione</option>
                            <option value="01" selected>Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        `;
                    }
                    else if( mes == 2) {
                        HTMLMesAbonado = `
                        <select class="select-mes-pago" disabled="true">
                            <option disabled value="0">Selecione</option>
                            <option value="01">Enero</option>
                            <option value="02" selected>Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        `;
                    }
                    else if(mes == 3) {
                        HTMLMesAbonado = `
                        <select class="select-mes-pago" disabled="true">
                            <option disabled value="0">Selecione</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03" selected>Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        `;
                    }
                    else if(mes == 4) {
                        HTMLMesAbonado = `
                        <select class="select-mes-pago" disabled="true">
                            <option value="0">Selecione</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04" selected>Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        `;
                    }
                    else if(mes == 5) {
                        HTMLMesAbonado = `
                        <select class="select-mes-pago" disabled="true">
                            <option disabled value="0">Selecione</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05" selected>Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        `;
                    }
                    else if(mes == 6) {
                        HTMLMesAbonado = `
                        <select class="select-mes-pago" disabled="true">
                            <option disabled value="0">Selecione</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06" selected>Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        `;
                    }
                    else if(mes == 7) {
                        HTMLMesAbonado = `
                        <select class="select-mes-pago" disabled="true">
                            <option disabled value="0">Selecione</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07" selected>Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        `;
                    }
                    else if(mes == 8) {
                        HTMLMesAbonado = `
                        <select class="select-mes-pago" disabled="true">
                            <option disabled value="0">Selecione</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08" selected>Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        `;
                    }
                    else if(mes == 9) {
                        HTMLMesAbonado = `
                        <select class="select-mes-pago" disabled="true">
                            <option disabled value="0">Selecione</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09" selected>Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        `;
                    }
                    else if(mes == 10) {
                        HTMLMesAbonado = `
                        <select class="select-mes-pago" disabled="true">
                            <option disabled value="0">Selecione</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10" selected>Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        `;
                    }
                    else if(mes == 11) {
                        HTMLMesAbonado = `
                        <select class="select-mes-pago" disabled="true">
                            <option disabled value="0">Selecione</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11" selected>Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        `;
                    }
                    else if(mes == 12) {
                        HTMLMesAbonado = `
                        <select class="select-mes-pago" disabled="true">
                            <option disabled value="0">Selecione</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12" selected>Diciembre</option>
                        </select>
                        `;
                    }
                    return HTMLMesAbonado;
                };
                const detectarModoDePago = (modoDePago) =>{
                    let HTMLModoDePago;
                    if(modoDePago === undefined || modoDePago == "") {
                        HTMLModoDePago = `
                            <div class="grupo-radio-h4"> 
                                <input type="radio" name="Forma pago" value="Efectivo" class="input-radio" id="modo-de-pago">
                                <h4>Efectivo</h4>
                            </div>
                            <div class="grupo-radio-h4">
                                <input type="radio" name="Forma pago" value="Debito" class="input-radio" id="modo-de-pago">
                                <h4>Debito</h4>
                            </div>
                            <div class="grupo-radio-h4">
                                <input type="radio" name="Forma pago" value="Transferencia" class="input-radio" id="modo-de-pago">
                                <h4>Transferencia</h4>
                            </div>
                        `;
                    }
                    else if(modoDePago === `Efectivo`) {
                        HTMLModoDePago = `
                            <div class="grupo-radio-h4">
                                <input type="radio" name="Forma pago" value="Efectivo" class="input-radio" id="modo-de-pago" checked>
                                <h4>Efectivo</h4>
                            </div>
                            <div class="grupo-radio-h4">
                                <input type="radio" name="Forma pago" value="Debito" class="input-radio" id="modo-de-pago">
                                <h4>Debito</h4>
                            </div>
                            <div class="grupo-radio-h4">
                                <input type="radio" name="Forma pago" value="Transferencia" class="input-radio" id="modo-de-pago">
                                <h4>Transferencia</h4>
                            </div>
                        `;
                    }
                    else if(modoDePago === `Debito`) {
                        HTMLModoDePago = `
                            <div class="grupo-radio-h4">
                                <input type="radio" name="Forma pago" value="Efectivo" class="input-radio" id="modo-de-pago">
                                <h4>Efectivo</h4>
                            </div>
                            <div class="grupo-radio-h4">
                                <input type="radio" name="Forma pago" value="Debito" class="input-radio" id="modo-de-pago" checked>
                                <h4>Debito</h4>
                            </div>
                            <div class="grupo-radio-h4">
                                <input type="radio" name="Forma pago" value="Transferencia" class="input-radio" id="modo-de-pago">
                                <h4>Transferencia</h4>
                            </div>
                        `;
                    }
                    else if(modoDePago === `Transferencia`) {
                        HTMLModoDePago = `
                            <div class="grupo-radio-h4">
                                <input type="radio" name="Forma pago" value="Efectivo" class="input-radio" id="modo-de-pago">
                                <h4>Efectivo</h4>
                            </div>
                            <div class="grupo-radio-h4">
                                <input type="radio" name="Forma pago" value="Debito" class="input-radio" id="modo-de-pago">
                                <h4>Debito</h4>
                            </div>
                            <div class="grupo-radio-h4">
                                <input type="radio" name="Forma pago" value="Transferencia" class="input-radio" id="modo-de-pago" checked>
                                <h4>Transferencia</h4>
                            </div>
                        `;
                    }
                    return HTMLModoDePago;
               
                };
               
                const mesAbonadoDetectado = detectarMesAbonado(mesDePago);
                const modoDePago = detectarModoDePago(modoPago);
                const HTMLPagos = `
                    <div class="contenedor-pagos">
                        <div class="ingresar-nuevo-pago">
                            <table class="tabladatospersonales">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Dni</th>
                                    <th>Nr. Socio</th>
                                </tr>
                                <tr class="pagos-datos-socio">
                                    <td>${nuevoSocio.nombre}</td>
                                    <td>${nuevoSocio.apellido}</td>
                                    <td>${nuevoSocio.dni}</td>
                                    <td>${nuevoSocio.nroSocio}</td>
                                </tr> 
                            </table>   
                            <div class="ingresarpago">
                                <form action="#" method="#" autocomplete="off">
                                    <div class="carga-pago">
                                    <div class="input-box">
                                        <label>Fecha</label>
                                        <div class="fecha-de-pago">${fechaAlta}</div>
                                    </div>
                                    <div class="input-box">
                                        <label>Importe</label>
                                        <input type="number" name="Importe" class="importe-pago" value="${importe}">
                                    </div>
                                    <div class="input-box">
                                        <label>Mes Abonado</label>
                                        ${mesAbonadoDetectado}
                                    </div>
                                    <div class="input-box">
                                        <label>Concepto / Observacion</label>
                                        <input type="text" name="Observacion" class="observacion-pago" value="${observacion}">
                                    </div>
                                    <div class="input-box">
                                        <label>Modo de pago</label>
                                        <div class="grupo-radio-pago">
                                            ${modoDePago}
                                        </div>
                                    </div>
                                </form>  
                            </div>
                            <div class="boton-registrar-pago">
                                <button type="submit" class="custom-btn btn-3 btn-activo-registrar-pago" id="boton-volver-nuevo-socio"><span>Volver</span></button>
                                <button type="submit" class="custom-btn btn-3 btn-activo-registrar-pago" id="boton-registrar-socio-pago"><span>Registrar</span></button>
                                <div class="sector-loader-nuevo-socio"></div>
                            </div>
                        </div>
                    </div>
                `;

                seccion.innerHTML = ``;    
                const contenedor = document.createElement("DIV");
                contenedor.setAttribute("class","contenedor");
                contenedor.innerHTML = HTMLPagos;
                seccion.appendChild(contenedor);
                sessionStorage.setItem("estasEditandoPago","false");
                limpiezaSessionStorage();

                    //Boton registra Socio y Pago
                document.getElementById("boton-registrar-socio-pago").addEventListener("click",async ()=>{

                    let modoDePago;
                    document.querySelectorAll("#modo-de-pago").forEach(ele=>{
                        if(ele.checked){
                            modoDePago = ele.value;
                        }
                    });

                const nuevoPago = {

                    importe: document.querySelector(".importe-pago").value,
                    modoDePago: modoDePago,
                    mesDePago: document.querySelector(".select-mes-pago").value,
                    observacion: document.querySelector(".observacion-pago").value,
                    eliminado: false

                }

                        
                if(validarSoloNumeros(nuevoPago.importe) || nuevoPago.importe == "") {

                    ejecutarCartelModal(`Debes ingresar un valor en el importe`);
                }
                else if(nuevoPago.mesDePago == "0") {

                    ejecutarCartelModal(`Debes seleccionar un mes correcto`);
                }
                else if(nuevoPago.observacion.length>38){
                    ejecutarCartelModal(`Limite de caracteres alcanzado en la observacion`);
                }
                else if(nuevoPago.mesDePago !== "01" && nuevoPago.mesDePago !== "02" && nuevoPago.mesDePago !== "03" && nuevoPago.mesDePago !== "04" && nuevoPago.mesDePago !== "05" && nuevoPago.mesDePago !== "06" && nuevoPago.mesDePago !== "07" && nuevoPago.mesDePago !== "08" && nuevoPago.mesDePago !== "09" && nuevoPago.mesDePago !== "10" && nuevoPago.mesDePago !== "11" && nuevoPago.mesDePago !== "12"){

                    ejecutarCartelModal(`El mes abonado no es el correcto`);
                }
                else if(nuevoPago.observacion.length>38){
                    ejecutarCartelModal(`Limite de caracteres alcanzado en la observacion`);
                }
                else if(nuevoPago.modoDePago !== "Efectivo" && nuevoPago.modoDePago !== "Debito" && nuevoPago.modoDePago !== "Transferencia") {

                    ejecutarCartelModal(`Elige una opcion correcta en el modo de pago`);
                }
                
                else {

                    registrarNuevoSocioYPago(nuevoSocio,nuevoPago);

                }

                });
                // Boton volver a nuevo socio
                document.querySelector("#boton-volver-nuevo-socio").addEventListener("click",()=>{
                    
                    let modoDePago;
                    document.querySelectorAll("#modo-de-pago").forEach(ele=>{
                        if(ele.checked){
                            modoDePago = ele.value;
                        }
                    });

                    const nuevoPago = {

                        importe: document.querySelector(".importe-pago").value,
                        modoDePago: modoDePago,
                        mesDePago: document.querySelector(".select-mes-pago").value,
                        observacion: document.querySelector(".observacion-pago").value,
                        eliminado: false
    
                    }


                    crearHTMLNuevoSocio(nuevoSocio.nombre,nuevoSocio.apellido,nuevoSocio.dni,nuevoSocio.nroSocio,nuevoSocio.correo,nuevoSocio.telefono,nuevoSocio.domicilio,nuevoSocio.fechaNacimiento,nuevoPago);
                });
            }


            async function registrarNuevoSocioYPago(nuevoSocio,nuevoPago){
                
                // Genera icono carga
                document.querySelector(".sector-loader-nuevo-socio").innerHTML = `<div class="loader-nuevo-socio"></div>`;
                try{

                    let objetoHeaderNuevoSocioYPago =
                    {
                        
                        method : "POST",
                        body : JSON.stringify({
                            nuevoSocio: nuevoSocio,
                            nuevoPago: nuevoPago

                        }),
                        headers : {
                            "Content-type" : "application/json"
                        }
                    } 


                    const JSONAltaNuevoSocioYPago = await fetch(`http://localhost:3000/nuevoSocio`,objetoHeaderNuevoSocioYPago);


                    const altaNuevoSocioYPago = await JSONAltaNuevoSocioYPago.json();


                    //Validaciones Socio
                    if(altaNuevoSocioYPago === `Debes ingresar un nombre mayor a 3 digitos`) {

                        ejecutarCartelModal(altaNuevoSocioYPago);
                        crearHTMLNuevoSocio(nuevoSocio.nombre,nuevoSocio.apellido,nuevoSocio.dni,nuevoSocio.nroSocio,nuevoSocio.correo,nuevoSocio.telefono,nuevoSocio.domicilio,nuevoSocio.fechaNacimiento,nuevoPago);
                    }
                    else if(altaNuevoSocioYPago === `Debes ingresar un apellido mayor a 3 digitos`) {

                        ejecutarCartelModal(altaNuevoSocioYPago);
                        crearHTMLNuevoSocio(nuevoSocio.nombre,nuevoSocio.apellido,nuevoSocio.dni,nuevoSocio.nroSocio,nuevoSocio.correo,nuevoSocio.telefono,nuevoSocio.domicilio,nuevoSocio.fechaNacimiento,nuevoPago);
                    }
                    else if(altaNuevoSocioYPago === `Debes ingresar entre 7 y 12 numeros para el dni`) {

                        ejecutarCartelModal(altaNuevoSocioYPago);
                        crearHTMLNuevoSocio(nuevoSocio.nombre,nuevoSocio.apellido,nuevoSocio.dni,nuevoSocio.nroSocio,nuevoSocio.correo,nuevoSocio.telefono,nuevoSocio.domicilio,nuevoSocio.fechaNacimiento,nuevoPago);
                    }
                    else if(altaNuevoSocioYPago === `Debes ingresar algun numero en el Nro. de Socio`) {

                        ejecutarCartelModal(altaNuevoSocioYPago);
                        crearHTMLNuevoSocio(nuevoSocio.nombre,nuevoSocio.apellido,nuevoSocio.dni,nuevoSocio.nroSocio,nuevoSocio.correo,nuevoSocio.telefono,nuevoSocio.domicilio,nuevoSocio.fechaNacimiento,nuevoPago);

                    }
                    else if(altaNuevoSocioYPago === `El maximo es de 10 digitos en nro. de socio`) {

                        ejecutarCartelModal(altaNuevoSocioYPago);
                        crearHTMLNuevoSocio(nuevoSocio.nombre,nuevoSocio.apellido,nuevoSocio.dni,nuevoSocio.nroSocio,nuevoSocio.correo,nuevoSocio.telefono,nuevoSocio.domicilio,nuevoSocio.fechaNacimiento,nuevoPago);
                    }
                    else if(altaNuevoSocioYPago === `Debe ingresar un correo electronico valido`) {

                        ejecutarCartelModal(altaNuevoSocioYPago);
                        crearHTMLNuevoSocio(nuevoSocio.nombre,nuevoSocio.apellido,nuevoSocio.dni,nuevoSocio.nroSocio,nuevoSocio.correo,nuevoSocio.telefono,nuevoSocio.domicilio,nuevoSocio.fechaNacimiento,nuevoPago);
                    }
                    else if(altaNuevoSocioYPago === `Debes ingresar solo numeros para el telefono`) {

                        ejecutarCartelModal(altaNuevoSocioYPago);
                        crearHTMLNuevoSocio(nuevoSocio.nombre,nuevoSocio.apellido,nuevoSocio.dni,nuevoSocio.nroSocio,nuevoSocio.correo,nuevoSocio.telefono,nuevoSocio.domicilio,nuevoSocio.fechaNacimiento,nuevoPago);
                    }// Validaciones del Pago
                    else if(altaNuevoSocioYPago === `Debes ingresar un valor en el importe`) {
                        ejecutarCartelModal(altaNuevoSocioYPago);
                    }
                    else if(altaNuevoSocioYPago === `Debes seleccionar un mes correcto`) {
                        ejecutarCartelModal(altaNuevoSocioYPago);
                    }
                    else if(altaNuevoSocioYPago === `El mes abonado no es el correcto`) {
                        ejecutarCartelModal(altaNuevoSocioYPago);
                    }
                    else if(altaNuevoSocioYPago === `Limite de caracteres alcanzado en la observacion`){
                        ejecutarCartelModal(altaNuevoSocioYPago);
                    }
                    else if(altaNuevoSocioYPago === `Elige una opcion correcta en el modo de pago`) {
                        ejecutarCartelModal(altaNuevoSocioYPago);
                    }
                    else if(altaNuevoSocioYPago === `El dni ya existe`) {
                        ejecutarCartelModal(altaNuevoSocioYPago);
                        crearHTMLNuevoSocio(nuevoSocio.nombre,nuevoSocio.apellido,nuevoSocio.dni,nuevoSocio.nroSocio,nuevoSocio.correo,nuevoSocio.telefono,nuevoSocio.domicilio,nuevoSocio.fechaNacimiento,nuevoPago);
                    }
                    else if(altaNuevoSocioYPago === `El nro. de socio ya existe`) {
                        ejecutarCartelModal(altaNuevoSocioYPago);
                        crearHTMLNuevoSocio(nuevoSocio.nombre,nuevoSocio.apellido,nuevoSocio.dni,nuevoSocio.nroSocio,nuevoSocio.correo,nuevoSocio.telefono,nuevoSocio.domicilio,nuevoSocio.fechaNacimiento,nuevoPago);
                    }
                    else if(altaNuevoSocioYPago === `El socio y la cuota fueron dados alta`) {
                        ejecutarCartelModal(altaNuevoSocioYPago);
                        crearHTMLNuevoSocio("","","","","","","","",undefined);
                    }
                } catch(e) {
                    console.log(e);
                    mensaje = `No esta ejecutado el servicio de NodeJS`;
                    ejecutarCartelModal(mensaje);
                }



            }

            //Editar un registro de Pago
    
            async function editarRegPago(id) {
    
                const validarEditarRegistroPago = sessionStorage.getItem("estasEditandoPago");
    
                if(validarEditarRegistroPago=="true"){
    
                    ejecutarCartelModal("Debes editar un registro a la vez");
    
                } else{
    
                    sessionStorage.setItem("estasEditandoPago",true);
                    if(document.querySelector(`#editar-${id}`).classList.contains("btn-activo")) {
                        
                        if(document.querySelector("#boton-registrar-pago")) {
                            document.querySelector("#boton-registrar-pago").classList.replace("btn-activo-registrar-pago","btn-inactivo-registrar-pago");
                        }

                        document.querySelector(`#editar-${id}`).classList.replace("btn-activo","btn-inactivo");
                        document.querySelector(`#guardar-${id}`).classList.replace("btn-inactivo","btn-activo");
                        document.querySelector(`#eliminar-${id}`).classList.replace(`btn-activo`,`btn-inactivo`);
                        
                        
                        let importeActual = document.querySelector(`#importe-${id}`).textContent;
                        if(importeActual[0] == "$"){
                        importeActual = importeActual.substring(1,25);
                        document.querySelector(`#importe-${id}`).textContent = importeActual;
    
                        }
                        const observacionActual = document.querySelector(`#observacion-${id}`).textContent;
                        const modoDePagoActual = document.querySelector(`#modo-pago-${id}`).textContent;
    
    
            
                        document.querySelector(`#importe-${id}`).contentEditable = true;
                        document.querySelector(`#importe-${id}`).style.color="#bbb";
                    
                        document.querySelector(`#observacion-${id}`).contentEditable = true;
                        document.querySelector(`#observacion-${id}`).style.color="#bbb";

                        
                        let formaDePagoActual = document.querySelector(`#modo-pago-${id}`).textContent;

                        let opcion = "";
                        if(formaDePagoActual === `Efectivo`) {
                            opcion = `
                                <select id="lista-modo-pago-${id}" class="lista-modo-pago">
                                    <option value="Efectivo" selected>Efectivo</option>
                                    <option value="Debito">Debito</option>
                                    <option value="Transferencia">Transferencia</option>
                                </select>`;
                        }
                        else if(formaDePagoActual ===`Debito`) {
                            opcion = `
                                <select id="lista-modo-pago-${id}" class="lista-modo-pago">
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Debito" selected>Debito</option>
                                    <option value="Transferencia">Transferencia</option>
                                </select>`;
                        }
                        else if(formaDePagoActual === `Transferencia`) {
                            opcion = `
                            <select id="lista-modo-pago-${id}" class="lista-modo-pago">
                                <option value="Efectivo">Efectivo</option>
                                <option value="Debito">Debito</option>
                                <option value="Transferencia" selected>Transferencia</option>
                            </select>`;
                        }

                        document.querySelector(`#modo-pago-${id}`).innerHTML = opcion;

    
                        sessionStorage.setItem("importeActual",importeActual);
                        sessionStorage.setItem("observacionActual",observacionActual);
                        sessionStorage.setItem("modoDePagoActual",modoDePagoActual);
    
                    }
                }
    
            }
    
            //Guardar un registro de Pago Modificado
            async function guardarRegPago(id,pagoVieneDe,fechaInput,ingresoOEgreso) {
    
                if(document.querySelector(`#guardar-${id}`).classList.contains("btn-activo")) {
    
                    modal.innerHTML="";
    
                    const importeAModificar = document.querySelector(`#importe-${id}`).textContent;
                    const observacionAModificar = document.querySelector(`#observacion-${id}`).textContent;
                    const modoDePagoAModificar = document.querySelector(`#lista-modo-pago-${id}`).value;
                    
                    
    
                    if(validarSoloNumeros(importeAModificar) || importeAModificar == ""){
    
                        ejecutarCartelModal(`Debes ingresar un valor correcto en el importe`);
    
                    }
                    else if(observacionAModificar.length>38){
    
                        ejecutarCartelModal(`Limite de caracteres alcanzado en la observacion`);
    
                    }
                    else if(modoDePagoAModificar !== "Efectivo" && modoDePagoAModificar !== "Debito" && modoDePagoAModificar !== "Transferencia") {

                        ejecutarCartelModal(`Elige una opcion correcta en el modo de pago`);

                    }
                    else {
    
                        sessionStorage.setItem("modoDePagoAModificar",modoDePagoAModificar);
                        sessionStorage.setItem("importeAModificar",importeAModificar);
                        sessionStorage.setItem("observacionAModificar",observacionAModificar);
    
                        
                        document.querySelector(`#importe-${id}`).contentEditable = false;   
                        document.querySelector(`#observacion-${id}`).contentEditable = false;
                        document.querySelector(`#observacion-${id}`).style.maxWidth = "315px";
                        document.querySelector(`#observacion-${id}`).style.maxHeight = "45px";
                        document.querySelector(`#modo-pago-${id}`).innerHTML = `${modoDePagoAModificar}`;
                
                        document.querySelector(`#editar-${id}`).classList.replace("btn-inactivo","btn-activo");
                        document.querySelector(`#guardar-${id}`).classList.replace("btn-activo","btn-inactivo");
                        document.querySelector(`#eliminar-${id}`).classList.replace(`btn-inactivo`,`btn-activo`);
                        
    
                        document.querySelector(`#importe-${id}`).style.color="#000";
                        document.querySelector(`#observacion-${id}`).style.color="#000";
                    
    
                        ejecutarCartelModalConfirmarModificarPago(`¿Desea guardar los cambios?`,id,pagoVieneDe,fechaInput,ingresoOEgreso);
    
    
                    }
    
                }
    
            }
    
            // Eliminar un registro de Pago
            async function eliminarRegPago(idPago,idSocio,vieneDe,fechaInput,ingresoOEgreso) {


                
                if(document.querySelector(`#eliminar-${idPago}`).classList.contains("btn-activo")) {
    
                    modal.innerHTML="";     
                    ejecutarCartelModalConfirmarEliminarPago(`¿Quieres eliminar el registro de pago?`,idPago,idSocio,vieneDe,fechaInput,ingresoOEgreso);


                }
    
            }
    
            // Actualizar lista de registros de pagos
            function actualizarListaRegistrosDePago(listaPagos,idSocio) {
            
                let HTMLPreListaHistorialPagos;
            
                if(listaPagos.length === 0 || listaPagos === "0") {
    
    
    
                    HTMLPreListaHistorialPagos =`
                        <tr class="columnas">
                            <th>Fecha</th>
                            <th>Cuota/Mes/Año</th>
                            <th>Importe</th>
                            <th>Modo de Pago</th>
                            <th class="concepto">Concepto</th>
                            <th>Accion</th>
                        </tr>
                        <tr>
                            <td class="td-pagos">--------</td>
                            <td class="td-pagos">--------</td>
                            <td class="td-pagos">--------</td>
                            <td class="td-pagos">--------</td>
                            <td class="td-pagos concepto">---------------</td>
                            <td class="accion"></td>
                        </tr>
                    `;
                } else {
                    

                    HTMLPreListaHistorialPagos = `
                    <tr class="columnas">
                        <th>Fecha</th>
                        <th>Cuota/Mes/Año</th>
                        <th>Importe</th>
                        <th>Modo de Pago</th>
                        <th class="concepto">Concepto</th>
                        <th>Accion</th>
                    </tr>`;
                    
                    listaPagos.forEach(element=>{

                        HTMLPreListaHistorialPagos += `
                            <tr>
                                <td>${element.fechaDePago.slice(0,10)}</td>
                                <td class="td-pagos">${element.cuotaMensual}</td>
                                <td class="td-pagos" id="importe-${element.idPago}">$${element.importe}</td>
                                <td class="td-pagos" id="modo-pago-${element.idPago}">${element.modoDePago}</td>
                                <td class="td-pagos concepto" id="observacion-${element.idPago}">${element.observacion}</td>
                                <td class="accion">
                                    <i class="fa-solid fa-pencil btn-activo accion-editar" title="Editar" id="editar-${element.idPago}"></i>  
                                    <i class="fa-solid fa-floppy-disk btn-inactivo accion-guardar" id="guardar-${element.idPago}" title="Guardar"></i>
                                    <i class="fa-solid fa-trash btn-activo accion-eliminar" id="eliminar-${element.idPago}" title="Eliminar"></i>
                                </td>
                                <td class="td-cargando">
                                    <div class="sector-loader-pagos-opciones" id="sector-cargar-pagos-${element.idPago}">
                                    </div>
                                </td>
                            </tr>                    
                        `;     
                    });

    
                }
    
                document.querySelector(".historial-pagos").innerHTML = "";
                document.querySelector(".historial-pagos").innerHTML = HTMLPreListaHistorialPagos;
    
                //Editar un registro de Pago               
                const editarRegistrosPagos = document.querySelectorAll("table.historial-pagos tr td.accion i.accion-editar ");
    
                editarRegistrosPagos.forEach(element => {
                    
    
                    element.addEventListener("click",()=>{
                                
                        editarRegPago(element.id.slice(7,15));
                            
                    });
                });
                
                // Guardar el registro Modificado de Pago
                const guardarRegistrosPagos = document.querySelectorAll("table.historial-pagos tr td.accion i.accion-guardar");
    
                guardarRegistrosPagos.forEach(element => {
    
                    element.addEventListener("click",()=>{
                        
                        guardarRegPago(element.id.slice(8,15),"Socio");
    
                    });
                });
                
                //Eliminar un registro de Pago
                const eliminarRegistrosPagos = document.querySelectorAll("table.historial-pagos tr td.accion i.accion-eliminar");
    
                eliminarRegistrosPagos.forEach(element => {
    
                    element.addEventListener("click",()=>{
    
                        eliminarRegPago(element.id.slice(9,15),idSocio,"Socio");
    
                    });
                });
    
            }
    
            function actualizarListaSociosActivos(listaSociosActivos,activoOMoroso) {
                

                let listadoSociosActivos = "";
                let socioActivo = "";
                listaSociosActivos.forEach(ele=>{
                    let inactivarSocio;
                    if(ele.inactivarSocio === true) {
                        inactivarSocio = `
                        <i class="fa-solid fa-person-arrow-down-to-line accion-inactivar btn-activo-activos" id="socio-activo-inactivar-${ele.idSocio}" title="Inactivar"></i>
                        `;
                    }

                    else if(ele.inactivarSocio === false) {
                        inactivarSocio = `
                        <i class="fa-solid fa-person-arrow-down-to-line accion-inactivar btn-inactivo-activos" id="socio-activo-inactivar-${ele.idSocio}" title="Inactivar"></i>
                        `;
                    }

                    socioActivo = `
                    <tr>
                        <td>${ele.nombres} ${ele.apellidos}</td>
                        <td>${ele.ultimaFechaDePago}</td>
                        <td>Activo</td>
                        <td class="mora-${ele.color}">${ele.situacion}</td>
                        <td class="mora-${ele.color}">${ele.morosidad}</td>
                        <td class="accion">
                            <i class="fa-solid fa-money-bill accion-pagos-activos btn-activo-activos" title="Pagos" id="socio-activo-pagos-${ele.idSocio}"></i>
                            ${inactivarSocio}
                            <i class="fa-solid fa-user accion-ver-ficha btn-activo-activos" title="Ficha socio" id="socio-activo-ficha-${ele.idSocio}"></i>
                        </td>
                        <td class="td-cargando">
                            <div class="sector-loader-socios-activos-opciones" id="sector-cargar-socios-activos-${ele.idSocio}">
                            </div>
                        </td>
                    </tr>
                    `;
                    listadoSociosActivos += socioActivo;
                });
    
                let HTMLListaSociosActivos = `
                <table class="registro-historial">
                    <tr class="columnas">
                        <th>Socio</th>
                        <th>Acceso hasta</th>
                        <th>Estado</th>
                        <th>Situacion</th>
                        <th>Morosidad</th>
                        <th>Accion</th>
                    </tr>
                    ${listadoSociosActivos}
                </table>
                `
                document.querySelector(".registro-historial-activos").innerHTML = HTMLListaSociosActivos;
    
    
                //Botones Inactivar
                const botonInactivarSocio = document.querySelectorAll("table.registro-historial tr td.accion i.accion-inactivar");
    
                botonInactivarSocio.forEach(ele=>{
                    ele.addEventListener("click",()=>{
                        if(ele.classList.contains("btn-activo-activos")){
                            inactivarSocio(ele.id.slice(23,35),activoOMoroso);
                        }
                    });
                });
    
                //Botones Ficha Socio
                const botonFichaSocio = document.querySelectorAll(".accion-ver-ficha");
                botonFichaSocio.forEach(ele=>{
                    ele.addEventListener("click",async ()=>{
                    
                    if(activoOMoroso === "Moroso") {
                        await verFichaSocio(ele.id.slice(19,39),"Moroso");
                    } 
                    else {
                        await verFichaSocio(ele.id.slice(19,39),"Activo");
                    }                
                    });
                });

                //Botones Ficha Pagos
                const botonFichaPago = document.querySelectorAll(".accion-pagos-activos");
                botonFichaPago.forEach(ele=>{
                    ele.addEventListener("click", async ()=>{

                        if(activoOMoroso === "Moroso") {
                            await verFichaPagos(ele.id.slice(19,39),"Moroso")
                        }
                        else {
                            await verFichaPagos(ele.id.slice(19,39),"Activo");
                        }
                        
                    });
                })
    
            }

            async function buscarSociosMorososActivos(){
                        
                document.querySelector(".sector-loader-socios--morosos-activos").innerHTML = `<div class="loader-socios-activos"></div>`;

                try {

                const JSONListaSociosMorososActivos = await fetch(`http://localhost:3000/buscarSociosActivos/SociosMorosos`);
                const listaSociosMorososActivos = await JSONListaSociosMorososActivos.json();

                document.querySelector(".sector-loader-socios--morosos-activos").innerHTML = ``;
                if(listaSociosMorososActivos === `No se han encontrado socios morosos`) {
                    ejecutarCartelModal(listaSociosMorososActivos);
                } else {
                    actualizarListaSociosActivos(listaSociosMorososActivos[0],"Moroso");
                }

                } 
                catch(e) {

                    mensaje = `No esta ejecutado el servicio de NodeJS`;
                    ejecutarCartelModal(mensaje);
                    console.log(e)
                }
            }

            async function abrirModuloActivosMorosos() {
    
                seccion.innerHTML = ``;
                sessionStorage.setItem("estasEditandoPago","false");
                limpiezaSessionStorage();

                let HTMLBuscarActivo = `
                <div class="contenedor-activos">
                    <div class="buscador">
                        <input type="text" placeholder="Ingrese DNI /N° de socio" required id="buscar-dni-o-nrosocio-activo">
                        <div class="boton-buscar-activos" id="btn-buscar-socios-activos">
                            <i class="fa fa-search"></i>
                        </div>
                        <div class="sector-loader-socios-activos">
                            <div class="loader-socios-activos"></div>
                        </div>
                    </div>
                    <div class="socios-morosos-activos"></div>
                    <div class="registro-historial-activos">
                        <table class="registro-historial">
                            <tr class="columnas">
                                <th>Socio</th>
                                <th>Acesso Hasta</th>
                                <th>Estado</th>
                                <th>Situacion</th>
                                <th>Morosidad</th>
                                <th>Accion</th>
                            </tr>
                        </table>
                    </div>
                </div>
                `;

                const contenedor = document.createElement("DIV");
                contenedor.setAttribute("class","contenedor");
                contenedor.innerHTML = HTMLBuscarActivo;
                seccion.appendChild(contenedor);
                
                try{
                    document.querySelector(".sector-loader-socios-activos").innerHTML = `<div class="loader-socios-activos"></div>`;
                    const JSONListaSociosMorososActivos = await fetch(`http://localhost:3000/buscarSociosActivos/SociosMorosos`);
                    const listaSociosMorososActivos = await JSONListaSociosMorososActivos.json();
                    document.querySelector(".sector-loader-socios-activos").innerHTML = ``;
                    if(listaSociosMorososActivos === `No se han encontrado socios morosos`) {
                        ejecutarCartelModal(listaSociosMorososActivos);
                    } else {
                        actualizarListaSociosActivos(listaSociosMorososActivos[0],"Moroso");
                    }
                     
                    //Buscar socios activos con la lupa
                    document.querySelector("#btn-buscar-socios-activos").addEventListener("click",buscarSocioActivo);

                    // Boton Morosos
                    document.querySelector(".socios-morosos-activos").innerHTML = `
                    <button type="submit" class="custom-btn btn-3" id="boton-buscar-morosos-activos"><span>Solo Morosos</span></button>
                    <div class="sector-loader-socios--morosos-activos"></div>
                    `;

                    document.querySelector("#boton-buscar-morosos-activos").addEventListener("click",buscarSociosMorososActivos);

                    
                    async function buscarSocioActivo() {
                        

                        try {
                            
                            const dniONroSocioActivo = document.querySelector("#buscar-dni-o-nrosocio-activo").value;
                            if(validarSoloNumeros(dniONroSocioActivo)){
    
                                ejecutarCartelModal(`Debes ingresar un valor correcto en el importe`);
    
                            } else {
                                
                                //Icono cargando activo
                                document.querySelector(".sector-loader-socios-activos").innerHTML = `<div class="loader-nuevo-socio"></div>`;
                                let objetoHeaderSocioActivo =
                                {
                                    
                                    method : "POST",
                                    body : JSON.stringify({
                                        dniONroSocioActivo
                                    }),
                                    headers : {
                                        "Content-type" : "application/json"
                                    }
                                }


                                
                                const JSONBuscarSocioActivo = await fetch('http://localhost:3000/buscarSociosActivos/buscarDNIoNroSocioActivo',objetoHeaderSocioActivo);
    
                                const buscarSocioActivo = await JSONBuscarSocioActivo.json();

                                //Icono cargando Desactivado
                                document.querySelector(".sector-loader-socios-activos").innerHTML = ``;
                                
                                if(buscarSocioActivo === `Debes ingresar un valor correcto en el importe`) {
    
                                    ejecutarCartelModal(buscarSocioActivo);
    
                                } else if(buscarSocioActivo == `Socio Inactivo o inexistente`) {
    
                                    ejecutarCartelModal(buscarSocioActivo);
    
                                } else {
                        
                                    let socioActivo = `
                                    <table class="registro-historial">
                                        <tr class="columnas">
                                            <th>Socio</th>
                                            <th>Acceso hasta</th>
                                            <th>Estado</th>
                                            <th>Situacion</th>
                                            <th>Morosidad</th>
                                            <th>Accion</th>
                                        </tr>
                                        <tr>
                                            <td>${buscarSocioActivo.nombres} ${buscarSocioActivo.apellidos}</td>
                                            <td>${buscarSocioActivo.ultimaFechaDePago}</td>
                                            <td>Activo</td>
                                            <td class="mora-${buscarSocioActivo.color}">${buscarSocioActivo.situacion}</td>
                                            <td class="mora-${buscarSocioActivo.color}">${buscarSocioActivo.morosidad}</td>
                                            <td class="accion">
                                                <i class="fa-solid fa-money-bill btn-activo-activos" title="Pagos" id="socio-activo-pagos-${buscarSocioActivo.idSocio}"></i>
                                                <i class="fa-solid fa-person-arrow-down-to-line accion-inactivar btn-activo-activos" title="Inactivar" id="socio-activo-inactivar-${buscarSocioActivo.idSocio}"></i>
                                                <i class="fa-solid fa-user accion-ver-ficha btn-activo-activos" title="Ficha socio" id="socio-activo-ficha-${buscarSocioActivo.idSocio}"></i>
                                            </td>
                                            <td class="td-cargando">
                                                <div class="sector-loader-socios-activos-opciones" id="sector-cargar-socios-activos-${buscarSocioActivo.idSocio}">
                                                </div>
                                            </td>

                                        </tr>
                                    </table>
                                    `;
    
                                    
                                    document.querySelector(".registro-historial-activos").innerHTML = "";                
                                    document.querySelector(".registro-historial-activos").innerHTML = socioActivo;
    
                                    // Boton inactivar
                                    document.querySelector(`#socio-activo-inactivar-${buscarSocioActivo.idSocio}`).addEventListener("click",()=>{
                                        inactivarSocio(buscarSocioActivo.idSocio);
                                        
                                    });
    
                                    // Boton Ficha Socio
                                    document.querySelector(`#socio-activo-ficha-${buscarSocioActivo.idSocio}`).addEventListener("click",async ()=>{
                                        verFichaSocio(buscarSocioActivo.idSocio,"Activo");
                                    });

                                    //Boton Ficha Pagos
                                    document.querySelector(`#socio-activo-pagos-${buscarSocioActivo.idSocio}`).addEventListener("click",async()=>{
                                        verFichaPagos(buscarSocioActivo.idSocio);
                                    });
    
                                }
    
                            }
    
                        } catch(e) {
                            console.log(e);
                            mensaje = `No esta ejecutado el servicio de NodeJS`;
                            ejecutarCartelModal(mensaje);
                        }
    
                    }
    
                } catch(e) {
    
                    console.log(e);
                    mensaje = `No esta ejecutado el servicio de NodeJS`;
                    ejecutarCartelModal(mensaje);
                }
    
            }
    
            // Inactivar Socio
            function inactivarSocio(idSocio,activoOMoroso) {
                
                const cartelModal = document.createElement("DIV");
                cartelModal.setAttribute("class","background-modal");
                cartelModal.innerHTML = `
    
                <div class="cartel-modal">
                    <h2>¿Quieres inactivar al socio?</h2>
                    <div class="cartel-modal__botones">
                        <button class="custom-btn btn-3" id="boton-inactivar-socio-activo" value="true"><span>Inactivar</span></button>
                        <button class="custom-btn btn-3" id="boton-cancelar-socio-activo" value="false"><span>Cancelar</span></button>
                    </div>
                </div>
                `;
    
                modal.appendChild(cartelModal);
    
                document.querySelector("#boton-inactivar-socio-activo").addEventListener("click", async ()=>{
                    
                    modal.innerHTML=``;
                    //Activa icono cargando
                    document.querySelector(`#sector-cargar-socios-activos-${idSocio}`).innerHTML =`<div class="loader-socios-activos-opciones"></div>`;

                    try{
    
                        let objetoHeaderIdSocioAInactivar =
                        {
                            
                            method : "POST",
                            body : JSON.stringify({
                                
                                idSocio: idSocio,
                                activoOMoroso: activoOMoroso
                            }),
                            headers : {
                                "Content-type" : "application/json"
                            }
                        }
    
                        const JSONIdSocioAInactivar = await fetch('http://localhost:3000/buscarSociosActivos/inactivarSocio',objetoHeaderIdSocioAInactivar);
    
                        const IdSocioAInactivar = await JSONIdSocioAInactivar.json();
                        
                        ejecutarCartelModal(IdSocioAInactivar[1]);

                        // desactiva icono cargando
                        document.querySelector(".sector-loader-socios-activos-opciones").innerHTML=``;
                        actualizarListaSociosActivos(IdSocioAInactivar[0],IdSocioAInactivar[2]);


    
    
                    } catch(e) {
    
                        console.log(e);
                        mensaje = `No esta ejecutado el servicio de NodeJS`;
                        ejecutarCartelModal(mensaje);
                    }
                });
    
                document.querySelector("#boton-cancelar-socio-activo").addEventListener("click",()=>{
                    modal.removeChild(cartelModal); 
                });
            }
    
            // Ver Ficha Socio Activo
            async function verFichaSocio(idSocio,activoOInactivo) {
    
                modal.innerHTML= "";

                if(document.querySelector(`#sector-cargar-socios-activos-${idSocio}`)){

                    document.querySelector(`#sector-cargar-socios-activos-${idSocio}`).innerHTML = `<div class="loader-socios-inactivos-opciones"></div>`;
                }
                else if(document.querySelector(`#sector-cargar-socios-inactivos-${idSocio}`)){
                    document.querySelector(`#sector-cargar-socios-inactivos-${idSocio}`).innerHTML = `<div class="loader-socios-inactivos-opciones"></div>`;
                }
                else if(document.querySelector(`#sector-cargar-socios-activos-${idSocio}`)) {

                    document.querySelector(`sector-cargar-socios-activos-${idSocio}`).innerHTML = `<div class="loader-ficha-cumple-opciones">`;
                }
    
                try {
                    let objetoHeaderFichaSocio =
                    {
                        
                        method : "POST",
                        body : JSON.stringify({
                            
                            idSocio: idSocio,
                        }),
                        headers : {
                            "Content-type" : "application/json"
                        }
                    }
    
                    const JSONdatosFichaSocio = await fetch(`http://localhost:3000/buscarSociosActivos/FichaSocio`,objetoHeaderFichaSocio);
                    
                    const datosFichaSocio = await JSONdatosFichaSocio.json();
    
                    seccion.innerHTML = "";
    
                    if(datosFichaSocio.telefono === null) {
                        datosFichaSocio.telefono = "";
                    }
                    
                    // Se arma el HTML de la ficha de socio
                    const HTMLNuevoSocio = `
                    <div class="contenedor-ficha-socio">
                        <div class="titulo-ficha-socio">Ficha de Socio</div>
                        <div class="datos-ficha-socio">
                            <div class="detalles_personales-ficha-socio">
                                <div class="input-box">
                                    <span class="detalle">Nombres</span>
                                    <div class="caja-datos-ficha-socio" name="nombres" id="nombre-ficha-socio">${datosFichaSocio.nombre}</div>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">Apellidos</span>
                                    <div class="caja-datos-ficha-socio" name="apellidos" id="apellido-ficha-socio">${datosFichaSocio.apellido}</div>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">DNI</span>
                                    <div class="caja-datos-ficha-socio" name="dni" id="dni-ficha-socio">${datosFichaSocio.dni}</div>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">Numero de Socio</span>
                                    <div class="caja-datos-ficha-socio" id="nroSocio-ficha-socio" name="Numero Socio">${datosFichaSocio.nroSocio}</div>
                                </div>                
                                <div class="input-box">
                                    <span class="detalle">Mail</span>
                                    <div class="caja-datos-ficha-socio" name="correo" id="correo-ficha-socio">${datosFichaSocio.correo}</div>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">Contacto</span>
                                    <div class="caja-datos-ficha-socio" name="telefono" id="telefono-ficha-socio">${datosFichaSocio.telefono}</div>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">Domicilio</span>
                                    <div class="caja-datos-ficha-socio" name="Domicilio" id="domicilio-ficha-socio">${datosFichaSocio.domicilio}</div>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">Fecha Nacimiento</span>
                                    <div class="caja-datos-ficha-socio" name="Fecha nacimiento" id="fecha-nacimiento-ficha-socio">${datosFichaSocio.fechaNacimientoEdit}</div>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">Fecha de alta</span>
                                    <div class="caja-datos-ficha-socio" name="fichero" id="fecha-alta-ficha-socio">${datosFichaSocio.fechaAlta.slice(0,10)}</div>
                                </div>
                                <div class="input-box">
                                    <span class="detalle">Fecha de Reactivacion</span>
                                    <div class="caja-datos-ficha-socio" name="fichero" id="fecha-Reactivacion-ficha-socio">${datosFichaSocio.fechaReactivacion.slice(0,10)}</div>
                                </div>
                                <div class="input-box">
                                </div>
                                <div class="grupo-botones-ficha-socio">
                                    <button type="submit" class="custom-btn btn-3" id="boton-volver-ficha-socio"><span>Volver</span></button>
                                    <button type="submit" class="custom-btn btn-3 btn-editar-ficha-socio" id="boton-editar-ficha-socio"><span>Editar Socio</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
    
                    const contenedor = document.createElement("DIV");
                    contenedor.setAttribute("class","contenedor");
                    contenedor.innerHTML = HTMLNuevoSocio;
                    seccion.appendChild(contenedor);
    
    
                    // Boton editar Ficha Socio
                    document.querySelector(".btn-editar-ficha-socio").addEventListener("click",()=>{
    
                        usarBotonEditarFichaSocio(datosFichaSocio,activoOInactivo);
                        
                    });
    
                    //Boton volver Ficha Socio
                    document.querySelector("#boton-volver-ficha-socio").addEventListener("click",async ()=>{
    
                        if(activoOInactivo === "Activo"){
    
                            await abrirModuloActivos();
    
                        }
                        else if(activoOInactivo ===  `Cumpleanos`) {

                            generarListaCumpleanos();
                        }
                        else if(activoOInactivo === "Moroso") {

                            await abrirModuloActivosMorosos();
                        }
                         else {
    
                            await abrirModuloInactivos();
                        }
    
    
                    });
    
                    
    
                } catch(e) {
    
                    console.log(e);
                    mensaje = `No esta ejecutado el servicio de NodeJS`;
                    ejecutarCartelModal(mensaje);
                }
            }
    
            function usarBotonEditarFichaSocio(datosFichaSocio,activoOInactivo) {
    
    
                        
                        document.querySelector(".grupo-botones-ficha-socio").outerHTML = `
    
                            <div class="grupo-botones-ficha-socio">
                                <button type="submit" class="custom-btn btn-3" id="boton-volver-ficha-socio"><span>Volver</span></button>
                                <button type="submit" class="custom-btn btn-3 btn-guardar-ficha-socio" id="boton-guardar-ficha-socio"><span>Guardar Socio</span></button>
                                <div class="sector-loader-ver-ficha-socios">
                                </div>
                            </div>
                        `;
    
    
                        const datosActualesFichaSocio = {
                            idSocio: datosFichaSocio.idSocio,
                            nombre: datosFichaSocio.nombre,
                            apellido: datosFichaSocio.apellido,
                            dni: datosFichaSocio.dni,
                            nroSocio: datosFichaSocio.nroSocio,
                            correo: datosFichaSocio.correo,
                            telefono: datosFichaSocio.telefono,
                            domicilio: datosFichaSocio.domicilio,
                            fechaNacimiento: datosFichaSocio.fechaNacimiento
                        }
                    
                        document.querySelector("#nombre-ficha-socio").contentEditable = true;
                        document.querySelector("#apellido-ficha-socio").contentEditable = true;
                        document.querySelector("#dni-ficha-socio").contentEditable = true;
                        document.querySelector("#nroSocio-ficha-socio").contentEditable = true;
                        document.querySelector("#correo-ficha-socio").contentEditable = true;
                        document.querySelector("#telefono-ficha-socio").contentEditable = true;
                        document.querySelector("#domicilio-ficha-socio").contentEditable = true;


                        document.querySelector("#fecha-nacimiento-ficha-socio").innerHTML = `
                            <input type="date" class="input-fecha-nac" id="input-fecha-nacimiento" value="${datosFichaSocio.fechaNacimiento.slice(0,10)}">
                        `;
                    
    
                        document.querySelector("#nombre-ficha-socio").style.color="#bbb";
                        document.querySelector("#apellido-ficha-socio").style.color="#bbb";
                        document.querySelector("#dni-ficha-socio").style.color="#bbb";
                        document.querySelector("#nroSocio-ficha-socio").style.color="#bbb";
                        document.querySelector("#correo-ficha-socio").style.color="#bbb";
                        document.querySelector("#telefono-ficha-socio").style.color="#bbb";
                        document.querySelector("#domicilio-ficha-socio").style.color="#bbb";
                        
    

    
                        //Guarda la ficha socio editada
                        document.querySelector("#boton-guardar-ficha-socio").addEventListener("click",()=>{
                            
                            
                            ejecutarCartelModalEditarFichaSocio(datosActualesFichaSocio,activoOInactivo);    
                        });
    
                        // Boton volver a la lista de socios activos
                        document.querySelector("#boton-volver-ficha-socio").addEventListener("click", async ()=>{
    
                            if(activoOInactivo === "Activo"){
    
                                await abrirModuloActivos();
                
                            }else if(activoOInactivo === "Moroso") {

                                await abrirModuloActivosMorosos();
                            } 
                            else if(activoOInactivo === "Inactivo") {
                
                                await abrirModuloInactivos();
                            }
                        });
                
                    
    
            }
    
            function actualizarListaSociosInactivos(listaSociosInactivos) {
    
                let listadoSociosInactivos = "";
                let socioInactivo = "";

                document.querySelector(".sector-loader-socios-inactivos").innerHTML = ``;
    
                listaSociosInactivos.forEach(ele => {
    
                    socioInactivo = `
                    <tr>
                        <td>${ele.nombres} ${ele.apellidos}</td>
                        <td>${ele.ultimaFechaDePago}</td>
                        <td>Inactivo</td>
                        <td>${ele.situacion}</td>
                        <td>${ele.morosidad}</td>
                        <td class="accion">
                            <i class="fa-solid fa-person-arrow-up-from-line btn-activo-inactivos accion-activar" title="Activar socio" id="socio-inactivo-activar-${ele.idSocio}"></i>
                            <i class="fa-solid fa-trash btn-activo-inactivos accion-eliminar" title="Eliminar" id="socio-inactivo-eliminar-${ele.idSocio}"></i>
                            <i class="fa-solid fa-user btn-activo-inactivos accion-ver-ficha" title="Ficha socio" id="socio-inactivo-ficha-${ele.idSocio}"></i>
                        </td>
                        <td class="td-cargando">
                            <div class="sector-loader-socios-inactivos-opciones" id="sector-cargar-socios-inactivos-${ele.idSocio}">
                            </div>
                        </td>
                    </tr>
                    `;
    
                    listadoSociosInactivos += socioInactivo;
    
                });
    
                let HTMLListaSociosInactivos = `
                <table class="registro-historial">
                    <tr class="columnas">
                        <th>Socio</th>
                        <th>Acceso hasta</th>
                        <th>Estado</th>
                        <th>Situacion</th>
                        <th>Morosidad</th>
                        <th>Accion</th>
                    </tr>
                    ${listadoSociosInactivos}
                </table>
                `;
                
                document.querySelector(".sector-loader-socios-inactivos").innerHTML = ``;
                document.querySelector(".registro-historial-inactivos").innerHTML = HTMLListaSociosInactivos;
    
                //Botones Activar socio
                const botonActivarSocio = document.querySelectorAll("table.registro-historial tr td.accion i.accion-activar");
    
                botonActivarSocio.forEach(ele=>{
    
                    ele.addEventListener("click",()=>{
                        activarSocio(ele.id.slice(23,35));
                    })
                });
    
                // Botones eliminar socio
                const botonEliminarSocioInactivo = document.querySelectorAll("table.registro-historial tr td.accion i.accion-eliminar");
    
                botonEliminarSocioInactivo.forEach(ele=>{
                    
                    ele.addEventListener("click",()=>{
                        
                        eliminarSocioInactivo(ele.id.slice(24,36));
                    });
                    
                });
    
                // Botones ficha Socio
                const botonFichaSocioInactivos = document.querySelectorAll(".accion-ver-ficha");
    
                botonFichaSocioInactivos.forEach(ele=>{
                    ele.addEventListener("click", async()=>{
                        await verFichaSocio(ele.id.slice(21,34),"Inactivo");
                    })
                    
                })
    
            }
    
            // Inactivar Socio
            function activarSocio(idSocio) {
                
                const cartelModal = document.createElement("DIV");
                cartelModal.setAttribute("class","background-modal");
                cartelModal.innerHTML = `
    
                <div class="cartel-modal">
                    <h2>¿Quieres volver activar al socio?</h2>
                    <div class="cartel-modal__botones">
                        <button class="custom-btn btn-3" id="boton-activar-socio-inactivo" value="true"><span>Activar</span></button>
                        <button class="custom-btn btn-3" id="boton-cancelar-socio-inactivo" value="false"><span>Cancelar</span></button>
                    </div>
                </div>
                `;
    
                modal.appendChild(cartelModal);
    
                document.querySelector("#boton-activar-socio-inactivo").addEventListener("click", async ()=>{

                    modal.innerHTML = ``;
                    
                    document.querySelector(`#sector-cargar-socios-inactivos-${idSocio}`).innerHTML = `<div class="loader-socios-inactivos-opciones"></div>`;

                    try{
    
                        let objetoHeaderIdSocioAActivar =
                        {
                            
                            method : "POST",
                            body : JSON.stringify({
                                
                                idSocio: idSocio
                            }),
                            headers : {
                                "Content-type" : "application/json"
                            }
                        }
    
                        const JSONIdSocioAActivar = await fetch('http://localhost:3000/buscarSociosInactivos/activarSocio',objetoHeaderIdSocioAActivar);
    
                        const IdSocioAActivar = await JSONIdSocioAActivar.json();

                        actualizarListaSociosInactivos(IdSocioAActivar[0]);
                        ejecutarCartelModal(IdSocioAActivar[1]);

                    } catch(e) {
    
                        console.log(e);   
                        mensaje = `No esta ejecutado el servicio de NodeJS`;
                        ejecutarCartelModal(mensaje);
                    }
                });
    
                document.querySelector("#boton-cancelar-socio-inactivo").addEventListener("click",()=>{
                    modal.removeChild(cartelModal); 
                });
            }
    
            // Eliminar Socio Inactivo
            async function eliminarSocioInactivo(idSocio) {
    
                
                const cartelModal = document.createElement("DIV");
                cartelModal.setAttribute("class","background-modal");
                cartelModal.innerHTML = `
    
                <div class="cartel-modal">
                    <h2>¿Quieres eliminar al socio?</h2>
                    <div class="cartel-modal__botones">
                        <button class="custom-btn btn-3" id="boton-eliminar-socio-activo" value="true"><span>Eliminar</span></button>
                        <button class="custom-btn btn-3" id="boton-cancelar-socio-activo" value="false"><span>Cancelar</span></button>
                    </div>
                </div>
                `;
    
                modal.appendChild(cartelModal);
    
                document.querySelector("#boton-eliminar-socio-activo").addEventListener("click", async ()=>{
                    
                    modal.innerHTML = ``;
                    document.querySelector(`#sector-cargar-socios-inactivos-${idSocio}`).innerHTML = `<div class="loader-socios-inactivos-opciones"></div>`;
                    try {
    
                        let objetoHeaderIdSocioAEliminar =
                        {
                            
                            method : "POST",
                            body : JSON.stringify({
                                idUsuarioQuienElimino: datosLogin[0].idUsuario,
                                usuarioQuienElimino: datosLogin[0].usuario,
                                idSocio: idSocio
                            }),
                            headers : {
                                "Content-type" : "application/json"
                            }
                        }
                
                        const JSONIdSocioAEliminar = await fetch('http://localhost:3000/buscarSociosInactivos/eliminarSocio',objetoHeaderIdSocioAEliminar);
                
                        const IdSocioAEliminar = await JSONIdSocioAEliminar.json();
                
                        actualizarListaSociosInactivos(IdSocioAEliminar[0]);                
                        ejecutarCartelModal(IdSocioAEliminar[1]);
                
                    } catch(e) {
                        console.log(e);
                        mensaje = `No esta ejecutado el servicio de NodeJS`;
                        ejecutarCartelModal(mensaje);
                    }
                });
    
                document.querySelector("#boton-cancelar-socio-activo").addEventListener("click",()=>{
                    modal.removeChild(cartelModal); 
                });
    
            }

            // Se registra el pago en la base de datos
            async function registrarPago(datos) {

                if(document.querySelector("#boton-registrar-pago").classList.contains("btn-activo-registrar-pago")) {

                    const idSocioPago = parseInt(datos[0].idSocio); 
                    const importePago = document.querySelector(".importe-pago").value;
                    let modoDePago;
                    document.querySelectorAll("#modo-de-pago").forEach(ele=>{
                        if(ele.checked){
                            modoDePago = ele.value;
                        }
                    })
                    const mesDePago = document.querySelector(".select-mes-pago").value;
                    const observacionPago = document.querySelector(".observacion-pago").value;

                    

                    if(validarSoloNumeros(importePago)) {

                        ejecutarCartelModal(`Debes ingresar un valor en el importe`);
                    }
                    else if(mesDePago == "0") {

                        ejecutarCartelModal(`Debes seleccionar un mes correcto`);
                    }
                    else if(observacionPago.length>38){
                        ejecutarCartelModal(`Limite de caracteres alcanzado en la observacion`);
                    }
                    else if(mesDePago !== "01" && mesDePago !== "02" && mesDePago !== "03" && mesDePago !== "04" && mesDePago !== "05" && mesDePago !== "06" && mesDePago !== "07" && mesDePago !== "08" && mesDePago !== "09" && mesDePago !== "10" && mesDePago !== "11" && mesDePago !== "12" && mesDePago !== "13"){

                        ejecutarCartelModal(`El mes abonado no es el correcto`);
                    }
                    else if(fechaHoy.getMonth()+1 !== 12 && mesDePago == "13") {

                        ejecutarCartelModal(`El mes abonado no es el correcto`);
                    }
                    else if(modoDePago !== "Efectivo" && modoDePago !== "Debito" && modoDePago !== "Transferencia") {

                        ejecutarCartelModal(`Elige una opcion correcta en el modo de pago`);
                    }
                    
                    else {
                        

                        const objetoPago = {

                            importePago,
                            mesDePago,
                            observacionPago,
                            modoDePago,
                            idSocioPago,
                            eliminado : false

                        }


                        let objetoHeaderCargarNuevoPago =
                        {
                            
                            method : "POST",
                            body : JSON.stringify({
                                objetoPago : objetoPago
                            }),
                            headers : {
                                "Content-type" : "application/json"
                            }
                        } 
                        try {

                            if(document.querySelector(".sector-loader-registrar-pago")){

                                document.querySelector(".sector-loader-registrar-pago").innerHTML=`<div class="loader-registrar-pago"></div>`;
                            }
                            else if(document.querySelector(".sector-loader-registrar-pago-activos")) {
                                document.querySelector(".sector-loader-registrar-pago-activos").innerHTML = `
                                    <div class="loader-registrar-pago-activos"></div>
                                `;
                            }


                            const solicitudEnvioPago = await fetch(`http://localhost:3000/nuevoPago/registrarPago`,objetoHeaderCargarNuevoPago);

                            const respuestaEnvioPago = await solicitudEnvioPago.json();

                            if(document.querySelector(".sector-loader-registrar-pago")){

                                document.querySelector(".sector-loader-registrar-pago").innerHTML=``;
                            }
                            else if(document.querySelector(".sector-loader-registrar-pago-activos")) {
                                document.querySelector(".sector-loader-registrar-pago-activos").innerHTML =``;
                            }


                            if(respuestaEnvioPago === `Debes ingresar un valor en el importe`) {

                                ejecutarCartelModal(respuestaEnvioPago);
                            }
                            else if(respuestaEnvioPago === `Debes seleccionar un mes correcto`) {

                                ejecutarCartelModal(respuestaEnvioPago);
                            }
                            else if(respuestaEnvioPago === `El mes abonado no es el correcto`) {
                                ejecutarCartelModal(respuestaEnvioPago);
                            }
                            else if(respuestaEnvioPago[1] === null) {

                                ejecutarCartelModal(respuestaEnvioPago[0]);

                            }
                            else if(respuestaEnvioPago === `Elige una opcion correcta en el modo de pago`) {

                                ejecutarCartelModal(respuestaEnvioPago);
                            }
                            else {

                                //Este contiene todos los registros de pago en el array[1] 
                                actualizarListaRegistrosDePago(respuestaEnvioPago[1],datos[0].idSocio);
    
                                
                                // // Guarda el registro del pago
                                ejecutarCartelModal(respuestaEnvioPago[0]);
    
    
                                document.querySelector(".importe-pago").value = "";
                                document.querySelector(".select-mes-pago").value = "";
                                document.querySelector(".observacion-pago").value = "";

                            }

                        } catch(e){
                            console.log(e)
                            mensaje = `No esta ejecutado el servicio de NodeJS`;
                            ejecutarCartelModal(mensaje);

                        }
                    }
                }
            } 

            function editarPassUsuario(id) {

                const validarEditarPassUsuario = sessionStorage.getItem("estasEditandoPassUsuario");

                if(validarEditarPassUsuario=="true"){
    
                    ejecutarCartelModal("Debes editar un registro a la vez");
    
                } else{

                    sessionStorage.setItem("estasEditandoPassUsuario","true");

                    if(document.querySelector(`#editar-usuario-${id}`).classList.contains("btn-activo-usuarios")) {

                        document.querySelector(`#editar-usuario-${id}`).classList.replace("btn-activo-usuarios","btn-inactivo-usuarios");
                        document.querySelector(`#guardar-usuario-${id}`).classList.replace("btn-inactivo-usuarios","btn-activo-usuarios");
                        document.querySelector(`#verpass-usuario-${id}`).classList.replace("btn-inactivo-usuarios","btn-activo-usuarios");

                        document.querySelector(`#pass-actual-${id}`).setAttribute("placeholder","");
                        document.querySelector(`#pass-nueva-${id}`).setAttribute("placeholder","");
                        document.querySelector(`#pass-repetida-${id}`).setAttribute("placeholder","");
                        
                        document.querySelector(`#pass-actual-${id}`).removeAttribute("disabled");
                        document.querySelector(`#pass-nueva-${id}`).removeAttribute("disabled");
                        document.querySelector(`#pass-repetida-${id}`).removeAttribute("disabled");

                        document.querySelector(`#pass-actual-${id}`).style.color="#bbb";
                        document.querySelector(`#pass-nueva-${id}`).style.color="#bbb";
                        document.querySelector(`#pass-repetida-${id}`).style.color="#bbb";


                    }
                }
            }

            function guardarPassUsuario(id) {
                    
                if(document.querySelector(`#guardar-usuario-${id}`).classList.contains("btn-activo-usuarios")){

                    ejecutarCartelModalConfirmarEditarPass(`¿Desea guardar los cambios?`,id);
                    
                }
            }

            function verPassUsuario(id) {

                if(document.querySelector(`#verpass-usuario-${id}`).classList.contains("btn-activo-usuarios")) {

                    const verPassUsuario = document.querySelector(`#verpass-usuario-${id}`);
                    verPassUsuario.addEventListener("mousedown",mostrarPassUsuario);
                    verPassUsuario.addEventListener("mouseup",ocultarPassUsuario);
                    verPassUsuario.addEventListener("mouseout",ocultarPassUsuario);
                
                    function mostrarPassUsuario(){
                        document.querySelector(`#pass-actual-${id}`).setAttribute("type","text");
                        document.querySelector(`#pass-nueva-${id}`).setAttribute("type","text");
                        document.querySelector(`#pass-repetida-${id}`).setAttribute("type","text");
                    }
                    function ocultarPassUsuario() {
                        document.querySelector(`#pass-actual-${id}`).setAttribute("type","password");
                        document.querySelector(`#pass-nueva-${id}`).setAttribute("type","password");
                        document.querySelector(`#pass-repetida-${id}`).setAttribute("type","password");
                    }
                }
            }


            async function verFichaPagos(idSocio,activoOMoroso) {

                // Activar boton cargando
                document.querySelector(`#sector-cargar-socios-activos-${idSocio}`).innerHTML =`<div class="loader-socios-activos-opciones"></div>`;

                sessionStorage.setItem("estasEditandoPago","false");
                limpiezaSessionStorage();

                let objetoHeaderVerFichaPago =

                {
                    
                    method : "POST",
                    body : JSON.stringify({
                        idSocio: idSocio
                    }),
                    headers : {
                        "Content-type" : "application/json"
                    }
                }
                
                try {

                    const JSONDatosFichaPagos = await fetch(`http://localhost:3000/buscarSociosActivos/verFichaPagosActivos`,objetoHeaderVerFichaPago);
                    const datosFichaPagos = await JSONDatosFichaPagos.json();

                    const fechaHoy = new Date();
                    let HTMLMesDePago;
                    if(fechaHoy.getMonth()+1 === 12 ) {

                        const eneroNuevo = `Enero ${fechaHoy.getFullYear()+1}`;
                        HTMLMesDePago = `
                        <select class="select-mes-pago">
                            <option disabled selected value="0">Selecione</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                            <option value="13">${eneroNuevo}</option>
                        </select>
                        `;
                    } else {

                        HTMLMesDePago = `
                        <select class="select-mes-pago">
                            <option disabled selected value="0">Selecione</option>
                            <option value="01">Enero</option>
                            <option value="02">Febrero</option>
                            <option value="03">Marzo</option>
                            <option value="04">Abril</option>
                            <option value="05">Mayo</option>
                            <option value="06">Junio</option>
                            <option value="07">Julio</option>
                            <option value="08">Agosto</option>
                            <option value="09">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                    `;
                    }

                    const HTMLPagos = `
                    <div class="contenedor-pagos">
                        <div class="ingresar-nuevo-pago">
                            <table class="tabladatospersonales">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Apellido</th>
                                    <th>Dni</th>
                                    <th>Nr. Socio</th>
                                </tr>
                                <tr class="pagos-datos-socio">
                                    <td>${datosFichaPagos[0].nombres}</td>
                                    <td>${datosFichaPagos[0].apellidos}</td>
                                    <td>${datosFichaPagos[0].dni}</td>
                                    <td>${datosFichaPagos[0].nroSocio}</td>
                                </tr>
                            </table>   
                            <div class="ingresarpago">
                                <form action="#" method="#" autocomplete="off">
                                    <div class="carga-pago">
                                    <div class="input-box">
                                        <label>Fecha</label>
                                        <div class="fecha-de-pago">${datosFichaPagos[0].fechaRegistracionPago.slice(0,10)}</div>
                                    </div>
                                    <div class="input-box">
                                        <label>Importe</label>
                                        <input type="number" name="Importe" class="importe-pago">
                                    </div>
                                    <div class="input-box">
                                        <label>Mes Abonado</label>
                                        ${HTMLMesDePago}
                                    </div>
                                    <div class="input-box">
                                        <label>Concepto / Observacion</label>
                                        <input type="text" name="Observacion" class="observacion-pago">
                                    </div>
                                    <div class="input-box">
                                        <label>Modo de pago</label>
                                        <div class="grupo-radio-pago">
                                            <div class="grupo-radio-h4">
                                                <input type="radio" name="Forma pago" value="Efectivo" class="input-radio" id="modo-de-pago">
                                                <h4>Efectivo</h4>
                                            </div>
                                            <div class="grupo-radio-h4">
                                                <input type="radio" name="Forma pago" value="Debito" class="input-radio" id="modo-de-pago">
                                                <h4>Debito</h4>
                                            </div>
                                            <div class="grupo-radio-h4">
                                                <input type="radio" name="Forma pago" value="Transferencia" class="input-radio" id="modo-de-pago">
                                                <h4>Transferencia</h4>
                                            </div>
                                        </div>
                                    </div>
                                </form>  
                            </div>
                            <table class="historial-pagos">
                                <tr class="columnas">
                                    <th>Fecha</th>
                                    <th>Cuota/Mes/Año</th>
                                    <th>Importe</th>
                                    <th>Modo de Pago</th>
                                    <th>Concepto</th>
                                    <th>Accion</th>
                                </tr>
                                <tr>
                                    <td>--------</td>
                                    <td>--------</td>
                                    <td>--------</td>
                                    <td>--------</td>
                                    <td>---------------</td>
                                    <td class="accion">  
                                    </td>
                                </tr>
                            </table>
                            <div class="grupo-botones-ficha-pagos-socio">
                                <button type="submit" class="custom-btn btn-3" id="boton-volver-ficha-pagos"><span>Volver</span></button>
                                <button type="submit" class="custom-btn btn-3 btn-activo-registrar-pago" id="boton-registrar-pago"><span>Registrar Pago</span></button>
                                <div class="sector-loader-registrar-pago-activos">
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

                    seccion.innerHTML = ``;
    
                    
                    const contenedor = document.createElement("DIV");
                    contenedor.setAttribute("class","contenedor");
                    contenedor.innerHTML = HTMLPagos;
                    seccion.appendChild(contenedor);

                    actualizarListaRegistrosDePago(datosFichaPagos[1],idSocio);

                    //Boton registra Pago
                    document.getElementById("boton-registrar-pago").addEventListener("click", async()=>{
                        await registrarPago(datosFichaPagos);
                    });

                    // Boton volver

                    document.querySelector("#boton-volver-ficha-pagos").addEventListener("click",async ()=>{
                        if(activoOMoroso === "Moroso") {
                            await abrirModuloActivosMorosos();
                        }
                        else if(activoOMoroso === "Activo") {
                            await abrirModuloActivos();
                        }
                        
                    });

                } catch(e) {
                    console.log(e);
                    mensaje = `No esta ejecutado el servicio de NodeJS`;
                    ejecutarCartelModal(mensaje);
                }
            }

            function abrirModuloCaja() {

                limpiezaSessionStorage();
                seccion.innerHTML = ``;
                const contenedor = document.createElement(`DIV`);
                contenedor.setAttribute("class","contenedor-caja");
                contenedor.innerHTML = `

                <div class="contenedor-general-caja">
                    <div class="contenedor-caja-ingreso">
                        <div class="titulo-caja-principal">Caja ingresos</div>
                        <i class="fa-solid fa-sack-dollar i-saco-dolar"></i>
                        <button class="custom-btn btn-3 btn-caja-ingresar" id="btn-caja-ingresos" value="true"><span>Ingresar</span></button>
                    </div>
                    <div class="contenedor-caja-egreso">
                        <div class="titulo-caja-principal">Caja egresos</div>
                        <i class="fa-solid fa-sack-dollar i-saco-dolar"></i>
                        <button class="custom-btn btn-3 btn-caja-ingresar" id="btn-caja-egresos" value="true"><span>Ingresar</span></button>
                    </div>
                </div>
                `;
                seccion.appendChild(contenedor);

                //Ingresar caja ingresos
                document.querySelector("#btn-caja-ingresos").addEventListener("click",abrirCajaIngresos);

                //Ingresar caja egresos
                document.querySelector("#btn-caja-egresos").addEventListener("click",abrirCajaEgresos);
            }

            function abrirCajaIngresos() {

                seccion.innerHTML = ``;

                const fechaHoy = new Date();
                const fechaMostrar = `${fechaHoy.getDate()}/${fechaHoy.getMonth()+1}/${fechaHoy.getFullYear()}`;

                const contenedor = document.createElement("DIV");
                contenedor.setAttribute("class","contenedor");
                contenedor.innerHTML = `
                
                <div class="modulo-caja-ingresos">
                    <div class="titulo-caja-principal">Caja Ingresos</div>
                    <div class="grupo-nuevo-caja">
                        <form action="#" class="form-nuevo-importe-caja">
                            <div class="titulo-caja">Agregar ingreso en caja:</div>
                            <div class="input-box-caja">
                                <span class="detalle">Fecha: </span>
                                <div class="fecha-hoy-caja">${fechaMostrar}</div>
                            </div>
                            <div class="input-box-caja">
                                <span class="detalle">Concepto: </span>
                                <input type="text" placeholder="Ingrese el concepto" class="detalle-input-caja" id="input-concepto-caja">
                            </div>
                            <div class="grupo-importe">
                                <div class="input-box-caja">
                                    <span class="detalle">Importe: </span>
                                    <input type="number" placeholder="Ingrese el importe" class="importe-input-caja" id="input-importe-caja">
                                </div>
                                <div class="grupo-radio-pago-caja">
                                    <div class="grupo-radio-h4-caja">
                                        <input type="radio" name="Forma pago" value="Efectivo" class="input-radio" id="modo-de-pago">
                                        <h4>Efectivo</h4>
                                    </div>
                                    <div class="grupo-radio-h4-caja">
                                        <input type="radio" name="Forma pago" value="Debito" class="input-radio" id="modo-de-pago">
                                        <h4>Debito</h4>
                                    </div>
                                    <div class="grupo-radio-h4-caja">
                                        <input type="radio" name="Forma pago" value="Transferencia" class="input-radio" id="modo-de-pago">
                                        <h4>Transferencia</h4>
                                    </div>
                                </div> 
                            </div>
                            <div class="grupo-btn-loader">
                                <button class="custom-btn-caja btn-3-caja" id="btn-caja-ingresos" value="true"><span>Agregar</span></button>
                                <div class="sector-loader-agregar-pago-caja"></div>
                            </div>
                        </form>
                    </div>
                    <div>
                        <div class="titulo-caja">Reporte diario ingreso caja:</div>
                        <div class="input-box-caja">
                            <div class="box-busqueda-caja">
                                <span class="detalle">Fecha: </span>
                                <input type="date" class="input-caja" id="buscar-fecha-caja">
                                <button class="custom-btn-caja btn-3-caja" id="btn-buscar-dia" value="true"><span>Buscar</span></button>
                                <div class="sector-loader-buscar-fecha-caja"></div>
                                <div class="sector-btn-descargar">
                                </div>
                            </div>
                            <div class="sector-total-caja">
                            </div>

                        </div>
                        <table class="historial-caja" id="descargar-caja-ingreso">
                            <tr class="columnas">
                                <th>Fecha</th>
                                <th>Nro Socio</th>
                                <th class="concepto-caja">Socio / Concepto</th>
                                <th>Importe</th>
                                <th>Modo de Pago</th>
                                <th>Accion</th>
                            </tr>
                            <tr>
                                <td class="td-pagos">--------</td>
                                <td class="td-pagos">--------</td>
                                <td class="td-pagos concepto-caja">---------------</td>
                                <td class="td-pagos">--------</td>
                                <td class="td-pagos">--------</td>
                                <td class="accion">
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                `;

                seccion.appendChild(contenedor);

                document.querySelector("#btn-caja-ingresos").addEventListener("click", (e)=>{
                    e.preventDefault();
                    cargarPagoCaja("Ingreso");
                });

                document.querySelector("#btn-buscar-dia").addEventListener("click",()=>{
                    buscarDiaReporteCaja("Ingreso");
                });
            }

            function abrirCajaEgresos() {

                seccion.innerHTML = ``;

                const fechaHoy = new Date();
                const fechaMostrar = `${fechaHoy.getDate()}/${fechaHoy.getMonth()+1}/${fechaHoy.getFullYear()}`;

                const contenedor = document.createElement("DIV");
                contenedor.setAttribute("class","contenedor");
                contenedor.innerHTML = `

                <div class="modulo-caja-egresos">
                    <div class="titulo-caja-principal">Caja Egresos</div>
                    <div class="grupo-nuevo-caja">
                        <form action="#" class="form-nuevo-importe-caja">
                            <div class="titulo-caja">Agregar egreso en caja:</div>
                            <div class="input-box-caja">
                                <span class="detalle">Fecha: </span>
                                <div class="fecha-hoy-caja">${fechaMostrar}</div>
                            </div>
                            <div class="input-box-caja">
                                <span class="detalle">Concepto: </span>
                                <input type="text" placeholder="Ingrese el concepto" class="detalle-input-caja" id="input-concepto-caja">
                            </div>
                            <div class="grupo-importe">
                                <div class="input-box-caja">
                                    <span class="detalle">Importe: </span>
                                    <input type="number" placeholder="Ingrese el importe" class="importe-input-caja" id="input-importe-caja">
                                </div>
                                <div class="grupo-radio-pago-caja">
                                    <div class="grupo-radio-h4-caja">
                                        <input type="radio" name="Forma pago" value="Efectivo" class="input-radio" id="modo-de-pago">
                                        <h4>Efectivo</h4>
                                    </div>
                                    <div class="grupo-radio-h4-caja">
                                        <input type="radio" name="Forma pago" value="Debito" class="input-radio" id="modo-de-pago">
                                        <h4>Debito</h4>
                                    </div>
                                    <div class="grupo-radio-h4-caja">
                                        <input type="radio" name="Forma pago" value="Transferencia" class="input-radio" id="modo-de-pago">
                                        <h4>Transferencia</h4>
                                    </div>
                                </div> 
                            </div>
                            <div class="grupo-btn-loader">
                                <button class="custom-btn-caja btn-3-caja" id="btn-caja-egresos" value="true"><span>Agregar</span></button>
                                <div class="sector-loader-agregar-pago-caja"></div>
                            </div>
                        </form>
                    </div>
                    <div>
                        <div class="titulo-caja">Reporte diario egreso caja:</div>
                        <div class="input-box-caja">
                            <div class="box-busqueda-caja">
                                <span class="detalle">Fecha: </span>
                                <input type="date" class="input-caja" id="buscar-fecha-caja">
                                <button class="custom-btn-caja btn-3-caja" id="btn-buscar-dia" value="true"><span>Buscar</span></button>
                                <div class="sector-loader-buscar-fecha-caja"></div>
                                <div class="sector-btn-descargar"></div>
                            </div>
                            <div class="sector-total-caja">
                            </div>

                        </div>
                        <table class="historial-caja">
                            <tr class="columnas">
                                <th class="td-pagos">Fecha</th>
                                <th class="td-pagos concepto-caja">Concepto</th>
                                <th class="td-pagos">Importe</th>
                                <th class="td-pagos">Modo de Pago</th>
                                <th class="td-pagos">Accion</th>
                            </tr>
                            <tr>
                                <td class="td-pagos">--------</td>
                                <td class="td-pagos concepto-caja">--------</td>
                                <td class="td-pagos">--------</td>
                                <td class="td-pagos">---------------</td>
                                <td class="accion">
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                `;

                seccion.appendChild(contenedor);

                document.querySelector("#btn-caja-egresos").addEventListener("click", (e)=>{
                    e.preventDefault();
                    cargarPagoCaja("Egreso");
                });

                document.querySelector("#btn-buscar-dia").addEventListener("click",()=>{
                    buscarDiaReporteCaja("Egreso");
                });
            }

            async function cargarPagoCaja(tipoDePago){

                const concepto = document.querySelector("#input-concepto-caja").value;
                const importe = document.querySelector("#input-importe-caja").value;
                let modoDePago;
                document.querySelectorAll("#modo-de-pago").forEach(ele=>{
                    if(ele.checked){
                        modoDePago = ele.value;
                    }
                });


                //Validaciones

                if(concepto === "") {

                    ejecutarCartelModal("Debes ingresar un dato en concepto");

                }
                else if(concepto.length > 38) {

                    ejecutarCartelModal("Limite de caracteres alcanzado en el concepto");
                }
                else if(validarSoloNumeros(importe) || importe === "") {

                    ejecutarCartelModal(`Debes ingresar un valor en el importe`);

                }
                else if(modoDePago !== "Efectivo" && modoDePago !== "Debito" && modoDePago !== "Transferencia") {

                    ejecutarCartelModal(`Elige una opcion correcta en el modo de pago`);
                }
                else if(tipoDePago !== "Ingreso" && tipoDePago !== "Egreso") {

                    ejecutarCartelModal(`No se valida si es un ingreso o egreso de caja`);
                }
                else {

                    try {

                        document.querySelector(".sector-loader-agregar-pago-caja").innerHTML = `<div class="loader-agregar-pago-caja"></div>`;

                        let objetoHeaderNuevoPagoCaja = {
                
                            method : "POST",
                            body : JSON.stringify({
                                concepto: concepto,
                                importe: importe,
                                modoDePago: modoDePago,
                                tipoDePago: tipoDePago
                            }),
                            headers : {
                                "Content-type" : "application/json"
                            }
                        }


                        const JSONResNuevoPagoCaja = await fetch(`http://localhost:3000/caja/nuevoPago`,objetoHeaderNuevoPagoCaja);
                        const resNuevoPagoCaja = await JSONResNuevoPagoCaja.json();

                        document.querySelector(".sector-loader-agregar-pago-caja").innerHTML = ``;

                        if(resNuevoPagoCaja === "Debes ingresar un dato en concepto") {

                            ejecutarCartelModal(resNuevoPagoCaja);
                        }
                        else if(resNuevoPagoCaja === "Limite de caracteres alcanzado en el concepto") {

                            ejecutarCartelModal(resNuevoPagoCaja);
                        }
                        else if(resNuevoPagoCaja === `Debes ingresar un valor en el importe`) {

                            ejecutarCartelModal(resNuevoPagoCaja);
                        }
                        else if (resNuevoPagoCaja === `Elige una opcion correcta en el modo de pago`) {

                            ejecutarCartelModal(resNuevoPagoCaja);
                        }
                        else {

                            ejecutarCartelModal(resNuevoPagoCaja);

                            document.querySelector(`.form-nuevo-importe-caja`).reset();

                        }

                    } catch(e) {
                        console.log(e);
                        ejecutarCartelModal(`No esta ejecutado el servicio de NodeJS`);

                    }

                }


            }

            async function buscarDiaReporteCaja(tipoDePago) {

                document.querySelector(".sector-btn-descargar").innerHTML = ``;
                const fechaInput = document.querySelector("#buscar-fecha-caja").value;
                

                if(fechaInput == ``) {
                    
                    ejecutarCartelModal(`Debes seleccionar una fecha correcta`);
                }
                else {

                    try {

                        document.querySelector(".sector-loader-buscar-fecha-caja").innerHTML = `<div class="loader-buscar-fecha-caja"></div>`;
                        let objetoHeaderBuscarFechaCaja = {
                
                            method : "POST",
                            body : JSON.stringify({
                                fecha: fechaInput,
                                tipoDePago: tipoDePago
                            }),
                            headers : {
                                "Content-type" : "application/json"
                            }
                        }

                        const JSONResBuscarFechaCaja = await fetch(`http://localhost:3000/caja/buscarFecha`,objetoHeaderBuscarFechaCaja);
                        const resBuscarFechaCaja = await JSONResBuscarFechaCaja.json();

                        listarRegistrosPagosCaja(resBuscarFechaCaja,fechaInput);

                    }
                    catch(e) {
                        console.log(e);
                        ejecutarCartelModal(`No esta ejecutado el servicio de NodeJS`);
                    }
                }
            }

            function listarRegistrosPagosCaja(lista,fechaInput) {

                modal.innerHTML = ``;

                if(lista === `No existen registros del dia seleccionado`) {
                            
                    document.querySelector(".sector-loader-buscar-fecha-caja").innerHTML = ``;
                    ejecutarCartelModal(lista);

                    let HTMLHistorialCaja = `
                    <tr class="columnas">
                        <th>Fecha</th>
                        <th>Nro Socio</th>
                        <th class="td-pagos">Concepto</th>
                        <th>Importe</th>
                        <th>Modo de Pago</th>
                        <th>Accion</th>
                    </tr>
                    <tr class="columnas">
                        <td class="td-pagos">--------</td>
                        <td class="td-pagos">--------</td>
                        <td class="td pagos concepto-caja">---------------</td>
                        <td class="td-pagos">--------</td>
                        <td class="td-pagos">--------</td>
                        <td class="accion"></td>
                    </tr>
                    `;

                    document.querySelector(".historial-caja").innerHTML = ``;
                    document.querySelector(".historial-caja").innerHTML = HTMLHistorialCaja;
                    document.querySelector(".sector-btn-descargar").innerHTML = ``;

                }
                else {

                    sessionStorage.setItem("estasEditandoPago","false");

                    if(lista[2] === `Ingreso`) {

                        let HTMLHistorialCaja = `
                            <tr class="columnas">
                                <th>Fecha</th>
                                <th>Nro Socio</th>
                                <th class="concepto-caja">Concepto</th>
                                <th>Importe</th>
                                <th>Modo de Pago</th>
                                <th>Accion</th>
                            </tr>
                        `;

                        lista[0].forEach(ele=>{

                            if(ele.idPago !== undefined) {

                                HTMLHistorialCaja += `
                                <tr>
                                    <td class="td-pagos">${ele.fecha}</td>
                                    <td class="td-pagos">${ele.nroSocio}</td>
                                    <td class="concepto-caja" id="observacion-${ele.idPago}">${ele.socioOConcepto}</td>
                                    <td class="td-pagos" id="importe-${ele.idPago}">$${ele.importe}</td>
                                    <td class="td-pagos" id="modo-pago-${ele.idPago}">${ele.modoDePago}</td>
                                    <td class="accion">
                                        <i class="fa-solid fa-pencil btn-activo accion-editar" title="Editar" id="editar-${ele.idPago}"></i>  
                                        <i class="fa-solid fa-floppy-disk btn-inactivo accion-guardar" id="guardar-${ele.idPago}" title="Guardar"></i>
                                        <i class="fa-solid fa-trash btn-activo accion-eliminar" id="eliminar-${ele.idPago}" title="Eliminar"></i>
                                    </td>
                                    <td class="td-cargando">
                                        <div class="sector-loader-pagos-opciones" id="sector-cargar-pagos-${ele.idPago}"
                                    </td>
                                </tr>
                                `;
                            } else {

                                HTMLHistorialCaja += `
                                    <tr>
                                        <td class="td-pagos">${ele.fecha}</td>
                                        <td class="td-pagos">${ele.nroSocio}</td>
                                        <td class="td-pagos concepto-caja">${ele.socioOConcepto}</td>
                                        <td class="td-pagos">$${ele.importe}</td>
                                        <td class="td-pagos">${ele.modoDePago}</td>
                                        <td class="accion">
                                        </td>
                                    </tr>
                                `;

                            }
                        });


                        document.querySelector(".sector-loader-buscar-fecha-caja").innerHTML = ``;
                        document.querySelector(".historial-caja").innerHTML = ``;
                        document.querySelector(".historial-caja").innerHTML = HTMLHistorialCaja;
                        document.querySelector(".sector-total-caja").innerHTML = `
                            <div class="total-caja-ingreso">Total: <span>$${lista[1]}</span></div>
                        `;
                        document.querySelector(".sector-btn-descargar").innerHTML = `<button class="custom-btn-descargar-caja btn-3-caja" id="btn-descargar-dia" value="true"><span>Descargar</span></button>`;

                        //Editar un registro de Pago 
                        const editarRegistrosPagos = document.querySelectorAll("table.historial-caja tr td.accion i.accion-editar");


                        editarRegistrosPagos.forEach(element => {
            
                            element.addEventListener("click",()=>{
                                
                                
                                editarRegPago(element.id.slice(7,15));
                                    
                            });
                        });

                        // Guardar el registro Modificado de Pago
                        const guardarRegistrosPagos = document.querySelectorAll("table.historial-caja tr td.accion i.accion-guardar");


                        guardarRegistrosPagos.forEach(element => {
            
                            element.addEventListener("click",()=>{
                                
                                guardarRegPago(element.id.slice(8,15),"Caja",fechaInput,"Ingreso");
            
                            });
                        });             

                        // Eliminar un registro de Pago
                        const eliminarRegistrosPagos = document.querySelectorAll("table.historial-caja tr td.accion i.accion-eliminar");
            
                        eliminarRegistrosPagos.forEach(element => {
                            
                            element.addEventListener("click",()=>{

                                    eliminarRegPago(element.id.slice(9,15),"","Caja",fechaInput,"Ingreso");

                            });
                        });



                        let arrayParaReporte = [];
                        let arrayRegistro = [];
                        lista[0].forEach(el=>{
                            arrayRegistro = [el.nroSocio,el.socioOConcepto,el.modoDePago,"","",el.importe];
                            arrayParaReporte.push(arrayRegistro);
                        });


                        // Reporte
                        let props = generarReportePersonalizado(arrayParaReporte,fechaInput,lista[1],lista[2]);



                        // Descargar a PDF
                        document.querySelector("#btn-descargar-dia").addEventListener("click",()=>{
                            
                            var pdfObject = jsPDFInvoiceTemplate.default(props);

                        });


                        

                    }
                    else if(lista[2] === `Egreso`) {

                        let HTMLHistorialCaja = `

                            <tr class="columnas">
                                <th class="td-pagos">Fecha</th>
                                <th class="td-pagos concepto-caja">Concepto</th>
                                <th class="td-pagos">Importe</th>
                                <th class="td-pagos">Modo de Pago</th>
                                <th class="td-pagos">Accion</th>
                            </tr>
                        `;

                        lista[0].forEach(ele=>{
                            HTMLHistorialCaja += `
                                <tr>
                                    <td class="td-pagos">${ele.fecha}</td>
                                    <td class="td-pagos concepto-caja" id="observacion-${ele.idPago}">${ele.socioOConcepto}</td>
                                    <td class="td-pagos" id="importe-${ele.idPago}">$${ele.importe}</td>
                                    <td class="td-pagos" id="modo-pago-${ele.idPago}">${ele.modoDePago}</td>
                                    <td class="accion">
                                        <i class="fa-solid fa-pencil btn-activo accion-editar" title="Editar" id="editar-${ele.idPago}"></i>  
                                        <i class="fa-solid fa-floppy-disk btn-inactivo accion-guardar" id="guardar-${ele.idPago}" title="Guardar"></i>
                                        <i class="fa-solid fa-trash btn-activo accion-eliminar" id="eliminar-${ele.idPago}" title="Eliminar"></i>
                                    </td>
                                    <td class="td-cargando">
                                        <div class="sector-loader-pagos-opciones" id="sector-cargar-pagos-${ele.idPago}"
                                    </td>
                                </tr>
                            `;
                        });

                        document.querySelector(".sector-loader-buscar-fecha-caja").innerHTML = ``;
                        document.querySelector(".historial-caja").innerHTML = ``;
                        document.querySelector(".historial-caja").innerHTML = HTMLHistorialCaja;
                        document.querySelector(".sector-total-caja").innerHTML = `
                            <div class="total-caja-egreso">Total: <span>$${lista[1]}</span></div>
                        `;
                        document.querySelector(".sector-btn-descargar").innerHTML = `<button class="custom-btn-descargar-caja btn-3-caja" id="btn-descargar-dia" value="true"><span>Descargar</span></button>`;
                        
                        //Editar un registro de Pago 
                        const editarRegistrosPagos = document.querySelectorAll("table.historial-caja tr td.accion i.accion-editar");


                        editarRegistrosPagos.forEach(element => {
            
                            element.addEventListener("click",()=>{
                                
                                
                                editarRegPago(element.id.slice(7,15));
                                    
                            });
                        });

                        // Guardar el registro Modificado de Pago
                        const guardarRegistrosPagos = document.querySelectorAll("table.historial-caja tr td.accion i.accion-guardar");


                        guardarRegistrosPagos.forEach(element => {
            
                            element.addEventListener("click",()=>{
                                
                                guardarRegPago(element.id.slice(8,15),"Caja",fechaInput,"Egreso");
            
                            });
                        });

                        // Eliminar un registro de Pago
                        const eliminarRegistrosPagos = document.querySelectorAll("table.historial-caja tr td.accion i.accion-eliminar");

                        eliminarRegistrosPagos.forEach(element => {
                            
                            element.addEventListener("click",()=>{

                                    eliminarRegPago(element.id.slice(9,15),"","Caja",fechaInput,"Egreso");

                            });
                        });

                        let arrayParaReporte = [];
                        let arrayRegistro = [];
                        lista[0].forEach(el=>{
                            arrayRegistro = [el.nroSocio,el.socioOConcepto,el.modoDePago,"","",el.importe];
                            arrayParaReporte.push(arrayRegistro);
                        });


                        // Reporte
                        let props = generarReportePersonalizado(arrayParaReporte,fechaInput,lista[1],lista[2]);


                        document.querySelector("#btn-descargar-dia").addEventListener("click",()=>{

                            var pdfObject = jsPDFInvoiceTemplate.default(props);
                        });

                    }
                }
            }

        }
    });
    
    // Boton ver pass
    const verPass = document.querySelector(".ver-pass");
    verPass.addEventListener("mousedown",mostrarPass);
    verPass.addEventListener("mouseup",ocultarPass);
    verPass.addEventListener("mouseout",ocultarPass);

    function mostrarPass(){
        document.querySelector("#password-login").setAttribute("type","text");
    }
    function ocultarPass() {
        document.querySelector("#password-login").setAttribute("type","password");
    }
}




