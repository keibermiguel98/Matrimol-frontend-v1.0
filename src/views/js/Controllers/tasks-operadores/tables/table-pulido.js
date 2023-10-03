const path = require('path');
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const moment = require('moment')
const rutaAbsoluta = path.join(__dirname,'pages-control-pulido-operador-ver.html')
let search = document.getElementById('search')
let searchfinal = document.getElementById('searchfinal')
let tableproceso = document.querySelector('.proceso')
let tablefinalizada = document.querySelector('.finalizada')

let buttonProceso = document.getElementById('buttonProceso')
let buttonFinalizada = document.getElementById('buttonFinalizada')

let datos = JSON.parse(localStorage.getItem('UserLogin'))
let welcome2 = document.querySelector('.bienvenido2');
let rol = document.querySelector('.rol')
//let rutaAbsoluta = path.join(__dirname, 'pages-orden-produccion.html' )


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
  let url = `http://192.168.1.128:18092/imagen/${rol.imagen}`
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

buttonProceso.addEventListener('click',(e)=>{
  e.preventDefault()
  buttonProceso.classList.add('active')
  search.classList.remove('d-none')
  searchfinal.classList.add('d-none')
  buttonFinalizada.classList.remove('active')
  tableproceso.classList.remove('d-none')
  tablefinalizada.classList.add('d-none')
})

buttonFinalizada.addEventListener('click',(e)=>{
  search.classList.add('d-none')
  searchfinal.classList.remove('d-none')
  buttonProceso.classList.remove('active')
  buttonFinalizada.classList.add('active')
  tableproceso.classList.add('d-none')
  tablefinalizada.classList.remove('d-none')
})

let mypulido;
let mypulidosearch;
let mypulidofinalizada
let mypulidofinalizadasearch

document.addEventListener('DOMContentLoaded', ()=>{
    mypulido = document.getElementById('mypulido')
    mypulidosearch = document.getElementById('mypulidosearch')
    mypulidofinalizada = document.getElementById('mypulidofinalizada')
    mypulidofinalizadasearch = document.getElementById('mypulidofinalizadasearch')

    getControlPulido()
 })

async function getControlPulido(){await socket.emit('get:tablecontrolpulido')}

let tablesearch = document.getElementById('procesosearch')
let tablecomun = document.querySelector('.proceso')
let inputsearch = document.getElementById('search')

inputsearch.addEventListener('input',()=>{
  if(inputsearch.value !== ''){
    tablesearch.classList.remove('d-none')
    tablecomun.classList.add('d-none')
  }else{
   tablesearch.classList.add('d-none')
   tablecomun.classList.remove('d-none')
  }
})

socket.on('get:tablecontrolpulido', (results)=>{
    let resultado = results.filter(item=>item.finalizada == 0)
    let template = ''
    resultado.forEach((producto,index)=>{
        template+= `<tr> 
        <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
        <td class='text-primary'><strong>${producto.codigoPulido}</strong></td>
          <td>${producto.nombreOperador + ' ' + producto.apellidoOperador}</td>
          <td>${producto.aliasOperarios}</td>
          <td>${producto.referencia}</td>
          <td>${producto.cantidadInicio}</td>
          <td>${producto.nombre + ' ' + producto.apellido}</td>
          <td>${moment(producto.fecha).utc().format('DD/MM/YYYY')}</td>

         
          <td>
          <input type="button" value="Seleccionar" id="${index}" class="btn btn-primary p-2 btn-ver m-1"></input>
         </td>
    </tr>`;
})
mypulido.innerHTML = template;

let button = document.querySelectorAll('.btn-ver')

button.forEach(boton=>{
  boton.addEventListener('click', handleSeeButton )
})

function handleSeeButton(e){
 e.preventDefault()
 let id = e.target.id
 let producto = results[id]
 localStorage.setItem('trabajo-operador', JSON.stringify(producto))
  location.pathname = rutaAbsoluta
}
  
})


socket.on('get:tablecontrolpulido', (results)=>{
  let resultado = results.filter(item=>item.finalizada == 0)
  inputsearch.addEventListener('input',()=>{
    let inputDatos = inputsearch.value.toLowerCase();
    const datosfiltrados = resultado.filter((dato)=>{
      return dato.nombreOperador.toLowerCase().includes(inputDatos) || dato.apellidoOperador.toLowerCase().includes(inputDatos) || dato.aliasOperarios.toLowerCase().includes(inputDatos) || dato.referencia.toLowerCase().includes(inputDatos) || dato.codigoPulido.toLowerCase().includes(inputDatos)
    })
  let template = ''
  datosfiltrados.forEach((producto,index)=>{
      template+= `<tr> 
      <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
      <td class='text-primary'><strong>${producto.codigoPulido}</strong></td>
        <td>${producto.nombreOperador + ' ' + producto.apellidoOperador}</td>
        <td>${producto.aliasOperarios}</td>
        <td>${producto.referencia}</td>
        <td>${producto.cantidadInicio}</td>
        <td>${producto.nombre + ' ' + producto.apellido}</td>
        <td>${moment(producto.fecha).utc().format('DD/MM/YYYY')}</td>

       
        <td>
        <input type="button" value="Seleccionar" id="${index}" class="btn btn-primary p-2 btn-ver m-1"></input>
       </td>
  </tr>`;
})
mypulidosearch.innerHTML = template;

let button = document.querySelectorAll('.btn-ver')

button.forEach(boton=>{
boton.addEventListener('click', handleSeeButton )
})

function handleSeeButton(e){
e.preventDefault()
let id = e.target.id
let producto = results[id]
localStorage.setItem('trabajo-operador', JSON.stringify(producto))
location.pathname = rutaAbsoluta
}
  })
})


let tablefinalsearch = document.getElementById('tablefinalsearch')
let finalcomun = document.querySelector('.finalizada')
let finalsearch = document.getElementById('searchfinal')

finalsearch.addEventListener('input',()=>{
  if(finalsearch.value !== ''){
    tablefinalsearch.classList.remove('d-none')
    finalcomun.classList.add('d-none')
  }else{
   tablefinalsearch.classList.add('d-none')
   finalcomun.classList.remove('d-none')
  }
})

socket.on('get:tablecontrolpulido', (results)=>{
  let resultado = results.filter(item=>item.finalizada == 1)
  let template = ''
  resultado.forEach((producto,index)=>{
      template+= `<tr> 
      <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
      <td>${producto.codigo}</td>
        <td>${producto.nombreOperador + ' ' +producto.apellidoOperador}</td>
        <td>${producto.aliasOperarios}</td>
        <td>${producto.referencia}</td>
        <td>${producto.cantidadInicio}</td>
        <td>${producto.cantidadFinal}</td>
        <td>${producto.nombre + ' ' + producto.apellido}</td>
        <td>${(producto.revisadoPor == null) ? '<span class="rounded badge bg-label-info me-1">Pendiente</span>' : producto.revisadoPor}</td>
        <td>${(producto.fechaRevision == null || producto.fechaRevision == '')? 'N/R' : moment(producto.fechaRevision).utc().format('DD/MM/YYYY')}</td>

       
        <td>
        <input type="button" value="Seleccionar" id="${index}" class="btn btn-primary p-2 btn-ver m-1"></input>
       </td>
  </tr>`;
})
mypulidofinalizada.innerHTML = template;

let button = document.querySelectorAll('.btn-ver')

button.forEach(boton=>{
boton.addEventListener('click', handleSeeButton )
})

function handleSeeButton(e){
e.preventDefault()
let id = e.target.id
let producto = results[id]
localStorage.setItem('trabajo-operador', JSON.stringify(producto))
 location.pathname = rutaAbsoluta
}

})

socket.on('get:tablecontrolpulido', (results)=>{
  let resultado = results.filter(item=>item.finalizada == 1)
  finalsearch.addEventListener('input',()=>{
    let inputDatos = finalsearch.value.toLowerCase();
    const datosfiltrados = resultado.filter((dato)=>{
      return dato.nombreOperador.toLowerCase().includes(inputDatos) || dato.apellidoOperador.toLowerCase().includes(inputDatos) || dato.aliasOperarios.toLowerCase().includes(inputDatos) || dato.referencia.toLowerCase().includes(inputDatos) || dato.codigoPulido.toLowerCase().includes(inputDatos)
    })
  let template = ''
  datosfiltrados.forEach((producto,index)=>{
      template+= `<tr> 
      <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
      <td>${producto.codigo}</td>
        <td>${producto.nombreOperador + ' ' +producto.apellidoOperador}</td>
        <td>${producto.aliasOperarios}</td>
        <td>${producto.referencia}</td>
        <td>${producto.cantidadInicio}</td>
        <td>${producto.cantidadFinal}</td>
        <td>${producto.nombre + ' ' + producto.apellido}</td>
        <td>${(producto.revisadoPor == null) ? '<span class="rounded badge bg-label-info me-1">Pendiente</span>' : producto.revisadoPor}</td>
        <td>${(producto.fechaRevision == null || producto.fechaRevision == '')? 'N/R' : moment(producto.fechaRevision).utc().format('DD/MM/YYYY')}</td>

       
        <td>
        <input type="button" value="Seleccionar" id="${index}" class="btn btn-primary p-2 btn-ver m-1"></input>
       </td>
  </tr>`;
})
mypulidofinalizadasearch.innerHTML = template;

let button = document.querySelectorAll('.btn-ver')

button.forEach(boton=>{
boton.addEventListener('click', handleSeeButton )
})

function handleSeeButton(e){
e.preventDefault()
let id = e.target.id
let producto = results[id]
localStorage.setItem('trabajo-operador', JSON.stringify(producto))
 location.pathname = rutaAbsoluta
}
  })
})

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