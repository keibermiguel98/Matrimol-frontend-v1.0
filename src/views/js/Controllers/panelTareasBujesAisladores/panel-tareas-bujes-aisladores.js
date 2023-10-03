const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const moment = require('moment'); 
const Swal = require('sweetalert2');
const path = require('path');
let rutaPulido = path.join(__dirname, 'pages-control-pulido-operador.html')
let rutaAisladores = path.join(__dirname,'pages-control-aisladores-operador.html')
let rutaBujes = path.join(__dirname, 'pages-control-bujes-operador.html')



///Tareas que van en el panel del operador donde se reflejaran losbujes y aisladores

let mytareasaisladores = document.getElementById('mytareasaisladores')
let mytareasbujes = document.getElementById('mytareasbujes')
let mytareaspulido = document.getElementById('mytareaspulido')

let tablepulido = document.querySelector('.table-pulido')
let tablebuje = document.querySelector('.table-bujes')
let tableaislador = document.querySelector('.table-aislador')



document.addEventListener('DOMContentLoaded', ()=>{
  emitirIdConsulta()
})

async function emitirIdConsulta(){
   await socket.emit('get:operadorescontroles')  
}

socket.on('get:operadorescontroles', (datos)=>{
  let template ="";
  let id = JSON.parse(localStorage.getItem('idoperador'))
  let datosoperador = datos.filter(dato=> dato.idOperador == id.id && dato.finalizada == 0)
  if(datosoperador.length > 0){tablebuje.classList.remove('d-none')}
  else{tablebuje.classList.add('d-none')}
    datosoperador.forEach((control, index)=>{ 
    template+=`
       <tr> 
         <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
           <td><strong>${control.referenciaCompuesto}</strong></td>
           <td><strong>${control.descripcion}</strong></td>
           <td><strong> ${control.cantidadAsignada}</stron></td>
           <td><strong>${moment(control.fecha).utc().format('DD/MM/YYYY')}</strong></td>
           <td>
           ${(control.proceso == 1)? `<input type='button' value='Continuar' id='${index}' class='btn btn-info p-2 btn-continue-bujes'>` : `<input type='button' value='Iniciar' id='${index}' class='btn btn-success p-2 btn-fabricar-bujes'>`}
          </td>
     </tr>
     `;
    })

    mytareasbujes.innerHTML = template
    let buttonfabricarbujes = document.querySelectorAll('.btn-fabricar-bujes')
    let buttoncontinuebujes = document.querySelectorAll('.btn-continue-bujes')

    buttoncontinuebujes.forEach(buttoncontinue=>{
      buttoncontinue.addEventListener('click',getContinueBujes)
    })
    function getContinueBujes(e){
      e.preventDefault()
    
      let id = e.target.id
      let datosReales = datosoperador[id]
      localStorage.setItem('datatareabuje',JSON.stringify(datosReales))
      setTimeout(()=>{
       window.location.pathname = rutaBujes
        }, 300)  
    }

    buttonfabricarbujes.forEach(button=>{
      button.addEventListener('click', buttonFabricarBujes)
    })

    function buttonFabricarBujes(e){
      e.preventDefault()
      Swal.fire({
        title: 'Seguro que desea iniciar?',
        text: "Al iniciar se ingresara la fecha y hora de inicio en el sistema!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, iniciar!'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire(
            'Perfecto!',
            'Has iniciado tu tarea, apartir de ahora tu fecha de inicio ha sido ingresada',
            'success'
          )

          let id = e.target.id
          let datosReales = datosoperador[id]
          let idBuje = datosReales.idBuje
          let hora = new Date()
      
          let datosBujes = {
            id: idBuje,
            fechaInicio: new Date(),
            horainicio: hora.getHours() +':'+ hora.getMinutes(), 
            proceso: 1
          }
          socket.emit('update:procesobujes', datosBujes)

          setTimeout(()=>{
           window.location.pathname = rutaBujes
          }, 300)
          localStorage.setItem('datatareabuje',JSON.stringify(datosReales))
        }
      })
     
     
   } 
})

socket.on('get:controlaisladores', (results)=>{
  let plantilla ="";

  let id = JSON.parse(localStorage.getItem('idoperador'))
  let datosoperador = results.filter(dato=> dato.idOperador == id.id && dato.finalizada == 0)
  if(datosoperador.length > 0){tableaislador.classList.remove('d-none')}
  else{tableaislador.classList.add('d-none')}
 datosoperador.forEach((control,index)=>{
 plantilla+=`
   <tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
       <td><strong>${control.referencia}</strong></td>
       <td><strong>${control.uso}</strong></td>
       <td><strong> ${control.descripcion}</stron></td>
       <td><strong> ${control.cantidadAsignada}</stron></td>
       <td><strong>${moment(control.fecha).utc().format('DD/MM/YYYY')}</strong></td>
       <td>
       ${(control.proceso == 1)? `<input type='button' value='Continuar' id='${index}' class='btn btn-info p-2 btn-continue'>` : ` <input type='button' value='Iniciar' id='${index}' class='btn btn-success p-2 btn-fabricaraisladores'>`}
      </td>
 </tr>
 `;
})

mytareasaisladores.innerHTML = plantilla

let btnFabricaraisladores = document.querySelectorAll('.btn-fabricaraisladores')
let buttoncontinuar = document.querySelectorAll('.btn-continue')

btnFabricaraisladores.forEach(button=>{
  button.addEventListener('click', getIdPlanillaAisladores)
})

buttoncontinuar.forEach(buttoncontinue=>{
  buttoncontinue.addEventListener('click',getContinue)
})
function getContinue(e){
  e.preventDefault()

  let id = e.target.id
  let datosReales = datosoperador[id]
  localStorage.setItem('datatareabuje',JSON.stringify(datosReales))
  setTimeout(()=>{
    window.location.pathname = rutaAisladores
    }, 300)  
}

function getIdPlanillaAisladores(e){
 e.preventDefault()

 Swal.fire({
  title: 'Seguro que desea iniciar?',
  text: "Al iniciar se ingresara la fecha y hora de inicio en el sistema!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, iniciar!'
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire(
      'Perfecto!',
      'Has iniciado tu tarea, apartir de ahora tu fecha de inicio ha sido ingresada',
      'success'
    )
    let id = e.target.id
    let datosReales = datosoperador[id]
    let idAislador = datosReales.idAislador
    let hora = new Date()

    let datosaislador = {
      id: idAislador,
      fechaInicio: new Date(),
      horainicio: hora.getHours() +':'+ hora.getMinutes(), 
      proceso: 1
    }
    socket.emit('update:procesoaislador', datosaislador)

     setTimeout(()=>{
     window.location.pathname = rutaAisladores
     }, 300)
      localStorage.setItem('datatareabuje',JSON.stringify(datosReales))
  }
})
}
})

socket.on('get:operadorpulido', (results)=>{
  let pulido = "";
  let id = JSON.parse(localStorage.getItem('idoperador'))
  let datosoperadorpulido = results.filter(dato=> dato.idOperador == id.id && dato.finalizada == 0)
  if(results.length>0){tablepulido.classList.remove('d-none')}
  else{tablepulido.classList.add('d-none')}
 datosoperadorpulido.forEach((control,index)=>{
 pulido+=`
   <tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
       <td><strong>${control.referencia}</strong></td>
       <td><strong>N/A</strong></td>

       <td><strong> ${control.cantidadInicio}</stron></td>
       <td><strong>${moment(control.fecha).utc().format('DD/MM/YYYY')}</strong></td>
       <td>
       ${(control.proceso == 1)? `<input type='button' value='Continuar' id='${index}' class='btn btn-info p-2 btn-continue-pulido'>` : ` <input type='button' value='Iniciar' id='${index}' class='btn btn-success p-2 btn-fabricarpulido'>`}
      </td>
 </tr>
 `;
})

mytareaspulido.innerHTML = pulido

let btnFabricarpulido = document.querySelectorAll('.btn-fabricarpulido')
let buttoncontinuarpulido = document.querySelectorAll('.btn-continue-pulido')

btnFabricarpulido.forEach(button=>{
  button.addEventListener('click', getIdPlanillaPulido)
})

buttoncontinuarpulido.forEach(buttoncontinue=>{
  buttoncontinue.addEventListener('click',getContinuePulido)
})
function getContinuePulido(e){
  e.preventDefault()

  let id = e.target.id
  let datosRealesPulido = datosoperadorpulido[id]
  localStorage.setItem('datatareabuje',JSON.stringify(datosRealesPulido))
  setTimeout(()=>{
    window.location.pathname = rutaPulido
    }, 300)  
}

function getIdPlanillaPulido(e){
 e.preventDefault()

 Swal.fire({
  title: 'Seguro que desea iniciar?',
  text: "Al iniciar se ingresara la fecha y hora de inicio en el sistema!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, iniciar!'
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire(
      'Perfecto!',
      'Has iniciado tu tarea, apartir de ahora tu fecha de inicio ha sido ingresada',
      'success'
    )
   

    let id = e.target.id
    let datosReales = datosoperadorpulido[id]
    let idPulido = datosReales.idPulido
    let hora = new Date()

    let datospulido = {
      id: idPulido,
      fechaInicio: new Date(),
      horainicio: hora.getHours() +':'+ hora.getMinutes(), 
      proceso: 1
    }
    socket.emit('update:procesopulido', datospulido)

    setTimeout(()=>{
      window.location.pathname =rutaPulido
      }, 300)
       localStorage.setItem('datatareabuje',JSON.stringify(datosReales))

  
  }
})
}
})