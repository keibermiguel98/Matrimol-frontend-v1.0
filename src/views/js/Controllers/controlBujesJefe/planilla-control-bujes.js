const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const Swal = require('sweetalert2')

let revisionproducto = document.getElementById('revisionproducto')
let revisionreferencia = document.getElementById('revisionreferencia')
let operadorconformes = document.getElementById('operadorconformes')
let operadornoconformes = document.getElementById('operadornoconformes')
let operadorsi = document.getElementById('operadorsi')
let operadorno = document.getElementById('operadorno')

let idrevision = document.getElementById('idrevision')
let btnRevisar = document.querySelector('.btnRevisar')


let modalid = document.getElementById('modalid')
let modalproducto = document.getElementById('modalproducto')
let modalreferencia = document.getElementById('modalreferencia')
let modalcantidadpendiente = document.getElementById('modalcantidad')
let modalcantidadAdicionada = document.getElementById("modalcantidaAumentar")
let buttonnew = document.querySelector('.btnnuevacantidad')
let validarcantidad = document.querySelector('.validarcantidad')

let codigoCB = document.getElementById('codigoCB')
let siglas = document.getElementById('siglasCB')
let numeroCB = document.getElementById('numeroCB')

//Datos del formulario control de bujes
const idProducto = document.getElementById('idProducto')
const maquinaria = document.getElementById('maquinaria')
const idMaquinaria = document.getElementById('idMaquinaria')
const operador = document.getElementById('operador')
const idOperador = document.getElementById('idOperador')
const cantidadaproximada = document.getElementById('cantidadaproximada')
const horasmaquina = document.getElementById('horasmaquina')
const btnRegister = document.getElementById('btnRegister')
const asigcantidad = document.getElementById('asigcantidad')
const longbuje = document.getElementById('longbuje')
const longrosca = document.getElementById('longrosca')

//Datos para asignar y ocultar
const btnAsignar = document.getElementById('btnAsignar')
const planillaAsignacion = document.getElementById('planillaasignacion')
const btnCancelar = document.getElementById('btnCancelar')

//Datos totales
let cantidadFabricar = document.getElementById('cantFabric')
let cantidadAsignada = document.getElementById('cantidadAsignada')
let cantidadPendiente = document.getElementById('cantidadPendiente')

let referencia = JSON.parse(localStorage.getItem('Referenciaproduccion'))
revisionproducto.value = referencia.descripcion
revisionreferencia.value = referencia.referencia
let usuario = JSON.parse(localStorage.getItem('UserLogin'))
let iduser;
usuario.forEach(user=>{
  iduser = user.id
})

cantidadFabricar.innerHTML = `  
<p>Total a fabricar</p>
<h1>${referencia.totalCantidad * referencia.cantidadComponente}</h1>
 `

btnAsignar.addEventListener('click', (e)=>{
  e.preventDefault()
   planillaAsignacion.classList.remove('d-none')
   btnAsignar.classList.add('d-none')
})

btnCancelar.addEventListener('click', (e)=>{
  e.preventDefault()
  planillaAsignacion.classList.add('d-none')
  btnAsignar.classList.remove('d-none')
})


let myoperadores;
let mymaquinaria;
let myoperadoresbujes;

document.addEventListener('DOMContentLoaded', ()=>{
  //Listar los operadores que esten en la planilla de bujes con esa referencia
   myoperadoresbujes = document.getElementById('myoperadoresbujes')
   myoperadores = document.getElementById('myoperadores')
   mymaquinaria = document.getElementById('mymaquinaria')
   getOperador()
   getMaquinaria()
   getOperadoresBujes()
})

socket.emit('configuracion:controlbujes')
socket.on('configuracion:controlbujes',(datos)=>{
  let dattos = datos.filter(datos=>{return datos})
  if(dattos == ''){
    socket.emit('config:controlbujes')
    socket.on('config:controlbujes',(res)=>{
      res.forEach((respuesta)=>{
        siglas.value = respuesta.siglasControlBujes
        numeroCB.value = respuesta.numeroinitCB
        codigoCB.value = siglas.value
      })
    })
  }else{
    socket.emit('get:ultimabujes')
    socket.on('get:ultimabujes', results=>{
      console.log(results)
      results.forEach(config=>{
        siglas.value = config.siglasCB
        numeroCB.value = parseInt(config.numeroCB) + 1
        codigoCB.value = siglas.value
      })
    })
  }
})

async function getOperadoresBujes(){await socket.emit('get:operadoresbujes')}
async function getOperador(){await socket.emit('get:operadorbujes')}
async function getMaquinaria(){await socket.emit('get:maquinariabujes')}

socket.on('get:operadorbujes', (results)=>{
    let template = '';
  results.forEach((item, index)=>{
    template+= `<tr> 
    <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index + 1}</strong></td>
      <td><strong>${item.alias}</strong></td>
      <td>${item.nombre}</td>
      <td> ${item.apellido} </td>
      <td>
      <input type="button" value='Seleccionar' id="${index}" class="btn btn-primary p-2 btn-select" data-bs-dismiss="modal"
      aria-label="Close">  

     </td>
</tr>`
  });

  myoperadores.innerHTML = template;

  let btnseleccionar = document.querySelectorAll('.btn-select')
  btnseleccionar.forEach((button)=>{
    button.addEventListener('click', getIdOperador)
  })

  function getIdOperador(e){
   e.preventDefault()

   operador.style = ''
   messageOperador.classList.add('d-none')
   id = e.target.id
   let resultado = results[id]
   operador.value = resultado.alias
   idOperador.value = resultado.id
   //console.log(id)
  // socket.emit('get:idoperadorbujes', id)
  let ids={
    idOperador: resultado.id,
    idComponente: referencia.idComponente
  }


  socket.emit('validator:getcontrolbuje', ids )
  socket.on('validator:getcontrolbuje', (valid)=>{
    let validar = valid.filter(valid=>valid.finalizada == 0)
    if(validar == ''){
     operador.style = ''
     messageOperador.classList.add('d-none')
    }else{
     Swal.fire({
       icon: 'error',
       title: 'Lo sentimos!',
       text: `Este operador ya cuenta con este producto asignado!`,
       footer: '<h4>Gracias!</h4>'
     });    
     operador.placeholder = 'Adicione un operador'
     operador.style = 'color:red; border: 1px solid red;'
     operador.value = ''
     idOperador.value = ''
     messageOperador.classList.remove('d-none')
     messageMaquinaria.classList.add('d-none')
    }
  })
  }
})


socket.on('get:maquinariabujes', (results)=>{
    let template = '';
  results.forEach((maqui, index)=>{
    template+= `<tr> 
    <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
      <td>${maqui.descripcion}</td>
      <td>${maqui.alias}</td>
      <td><input type="button" value='Seleccionar' id="${index}" class="btn btn-primary p-2 btn-tomar" data-bs-dismiss="modal"
      aria-label="Close"></td>
    </tr>`
  });

  mymaquinaria.innerHTML = template;

  let btnselect = document.querySelectorAll('.btn-tomar')
  btnselect.forEach((button)=>{
    button.addEventListener('click', getIdMaquinaria)
  })

  function getIdMaquinaria(e){
   e.preventDefault()
   maquinaria.style = 'border: 1px solid blue ;'
   messageMaquinaria.classList.add('d-none')
   id = e.target.id
   let resultado = results[id]
   maquinaria.value = resultado.descripcion
   idMaquinaria.value = resultado.id
   //socket.emit('get:idmaquinariasbujes', id)
  }
})



let product = JSON.parse(localStorage.getItem('Referenciaproduccion'))
    getreference.innerHTML = product.referenciaCompuesto
    idProducto.value = product.idComponente


let totalResultado;
let resultado;
socket.on('get:operadoresbujes', (datos)=>{

  let template = '';
  let local = JSON.parse(localStorage.getItem('Referenciaproduccion'))
  modalproducto.value = local.descripcion
  modalreferencia.value = local.referencia

  let result = datos.filter(datos=> datos.idComponente == local.idComponente)
  let bujesfill = result.filter((buje)=>buje.finalizada == 0)
  resultado = 0;
  bujesfill.map(dato=>resultado+=dato.cantidadAsignada)
  bujesfill.forEach((operadores, index)=>{
    template+= `<tr> 
    <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index + 1}</strong></td>
      <td><strong>${operadores.alias}</strong></td>
      <td>${operadores.nombre}</td>
      <td>${operadores.apellido}</td>
      <td><strong>${operadores.cantidadAsignada}</strong></td>
      <td><strong>${operadores.conformes}</strong></td>
      <td>${(operadores.cantidadAsignada == operadores.conformes)?  "<i class='bx bx-check bx-flashing bx-md text-success'></i>"  : (operadores.proceso == 1)?"<i class='bx bxs-cog bx-spin bx-md'></i>" : "<i class='bx bx-minus bx-md'></i>"}</td>

      <td>
      <input type="button" value='Adicionar cantidad' id="${operadores.idBujes}" class="btn btn-primary p-2 btn-agregar" data-bs-toggle="modal" data-bs-target="#modalAsignar" >  
      <input type="button" value='Revisar' id="${index}" ${(operadores.cantidadAsignada == operadores.conformes)? 'class="btn btn-warning p-2 btn-revisar" data-bs-toggle="modal" data-bs-target="#modalRevisionJefePlanta"': 'class="d-none btn btn-warning p-2 btn-revisar" data-bs-toggle="modal" data-bs-target="#modalRevisionJefePlanta"' } > 
      <input type="button" value='Finalizar' id="${operadores.idBujes}" ${(operadores.revisadoPor < 1)? 'class=" d-none btn btn-danger p-2 btn-finalizar"': 'class="btn btn-danger p-2 btn-finalizar"'} >  
 
     </td>
</tr>`
  });
  myoperadoresbujes.innerHTML = template;

  let buttonAdicionar = document.querySelectorAll('.btn-agregar')
  let buttonRevisar = document.querySelectorAll('.btn-revisar')
  let buttonFinalizar = document.querySelectorAll('.btn-finalizar')

  buttonFinalizar.forEach((button)=>{
    button.addEventListener('click',handleFinalizarTareaBuje)
  })

  buttonAdicionar.forEach((item)=>{
    item.addEventListener('click', handleAdicionarCantidad)
  })

function handleFinalizarTareaBuje(e){
  e.preventDefault()
  let id = e.target.id
  Swal.fire({
    title: 'Se encuentra seguro?',
    text: "Al finalizar este control no podra revertir los cambios!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, finalizar!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Finalizada!',
        'El control de bujes ha sido finalizado con exito.',
        'success'
      )
      socket.emit('finalizar:controlbujes',id)

    }

  })


}

 function handleAdicionarCantidad(e){
  e.preventDefault()
  let id = e.target.id
  modalid.value = id
 }

 buttonRevisar.forEach((btn)=>{
  btn.addEventListener('click', handleRevision)
})

function handleRevision(e){
 let idr = e.target.id
 let resultado = result[idr]
 operadorconformes.value = resultado.conformes - resultado.cantidadRevisada
 operadornoconformes.value = resultado.noConformesReportados - resultado.cantidadNoConformeRevisada
 operadorsi.value = resultado.conformes
 operadorno.value = resultado.noConformesReportados
 idrevision.value = resultado.idBujes
}

cantidadAsignada.innerHTML = `  
<p>Cantidad asignada</p>
<h1>${resultado}</h1>
 `;

 totalResultado = 0;
 totalResultado +=  local.totalCantidad * local.cantidadComponente - resultado

 modalcantidadpendiente.value = totalResultado

 
 cantidadPendiente.innerHTML = `  
 <p>Cantidad pendiente por asignar</p>
 <h1>${totalResultado}</h1>
  `;
})

let messageOperador = document.getElementById('messageOperador')
let messageMaquinaria = document.getElementById('messageMaquinaria')
let messageCantidad = document.getElementById('messageCantidad')

btnRegister.addEventListener('click', (e)=>{
  e.preventDefault()
  if(idOperador.value ==''){
    messageOperador.classList.remove('d-none')
  }else if(idMaquinaria.value == ''){
    messageOperador.classList.add('d-none')
    messageMaquinaria.classList.remove('d-none')
  }else if(asigcantidad.value == '' || asigcantidad.value == 0){
    messageMaquinaria.classList.add('d-none')
    messageCantidad.classList.remove('d-none')
  }else{
    messageCantidad.classList.add('d-none')

          planillaAsignacion.classList.add('d-none')
          btnAsignar.classList.remove('d-none')
            datos = {
            idOperador: idOperador.value,
            codigo: codigoCB.value,
            numeroCB: numeroCB.value,
            siglasCB: siglas.value,
            idMaquinaria: idMaquinaria.value,
            idComponente: idProducto.value,
            longitudbuje: longbuje.value,
            longitudrosca: longrosca.value,
            cantidadAsignada: asigcantidad.value,
            conformes: 0,
            noConformesReportados: 0,
            proceso: 0,
            idUsuario: iduser,
            finalizada: 0,
            cantidadProduccida: 0,
            fecha: new Date
            }
            socket.emit('set:controlbujes',datos)
            handleEliminar()
}
})

function handleEliminar(){
  idOperador.value = ''
  operador.value = ''
  idMaquinaria.value = ''
  maquinaria.value = ''
  idProducto.value = ''
  product.value = ''
  cantidadAsignada.value = ''
  longbuje.value = ''
  longrosca.value = ''
}

asigcantidad.addEventListener('keyup',()=>{
  if(asigcantidad.value == '' || asigcantidad.value == 0){
    asigcantidad.style = 'border:2px solid red; color: red'
    messageCantidad.innerHTML = 'Este campo no puede ser enviado vacio o en "0"'
    btnRegister.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
 else if(asigcantidad.value > totalResultado){
    asigcantidad.style = 'border:2px solid red; color: red'
    messageCantidad.innerHTML = 'La cantidad no puede ser mayor a "Cantidad pendiente por asignar'
    btnRegister.disabled = 'disabled'

    // buttonnew.disabled= 'disabled'
  }else{
    asigcantidad.style = 'border:2px solid green; color:green'
    messageCantidad.innerHTML = ''
    btnRegister.disabled = ''

   // buttonnew.disabled=''
  }
})


modalcantidadAdicionada.addEventListener('keyup',()=>{
  if(modalcantidadAdicionada.value == '' || modalcantidadAdicionada.value == 0){
    modalcantidadAdicionada.style = 'border:2px solid red; color: red'
    validarcantidad.innerHTML = 'Este campo no puede ser enviado vacio o en "0"'
    buttonnew.disabled= 'disabled'

  }
 else if(modalcantidadAdicionada.value > totalResultado){
    modalcantidadAdicionada.style = 'border:2px solid red; color: red'
    validarcantidad.innerHTML = 'La cantidad no puede ser mayor a "Cantidad pendiente por asignar'
    buttonnew.disabled= 'disabled'
  }else{
    modalcantidadAdicionada.style = 'border:2px solid green; color:green'
    validarcantidad.innerHTML = ''
    buttonnew.disabled=''
  }
})

buttonnew.addEventListener('click', (e)=>{
  e.preventDefault()
  let restotal = 0
  socket.emit('get:cantidadesBujes', modalid.value)
  socket.on('get:cantidadesBujes',(results)=>{
    results.forEach((res)=>{
      restotal+= parseInt(res.cantidadAsignada) + parseInt(modalcantidadAdicionada.value)
    })
    let totalsum = {
      id:modalid.value,
      cantidadAgregada: modalcantidadAdicionada.value,
      cantidadAsignada: restotal
    }
    socket.emit('send:cantidadagregadabujes', totalsum)
  })
  console.log(restotal)
})



btnRevisar.addEventListener('click',(e)=>{
  e.preventDefault()
  let revisadoPor;
  usuario.forEach((user)=>{
    revisadoPor = user.nombre + ' ' + user.apellido
  })
  let revision = {
    id: idrevision.value,
    revisadoPor: revisadoPor,
    fechaRevision: new Date(),
    cantidadRevisada: operadorsi.value,
    cantidadNoConformeRevisada: operadorno.value,
  }
  console.log(revision)
  socket.emit('revisar:controlbujes', revision )
 })
