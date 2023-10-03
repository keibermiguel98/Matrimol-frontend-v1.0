const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const moment = require('moment');
const path = require('path');
const sound = new Audio();
let rutaAbsolutasalir = path.join(__dirname, 'index.html')


let inputMaquinaria = document.getElementById('maquinaria')
let inputReferencia = document.getElementById('referencia')
let inputidcontrolbujes = document.getElementById('idcontrolbujes')

let nameoperador = document.getElementById('nameoperador')

let idoperador = JSON.parse(localStorage.getItem('trabajo-operador'))
nameoperador.innerHTML = idoperador.nombreOperador +' '+ idoperador.apellidoOperador +' / '+ idoperador.aliasOperarios



document.addEventListener('DOMContentLoaded',()=>{
    getControlProduccionBujes()
})

async function getControlProduccionBujes(){await socket.emit('get:controlproduccionbujestotales')}


 
let datos = JSON.parse(localStorage.getItem('trabajo-operador'))
inputidcontrolbujes.value = datos.idBuje
let horas = new Date()

inputReferencia.value = datos.referenciaCompuesto
inputMaquinaria.value = datos.descripcion
inputidcontrolbujes.value = datos.idBuje



let mycontrolbujes;
document.addEventListener('DOMContentLoaded', ()=>{
 mycontrolbujes = document.getElementById('mycontrolbujes')
 getDetalleControlBujes()
})

async function getDetalleControlBujes(){
    await socket.emit('get:detallescontrolbujes')
}

socket.on('get:detallescontrolbujes', (results)=>{
  let resultado = results.filter(dato=> dato.idcontrolbujes == inputidcontrolbujes.value )
    let template = '';
     resultado.forEach((detalle,index)=>{
     template+=`<tr>
      <td>${index + 1}</td>
      <td><strong>${moment(detalle.fecha).utc().format('DD/MM/YYYY')}</strong></td>
      <td><strong>${moment(detalle.hora, 'HH:mm').format('h:mm A')}</strong></td>
      <td>${(detalle.cantidadConformes == '' || detalle.cantidadConformes == 0) ? '' : detalle.cantidadConformes}</td>
      <td class='text-primary'><strong>${detalle.longitudBuje}</strong></td>
      <td class='text-primary'><strong>${detalle.longitudRoscaMM}</strong></td>
      <td>${(detalle.perforados == '' || detalle.perforados == 0) ? '' : detalle.perforados}</td>
      <td>${(detalle.descentrados == '' || detalle.descentrados == 0) ? '' : detalle.descentrados}</td>
      <td>${(detalle.longitudRosca == '' || detalle.longitudRosca == 0) ? '' : detalle.longitudRosca}</td>
      <td>${(detalle.roscaEquivocada == '' || detalle.roscaEquivocada == 0) ? '' : detalle.roscaEquivocada}</td>
      <td>${(detalle.herramientaPartidaBuje == '' || detalle.herramientaPartidaBuje == 0) ? '' : detalle.herramientaPartidaBuje}</td>
     </tr>`; 

      })

      mycontrolbujes.innerHTML= template
})

let cantInicial = document.getElementById('cantInicial')
let cantAgregada = document.getElementById('cantAgregada')
let cantConforme = document.getElementById('cantConforme')
let cantNoConforme = document.getElementById('cantNoConforme')
let totalProducido = document.getElementById('totProducido')
let cantidadPendiente = document.getElementById('cantPen')

let pen;
socket.on('get:controlproduccionbujestotales',(datos)=>{
     pen = 0
     let fillbujes = datos.filter(fil=>fil.id == inputidcontrolbujes.value)

    fillbujes.forEach(fill=>{
   cantInicial.innerHTML = `
   <span class="fw-semibold d-block mb-3">Cantid inicial</span>
   <h1 class="card-title mb-2">${fill.cantidadAsignada}</h1>
   <small class="text-warning fw-semibold" style='font-size:20px;'><i class="bx bx-up-arrow-alt" ></i>${fill.cantidadAsignada - fill.cantidadAgregada}</small>
   `;

   cantAgregada.innerHTML = `
   <span class="fw-semibold d-block mb-3">Cantidad Agregada</span>
   <h1 class="card-title mb-2">${(fill.cantidadAgregada == null)? '0' : fill.cantidadAgregada}</h1>
   <small class="text-success m-3 fw-semibold"><i class="bx bx-up-arrow-alt"></i></small>
   `

   cantConforme.innerHTML = `
   <span class="fw-semibold d-block mb-3">Conformes</span>
   <h1 class="card-title mb-2">${fill.conformes}</h1>
   
   <small class="text-warning fw-semibold"><i class="bx bx-up-arrow-alt"></i></small>
   `

   cantNoConforme.innerHTML = `
   <span class="fw-semibold d-block mb-3">No conformes</span>
   <h1 class="card-title mb-2">${fill.noConformesReportados}</h1>
   <small class="text-success m-3 fw-semibold"><i class="bx bx-up-arrow-alt"></i></small>
   `
   totalProducido.innerHTML = `
   <p>Total Produccidos</p>
   <h1>${fill.cantidadProduccida}</h1>
   `

   cantidadPendiente.innerHTML = `
   <p>Pendientes por fabricar</p>
   <h1>${fill.cantidadAsignada - fill.conformes}</h1>
   `
    pen+= fill.cantidadAsignada - fill.conformes


    })
})



