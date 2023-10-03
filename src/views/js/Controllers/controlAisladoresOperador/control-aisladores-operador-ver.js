const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const moment = require('moment');

let inputMaquinaria = document.getElementById('maquinaria')
let inputReferencia = document.getElementById('referencia')
let inputidcontrolaisladores = document.getElementById('idcontrolaisladores')

//Totalidades//
let cantConformes = document.getElementById('cantConforme')
let cantNoConforme = document.getElementById('cantNoConforme')
let totProducido = document.getElementById('totProducido')
let cantPendiente = document.querySelector('.cantPendiente')


 
let datos = JSON.parse(localStorage.getItem('trabajo-operador'))
let idoperador = JSON.parse(localStorage.getItem('idoperador'))

inputReferencia.value = datos.referencia
inputMaquinaria.value = datos.descripcion
inputidcontrolaisladores.value = datos.idAislador



let nameoperador = document.getElementById('nameoperador')
nameoperador.innerHTML = datos.nombreOperador + ' ' + datos.apellidoOperador + ' / ' + datos.aliasOperarios


let mycontrolAisladores;
document.addEventListener('DOMContentLoaded', ()=>{
 
 mycontrolAisladores = document.getElementById('mycontrolaisladores')
  handleemitcontrolaisladores()
  getDetalleControlAisladores()
 // getControlAisladores()
})

async function getDetalleControlAisladores(){
    await socket.emit('get:detallescontrolaisladores')
}


async function handleemitcontrolaisladores(){
  await socket.emit('get:operadorescontroles')
}




socket.on('get:detallescontrolaisladores', (results)=>{
  let resultado = results.filter(dato=> dato.idcontrolaisladores == inputidcontrolaisladores.value )
    let template = '';
     resultado.forEach((detalle,index)=>{
     template+=`<tr>
      <td>${index + 1}</td>
      <td><strong>${moment(detalle.fecha).utc().format('DD/MM/YYYY')}</strong></td>
      <td><strong>${moment(detalle.hora, 'HH:mm').format('h:mm A')}</strong></td>

      <td>${(detalle.conformes == null) ? '' : detalle.conformes}</td>
      <td>${(detalle.lineasFlujo == null) ? '' : detalle.lineasFlujo}</td>
      <td>${(detalle.chupados == null) ? '' : detalle.chupados}</td>
      <td>${(detalle.escurrido == null) ? '': detalle.escurrido}</td>
      <td>${(detalle.burbujas == null) ? '': detalle.burbujas}</td>
      <td>${(detalle.rotura == null) ? '': detalle.rotura}</td>
      <td>${(detalle.bujes == null) ? '': detalle.bujes}</td>
      <td>${(detalle.incompleto==null)? '': detalle.incompleto}</td>
     </tr>`; 
      })
      mycontrolAisladores.innerHTML= template


})

let cantInicial = document.getElementById('cantInicial')
let cantAgregada = document.getElementById('cantAgregada')

let result;
let pen;

socket.on('get:controlaisladores', (results)=>{
 let fillaislador = results.filter(fil=>fil.idAislador == inputidcontrolaisladores.value)
 result=0;
 pen=0
 fillaislador.map((item)=>{
  result+= item.cantidadAsignada - item.cantidadAgregada
 })
 
 fillaislador.forEach(fil=>{

   cantInicial.innerHTML = `
   <span class="fw-semibold d-block mb-3">Cantid inicial</span>
   <h1 class="card-title mb-2">${fil.cantidadAsignada}</h1>
   <small class="text-warning fw-semibold" style='font-size:20px;'><i class="bx bx-up-arrow-alt" ></i>${result}</small>
   `;
   cantAgregada.innerHTML = `
   <span class="fw-semibold d-block mb-3">Cantidad Agregada</span>
   <h1 class="card-title mb-2">${(fil.cantidadAgregada == null) ? '0' : fil.cantidadAgregada}</h1>
   <small class="text-success m-3 fw-semibold"><i class="bx bx-up-arrow-alt" style='font-size:30px'></i></small>
   `;
 
   pen+=fil.cantidadAsignada - fil.totalProducido
 

   cantPendiente.innerHTML = `
   <p>Pendientes por fabricar</p>
   <h1>${pen}</h1>`

   cantNoConforme.innerHTML = `<span class="fw-semibold d-block mb-3">No conformes</span>
   <h1 class="card-title mb-2">${fil.noConformesReport}</h1>
    <a href='#' class='col-md-12'  data-bs-toggle="modal"
    data-bs-target="#modalScrollable">Ver detalles</a>
   `
   
   cantConformes.innerHTML = `<span class="fw-semibold d-block mb-3">Conformes</span>
   <h1 class="card-title mb-2">${fil.conformes}</h1>
   <small class="text-warning fw-semibold"><i class="bx bx-up-arrow-alt"></i></small>
   `

   totProducido.innerHTML = `
   <p>Total Produccidos</p>
   <h1>${fil.totalProducido}</h1>`

})
})
