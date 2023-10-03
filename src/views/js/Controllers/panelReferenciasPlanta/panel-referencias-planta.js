//PANEL DONDE SE MOSTRARAN LAS REFERENCIAS AL JEFE DE PLANTA
const path = require('path');
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const rutaAisladores = path.join(__dirname, 'pages-planilla-jefe-aisladores.html')
const rutaPulido = path.join(__dirname, 'pages-planilla-jefe-pulido.html')
const rutaBujes = path.join(__dirname, 'pages-planilla-jefe-bujes.html')

let panel = document.getElementById('mycontrol')
let mypulido = document.getElementById('mypulido')
let mybuje = document.getElementById('mybuje')

let btnAisladores = document.getElementById('btnAisladores')
let btnBujes = document.getElementById('btnBujes')
let btnPulido = document.getElementById('btnPulido')

btnAisladores.addEventListener('click', (e)=>{
  e.preventDefault()
  btnAisladores.classList.add('active')
  panel.classList.remove('d-none')
  mypulido.classList.add('d-none')
  mybuje.classList.add('d-none')

  btnBujes.classList.remove('active')
  btnPulido.classList.remove('active')
})

btnBujes.addEventListener('click', (e)=>{
  e.preventDefault()
  btnBujes.classList.add('active')
  btnAisladores.classList.remove('active')
  btnPulido.classList.remove('active')

  panel.classList.add('d-none')
  mypulido.classList.add('d-none')
  mybuje.classList.remove('d-none')
})

btnPulido.addEventListener('click', (e)=>{
  e.preventDefault()
  btnBujes.classList.remove('active')
  btnAisladores.classList.remove('active')
  btnPulido.classList.add('active')

  panel.classList.add('d-none')
  mypulido.classList.remove('d-none')
  mybuje.classList.add('d-none')
})

document.addEventListener('DOMContentLoaded', ()=>{
  getReferenciasPanel()
  getReferenciaAisladorPulido()
  getBujeTotales()
})


async function getReferenciaAisladorPulido(){
  await socket.emit('get:aisladorpulido')
}

async function getReferenciasPanel(){
   await socket.emit('get:referenciaspanel')
}

async function getBujeTotales(){
  await socket.emit('get:bujecantidadtotales')
}


socket.on('get:referenciaspanel', (results)=>{
   let resultado = results.filter(orden=> orden.status == 'En proceso')
    let template=''
    resultado.forEach((total, index)=>{
    template+=`<div class="col-md-6 col-lg-3 col-sm-6 mb-3">
    <div class="card text-center shadow">
      <div class="card-header"><h4>${total.descripcion}</h4></div>
      <div class="card-body">
         <h6>Referencia</h6>
        <h5 class="card-title"><h2>${total.referencia}</h2></h5>
        <p class="card-text">Cantidad : ${total.totalCantidad}</p>
        <h4 class="card-text">${total.uso}</h4>

        <input type='button' class="btn btn-primary btnGetIdAisladores" id='${index}' value='Control de produccion'></input>
      </div>
    </div>
  </div>`;
    })

  panel.innerHTML = template 

  let buttonAisladores = document.querySelectorAll('.btnGetIdAisladores')

  buttonAisladores.forEach(button=> button.addEventListener('click', getIdReferenceAisladores))

  function getIdReferenceAisladores(e){
     let index = e.target.id
     localStorage.setItem('Referenciaproduccion', JSON.stringify(resultado[index]))
        location.pathname = rutaAisladores
     //  }

   
  }
})


socket.on('get:aisladorpulido', (results)=>{
  let resultado = results.filter(orden=> orden.finalizada == 0)
    let template=''
    resultado.forEach((total, index)=>{
    template+=`<div class="col-md-6 col-lg-3 col-sm-6 mb-3">
    <div class="card text-center shadow">
      <div class="card-header"><h4>${total.descripcion}</h4></div>
      <div class="card-body">
         <h6>Referencia</h6>
        <h5 class="card-title"><h2>${total.referencia}</h2></h5>
        <p class="card-text">Conformes: ${total.totConformes}</p>
        <h4 class="card-text">${total.uso}</h4>

        <input type='button' class="btn btn-warning btnGetIdPulido" id='${index}' value='Control de pulido'></input>
      </div>
    </div>
  </div>`;
    })

  mypulido.innerHTML = template 

  let buttonPulido = document.querySelectorAll('.btnGetIdPulido')

  buttonPulido.forEach(button=> button.addEventListener('click', getIdReference))

  function getIdReference(e){
     let index = e.target.id
     localStorage.setItem('Referenciaproduccion', JSON.stringify(resultado[index]))
    location.pathname = rutaPulido
    // let result = JSON.parse(localStorage.getItem('Referenciaproduccion'))
    //  console.log(result.descripcion)
  }
})

socket.on('get:bujecantidadtotales', (results)=>{
   let resultado = results.filter(orden=> orden.status == 'En proceso')
    let template=''
    results.forEach((total, index)=>{
    template+=`<div class="col-md-6 col-lg-3 col-sm-6 mb-3">
    <div class="card text-center shadow">
      <div class="card-header"><h4>${total.nombreCompuesto}</h4></div>
      <div class="card-body">
         <h6>Referencia</h6>
        <h5 class="card-title"><h2>${total.referenciaCompuesto}</h2></h5>
        <p class="card-text">Cantidad : ${total.totalCompuestos * total.totalCantidad}</p>
       
        <input type='button' class="btn btn-success btnGetId" id='${index}' value='Control de produccion'></input>
      </div>
    </div>
  </div>`;
  //<p class="card-text">${total.uso}</p>
    })

  mybuje.innerHTML = template 

  let button = document.querySelectorAll('.btnGetId')

  button.forEach(button=> button.addEventListener('click', getIdReferenciaBujes))

  function getIdReferenciaBujes(e){
     let index = e.target.id
     localStorage.setItem('Referenciaproduccion', JSON.stringify(resultado[index]))

    // let result = JSON.parse(localStorage.getItem('Referenciaproduccion'))
  //    console.log(result.descripcion)
    //  if(result.descripcion.trim().includes('Aislador')){
       location.pathname = rutaBujes
     // }
  }
})

