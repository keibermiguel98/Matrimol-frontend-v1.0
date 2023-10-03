const Swal = require('sweetalert2')
const io = require('socket.io-client');
const path = require('path');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
let rutatable = path.join(__dirname, 'tables-maquinarias.html' )

 let id = document.getElementById('id')
 let codigo = document.getElementById('codigo')
 let descripcion = document.getElementById('descripcion')
 let numeromaquina = document.getElementById('numeromaquina')
 let btnGuardar = document.getElementById('btnGuardar')
 let btnCancelar = document.getElementById('btnCancelar')
 let btnEliminar = document.getElementById('btnEliminar')

 button = document.getElementById("btnGuardar")

const valores = JSON.parse(localStorage.getItem('maquinaria'))
 id.value = valores.id
 codigo.value = valores.codigo
 descripcion.value = valores.descripcion
 numeromaquina.value = valores.alias
  
 
   let validarDescripcion = document.getElementById('validarDescripcion')
   let validarCodigo = document.getElementById('validarCodigo')
   let validarNumero = document.getElementById('validarNumero')

     btnGuardar.addEventListener('click', (e)=>{
        e.preventDefault()

        if(codigo.value == ''){
         validarCodigo.innerHTML = 'El campo "Codigo" es totalmente obligatorio!'
         validarDescripcion.innerHTML = ''
         validarNumero.innerHTML = ''
       }else if(numeromaquina.value == ''){
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

          datos = {
           id: parseInt(id.value),
           codigo: codigo.value,
           descripcion: descripcion.value,
           alias: numeromaquina.value

        }

        socket.emit('Maquinaria:Update', datos)
        console.log(datos)
        localStorage.removeItem('maquinaria')
         window.location.pathname = rutatable
     }})




     btnEliminar.addEventListener('click', (e)=>{
        e.preventDefault()
        
        let id = valores.id
        console.log(id)
        socket.emit('idDeleteMaquinaria', id)
        window.location.pathname = rutatable
        console.log(datos)
     })
 


     btnCancelar.addEventListener('click', (e)=>{
        e.preventDefault()
       // window.location.pathname ='../src/views/tables-maquinarias.html'
       // localStorage.removeItem('maquinaria')
     })
