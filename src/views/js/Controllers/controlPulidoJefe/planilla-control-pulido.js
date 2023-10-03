const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const Swal = require('sweetalert2')
const moment = require('moment');
const path = require('path');

//CODIGO CONFIGURACION
let codigoCP = document.getElementById('codigoCP')
let siglas = document.getElementById('siglasCP')
let numeroCP = document.getElementById('numinitCP')

let btnRevisar = document.querySelector('.btnRevisar')
let usoemergente = document.getElementById('usoemergente')
let cantidadsolicitadaentrega = document.getElementById('cantidadsolicitadaentrega')
let especiales = document.querySelector('.especiales')
let comunes = document.querySelector('.comunes')
let validarcantidad = document.querySelector('.validarcantidad')
let buttonnew = document.querySelector('.btnnuevacantidad')
//Datos del formulario control de bujes
let modalid = document.getElementById('modalid')
let modalproducto = document.getElementById('modalproducto')
let modalreferencia = document.getElementById('modalreferencia')
let modalcantidadpendiente = document.getElementById('modalcantidad')
//const producto = document.getElementById('producto')
//const idProducto = document.getElementById('idProducto')
//const maquinaria = document.getElementById('maquinaria')
//const idMaquinaria = document.getElementById('idMaquinaria')
const operador = document.getElementById('operador')
const idOperador = document.getElementById('idOperador')
const btnRegister = document.getElementById('btnRegister')
const cantAsignar = document.getElementById('asigcantidad')
//Datos para asignar y ocultar
const btnAsignar = document.getElementById('btnAsignar')
const planillaAsignacion = document.getElementById('planillaasignacion')
const btnCancelar = document.getElementById('btnCancelar')
//Datos totales
const cantidadFabricar = document.getElementById('cantFabric')
const cantidadAsignada = document.getElementById('cantAsignada')
const cantidadPendiente = document.getElementById('cantPendiente')

let revisionproducto = document.getElementById('revisionproducto')
let revisionreferencia = document.getElementById('revisionreferencia')
let operadorconformes = document.getElementById('operadorconformes')
let operadornoconformes = document.getElementById('operadornoconformes')
let operadorsi = document.getElementById('operadorsi')
let operadorno = document.getElementById('operadorno')

let idrevision = document.getElementById('idrevision')


let iduser;
let usuario = JSON.parse(localStorage.getItem('UserLogin'))
usuario.forEach(usuario=>{
  iduser = usuario.id
})

const titleAisladores = document.getElementById('titleAisladores')
  let reflocal = JSON.parse(localStorage.getItem('Referenciaproduccion'))
  usoemergente.value = reflocal.uso
  titleAisladores.innerHTML = 'Referencia:' +' '+ reflocal.referencia
  revisionproducto.value = reflocal.descripcion
  revisionreferencia.value = reflocal.referencia
  cantidadFabricar.innerHTML = `  
  <p>Cantidad a pulir</p>

<h1>${reflocal.totConformes}</h1>
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
//let mymaquinaria;
//let myproductos;
let myoperadoresaisladores;
let myordendetalladas;
let myordenpendientes;

document.addEventListener('DOMContentLoaded', ()=>{
  //Listar los operadores que esten en la planilla de bujes con esa referencia
   myoperadoresaisladores = document.getElementById('myoperadoresaisladores')
   myoperadores = document.getElementById('myoperadores')
   //mymaquinaria = document.getElementById('mymaquinaria')
   myordendetalladas = document.getElementById('myordendetalladas')
   myordenespeciales = document.getElementById('myordenespeciales') 
   myordenpendientes = document.getElementById('myordenpendientes')
    // myproductos = document.getElementById('myArticles')
     getOperador()
   // getMaquinaria()
   //getOrdenDetalladas()
   // getArticles()
    getOperadoresPulido()
    getOrdenDetalladas()
})
//que participan en el proceso
async function getOperadoresPulido(){await socket.emit('get:operadorespulidoproceso')}
async function getOrdenDetalladas(){await socket.emit('get:ordenesdetalladas')}
//async function getOrdenDetalladas(){await socket.emit('get:ordenesdetalladas')}
//Listar operadores para asignar tareas
async function getOperador(){await socket.emit('get:operadoraislador')}
//async function getMaquinaria(){await socket.emit('get:maquinariaaislador')}
//async function getArticles(){await socket.emit('get:articulosaislador')}
socket.emit('configuracion:controlpulido')
socket.on('configuracion:controlpulido',(datos)=>{
  let dattos = datos.filter(datos=>{return datos})
  if(dattos == ''){
    socket.emit('config:controlpulido')
    socket.on('config:controlpulido',(res)=>{
      res.forEach((respuesta)=>{
        siglas.value = respuesta.siglasControlPulido
        numeroCP.value = respuesta.numeroinitCP
        codigoCP.value = siglas.value
      })
    })
  }else{
    socket.emit('get:ultimapulido')
    socket.on('get:ultimapulido', results=>{
      results.forEach(config=>{
        siglas.value = config.siglasCP
        numeroCP.value = parseInt(config.numeroCP) + 1
        codigoCP.value = siglas.value
      })
    })
  }
})

socket.on('get:operadoresaislador', (results)=>{
    let template = '';
  results.forEach((item, index)=>{
    template+= `<tr> 
    <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index + 1}</strong></td>
      <td>${item.alias}</td>
      <td>${item.nombre}</td>
      <td> ${item.apellido} </td>
      <td>
      <input type="button" value='Seleccionar' id="${index}" class="btn btn-primary p-2 btn-ver" data-bs-dismiss="modal" >  
     </td>
</tr>`
  });

  myoperadores.innerHTML = template;

  let btnseleccionar = document.querySelectorAll('.btn-ver')
  btnseleccionar.forEach((button)=>{
    button.addEventListener('click', getIdOperador)
  })

  function getIdOperador(e){
   e.preventDefault()
   id = e.target.id
   let operarios = results[id]
   operador.value = operarios.alias
     idOperador.value = operarios.id

   let ids={
    idoperador: idOperador.value,
    idProducto: idProduct.idProducto
  }  
  socket.emit('validator:getcontrolpulidooperador', ids )

  //Pendiente por validar mejor
  socket.on('validator:getcontrolpulidooperador', (valid)=>{
    let validar = valid.filter(dato=>dato.finalizada == 0)
     if(validar == ''){
      operador.style = 'border: 1px solid blue ;'
      messageOperador.classList.add('d-none')
     }else{
      Swal.fire({
        icon: 'error',
        title: 'Lo sentimos!',
        text: 'Este operador ya cuenta con este producto asignado!',
        footer: '<h4>Gracias!</h4>'
      });    
      operador.placeholder = 'Adicione un operador'
      operador.style = 'color:red; border: 1px solid red;'
      operador.value = ''
      idOperador.value = ''
      messageOperador.classList.remove('d-none')
     // messageMaquinaria.classList.add('d-none')
     }
   })
   //socket.emit('get:idoperadoraislador', id)
  }
})

//Maquinarias
//socket.on('get:maquinariaaislador', (results)=>{
   // let template = '';
  //results.forEach((maqui, index)=>{
  //  template+= `<tr> 
   // <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
   //   <td>${maqui.descripcion}</td>
    //  <td>${maqui.alias}</td>
    //  <td><input type="button" value='Seleccionar' id="${index}" class="btn btn-primary p-2 btn-tomar" data-bs-dismiss="modal"></td>
   // </tr>`
  //});

  //mymaquinaria.innerHTML = template;

  //let btnselect = document.querySelectorAll('.btn-tomar')
  //btnselect.forEach((button)=>{
   // button.addEventListener('click', getIdMaquinaria)
  //})

  //function getIdMaquinaria(e){
  // e.preventDefault()
  // messageMaquinaria.classList.add('d-none')
  // id = e.target.id
  // let maquinarias = results[id]
  // console.log(maquinarias)
 //  maquinaria.value = maquinarias.descripcion
 //  idMaquinaria.value = maquinarias.id
   //socket.emit('get:idmaquinariasaislador', id)
 // }
//})

//Desactivado
//socket.on('get:articulosaislador', (results)=>{
  //  let template = '';
 // results.forEach((artic, index)=>{
   // template+= `<tr> 
   // <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index + 1}</strong></td>
   //   <td>${artic.referencia}</td>
   //   <td>${artic.descripcion}</td>
   //   <td>
   //   <input type="button" value='Seleccionar' id="${artic.id}" class="btn btn-info p-2 btn-select">  
   //  </td>
//</tr>`
  //});

 // myproductos.innerHTML = template;

  //let btnselectt = document.querySelectorAll('.btn-select')
 // btnselectt.forEach((button)=>{
 //   button.addEventListener('click', getIdProductos)
 // })

  //function getIdProductos(e){
 //  e.preventDefault()
 //  let id = e.target.id
 //  socket.emit('get:idproductosaislador', id)
 // }

  //socket.on('get:idproductosaislador', (product)=>{
  //  product.forEach(product=>{
  //    producto.value = product.referencia + ' - ' + product.descripcion
  //    idProducto.value = product.id
  //  })
 // })
//})
let totalResultado;
let resultado;

socket.on('get:operadorespulidoproceso', (datos)=>{
  let template = '';
  let local = JSON.parse(localStorage.getItem('Referenciaproduccion'))
  modalproducto.value = local.descripcion
  modalreferencia.value = local.referencia
  
  let results = datos.filter(datos=> datos.idProducto == local.idProducto)

  //Sumatoria de la cantidad asignada
  resultado = 0;
  results.map((dato)=>resultado+=dato.cantidadInicio)
 
  results.forEach((operadores, index)=>{
    template+= `<tr> 
    <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index + 1}</strong></td>
      <td>${operadores.alias}</td>
      <td>${operadores.nombre + operadores.apellido}</td>
      <td>${operadores.cantidadInicio}</td>
      <td>${(operadores.conformestrabajados == null)? 0 : operadores.conformestrabajados}</td>
      <td>${(operadores.cantidadInicio == operadores.conformestrabajados || operadores.notificar == 1)?  "<i class='bx bx-check bx-flashing bx-md text-success'></i>"  : (operadores.proceso == 1)?"<i class='bx bxs-cog bx-spin bx-md'></i>" : "<i class='bx bx-minus bx-md'></i>"}</td>
      <td>
      <input type="button" id=${index} class="btn btn-warning p-2 btn-revisar" value="Revisar" data-bs-toggle="modal" data-bs-target="#modalRevisionJefePlanta" >
     </td>
</tr>`
  });
  myoperadoresaisladores.innerHTML = template;
  
  let buttonRevisar = document.querySelectorAll('.btn-revisar')

  buttonRevisar.forEach((btn)=>{
    btn.addEventListener('click', handleRevision)
  })

  function handleRevision(e){
   let idr = e.target.id
   let resultado = results[idr]
   operadorconformes.value = resultado.conformestrabajados - resultado.cantidadRevisada
   operadornoconformes.value = resultado.noconformestrabajados - resultado.cantidadNoConformeRevisada
   operadorsi.value = resultado.conformestrabajados
   operadorno.value = resultado.noconformestrabajados
   idrevision.value = resultado.idPulido
  }

cantidadAsignada.innerHTML = `  
<p>Cantidad asignada</p>
<h1>${resultado}</h1>
 `;

totalResultado = 0;
totalResultado =  reflocal.totConformes - resultado

modalcantidadpendiente.value = totalResultado

cantidadPendiente.innerHTML = `  
<p>Cantidad pendiente por asignar</p>
<h1>${totalResultado}</h1>
 `;
 
  
})

let idProduct = JSON.parse(localStorage.getItem('Referenciaproduccion'))

let messageOperador = document.getElementById('messageOperador')
//let messageMaquinaria = document.getElementById('messageMaquinaria')
let messageCantidad = document.getElementById('messageCantidad')
//Creacion de la planilla de control de aisladores que va hacia el operador
btnRegister.addEventListener('click', (e)=>{
  e.preventDefault()
  if(idOperador.value == ''){
    messageOperador.classList.remove('d-none')
    messageCantidad.classList.add('d-none')

  }else if(asigcantidad.value == '' || asigcantidad.value == 0){
    messageCantidad.classList.remove('d-none')
    messageOperador.classList.add('d-none')

  }else{
      datos = {
        idOperador: idOperador.value,
        codigoPulido: codigoCP.value,
        siglasCP: siglas.value,
        numeroCP: numeroCP.value,
        idProducto: idProduct.idProducto,
        cantidadInicio: cantAsignar.value,
        cantidadFinal: 0,
        conformestrabajados:0,
        noconformestrabajados:0,
        idUsuario:iduser,
        proceso: 0,
        finalizada:0,
        fecha: new Date,
        uso: usoemergente.value
      }
      socket.emit('set:controlpulido',datos)
      planillaAsignacion.classList.add('d-none')
      btnAsignar.classList.remove('d-none')
      idOperador.value = ''
      operador.value = ''
     // idMaquinaria.value = ''
      //maquinaria.value = ''
      cantAsignar.value = ''
    }
})


asigcantidad.addEventListener('keyup',()=>{
  if(asigcantidad.value == '' || asigcantidad.value == 0){
    messageCantidad.classList.remove('d-none')
    asigcantidad.style = 'border:2px solid red; color: red'
    messageCantidad.innerHTML = 'Este campo no puede estar vacio o en "0"'
    btnRegister.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
 else if(asigcantidad.value > totalResultado){
    asigcantidad.style = 'border:2px solid red; color: red'
    messageCantidad.classList.remove('d-none')

    messageCantidad.innerHTML = 'La cantidad no puede ser mayor a "Cantidad pendiente por asignar"'
    btnRegister.disabled = 'disabled'

    // buttonnew.disabled= 'disabled'
  }else{
    asigcantidad.style = 'border:2px solid green; color:green'
    messageCantidad.innerHTML = ''
    btnRegister.disabled = ''

   // buttonnew.disabled=''
  }
})



buttonnew.addEventListener('click', (e)=>{
  e.preventDefault()
  let restotal = 0
  socket.emit('get:cantidadesAisladores', modalid.value)
  socket.on('get:cantidadesAisladores',(results)=>{
    results.forEach((res)=>{
      restotal+= parseInt(res.cantidadAsignada) + parseInt(modalcantidadAdicionada.value)
    })
    let totalsum = {
      id:modalid.value,
      cantidadAgregada: modalcantidadAdicionada.value,
      cantidadAsignada: restotal
    }
    console.log(totalsum)
    socket.emit('send:cantidadagregada', totalsum)
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
    cantidadNoConformeRevisada: operadorno.value
  }
  socket.emit('revisar:controlPulido', revision )
  console.log(revision)
 })

let buttonespecial = document.getElementById('buttonespecial')
let buttoncomun = document.getElementById('buttoncomun')

buttonespecial.addEventListener('click',(e)=>{
 e.preventDefault()
 buttonespecial.classList.add('active')
 buttoncomun.classList.remove('active')
 comunes.classList.add('d-none')
 especiales.classList.remove('d-none')
})

buttoncomun.addEventListener('click',(e)=>{
 e.preventDefault()
 buttoncomun.classList.add('active')
 buttonespecial.classList.remove('active')
 comunes.classList.remove('d-none')
 especiales.classList.add('d-none')
})

socket.on('get:ordenesdetalladas',(results)=>{
  console.log(results)
  let template = ''
  let valor= results.filter(res=>res.idProducto == idProduct.idProducto && res.status == 'En proceso' && res.tipo == 1 && res.uso == usoemergente.value)
  valor.forEach((results,index)=>{
    cantidadsolicitadaentrega.value = results.cantidadCambiariaEntregasJefe
     template+= `<tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index + 1}</strong></td>
       <td class="text-danger">${results.codigoOrden}</td>
       <td style='color:blue'>${results.nombre}</td>
       <td><strong>${results.cantidad}</strong></td>
       <td>${results.programadoPor}</td>
       <td>${(results.entregada == 1)? '<span class="badge rounded-pill bg-success p-2">Entregada</span>' : '<span class="badge rounded-pill bg-info p-2">Pendiente</span>' }</td>
       <td><strong>${moment(results.fechaEntregaProgramada).utc().format('DD/MM/YY')}</strong></td>
 </tr>`
  })
  myordendetalladas.innerHTML = template

 })


 socket.on('get:ordenesdetalladas',(results)=>{
  let template = ''
  let valor= results.filter(res=>res.idProducto == idProduct.idProducto && res.status == 'En proceso' && res.tipo == 0 && res.uso == usoemergente.value)
  valor.forEach((results,index)=>{
     template+= `<tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index + 1}</strong></td>
       <td class="text-danger">${results.codigoOrden}</td>
       <td style='color:blue'>${results.nombre}</td>
       <td><strong>${results.cantidad}</strong></td>
       <td>${results.programadoPor}</td>
       <td><strong>${moment(results.fecha).utc().format('DD/MM/YY')}</strong></td>
       <td>
      </td>
 </tr>`
  })
  myordenespeciales.innerHTML = template
 })
 
 let idordenproduccion = document.getElementById('idordenproduccion')
 let codigoordenproduccion = document.getElementById('codigoordenproduccion')
 let clienteentrega = document.getElementById('clienteentrega')
 let productoentrega = document.getElementById('productoentrega')
 let referenceentrega = document.getElementById('referenceentrega')
 let cantidadentregarentrega = document.getElementById('cantidadentregarentrega')
 let observacionentrega = document.getElementById('observacionentrega')
 let btnRealizarEntrega = document.getElementById('btnRealizarEntrega')
 let siglasOrden = document.getElementById('siglasOrden')
 let codigoOrdenEntrega = document.getElementById('codigoOrdenEntrega')
 let numeroEntrega = document.getElementById('numeroEntrega')




///CREACION ORDEN ENTREGA JEFE PLANTA
btnRealizarEntrega.addEventListener('click',(e)=>{
  e.preventDefault()
  let createOrdenEntrega = {
    codigordentrega: codigoOrdenEntrega.value,
    siglasOrdenEntrega: siglasOrden.value,
    numeroentrega: numeroEntrega.value,
    cliente: clienteentrega.value,
    idordenproduccion:idordenproduccion.value,
    idUsuario: usuario.id
}
 
socket.emit('create:ordenentregaplanta', createOrdenEntrega)
socket.on('create:ordenentregaplanta',(orden)=>{
  let createDetalleOrden = {
    producto: productoentrega.value,
    referencia: referenceentrega.value,
    idordenentrega: orden.insertId,
    cantidadEntregada: cantidadentregarentrega.value,
    cantidadPendiente: cantidadsolicitadaentrega.value - cantidadentregarentrega.value,
    observacionentrega: observacionentrega.value
   }
   let cantidad = {cantidadCambiariaEntregasJefe: cantidadsolicitadaentrega.value - cantidadentregarentrega.value, id:idordenproduccion.value}
   socket.emit('createDetalleCompleto', createDetalleOrden)
   socket.emit('update:cantidadordenentrega', cantidad)
})
})
//////////////////////////////////////////////////////////////////////////////////////////////////
socket.on('get:ordenesdetalladas',(results)=>{
  let template = ''
  let valor= results.filter(res=>res.idProducto == idProduct.idProducto && res.status == 'En proceso' && res.tipo == 1 && res.uso == usoemergente.value)
  let resultado = 0
  valor.forEach((results,index)=>{
    resultado+= results.cantidad - results.cantidadCambiariaEntregasJefe
    cantidadsolicitadaentrega.value = results.cantidadCambiariaEntregasJefe
     template+= `<tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index + 1}</strong></td>
       <td class="text-danger">${results.codigoOrden}</td>
       <td style='color:blue'>${results.nombre}</td>
       <td><strong>${results.cantidad}</strong></td>
       <td><strong>${resultado}</strong></td>
       <td><strong>${results.cantidadCambiariaEntregasJefe}</strong></td>
       <td><strong>${moment(results.fechaEntregaProgramada).utc().format('DD/MM/YY')}</strong></td>
       <td>
       <a href='#' class='btn btn-warning buttonentregar' id=${index} data-bs-toggle="modal" data-bs-target="#Entregas">Entregar</a>
      </td>
 </tr>`
  })
  myordenpendientes.innerHTML = template

  let buttonentregar = document.querySelectorAll('.buttonentregar')
  buttonentregar.forEach((button)=>{
    button.addEventListener('click', handleEntregarProducto)
  })

  function handleEntregarProducto(e){
    e.preventDefault()
    let id = e.target.id
    let entrega = valor[id]

idordenproduccion.value = entrega.idOrdenProduccion
codigoordenproduccion.value = entrega.codigoOrden
clienteentrega.value = entrega.nombre
referenceentrega.value = reflocal.referencia
productoentrega.value = reflocal.descripcion
cantidadsolicitadaentrega.value = entrega.cantidadCambiariaEntregasJefe
  }
 })


 