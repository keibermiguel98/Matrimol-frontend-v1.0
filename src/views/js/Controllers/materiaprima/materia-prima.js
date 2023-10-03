const path = require('path');
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const Swal = require('sweetalert2')
let rutaAbsoluta = path.join(__dirname, 'tables-materia-prima.html')

const componente = document.getElementById('componente');
const referencia = document.getElementById('referencia')

const parametro = document.getElementById('parametro')
const buttonEnviar = document.getElementById('btnGuardar')

let validarParametro = document.getElementById('validarParametro')
let validarComponente = document.getElementById('validarComponente')
let validarReferencia = document.getElementById('validarReferencia')

let materia = JSON.parse(localStorage.getItem('materiaprima'))
let buttonEliminar = document.getElementById('btnEliminar')

componente.value = materia.nombreCompuesto
parametro.value = materia.parametro
referencia.value = materia.referenciaCompuesto

referencia.addEventListener('keyup',(e)=>{
  socket.emit('validar:componente')
  socket.on('validar:componente',(results)=>{
    let filtrado = results.filter(componente=>componente.eliminado == 0)
    const componenteValue = e.target.value.toLowerCase(); 
     for (let i = 0; i < filtrado.length; i++) {
      if (filtrado[i].referenciaCompuesto.toLowerCase() === componenteValue) { 
        validarReferencia.innerHTML = 'Este componente ya se encuentra registrado!'
        referencia.style = 'border: 2px solid red';
        return;
      }
     }
     referencia.style = ''; // Pintar en verde solo si no hay coincidencias
     validarReferencia.innerHTML = ''


  })
})

buttonEnviar.addEventListener('click',(e)=>{
  e.preventDefault()
  if(componente.value == ''){
    validarComponente.innerHTML = 'El campo "Componente" es totalmente obligatorio!'
    validarParametro.innerHTML = ''
    validarReferencia.innerHTML = ''
  }else if(referencia.value == ''){
    validarReferencia.innerHTML = 'El campo "Referencia" es totalmente obligatorio!'
    validarComponente.innerHTML = ''
    validarParametro.innerHTML = ''
  }else if(parametro.value == '----'){
    validarReferencia.innerHTML = 'El campo "Parametro" es totalmente obligatorio!'

    validarComponente.innerHTML = ''
    validarReferencia.innerHTML = ''
  }else{
    validarComponente.innerHTML = ''
    validarReferencia.innerHTML = ''
    validarParametro.innerHTML = ''

    let componentes = {
    id:materia.id,
    nombreCompuesto: componente.value,
    referenciaCompuesto: referencia.value,
    parametro: parametro.value
  }
  socket.emit('update:materiaprima', componentes)
  window.location.pathname = rutaAbsoluta

}})


buttonEliminar.addEventListener('click',(e)=>{
  e.preventDefault()
  Swal.fire({
    title: 'Se encuentra seguro?',
    text: "Al eliminar este material no se podra revertir los cambios!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Eliminar!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Eliminado!',
        'Su material ha sido eliminado.',
        'success'
      )
      socket.emit('eliminar:materia', materia.id)
      window.location.pathname = rutaAbsoluta
    }
  })
})