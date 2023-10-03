const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const moment = require('moment');


let inputMaquinaria = document.getElementById('maquinaria')
let inputReferencia = document.getElementById('referencia')
let inputidcontrolPulido = document.getElementById('idcontrolapulido')


//Totalidades//
let cantConformes = document.getElementById('cantConforme')
let cantNoConforme = document.getElementById('cantNoConforme')


let datospulido = JSON.parse(localStorage.getItem('trabajo-operador'))
let idoperador = JSON.parse(localStorage.getItem('idoperador'))

inputReferencia.value = datospulido.referencia
inputMaquinaria.value = datospulido.descripcion
inputidcontrolPulido.value = datospulido.idAislador

let nameoperador = document.getElementById('nameoperador')
nameoperador.innerHTML = datospulido.nombreOperador + ' ' + datospulido.apellidoOperador + ' / ' + datospulido.aliasOperarios


let mycontrolpulido;
document.addEventListener('DOMContentLoaded', ()=>{
 
 mycontrolpulido = document.getElementById('mycontrolpulido')
  handleemitcontrolaisladores()
  getDetalleControlAisladores()
 // getControlAisladores()
})

async function getDetalleControlAisladores(){
    await socket.emit('get:detallescontrolpulido')
}


async function handleemitcontrolaisladores(){
  await socket.emit('get:operadorescontroles')
}


socket.on('get:detallescontrolpulido', (results)=>{
  let resultado = results.filter(dato=> dato.idcontrolpulido == inputidcontrolPulido.value )

    
    let template = '';
     resultado.forEach((detalle,index)=>{
     template+=`<tr>
      <td>${index+1}</td>
      <td><strong>${detalle.referencia}</strong></td>
      <td><strong>${detalle.actividad}</strong></td>
      <td><strong>${moment(detalle.fecha).utc().format('DD/MM/YYYY')}</strong></td>
      <td><strong>${moment(detalle.horaInicio, 'HH:mm').format('h:mm A')}</strong></td>
      <td><strong>${(moment(detalle.horaFinaliza, 'HH:mm').format('h:mm A') == 'Invalid date')? '' : moment(detalle.horaFinaliza, 'HH:mm').format('h:mm A')}</strong></td>
      <td>${(detalle.conformes == null) ? '': detalle.conformes}</td>
      <td>${(detalle.lineasFlujo == null) ? '': detalle.lineasFlujo}</td>
      <td>${(detalle.chupados == null) ? '': detalle.chupados}</td>
      <td>${(detalle.escurrido == null) ? '': detalle.escurrido}</td>
      <td>${(detalle.presion == null)? '': detalle.presion}</td>
      <td>${(detalle.rotura) == null ? '' : detalle.rotura}</td>
      <td>${(detalle.bujes == null)? '' : detalle.bujes}</td>
      <td>${(detalle.burbujas == null)? '': detalle.burbujas}</td>
      </tr>`; 
      })

      mycontrolpulido.innerHTML= template
})

let cantInicial = document.getElementById('cantInicial')



socket.on('get:operadorpulido', (results)=>{
 let fillaislador = results.filter(fil=>fil.idPulido == inputidcontrolPulido.value)
 
 fillaislador.forEach(fil=>{

   cantInicial.innerHTML = `
   <span class="fw-semibold d-block mb-3">Cantidad inicio</span>
   <h1 class="card-title mb-2">${(fil.cantidadInicio == null) ? '0' : fil.cantidadInicio}</h1>
   `;
   //cantAgregada.innerHTML = `
   //<span class="fw-semibold d-block mb-3">Cantidad Agregada</span>
   ///<h1 class="card-title mb-2">${(fil.cantidadAgregada == null) ? '0' : fil.cantidadAgregada}</h1>
   //<small class="text-success m-3 fw-semibold"><i class="bx bx-up-arrow-alt" style='font-size:30px'></i></small>
   //`;
 


   cantNoConforme.innerHTML = `<span class="fw-semibold d-block mb-3">No conformes trabajados</span>
   <h1 class="card-title mb-2">${(fil.noconformestrabajados == null)? '0' : fil.noconformestrabajados}</h1>
    <a href='#' class='col-md-12'  data-bs-toggle="modal"
    data-bs-target="#modalScrollable">Ver detalles</a>
   `
   
   cantConformes.innerHTML = `<span class="fw-semibold d-block mb-3">Conformes trabajados</span>
   <h1 class="card-title mb-2">${(fil.conformestrabajados == null)? '0' : fil.noconformestrabajados}</h1>
   <small class="text-warning fw-semibold"><i class="bx bx-up-arrow-alt"></i></small>
   `

  conformespulido.value = fil.cantidadInicio - fil.noconformestrabajados

  })
})





