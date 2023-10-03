const path = require('path');
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const Swal = require('sweetalert2')

let rutaAbsoluta = path.join(__dirname, 'tables-productos.html')
const referencia = document.getElementById('referencia')
const descripcion = document.getElementById('nombreArticulo')
const unidad = document.getElementById('unidad')
const btnGuardar = document.getElementById('btnGuardar')
const btnCancelar = document.getElementById('btnCancelar')
let validarDescripcion = document.getElementById('validarDescripcion')

   descripcion.addEventListener('keyup',(e)=>{
    socket.emit('validar:producto')
    socket.on('validar:producto',(results)=>{
      let filtrado = results.filter(componente=>componente.eliminado == 0)
      const descripcion = e.target.value.toLowerCase(); 
       for (let i = 0; i < filtrado.length; i++) {
        if (filtrado[i].descripcion.toLowerCase() === descripcion && filtrado[i].referencia == referencia.value) { 
          validarDescripcion.innerHTML = 'Este producto ya se encuentra registrado con esa referencia!'
          descripcion.style = 'border: 2px solid red';
          btnGuardar.disabled = 'disabled'
          return;
        }
       }
       descripcion.style = ''; // Pintar en verde solo si no hay coincidencias
       validarDescripcion.innerHTML = ''
       btnGuardar.disabled = ''
  
  
    })
  })

btnGuardar.addEventListener('click', (e)=>{
 e.preventDefault()
 let ref = referencia.value


 let validarReferencia = document.getElementById('validarReferencia')
 let validarDescripcion = document.getElementById('validarDescripcion')
 let validarUnidad = document.getElementById('validarUnidad')
 
 if(referencia.value == ''){
    validarReferencia.innerHTML = 'el campo Referencia es obligatorio'
    validarDescripcion.innerHTML = ''
    validarUnidad.innerHTML = ''   


   }else if(descripcion.value == ''){
       validarReferencia.innerHTML = ''
       validarUnidad.innerHTML = ''   
       validarDescripcion.innerHTML = 'el campo Descripcion es obligatorio'
   }else if(unidad.value == '---'){
       validarDescripcion.innerHTML = ''
       validarReferencia.innerHTML = ''   
       validarUnidad.innerHTML = 'el campo Unidad es obligatorio'
   }else{
      validarUnidad.innerHTML = ''   
      validarDescripcion.innerHTML = ''
      validarReferencia.innerHTML = ''   
   

 socket.emit('validator:getproducto', ref)

 socket.on('validator:getproducto', (results)=>{
    console.log(results)
    if(results == ''){
        
        let productos = {
            referencia:referencia.value,
            descripcion: descripcion.value,
            unidad : unidad.value,
            eliminado: 0,
            created_at: new Date
         }
         console.log(productos)
        
        socket.emit('add:article', productos)
        location.pathname = rutaAbsoluta
    }
    else{
        Swal.fire({
            icon: 'error',
            title: 'Disculpe!',
            text: 'Ya existe un producto con esa referencia',
            footer: '<h4>Gracias!</h4>'
          });    
          referencia.style = 'color:red; border: 1px solid red;'
        }
 })


   }
})

btnCancelar.addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.pathname = rutaAbsoluta
})

