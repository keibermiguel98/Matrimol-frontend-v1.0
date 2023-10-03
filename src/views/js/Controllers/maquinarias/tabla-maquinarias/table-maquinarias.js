const path = require('path');
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
let rutaAbsolutaMaquinaria = path.join(__dirname, 'settings-account-maquinarias.html')
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

let myMaquinaria; 
document.addEventListener('DOMContentLoaded', ()=>{
myMaquinaria = document.getElementById('myMaquinaria')
 renderGetMaquinaria()
})


async function renderGetMaquinaria(){
  await socket.emit('get:Maquinarias')
}
  
 socket.on('set:Maquinarias',(results)=>{
    let maquinarias = results.filter(maquinaria=>maquinaria.eliminado == 0)
    let template ="";

    maquinarias.forEach((element,index)=>{
      template+=`
   <tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
       <td>${element.codigo}</td>
       <td>${element.descripcion}</td>
       <td> ${element.alias} </td>
       <td>
       <input type="button" value='Seleccionar' id="${index}" class="btn btn-primary p-2 btn-ver">  
      </td>
 </tr>
 `;
    })

    myMaquinaria.innerHTML= template;

    btnObservar = document.querySelectorAll('.btn-ver');
 

    btnObservar.forEach(boton=>{
      boton.addEventListener('click', renderGetMaquinaria)  
    })
   

    async function renderGetMaquinaria(e){
      const id = parseInt(e.target.id)
      let resmaqui = maquinarias[id]
        window.localStorage.setItem('maquinaria', JSON.stringify(resmaqui))
 
        setTimeout(()=>{
          window.location.pathname = rutaAbsolutaMaquinaria
        },20)
    }})
    
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