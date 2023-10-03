const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const moment = require('moment'); 
const path = require('path');

let user = JSON.parse(localStorage.getItem('UserLogin'))
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

user.forEach((rol)=>{
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
  roljefeplanta.classList.remove('d-none')
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

let rutaAbsoluta = path.join(__dirname, 'pages-nota-entrega.html')
let datos = JSON.parse(localStorage.getItem('UserLogin'))
let welcome2 = document.querySelector('.bienvenido2');
let rol = document.querySelector('.rol')
let accountUserImage = document.getElementById('uploadedAvatar')
let imgAvatar = document.getElementById('imgavatar')

let nombre2 = ''
let roll = ''

datos.map((item)=>{
  nombre2 = item.nombre +' '+item.apellido
  roll = item.rol
  console.log(item)
})
  welcome2.innerHTML = nombre2
  rol.innerHTML = roll

datos.forEach(rol=>{
  let url = `http://localhost:18092/imagen/${rol.imagen}`
  fetch(url)
  .then(response => response.blob())
  .then(blob => {
    const urlImagen = URL.createObjectURL(blob);
    accountUserImage.src = urlImagen;
    console.log(urlImagen)
    imgAvatar.src = urlImagen
})
  .catch(error => {
    console.error('Error al consultar la imagen:', error);
});
})

let mynotadeentrega;
let mynotapendientes;
document.addEventListener('DOMContentLoaded',()=>{
  emitTableNotaEntrega()
  handleEntregas()
})

async function handleEntregas(){await socket.emit('get:entregasnotas')}
async function emitTableNotaEntrega(){await socket.emit('send:tablenotaentrega')}

mynotadeentrega = document.getElementById('mynotadeentrega')
mynotapendientes = document.getElementById('mynotapendientes')


socket.on('send:tablenotaentrega', (results)=>{
  let template = '';
  results.reverse().forEach((nota,index)=>{
     template+= `
     <tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
       <td>${(nota.codigoalbaranes == '')? 'N/A' : nota.codigoalbaranes}</td>
       <td>${nota.nombre}</td>
       <td> ${nota.numOrdenProduccion} </td>
       <td> ${nota.entregadoPor} </td>
       <td>${moment(nota.fecha).utc().format('DD/MM/YYYY')}</td>
       <td>
       <input type="button" value="Seleccionar" id="${index}" class="btn btn-primary p-2 btn-ver m-1"></input>
       <input type="button" value="Pdf" id="${nota.id}" class="btn btn-danger p-2 btn-pdf">
      </td>
 </tr>`
  })
  mynotadeentrega.innerHTML = template

  let buttonObservar = document.querySelectorAll('.btn-ver')

  buttonObservar.forEach(button=>{
    button.addEventListener('click', handleGetIdNota)
  })

  function handleGetIdNota(e){
    e.preventDefault()
    let id = e.target.id
    let data = results[id]
    localStorage.setItem('notaentrega',JSON.stringify(data))
    location.pathname = rutaAbsoluta

  }
})

socket.on('get:entregasnotas',(notas)=>{
  let filtradas = notas.filter(nota=>nota.status == 'En proceso')
  let plantilla = ''
  filtradas.forEach((notas,index)=>{
   plantilla+=`
   <tr> 
   <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
     <td class='text-primary'>${notas.codigoOrden}</td>
     <td>${notas.nombre}</td>
     <td> ${notas.descripcion} </td>
     <td> ${notas.referencia} </td>
     <td> ${notas.cantidad} </td>
     <td> ${notas.cantidad - notas.cantidadCambiaria} </td>
     <td> ${notas.cantidadCambiaria} </td>
     <td>${moment(notas.fechaEntregaProgramada).utc().format('DD/MM/YYYY')}</td>
     <td>
    </td>
</tr>`
  })
  mynotapendientes.innerHTML = plantilla
})