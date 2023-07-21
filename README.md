# sys-gym
Sistema de administracion de Socios en un Gimnasio

Es mi primer sistema que hice, se peuden hacer mejoras en el codigo, ya que fue aprte de mi aprendizaje.
El sistema administra las cuotas de los socios que pagan, tambien administra la caja con ingresos y egresos con reporte incluido para descargar en PDF y ademas notifica el dia de cumpleaños del socio.
Las tecnologias utilizadas:
- Frontend: HTML5, CSS, Javascript
- Backend: NodeJS, MySQL

Base de Datos del sistema: scapegym.sql

Detalle del sistema:
- Permite dar de alta un socio nuevo con sus datos personales, nombre, apellido, dni(Unique key), numero de socio(Unique key), mail, Contacto, Domicilio, Fecha Nacimiento
- Permite dar de alta los pagos de las cuotas de los socios cargando el importe, el mes del abonado, modo de pago (debito, transferencia, efectivo) Concepto y la Observacion 
- Buscar socios Activos y como socios inactivos por medio de su numero de DNI y Nro. de Socio.
- La tabla de Busqueda te puede mostrar en colores el estado de la cuota si esta al dia el pago o no, rojo esta atrasado mas de 20 dias, amarilla esta atrasado de 1 a 19 dias, y verde tiene la cuota al dia
- Podes inactivar a los socios cuando no estan viniendo mas al gimnasio
- En la busqueda de activos, podes filtrar solamente los socios en color rojo que superan la cuota atrasada mas de 20 dias
- Modulo para cargar pagos de cuotas y asignar al socio
- Modulo Caja te permite cargar ingresos o egresos que se vayan haciendo en el dia, y ademas podes descargar un reporte en PDF dodne te permite ver el total de ingreso o egreso del dia
- Modulo de usuarios te permite administrar el cambio de contraseñas de los usuarios para poder ingresar al sistema
- En el ingreso del sistema notifica si en el dia d ela fecha un socio cumple años

Algunas capturas del sistema:

Pantalla Login:
![image](https://github.com/marianos1988/sys-gym/assets/138610830/bc7460eb-5725-4620-b885-0e08509453e6)

Notificacion de cumpleaños:
![image](https://github.com/marianos1988/sys-gym/assets/138610830/6c2f336e-cb90-499b-a0fd-04835e0a8705)

Nuevo Socio:
![image](https://github.com/marianos1988/sys-gym/assets/138610830/c21efdb8-63c9-4c4e-be7b-16ed48e510ea)

Buscar Socios Activos:
![image](https://github.com/marianos1988/sys-gym/assets/138610830/99916105-e9f6-4982-be69-08c4d1db96c9)

Buscar Socios Inactivos:
![image](https://github.com/marianos1988/sys-gym/assets/138610830/a6be7c15-44ed-412e-a883-de42bcab8618)

Modulos Pagos:
![image](https://github.com/marianos1988/sys-gym/assets/138610830/683201fa-6465-44d3-82d0-d55974013b34)

Modulo Caja:
![image](https://github.com/marianos1988/sys-gym/assets/138610830/5461fc64-7187-4bf5-9512-1ba9f6caf34d)

Modulo Usuarios:
![image](https://github.com/marianos1988/sys-gym/assets/138610830/67221ee1-934d-424e-b2e4-cfcd5af38c47)


Usuario de prueba login:
User: recepcion
Password: 1234

Dependencias Requeridas Nodejs:
-cors
-mysql
-express





