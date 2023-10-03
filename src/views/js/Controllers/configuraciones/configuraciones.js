const Swal = require('sweetalert2')
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const path = require('path');
let rutaAbsoluta = path.join(__dirname, 'index.html')

//Orden produccion
let ordproduccion = document.getElementById('ordcaracteres')
let ordnuninit = document.getElementById('ordnuninit')

//Orden produccion especiales
let ordproduccionespecial = document.getElementById('caracteresordenespecial')
let ordnuninitespecial = document.getElementById('numeroordeneespecial')

//Orden entrega jefe planta a despacho
let caracterordendespacho = document.getElementById('caracteresordenentregajefeplanta')
let numerodespacho = document.getElementById('numeroordenentregajefeplanta')

//control aisladores 
let caracteraislador = document.getElementById('caracteraislador')
let numeroasilador = document.getElementById('numeroaislador')

//control bujes
let caracterbuje = document.getElementById('caracterbujes')
let numerobuje = document.getElementById('numerobujes')

//control pulido
let caracterpulido = document.getElementById('caracterpulido')
let numeropulido = document.getElementById('numeropulido')

//Albaranes
let caracteralbaran = document.getElementById('caracteralbaran')
let numeroalbaran = document.getElementById('numeroalbaran')

let datos = JSON.parse(localStorage.getItem('UserLogin'))
let rolordenproduccion = document.querySelector('.rol-orden-produccion')
let rolnotasentrega = document.querySelector('.rol-notas-entrega')
let roljefeplanta = document.querySelector('.rol-jefe-de-planta')
let rolmaster = document.querySelector('.rol-maestros')
let rolseguridad = document.querySelector('.rol-security')
let rolconfigurar = document.querySelector('.rol-configure')
let roloperadores = document.querySelector('.rol-operadores-planta')

let createOrden = document.querySelector('.rol-create-orden')
let rolnotacrear = document.querySelector('.rol-nota-crear')
let roloperadorestareas = document.querySelector('.rol-operadores-tareas')

datos.forEach((rol)=>{
  if(rol.rol == 'Jefe de Planta'){
    /////////Roles//////////
 createOrden.classList.add('d-none')
 rolmaster.classList.add('d-none')
 rolseguridad.classList.add('d-none')
 rolconfigurar.classList.add('d-none')
 rolnotasentrega.classList.add('d-none')
 roloperadores.classList.remove('d-none')
 roljefeplanta.classList.remove('d-none')
 rolordenproduccion.classList.remove('d-none')
 createOrden.classList.add('d-none')
 rolnotacrear.classList.add('d-none')
 roloperadorestareas.classList.add('d-none')
}
else if(rol.rol == 'Planta'){
rolordenproduccion.classList.add('d-none')
rolnotasentrega.classList.add('d-none')
roljefeplanta.classList.add('d-none')
rolmaster.classList.add('d-none')
rolseguridad.classList.add('d-none')
rolconfigurar.classList.add('d-none')
roloperadorestareas.classList.remove('d-none')
roloperadores.classList.remove('d-none')
}
else if(rol.rol == 'Administrativo'){
  rolconfigurar.classList.add('d-none')
  rolmaster.classList.remove('d-none')
  rolordenproduccion.classList.remove('d-none')
  rolseguridad.classList.add('d-none')
  rolconfigurar.classList.add('d-none')
  rolnotasentrega.classList.remove('d-none')
  roloperadorestareas.classList.add('d-none')
  roloperadores.classList.remove('d-none')
}
else if(rol.rol == 'Despachos'){
  rolconfigurar.classList.add('d-none')
  rolseguridad.classList.add('d-none')
  rolmaster.classList.remove('d-none')
  roljefeplanta.classList.add('d-none')
  roloperadorestareas.classList.add('d-none')
  rolordenproduccion.classList.remove('d-none')
  rolnotasentrega.classList.remove('d-none')
  
}else if(rol.rol == 'Super usuario'){
  rolconfigurar.classList.remove('d-none')
  rolordenproduccion.classList.remove('d-none')
  roljefeplanta.classList.remove('d-none')
  rolmaster.classList.remove('d-none')
  rolseguridad.classList.remove('d-none')
  rolconfigurar.classList.remove('d-none')
  rolnotasentrega.classList.remove('d-none')
  roloperadores.classList.remove('d-none')
  roloperadorestareas.classList.remove('d-none')
}
})

function configuraciones(){
    let configuraciones = {
        siglasOrdenProduccion: ordproduccion.value,
        numerordinit: ordnuninit.value,
        siglasControlAisladores: caracteraislador.value,
        numeroinitCA: numeroasilador.value,
        siglasControlBujes: caracterbuje.value,
        numeroinitCB: numerobuje.value,
        siglasControlPulido: caracterpulido.value,
        numeroinitCP: numeropulido.value,
        siglasNotaEntrega: caracteralbaran.value,
        numeroinitNE: numeroalbaran.value,
        siglasOrdenJefe: ordproduccionespecial.value,
        numeroordinitjefe: ordnuninitespecial.value,
        siglasOrdenEntrega: caracterordendespacho.value,
        numerordenentregainit: numerodespacho.value
       } 
        socket.emit('add:configuraciones', configuraciones)
        location.pathname = rutaAbsoluta;

    }

document.addEventListener('DOMContentLoaded', ()=>{
    socket.emit('get:configuracion')
    socket.on('get:configuracion', (results)=>{
        results.forEach(dato=>{
            ordproduccion.value = dato.siglasOrdenProduccion
            ordnuninit.value = dato.numerordinit
            caracteraislador.value = dato.siglasControlAisladores
            numeroasilador.value = dato.numeroinitCA
            caracterpulido.value = dato.siglasControlPulido
            numeropulido.value = dato.numeroinitCP
            caracterbuje.value = dato.siglasControlBujes
            numerobuje.value = dato.numeroinitCB
            caracteralbaran.value = dato.siglasNotaEntrega
            numeroalbaran.value = dato.numeroinitNE
            ordproduccionespecial.value = dato.siglasOrdenJefe
            ordnuninitespecial.value = dato.numeroordinitjefe
            caracterordendespacho.value =  dato.siglasOrdenEntrega
            numerodespacho.value = dato.numerordenentregainit
        
        })})
        })

