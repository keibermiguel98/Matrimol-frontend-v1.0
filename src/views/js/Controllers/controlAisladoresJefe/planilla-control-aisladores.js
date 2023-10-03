const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const Swal = require('sweetalert2')
const moment = require('moment')
const path = require('path')
let rutaAbsoluta = path.join(__dirname, 'orden-produccion-controles-add.html')
let rutaPanelProduccion = path.join(__dirname, 'PanelJefePlanta.html')

//CODIGO CONFIGURACION
let codigoCA = document.getElementById('codigoCA')
let siglas = document.getElementById('siglasCA')
let numeroCA = document.getElementById('numeroCA')

let especiales = document.querySelector('.especiales')
let comunes = document.querySelector('.comunes')

let validarcantidad = document.querySelector('.validarcantidad')
let buttonnew = document.querySelector('.btnnuevacantidad')
let usoemergente = document.getElementById('usoemergente')

let revisionproducto = document.getElementById('revisionproducto')
let revisionreferencia = document.getElementById('revisionreferencia')
let operadorconformes = document.getElementById('operadorconformes')
let operadornoconformes = document.getElementById('operadornoconformes')
let operadorsi = document.getElementById('operadorsi')
let operadorno = document.getElementById('operadorno')

let idrevision = document.getElementById('idrevision')
let btnRevisar = document.querySelector('.btnRevisar')


//Datos del formulario control de bujes
let modalid = document.getElementById('modalid')
let modalproducto = document.getElementById('modalproducto')
let modalreferencia = document.getElementById('modalreferencia')
let modalcantidadpendiente = document.getElementById('modalcantidad')
let modalcantidadAdicionada = document.getElementById("modalcantidaAumentar")

//const producto = document.getElementById('producto')
//const idProducto = document.getElementById('idProducto')
const maquinaria = document.getElementById('maquinaria')
const idMaquinaria = document.getElementById('idMaquinaria')
const operador = document.getElementById('operador')
const idOperador = document.getElementById('idOperador')
const cantidadaproximada = document.getElementById('cantidadaproximada')
const horasmaquina = document.getElementById('horasmaquina')
const btnRegister = document.getElementById('btnRegister')
const cantAsignar = document.getElementById('asigcantidad')

//Datos para asignar y ocultar
const btnAsignar = document.getElementById('btnAsignar')
const planillaAsignacion = document.getElementById('planillaasignacion')
const btnCancelar = document.getElementById('btnCancelar')
const btnCreateOrden = document.getElementById('btncreateorden')

//Datos totales
const cantidadFabricar = document.getElementById('cantFabric')
const cantidadAsignada = document.getElementById('cantAsignada')
const cantidadPendiente = document.getElementById('cantPendiente')

////////////////////////////////////////
const titleAisladores = document.getElementById('titleAisladores')

let reflocal = JSON.parse(localStorage.getItem('Referenciaproduccion'))
let idUsuario = JSON.parse(localStorage.getItem('UserLogin'))
let iduser;
idUsuario.forEach((user)=>{
 iduser = user.id
})
titleAisladores.innerHTML = 'Referencia:' +' '+ reflocal.referencia + '-' + reflocal.uso
usoemergente.value = reflocal.uso
revisionproducto.value = reflocal.descripcion
revisionreferencia.value = reflocal.referencia

btnCreateOrden.addEventListener('click',(e)=>{
  e.preventDefault()
  let producto ={
    id: reflocal.idProducto,
    referencia: reflocal.referencia,
    descripcion: reflocal.descripcion,
    uso: reflocal.uso
  }

  localStorage.setItem('producto:controles',JSON.stringify(producto))
  location.pathname = rutaAbsoluta
})

cantidadFabricar.innerHTML = `  
<p>Cantidad a fabricar</p>

<h1>${reflocal.totalCantidad}</h1>
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
//let myproductos;
let myoperadoresaisladores;
let myordendetalladas;
let myordenespeciales;

document.addEventListener('DOMContentLoaded', ()=>{
  //Listar los operadores que esten en la planilla de bujes con esa referencia
   myoperadoresaisladores = document.getElementById('myoperadoresaisladores')
   myoperadores = document.getElementById('myoperadores')
   mymaquinaria = document.getElementById('mymaquinaria')
   myordendetalladas = document.getElementById('myordendetalladas')
   myordenespeciales = document.getElementById('myordenespeciales')
  // myproductos = document.getElementById('myArticles')
   getOperador()
   getMaquinaria()
   getOrdenDetalladas()
   getReferenciasPorUso()
  // getArticles()
   getOperadoresAislador()
}) 

socket.emit('configuracion:controlaislador')
socket.on('configuracion:controlaislador',(datos)=>{
  let dattos = datos.filter(datos=>{return datos})
  if(dattos == ''){
    socket.emit('config:controlaislador')
    socket.on('config:controlaislador',(res)=>{
      res.forEach((respuesta)=>{
        siglas.value = respuesta.siglasControlAisladores
        numeroCA.value = respuesta.numeroinitCA
        codigoCA.value = siglas.value
      })
    })
  }else{
    socket.emit('get:ultimaaislador')
    socket.on('get:ultimaaislador', results=>{
      console.log('ultima', results)
      results.forEach(config=>{
        siglas.value = config.siglasCA
        numeroCA.value = parseInt(config.numeroCA) + 1
        codigoCA.value = siglas.value
      })
    })
  }
})


async function getReferenciasPorUso(){await socket.emit('get:referenciaspaneluso')}
//que participan en el proceso
async function getOperadoresAislador(){await socket.emit('get:operadoresaisladorproceso')}

async function getOrdenDetalladas(){await socket.emit('get:ordenesdetalladas')}

//Listar operadores para asignar tareas
async function getOperador(){await socket.emit('get:operadoraislador')}
async function getMaquinaria(){await socket.emit('get:maquinariaaislador')}
//async function getArticles(){await socket.emit('get:articulosaislador')}

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
  socket.emit('validator:getcontrolaisladoroperador', ids )

  //Pendiente por validar mejor
  socket.on('validator:getcontrolaislador', (valid)=>{
   let validar = valid.filter(valid=>valid.finalizada == 0 && valid.uso == usoemergente.value)
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
      messageMaquinaria.classList.add('d-none')
     }
   })
   //socket.emit('get:idoperadoraislador', id)
  }
})


socket.on('get:maquinariaaislador', (results)=>{
    let template = '';
  results.forEach((maqui, index)=>{
    template+= `<tr> 
    <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
      <td>${maqui.descripcion}</td>
      <td>${maqui.alias}</td>
      <td><input type="button" value='Seleccionar' id="${index}" class="btn btn-primary p-2 btn-tomar" data-bs-dismiss="modal"></td>
    </tr>`
  });

  mymaquinaria.innerHTML = template;

  let btnselect = document.querySelectorAll('.btn-tomar')
  btnselect.forEach((button)=>{
    button.addEventListener('click', getIdMaquinaria)
  })

  function getIdMaquinaria(e){
   e.preventDefault()
   messageMaquinaria.classList.add('d-none')
   id = e.target.id
   let maquinarias = results[id]
   maquinaria.value = maquinarias.descripcion
   idMaquinaria.value = maquinarias.id
   //socket.emit('get:idmaquinariasaislador', id)
  }
})

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

socket.on('get:operadoresaisladorproceso', (datos)=>{
  let template = '';
  let local = JSON.parse(localStorage.getItem('Referenciaproduccion'))
  modalproducto.value = local.descripcion
  modalreferencia.value = local.referencia
  
  let results = datos.filter(datos=> datos.idProducto == local.idProducto && datos.finalizada == 0 && usoemergente.value == datos.uso)
  console.log(datos)

  //Sumatoria de la cantidad asignada
  resultado = 0;

  results.map((dato)=>resultado+=dato.cantidadAsignada)

  results.forEach((operadores, index)=>{
    template+= `<tr> 
    <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index + 1}</strong></td>
      <td>${operadores.alias}</td>
      <td>${operadores.nombre}</td>
      <td>${operadores.apellido}</td>
      <td>${operadores.cantidadAsignada}</td>
      <td>${operadores.conformes}</td>
      <td>${(operadores.cantidadAsignada == operadores.conformes || operadores.notificar == 1)?  "<i class='bx bx-check bx-flashing bx-md text-success'></i>"  : (operadores.proceso == 1)?"<i class='bx bxs-cog bx-spin bx-md'></i>" : "<i class='bx bx-minus bx-md'></i>"}</td>
       
      <td>
      <input type="button" value='Adicionar cantidad' id="${operadores.idAisladores}" class="btn btn-primary p-2 btn-agregar" data-bs-toggle="modal" data-bs-target="#modalAsignar" >  
      <input type="button" value='Revisar' id="${index}" ${(operadores.cantidadAsignada == operadores.conformes || operadores.notificar == 1)? 'class="btn btn-warning p-2 btn-revisar" data-bs-toggle="modal" data-bs-target="#modalRevisionJefePlanta"': 'class="d-none btn btn-warning p-2 btn-revisar" data-bs-toggle="modal" data-bs-target="#modalRevisionJefePlanta"' } >  
      </td>
</tr>`
  });
  myoperadoresaisladores.innerHTML = template;


  let buttonAdicionar = document.querySelectorAll('.btn-agregar')
  let buttonRevisar = document.querySelectorAll('.btn-revisar')

  buttonAdicionar.forEach((item)=>{
    item.addEventListener('click', handleAdicionarCantidad)
  })
  buttonRevisar.forEach((btn)=>{
    btn.addEventListener('click', handleRevision)
  })

  function handleRevision(e){
   let idr = e.target.id
   let resultado = results[idr]
   operadorconformes.value = resultado.conformes - resultado.cantidadRevisada
   operadornoconformes.value = resultado.noConformesReport - resultado.cantidadNoConformeRevisada
   operadorsi.value = resultado.conformes
   operadorno.value = resultado.noConformesReport
   idrevision.value = resultado.idAisladores
  }
  

 function handleAdicionarCantidad(e){
  e.preventDefault()
  let id = e.target.id
  modalid.value = id
 }

cantidadAsignada.innerHTML = `  
<p>Cantidad asignada</p>
<h1>${resultado}</h1>
 `;

totalResultado = 0;
totalResultado =  reflocal.totalCantidad - resultado

modalcantidadpendiente.value = totalResultado

cantidadPendiente.innerHTML = `  
<p>Cantidad pendiente por asignar</p>
<h1>${totalResultado}</h1>
 `;  

 //cantPendienteUso.innerHTML =  `
//<p>Asignados</p>
//<div class="col-md-12 row">
//  <div class="col-md-6 ">
//    <div class="col-md-12"><strong>INTERIOR</strong></div>
 //   <h3 class="col-md-12">${resInterior}</h3>
//  </div>
 
 // <div class="col-md-6">
//    <div class="col-md-12"><strong>EXTERIOR</strong></div>
 //   <h3 class="col-md-12">${resExterior}</h3>
 // </div>

//</div>
////`
})



let idProduct = JSON.parse(localStorage.getItem('Referenciaproduccion'))

let messageOperador = document.getElementById('messageOperador')
let messageMaquinaria = document.getElementById('messageMaquinaria')
let messageCantidad = document.getElementById('messageCantidad')
//Creacion de la planilla de control de aisladores que va hacia el operador
btnRegister.addEventListener('click', (e)=>{
  e.preventDefault()
  if(idOperador.value ==''){
    messageOperador.classList.remove('d-none')
    messageMaquinaria.classList.add('d-none')
    messageCantidad.classList.add('d-none')

  }else if(idMaquinaria.value == ''){
    messageOperador.classList.add('d-none')
    messageCantidad.classList.add('d-none')
    messageMaquinaria.classList.remove('d-none')

  }else if(cantAsignar.value == '' || cantAsignar.value == 0){
    messageMaquinaria.classList.add('d-none')
    messageOperador.classList.add('d-none')
    messageCantidad.innerHTML = 'Este campo es totalmente obligatorio'
  }else{
    messageCantidad.classList.add('d-none')
    messageOperador.classList.add('d-none')
    messageMaquinaria.classList.add('d-none') 

    if(cantAsignar.value > totalResultado){
      Swal.fire({
        icon: 'error',
        title: 'Disculpe!',
        text: 'No puede adicionar una cantidad mayor a "Cantidad pendiente por asignar"',
        footer: '<h4>Gracias!</h4>'
      }); 
    }else{
      datos = {
        idOperador: idOperador.value,
        codigoCA: codigoCA.value,
        numeroCA: numeroCA.value,
        siglasCA: siglas.value,
        idMaquinaria: idMaquinaria.value,
        idProducto: idProduct.idProducto,
        uso: usoemergente.value,
        cantidadAgregada:0,
        finalizada: 0,
        revisadoPor: '',
        proceso:0,
        idUsuario: iduser,
        conformes: 0,
        totalProducido: 0,
        noConformesReport: 0,
        cantidadAsignada: cantAsignar.value,
        fecha: new Date

      }
      socket.emit('set:controlaislador',datos)
      planillaAsignacion.classList.add('d-none')
      btnAsignar.classList.remove('d-none')
      idOperador.value = ''
      operador.value = ''
      idMaquinaria.value = ''
      maquinaria.value = ''
      cantAsignar.value = ''
  }}
})


socket.on('get:ordenesdetalladas',(results)=>{
 let template = ''
 let valor= results.filter(res=>res.idProducto == idProduct.idProducto && res.status == 'En proceso' && res.tipo == 1 && res.uso == usoemergente.value)
 valor.forEach((results,index)=>{
    template+= `<tr> 
    <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index + 1}</strong></td>
      <td class="text-danger">${results.codigoOrden}</td>
      <td style='color:blue'>${results.nombre}</td>
      <td><strong>${results.cantidad}</strong></td>
      <td>${results.programadoPor}</td>
      <td>${(results.entregada == 1)? '<span class="badge rounded-pill bg-success p-2">Entregada</span>' : '<span class="badge rounded-pill bg-info p-2">Pendiente</span>' }</td>
      <td><strong>${moment(results.fechaEntregaProgramada).utc().format('DD/MM/YY')}</strong></td>
      <td>
     </td>
</tr>`
 })
 myordendetalladas.innerHTML = template   
})
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
  socket.emit('get:cantidadesAisladores', modalid.value)
  socket.on('get:cantidadesAisladores',(results)=>{
    results.forEach((res)=>{
      restotal+= parseInt(res.cantidadAsignada) + parseInt(modalcantidadAdicionada.value)
    })
    let totalsum = {
      id:modalid.value,
      cantidadAgregada: modalcantidadAdicionada.value,
      cantidadAsignada: restotal,
      revisadoPor: '',
      notificar: 0
    }
    socket.emit('send:cantidadagregada', totalsum)
  })
})

let usuario = JSON.parse(localStorage.getItem('usuario'))

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
  socket.emit('revisar:controlaislador', revision )
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
 

 //socket.on('get:referenciaspaneluso', (results)=>{
 // let resultado = results.filter(res=>res.status == 'En proceso' && res.referencia == reflocal.referencia)
 // let objeto = [resultado]
 // objeto.forEach((respuesta,index)=>{
 //    cantidadPorUso.innerHTML = `
  //   <p>Cantidades por uso</p>
  //   <div class="col-md-12 row">
  //     <div class="col-md-6 ">
   //      <div class="col-md-12"><strong>${respuesta[0].uso}</strong></div>
    //     <h3 class="col-md-12">${respuesta[0].totalCantidad}</h3>
    //   </div>
      
     //  <div class="col-md-6">
     //    <div class="col-md-12"><strong>${respuesta[1].uso}</strong></div>
    ///  </div>

   //  </div>
    /// `
  // // localStorage.setItem('Referenciaproduccion', JSON.stringify(resultado[index]))
  //})
//})



socket.on('get:ordenesdetalladas',(results)=>{

  let valor= results.filter(res=>res.idProducto == idProduct.idProducto && res.status == 'En proceso' && res.uso == usoemergente.value)
  let todasEntregadas = true;
  let idOrdenProduccion;

  valor.forEach((results,index)=>{
      idOrdenProduccion = results.idOrdenProduccion
     if (results.entregada != 1) {
       todasEntregadas = false;
     }
   
  })
  if (todasEntregadas) {


  let idPulido;
  socket.emit('get:operadorespulidoprocesoentregar')
  socket.on('get:operadorespulidoprocesoentregar', (datos)=>{
  let local = JSON.parse(localStorage.getItem('Referenciaproduccion'))
  let results = datos.filter(datos=> datos.idProducto == local.idProducto && datos.finalizada == 0 && usoemergente.value == datos.uso)
   console.log('ESTO ES PULIDO EN AISLADORES', results)
  results.forEach((ids)=>{
    idPulido = ids.idPulido
  })
  socket.emit('finalizar:controlpulido', idPulido)
})

    let id;
    socket.on('get:operadoresaisladorproceso', (datos)=>{
      let local = JSON.parse(localStorage.getItem('Referenciaproduccion'))
      let results = datos.filter(datos=> datos.idProducto == local.idProducto && datos.finalizada == 0 && usoemergente.value == datos.uso)
      results.forEach((ids)=>{
       id = ids.idAisladores
     })
      socket.emit('finalizar:controlaisladores', id)
    })
      socket.emit('terminar:ordenesproduccion', idOrdenProduccion)

   Swal.fire({
    title: 'Se han entregado todas las ordenes de produccion?',
    text: "Apartir de este momento queda finalizado este proceso, Desea salir?!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Salir!'
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        'Grandioso!',
        'Ha culminado su proceso.',
        'success'
      )
      location.pathname = rutaPanelProduccion
    }
  })
 
  } else {
   console.log('no entregar')
  }
 
 })