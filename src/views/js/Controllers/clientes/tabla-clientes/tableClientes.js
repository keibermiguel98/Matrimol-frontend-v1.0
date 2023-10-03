const Swal = require('sweetalert2')
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const path = require('path');
let rutaAbsoluta = path.join(__dirname, 'settings-account-clientes.html')
let welcome2 = document.querySelector('.bienvenido2');
let rol = document.querySelector('.rol')
let datos = JSON.parse(localStorage.getItem('UserLogin'))
let accountUserImage = document.getElementById('uploadedAvatar')
let imgAvatar = document.getElementById('imgavatar')

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

let tablesearch = document.getElementById('tablesearch')
let tablecomun = document.getElementById('tablecomun')
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
let mysClientes; 
let mysClientesSearch;

document.addEventListener('DOMContentLoaded', ()=>{
mysClientes = document.getElementById('mysClientes')
mysClientesSearch = document.getElementById('mysClientesSearch')
 renderGetClientes()
})

async function renderGetClientes(){await socket.emit('get:Clientes')}

 socket.on('set:Clientes',(results)=>{
    resultado = results.filter(item=>item.eliminado == 0)
    console.log(resultado)
    let template ="";
    resultado.forEach((element,index)=>{
      template+=`
   <tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${element.id}</strong></td>
       <td>${element.cif}</td>  
       <td>${element.nombre}</td>
       <td>${element.movil}</td>
    <td>
       <input type="button" value='Seleccionar' id="${index}" class="btn btn-primary p-2 btn-ver">  
   </td>
  </tr>
 
 `;
    });

    mysClientes.innerHTML= template;

    btnObservar = document.querySelectorAll('.btn-ver');
 

    btnObservar.forEach(boton=>{
      boton.addEventListener('click', renderGetClient)       
    })
   
  
    async function renderGetClient(e){
      const id = e.target.id
      let res = resultado[id]
      console.log(res) 
      window.localStorage.setItem('cliente', JSON.stringify(res)) 
      setTimeout(()=>{
       window.location.pathname = rutaAbsoluta
       },20)
    }
})

socket.on('set:Clientes',(results)=>{
  resultado = results.filter(item=>item.eliminado == 0)
  inputsearch.addEventListener('input',()=>{
    let inputDatos = inputsearch.value.toLowerCase();
    const datosfiltrados = resultado.filter((dato)=>{
      return dato.cif.toLowerCase().includes(inputDatos) || dato.nombre.toLowerCase().includes(inputDatos) 
    })
  let template ="";
  datosfiltrados.forEach((element,index)=>{
    template+=`
 <tr> 
   <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${element.id}</strong></td>
     <td>${element.cif}</td>  
     <td>${element.nombre}</td>
     <td>${element.movil}</td>
  <td>
     <input type="button" value='Seleccionar' id="${index}" class="btn btn-primary p-2 btn-ver">  
 </td>
</tr>

`;
  });

  mysClientesSearch.innerHTML= template;

  btnObservar = document.querySelectorAll('.btn-ver');


  btnObservar.forEach(boton=>{
    boton.addEventListener('click', renderGetClient)       
  })
 

  async function renderGetClient(e){
    const id = e.target.id
    let res = resultado[id]
    console.log(res) 
    window.localStorage.setItem('cliente', JSON.stringify(res)) 
    setTimeout(()=>{
     window.location.pathname = rutaAbsoluta
     },20)
  }
})
})


