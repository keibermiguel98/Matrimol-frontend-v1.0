const path = require('path');
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
let datos = JSON.parse(localStorage.getItem('UserLogin'))
let welcome2 = document.querySelector('.bienvenido2');
let rol = document.querySelector('.rol')
let rutaAbsoluta = path.join(__dirname, 'settings-account-operarios.html')


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

let mysOperadores;
let mysOperadoresSearch; 

document.addEventListener('DOMContentLoaded', ()=>{
mysOperadores = document.getElementById('mysOperadores')
mysOperadoresSearch = document.getElementById('mysOperadoresSearch')


 renderGetOperadores()

})


async function renderGetOperadores(){
  await socket.emit('get:Operadores')
}

 socket.on('set:Operadores',(results)=>{
    let datos = results.filter(operador=>operador.eliminado == 0)
    let plantilla ="";

    datos.forEach(element=>{
      plantilla+=`
   <tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${element.id}</strong></td>
       <td>${element.cif}</td>
       <td>${element.alias}</td>
       <td>${element.nombre}</td>
       <td> ${element.apellido} </td>
       <td>
       <input type="button" value='Seleccionar' id="${element.id}" class="btn btn-primary p-2 btn-ver">  
      </td>
 </tr>
 `;
    })

    mysOperadores.innerHTML= plantilla;

    btnObservar = document.querySelectorAll('.btn-ver');
 

    btnObservar.forEach(boton=>{
      boton.addEventListener('click', renderGetOperador)  
    })
   

    async function renderGetOperador(e){
      const obj = parseInt(e.target.id)
      await socket.emit('idGetOperador', obj) 

      socket.on('idOperadorResult', (result)=>{
   
        const datos = JSON.stringify(result)
        window.localStorage.setItem('operador', datos)
    })
    setTimeout(()=>{
      window.location.pathname =rutaAbsoluta
    },20)
     
    
    }
})


socket.on('set:Operadores',(results)=>{
  let filtrado = results.filter(operador=>operador.eliminado == 0)
  inputsearch.addEventListener('input',()=>{
    let inputDatos = inputsearch.value.toLowerCase();
    const datosfiltrados = filtrado.filter((dato)=>{
      return dato.cif.toLowerCase().includes(inputDatos) || dato.nombre.toLowerCase().includes(inputDatos) || dato.apellido.toLowerCase().includes(inputDatos) || dato.alias.toLowerCase().includes(inputDatos)
    })
  let template ="";

  datosfiltrados.forEach(element=>{
    template+=`
 <tr> 
   <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${element.id}</strong></td>
     <td>${element.cif}</td>
     <td>${element.alias}</td>
     <td>${element.nombre}</td>
     <td> ${element.apellido} </td>
     <td>
     <input type="button" value='Seleccionar' id="${element.id}" class="btn btn-primary p-2 btn-ver">  
    </td>
</tr>
`;
  })

  mysOperadoresSearch.innerHTML= template;

  btnObservar = document.querySelectorAll('.btn-ver');


  btnObservar.forEach(boton=>{
    boton.addEventListener('click', renderGetOperador)  
  })
 

  async function renderGetOperador(e){
    const obj = parseInt(e.target.id)
    await socket.emit('idGetOperador', obj) 

    socket.on('idOperadorResult', (result)=>{
 
      const datos = JSON.stringify(result)
      window.localStorage.setItem('operador', datos)
  })
  setTimeout(()=>{
    window.location.pathname =rutaAbsoluta
  },20)
   
  
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