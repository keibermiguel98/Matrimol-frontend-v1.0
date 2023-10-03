const Swal = require('sweetalert2')
const io = require('socket.io-client');
const path = require('path');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
let rutatable = path.join(__dirname,'tables-maquinarias.html')
let codigo = document.getElementById("codigo")
let descripcion = document.getElementById("descripcion")
let numeromaquinaria = document.getElementById('numeromaquinaria')
btnGuardar = document.getElementById("btnGuardar")
btnCancelar = document.getElementById('btnCancelar')

let validarDescripcion = document.getElementById('validarDescripcion')
let validarCodigo = document.getElementById('validarCodigo')
let validarNumero = document.getElementById('validarNumero')




btnGuardar.addEventListener("click", (e)=>{
    e.preventDefault()
    if(codigo.value == ''){
      validarCodigo.innerHTML = 'El campo "Codigo" es totalmente obligatorio!'
      validarDescripcion.innerHTML = ''
      validarNumero.innerHTML = ''
    }else if(numeromaquinaria.value == ''){
        validarNumero.innerHTML = 'El campo "Maquina Nº" es totalmente obligatorio'
        validarCodigo.innerHTML = ''
        validarDescripcion.innerHTML = ''
    }else if(descripcion.value == ''){
        validarDescripcion.innerHTML = 'El campo "Descripcion" es totalmente obligatorio'
        validarCodigo.innerHTML = ''
        validarNumero.innerHTML = ''
    }else{
        validarCodigo.innerHTML = ''
        validarNumero.innerHTML = ''
        validarDescripcion.innerHTML = ''

        let validar = {
            codigo: codigo.value,
            alias: numeromaquinaria.value
         }

     socket.emit('validar:maquinaria', validar)

     socket.on('validar:maquinaria', (resultado)=>{
        
        if(resultado == ''){
            const maquinaria = {
                codigo: codigo.value,
                descripcion: descripcion.value,
                alias: numeromaquinaria.value,
                status: 1,
                created_at: new Date,
                eliminado: 0
            }
             console.log(maquinaria)
            socket.emit('add:Maquinaria', maquinaria)    
            setTimeout(()=>{
                window.location.pathname = rutatable
            },2000)
       
            Swal.fire({
                icon: 'success',
                title: '¡Grandioso!',
                text: 'Su maquinaria fue almacenada exitosamente!'
                
              })

        }else{
            
            Swal.fire({
                icon: 'error',
                title: '¡Informacion!',
                text: 'El codigo que digito ya se encuentra asignado!'
              })  
              codigo.style = 'border:2px solid red; color:red'
        } 

     })

  
}})



btnCancelar.addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.pathname = rutatable
    localStorage.removeItem('maquinaria')
})
  