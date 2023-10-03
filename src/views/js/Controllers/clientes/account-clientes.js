const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const path = require('path');
let rutaAbsoluta = path.join(__dirname, 'tables-clientes.html')

let validatenombre = document.getElementById('validatenombre')
let validateidentificacion = document.getElementById('validateidentificacion')
let validatemovil = document.getElementById('validatemovil')
let validatedireccion = document.getElementById('validatedireccion')

   let id = document.getElementById('id')
   let nombre = document.getElementById('nombre')
   let movil = document.getElementById('movil')
   let cif = document.getElementById('identificacion')
   let direccion = document.getElementById('direccion')
   let btnGuardar = document.getElementById('btnGuardar')
   let btnCancelar = document.getElementById('btnCancelar')
   let btnEliminar = document.getElementById('btnEliminar')
   let tipoidentificacion = document.getElementById('tipoidentificacion')



  let valores = JSON.parse(localStorage.getItem('cliente'))
   id.value = valores.id
   nombre.value = valores.nombre
   tipoidentificacion.value = valores.tipoIdentificacion
   cif.value = valores.cif
   direccion.value = valores.direccion
   movil.value = valores.movil 
   
 
     btnGuardar.addEventListener('click', (e)=>{
        e.preventDefault()

        if(cif.value == ''){
         validateidentificacion.classList.remove('d-none')
         validatenombre.classList.add('d-none')
         validatemovil.classList.add('d-none')
         validatedireccion.classList.add('d-none')

        }else if(nombre.value == ''){
            validateidentificacion.classList.add('d-none')
            validatemovil.classList.add('d-none')
            validatedireccion.classList.add('d-none')        
            validatenombre.classList.remove('d-none')
        }else if(movil.value == ''){
            validatemovil.classList.remove('d-none')
            validatenombre.classList.add('d-none')
            validateidentificacion.classList.add('d-none')
            validatedireccion.classList.add('d-none')
        }else if(direccion.value == ''){
            validatedireccion.classList.remove('d-none')
            validatemovil.classList.add('d-none')
            validatenombre.classList.add('d-none')
            validateidentificacion.classList.add('d-none')
        }else{
             validatedireccion.classList.add('d-none')
             validatemovil.classList.add('d-none')
             validatenombre.classList.add('d-none')
             validateidentificacion.classList.add('d-none')

         let datos = {
           id: id.value,
           nombre: nombre.value,
           movil: movil.value,
           tipoIdentificacion: tipoidentificacion.value,
           identificacion: identificacion.value,
           direccion: direccion.value,
           cif: cif.value,
        }

   
        socket.emit('update:cliente', datos)
        console.log(datos)
    
        
         window.location.pathname = rutaAbsoluta
     }})


     btnEliminar.addEventListener('click', (e)=>{
        e.preventDefault()
      
        socket.emit('idDeleteClient', id.value)
        window.location.pathname = rutaAbsoluta
     })
 


     btnCancelar.addEventListener('click', (e)=>{
        e.preventDefault()
        window.location.pathname = rutaAbsoluta
        localStorage.removeItem('cliente')

     })

