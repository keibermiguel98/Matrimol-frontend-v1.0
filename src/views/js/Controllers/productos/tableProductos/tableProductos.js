const path = require('path');
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
let datos = JSON.parse(localStorage.getItem('UserLogin'))
let accountUserImage = document.getElementById('uploadedAvatar')
let imgAvatar = document.getElementById('imgavatar')
let rutaAbsoluta = path.join(__dirname,'settings-account-productos.html')

let inputsearch = document.getElementById('searchproducto')
let tablesearch = document.getElementById('tablesearch')
let tablecomun = document.getElementById('tablecomun')

let welcome2 = document.querySelector('.bienvenido2');
let rol = document.querySelector('.rol')

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

let myArticles;
let myArticlesSearch;

inputsearch.addEventListener('input',()=>{
  if(inputsearch.value !== ''){
    tablesearch.classList.remove('d-none')
    tablecomun.classList.add('d-none')
  }else{
   tablesearch.classList.add('d-none')
   tablecomun.classList.remove('d-none')
  }
})

document.addEventListener('DOMContentLoaded', ()=>{
    myArticles = document.getElementById('mylist')
    myArticlesSearch = document.getElementById('mylistsearch')
  getArticle()
 })

async function getArticle(){await socket.emit('get:article')}

socket.on('getarticle', (results)=>{
    console.log(results)
    let template = ''
    results.forEach((producto,index)=>{
        template+= `<tr> 
        <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
          <td>${producto.referencia}</td>
          <td>${producto.descripcion}</td>
          <td>${producto.unidad}</td>
         
          <td>
          <input type="button" value="Ver" id="${index}" class="btn btn-primary p-2 btn-ver m-1"></input>
         </td>
    </tr>`;
})
myArticles.innerHTML = template;

let button = document.querySelectorAll('.btn-ver')

button.forEach(boton=>{
  boton.addEventListener('click', handleSeeButton )
})

function handleSeeButton(e){
 e.preventDefault()
 let id = e.target.id
 let producto = results[id]
 localStorage.setItem('producto', JSON.stringify(producto))
 window.location.pathname = rutaAbsoluta
}
  
})

socket.on('getarticle', (results)=>{
  inputsearch.addEventListener('input',()=>{
    let inputDatos = inputsearch.value.toLowerCase();
    const datosfiltrados = results.filter((dato)=>{
      return dato.referencia.toLowerCase().includes(inputDatos) || dato.descripcion.toLowerCase().includes(inputDatos)
    })
  let template = ''
  datosfiltrados.forEach((producto,index)=>{
      template+= `<tr> 
      <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
        <td>${producto.referencia}</td>
        <td>${producto.descripcion}</td>
        <td>${producto.unidad}</td>
       
        <td>
        <input type="button" value="Ver" id="${index}" class="btn btn-primary p-2 btn-ver m-1"></input>
       </td>
  </tr>`;
})
myArticlesSearch.innerHTML = template;

let button = document.querySelectorAll('.btn-ver')

button.forEach(boton=>{
boton.addEventListener('click', handleSeeButton )
})

function handleSeeButton(e){
e.preventDefault()
let id = e.target.id
let producto = results[id]
localStorage.setItem('producto', JSON.stringify(producto))
window.location.pathname = rutaAbsoluta
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