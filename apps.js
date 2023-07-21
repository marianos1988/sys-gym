//PAquetes instalados: express - cors - mysql
const express = require("express");
const cors = require("cors"); 
const app = express();


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

// Routers
const routerLogin = require("./routers/routerLogin.js");
app.use("/Login",routerLogin);

const routerNuevoSocio = require("./routers/routerNuevoSocio.js");
app.use("/nuevoSocio",routerNuevoSocio);

const routerNuevoPago = require("./routers/routerNuevoPago.js");
app.use("/nuevoPago",routerNuevoPago);

const routerEditarPago = require("./routers/routerEditarPago.js");
app.use("/editarPago",routerEditarPago);

const routerSociosActivos = require("./routers/routerSociosActivos.js");
app.use("/buscarSociosActivos",routerSociosActivos);

const routerSociosInactivos = require("./routers/routerSociosInactivos.js");
app.use("/buscarSociosInactivos",routerSociosInactivos);

const routerListaUsuarios = require("./routers/routerListaUsuarios.js");
app.use("/ListaUsuarios",routerListaUsuarios);

const routerCaja = require("./routers/routerCaja.js");
app.use("/caja",routerCaja);


 
const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO,()=>{
    console.log(`El servidor esta escuchando en el puerto ${PUERTO}...`);
});