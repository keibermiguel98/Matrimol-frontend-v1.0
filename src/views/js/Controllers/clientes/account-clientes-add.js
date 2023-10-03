const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const path = require('path');
let rutaAbsoluta = path.join(__dirname, 'tables-clientes.html')

let validatenombre = document.getElementById('validatenombre')
let validateidentificacion = document.getElementById('validateidentificacion')
let validatemovil = document.getElementById('validatemovil')
let validatedireccion = document.getElementById('validatedireccion')


   let nombre = document.getElementById('nombre')
   let movil = document.getElementById('movil')
   let cif = document.getElementById('identificacion')
   let eliminado = document.getElementById('eliminado')
   let direccion = document.getElementById('direccion')
   let  btnGuardar = document.getElementById('btnGuardar')
   let btnCancelar = document.getElementById('btnCancelar')
   let tipoidentificacion = document.getElementById('tipoidentificacion')


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

          data = {
           nombre: nombre.value,
           movil: movil.value,
           direccion: direccion.value,
           tipoIdentificacion: tipoidentificacion.value,
           cif: cif.value,
           eliminado: 0 
        }
        console.log(data)

      
        socket.emit('add:client', data)
        console.log(data)
        window.location.pathname = rutaAbsoluta

     }})

     function reset(){
        nombre.value = '',
        apellido.value = '',
        movil.value = '',
        cif.value = '',
        direccion.value = '',
        eliminado.value = '',
        tipoidentificacion.value = ''
   
     }


     btnCancelar.addEventListener('click', (e)=>{
        e.preventDefault()
        reset()
        window.location.pathname =rutaAbsoluta
     })



   