const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const moment = require('moment'); 
const path = require('path');
let datos = JSON.parse(localStorage.getItem('UserLogin'))
let welcome2 = document.querySelector('.bienvenido2');
let rol = document.querySelector('.rol')
let rutaAbsoluta = path.join(__dirname, 'pages-orden-produccion.html' )


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

let myOrdenProduccion
let myOrdenSearch;
let search = document.getElementById('inputsearch')
let tablecorriente = document.querySelector('.table-corriente')
let tableSearch = document.querySelector('.table-search')

 search.addEventListener('input',()=>{
  if(search.value !==''){
    tablecorriente.classList.add('d-none')
    tableSearch.classList.remove('d-none')
  }else{
    tableSearch.classList.add('d-none')
    tablecorriente.classList.remove('d-none')
  }
 })

document.addEventListener('DOMContentLoaded', ()=>{
 myOrdenProduccion = document.getElementById('myOrdenProduccion')
 myOrdenSearch = document.getElementById('myOrdenSearch')
  renderOrdenProduccion()
})

async function renderOrdenProduccion(){await socket.emit('get:ordenproduccionstatus')}

socket.on('getordenesproduccionstatus', (results)=>{
   // let ordenProduccionList = results.filter(status=> status.status == 'finalizada')
    let template ="";
    let ordenProduccionList = results.filter(orden=> orden.status == 'Finalizada');
     ordenProduccionList.forEach((element,index)=>{
      template+=`
    <tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
     <td class='text-primary'><strong>${element.numOrdenProduccion}</strong></td>
     <td>${element.cif}</td>
       <td> ${element.nombre} </td>
       <td> ${element.programadoPor} </td>
       <td><span class="badge rounded-pill bg-danger p-2">${element.status}</span></td>
       <td>${moment(element.fecha).utc().format('DD/MM/YYYY')}</td>
       <td>
       <input type="button" value="Seleccionar" id="${index}" class="btn btn-primary p-2 btn-ver m-1"></input>
      </td>
 </tr>
 `;})

    myOrdenProduccion.innerHTML= template;

  button = document.querySelectorAll('.btn-ver')
   
  button.forEach(button=>{
      button.addEventListener('click', idOrdenProduccion)
    })

  async function idOrdenProduccion(e){
      e.preventDefault()
       id = e.target.id
       console.log(id)
       let localdata = ordenProduccionList[id]
     // await socket.emit('idordenproduccion', id)
    //  socket.on('idOrdenProduccion', (results)=>{
       window.localStorage.setItem('ordenProduccion', JSON.stringify(localdata))

        setTimeout(()=>{
          window.location.pathname = rutaAbsoluta
        },200)
  //  })
  } 
})

socket.on('getordenesproduccionstatus', (results)=>{
  let ordenProduccionList = results.filter(orden=> orden.status == 'Finalizada');
    search.addEventListener('input',()=>{
      let inputDatos = search.value.toLowerCase()
      let resultado = ordenProduccionList.filter(filter=>{
        return filter.nombre.toLowerCase().includes(inputDatos) || filter.cif.toLowerCase().includes(inputDatos) || filter.codigoOrden.toLowerCase().includes(inputDatos)
      })
    
  // let ordenProduccionList = results.filter(status=> status.status == 'finalizada')
   let template ="";
     resultado.forEach((element,index)=>{
     template+=`
   <tr> 
    <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
    <td class='text-primary'><strong>${element.codigoOrden}</strong></td>
    <td>${element.cif}</td>
      <td> ${element.nombre} </td>
      <td> ${element.programadoPor} </td>
      <td><span class="badge rounded-pill bg-danger p-2">${element.status}</span></td>
      <td>${moment(element.fecha).utc().format('DD/MM/YYYY')}</td>
      <td>
      <input type="button" value="Seleccionar" id="${index}" class="btn btn-primary p-2 btn-ver m-1"></input>
     </td>
</tr>
`;})

   myOrdenSearch.innerHTML= template;

 button = document.querySelectorAll('.btn-ver')
  
 button.forEach(button=>{
     button.addEventListener('click', idOrdenProduccion)
   })

 async function idOrdenProduccion(e){
     e.preventDefault()
      id = e.target.id
      console.log(id)
      let localdata = ordenProduccionList[id]
    // await socket.emit('idordenproduccion', id)
   //  socket.on('idOrdenProduccion', (results)=>{
      window.localStorage.setItem('ordenProduccion', JSON.stringify(localdata))

       setTimeout(()=>{
         window.location.pathname = rutaAbsoluta
       },200)
 //  })
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