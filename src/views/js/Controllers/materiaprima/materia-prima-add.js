const path = require('path');
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
let rutaAbsoluta = path.join(__dirname, 'tables-materia-prima.html')
let componente = document.getElementById('componente');
let parametro = document.getElementById('parametro')
let referencia = document.getElementById('referencia')

let validarComponente = document.getElementById('validarComponente')
let validarReferencia = document.getElementById('validarReferencia')
let validarParametro = document.getElementById('validarParametro')

document.addEventListener('DOMContentLoaded',()=>{
  handleGetProductos()
})

async function handleGetProductos(){await socket.emit('get:productoscompuesto')}

referencia.addEventListener('keyup',(e)=>{
  socket.emit('validar:componente')
  socket.on('validar:componente',(results)=>{
    let filtrado = results.filter(componente=>componente.eliminado == 0)
    const componenteValue = e.target.value.toLowerCase(); 
     for (let i = 0; i < filtrado.length; i++) {
      if (filtrado[i].referenciaCompuesto.toLowerCase() === componenteValue) { 
        validarReferencia.innerHTML = 'Este componente ya se encuentra registrado!'
        referencia.style = 'border: 2px solid red';
        btnGuardar.disabled = 'disabled'
        return;
      }
     }
     referencia.style = ''; // Pintar en verde solo si no hay coincidencias
     validarReferencia.innerHTML = ''
     btnGuardar.disabled = ''


  })
})


let btnGuardar = document.getElementById('btnGuardar');
btnGuardar.addEventListener('click', (e) => {
  e.preventDefault();

    if(componente.value == ''){
      validarComponente.innerHTML = 'El dato "Componente" es totalmente obligatorio!'
      validarParametro.innerHTML = ''
      validarReferencia.innerHTML = ''

    }else if(referencia.value == ''){
    validarReferencia.innerHTML = 'El dato "Referencia" es totalmente obligatorio'
    validarParametro.innerHTML = ''
    validarComponente.innerHTML = ''    
    }else if(parametro.value == '----'){
      validarComponente.innerHTML = ''
      validarReferencia.innerHTML = ''
      validarParametro.innerHTML = 'El dato "Parametro" es totalmente obligatorio'
    }else{
      validarComponente.innerHTML = ''
      validarParametro.innerHTML = ''
      validarReferencia.innerHTML = ''

      

    materia = {
      nombreCompuesto: componente.value,
      referenciaCompuesto: referencia.value,
      parametro: parametro.value,
      fecha: new Date(),
      eliminado: 0
    };
    socket.emit('add:materiaprima', materia)
    window.location.pathname =rutaAbsoluta
}});

