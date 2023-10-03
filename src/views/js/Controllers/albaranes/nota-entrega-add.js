const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const Swal = require('sweetalert2')
const moment = require('moment')
const path = require('path');
let rutaAbsoluta = path.join(__dirname ,'tables-notas-entrega.html')


let submitmodaladd = document.querySelector('.btn-submit')


let tablecomun = document.querySelector('.table-comun')
let tablebusquedad = document.querySelector('.table-search')
let inputsearch = document.getElementById('searchorden')

let codigoNota  = document.getElementById('codigoNota')
let numeroNotaEntrega = document.getElementById('numeroNotaEntrega')
let siglasNota = document.getElementById('siglasNota')
let codcaracter = document.getElementById('codcaracter')
let numini = document.getElementById('numini')


inputsearch.addEventListener('keyup', () => {
  if (inputsearch.value !== '') {
    tablebusquedad.classList.remove('d-none');
    tablecomun.classList.add('d-none');
  } else {
    tablebusquedad.classList.add('d-none');
    tablecomun.classList.remove('d-none');
  }
});
let entregadoPor = document.getElementById('entregadoPor')
let log = document.getElementById('programado')
let logid = document.getElementById('idUser')
let orden = document.getElementById('ordenproduccion')
let idord = document.getElementById('idord')


let iddetalleOrdenProduccion = document.getElementById('iddetallesOrdenProduccion')
let idAlbaran = document.getElementById('idAlbaran')
let producto = document.getElementById('producto')
let referencia = document.getElementById('referencia')
let cantidadPendiente = document.getElementById('cantidadpendiente')
let cantidadentregar = document.getElementById('cantidadentregar')
let cantidadcambiaria = document.getElementById('cantidadcambiaria')

let myOrden;
let mydetalle;
let myordensearch;

let logg = JSON.parse(localStorage.getItem('UserLogin'))

logg.forEach((dat)=>{
    log.value = dat.nombre + ' ' + dat.apellido
    logid.value = dat.id
    entregadoPor.value = dat.nombre + ' ' + dat.apellido
})

document.addEventListener('DOMContentLoaded', ()=>{
   //log.value = logg.nombre + ' ' + logg.apellido 
    myOrden = document.getElementById('myOrdenModal')
    mydetalle = document.getElementById('mydetalleorden')
    myordensearch = document.getElementById('myordensearch')
    ordenesProduccion()
    ordenesProduccionSearch()
})

async function ordenesProduccion(){await socket.emit('get:ordenproduccionnota')}
async function ordenesProduccionSearch(){await socket.emit('get:ordenproduccionnotasearch')}

async function detallesProduccion(){await socket.emit('get:detalleordenproduccionnotaentrega')}




socket.on('get:ordenproduccionnota', (results)=>{
  console.log(results)
    datos = results.filter(dato=>dato.status == 'En proceso' && dato.tipo == 1)
    template='';
    datos.forEach((results,index)=>{
     template+=`<tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
       <td><strong class='text-danger'>${results.codigoOrden}</strong></td>
       <td>${results.nombre}</td>
       <td><strong>${results.pedido}</strong></td>
       <td>${results.programadoPor}</td>
       <td>${moment(results.fechaEntregaProgramada).utc().format('DD/MM/YY')}</td>
       <td>${results.exportPais}</td>
       <td>
       <input type="button" value="Seleccionar" id="${index}" class="btn btn-primary p-2 btn-ver m-1" data-bs-dismiss="modal" aria-label="Close"></input>
      </td>
 </tr>`
    })
    myOrden.innerHTML = template;

    let sel = document.querySelectorAll('.btn-ver')
    sel.forEach(sel=>{
        sel.addEventListener('click',getSelId)
    })

    function getSelId(e){
     e.preventDefault()
     let sel = e.target.id
     let dat = results[sel]
     orden.value = dat.codigoOrden + ' - '+ dat.nombre
     idord.value = dat.id
   //  orden.value = dat.codigo
   detallesProduccion()

    }
    
})

//Tabla del filtrado
socket.on('get:ordenproduccionnotasearch', (results)=>{
   let datosFiltrados = results.filter(fil=>fil.tipo == 1 && fil.entregada == 0)
  inputsearch.addEventListener('input', function() {
    const valorBusqueda = inputsearch.value.toLowerCase();
    const result = datosFiltrados.filter(function(dato) {
        return dato.nombre.toLowerCase().includes(valorBusqueda) || dato.referencia.toLowerCase().includes(valorBusqueda) || dato.codigoOrden.toLowerCase().includes(valorBusqueda)
    
    });

    template='';
    result.forEach((results,index)=>{
     template+=`<tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
       <td><strong class='text-danger'>${results.codigoOrden}</strong></td>
       <td>${results.nombre}</td>
       <td><strong>${results.pedido}</strong></td>
       <td><strong>${results.referencia}</strong></td>
       <td><strong>${results.cantidadCambiaria}</strong></td>
       <td>${results.uso}</td>
       <td>${results.programadoPor}</td>
       <td>${moment(results.fechaEntregaProgramada).utc().format('DD/MM/YY')}</td>
       <td>${results.exportPais}</td>
       <td>
       <input type="button" value="Seleccionar" id="${index}" class="btn btn-primary p-2 btn-seleccionar m-1" data-bs-dismiss="modal" aria-label="Close"></input>
      </td>
 </tr>`
    })
    myordensearch.innerHTML = template;

    let sel = document.querySelectorAll('.btn-seleccionar')
    sel.forEach(sel=>{
        sel.addEventListener('click',getSeleccionarId)
    })

    function getSeleccionarId(e){
     e.preventDefault()
     let sel = e.target.id
     let dat = result[sel]
     orden.value = dat.codigoOrden + ' - '+ dat.nombre
     idord.value = dat.idOrdenProduccion
   //  orden.value = dat.codigo
   detallesProduccion()

    }
  })   
})

let detallesalbaran = []


socket.on('get:detalleordenproduccionnotaentrega',(results)=>{
    datos = results.filter(dato=>dato.idOrdenProduccion == idord.value)
    template='';
    datos.forEach((results,index)=>{
     template+=`<tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
       <td><strong class='text-danger'>${results.referencia}</strong></td>
       <td>${results.descripcion}</td>
       <td><strong>${results.uso}</strong></td>
       <td>${(results.cantidadCambiaria == 0) ? '<span class="badge bg-label-success rounded-pill me-1 p-3">Entregado</span>' : results.cantidadCambiaria}</td>
       <td>${moment(results.fechaEntregaRequerida).utc().format('DD/MM/YY')}</td>
       <td>${results.fabricMolde}</td>
       <td>
       <input type="button" value="Seleccionar" id="${index}" class="btn btn-primary p-2 btn-ver m-1" data-bs-toggle="modal" data-bs-target="#modalScrollable"></input>
      </td>
 </tr>`
    })
    mydetalle.innerHTML = template
    let btnSeleccionar = document.querySelectorAll('.btn-ver')
    btnSeleccionar.forEach(button=>{
        button.addEventListener('click', handleSeleccionar)
    })


    function handleSeleccionar(e){
        e.preventDefault()
        let id = e.target.id
        console.log(id)
        let valor = datos[id]
         cantidadcambiaria.value = valor.cantidadCambiaria
         iddetalleOrdenProduccion.value = valor.id
         producto.value = valor.descripcion
         referencia.value = valor.referencia
         cantidadPendiente.value = valor.cantidadCambiaria
    }
})

 submitmodaladd.addEventListener('click', handleAddDetalle)

function handleAddDetalle(e){
  e.preventDefault()

  if(detallesalbaran == ''){
    let detalle = {
      iddetallesOrdenProduccion:iddetalleOrdenProduccion.value,
      producto: producto.value,
      referencia: referencia.value,
      cantidadEntregada: cantidadentregar.value ,

    }
     detallesalbaran.push(detalle)
     getDetallesAlbaranes()
     limpiarAdd()
  }else{
    let detalle = {
      iddetallesOrdenProduccion:iddetalleOrdenProduccion.value,
      producto: producto.value,
      referencia: referencia.value,
      cantidadEntregada: cantidadentregar.value ,
    }

    let productoDuplicado = false;

    detallesalbaran.forEach(item=>{
      if(item.iddetallesOrdenProduccion == iddetalleOrdenProduccion.value){
        productoDuplicado = true;
        Swal.fire({
          icon: 'error',
          title: 'Disculpe!',
          text: 'Ya cuenta con este registro en los detalles, no es posible utilizarlo!',
          footer: '<h4>Gracias!</h4>'
        })      
      }
    })
    if (!productoDuplicado) {
      detallesalbaran.push(detalle)
      getDetallesAlbaranes()
      limpiarAdd()
  }
}



}

let myalbaranes;

function getDetallesAlbaranes(){
    myalbaranes = document.getElementById('myalbaranes')
    myalbaranes.innerHTML= '';
    detallesalbaran.forEach((dato,index)=>{
        myalbaranes.innerHTML+=  `<tr> 
        <td><i class="fab fa-angular fa-lg me-2"></i> <strong>${index +1}</strong></td>
        <td>${dato.referencia}</td>
        <td>${dato.producto}</td>
        <td>${dato.cantidadEntregada}</td> 
       <td><button type='button' class="btn btn-icon btn-outline-danger" onClick='deleteProduct("${index}")'>
       <i class="bx bx-trash-alt"></i>
       </button>

       <button type='button' class="btn btn-icon btn-outline-info" onClick='editProduct("${index}")' data-bs-toggle="modal"
       data-bs-target="#modalScrollableEdit">
       <i class='bx bxs-pencil'></i>
       </button>
       </td>
      </tr>`;
   })
} 

  getDetallesAlbaranes()


  function limpiarAdd(){
    cantidadentregar.value = ''
  }
  function deleteProduct(index){
    detallesalbaran.splice(index, 1)
    getDetallesAlbaranes()
 }


function editProduct(index){
    let eiddetallesOrdenProduccion = document.getElementById('eiddetallesOrdenProduccion')
    let eproducto = document.getElementById('eproducto')
    let ereferencia = document.getElementById('ereferencia')
    let ecantidadpendiente = document.getElementById('ecantidadpendiente')
    let ecantidadentregar = document.getElementById('ecantidadentregar')


    let id = detallesalbaran[index]
    eiddetallesOrdenProduccion.value = id.iddetallesOrdenProduccion
    eproducto.value =  id.producto
    ereferencia.value = id.referencia
    ecantidadpendiente.value = cantidadPendiente.value
    ecantidadentregar.value = id.cantidadEntregada

    document.querySelector('.btn-guardarcambios').addEventListener('click', (e)=>{
        e.preventDefault()
          detallesalbaran.splice(index, 1, {
          iddetallesOrdenProduccion: eiddetallesOrdenProduccion.value,
          producto: eproducto.value,
          referencia: ereferencia.value,  
          cantidadEntregada: ecantidadentregar.value,
          
      })
     
      getDetallesAlbaranes()
    })

    getDetallesAlbaranes()
}

socket.emit('notaentrega:configuracion')
socket.on('notaentrega:configuracion', (valor)=>{ 
 if(valor == ''){
    socket.emit('config:datanotaentrega')
    socket.on('config:datanotaentrega',(data)=>{
     data.forEach(config=>{
       numeroNotaEntrega.value = config.numeroinitNE
       siglasNota.value = config.siglasNotaEntrega
       codigoNota.value = config.siglasNotaEntrega
       codcaracter.innerHTML = codigoNota.value
       numini.innerHTML = numeroNotaEntrega.value
       
     })
    })
 }else{
   socket.emit('get:ultimaNotaEntrega')
   socket.on('get:ultimaNotaEntrega', results=>{
     console.log('ordenconfiguracion',results)
     results.forEach(config=>{
     let numeroNota = parseInt(config.numeroalbaran) + 1
     siglasNota.value = config.caracterAL
     numeroNotaEntrega.value = numeroNota
     codigoNota.value = config.caracterAL
     codcaracter.innerHTML = config.caracterAL 
     numini.innerHTML = numeroNota
     })
   })
 }
})

let buttonRegistrar = document.getElementById('btnRegister')
buttonRegistrar.addEventListener('click',(e)=>{
  e.preventDefault()


    let dataNotaEntrega = {
        idordenproduccion: idord.value,
        numeroalbaran: numeroNotaEntrega.value,
        codigoalbaranes: codigoNota.value,
        caracterAL: siglasNota.value,
        idusuario: logid.value,
        entregadoPor: entregadoPor.value,
        fecha: new Date()
    }
   socket.emit('send:notaentrega', dataNotaEntrega)

   socket.on('send:notaentrega', (dato)=>{
    console.log(dato.insertId)
    detallesalbaran.forEach(valor=>{
    let dataDetalleNota = {
        idalbaran: dato.insertId,
        iddetallesOrdenProduccion: valor.iddetallesOrdenProduccion,
        producto: valor.producto,
        referencia: valor.referencia,
        cantidadEntregada: valor.cantidadEntregada ,
        fechaEntrega: new Date()
    }
    
    let detalleorden = {
        id: valor.iddetallesOrdenProduccion,
        cantidadCambiaria: cantidadcambiaria.value - valor.cantidadEntregada
      }   

      socket.emit('update:detalleordenvalor', detalleorden)
      socket.emit('send:detallesnotaentrega', dataDetalleNota)

      socket.emit('get:detalleordenproduccionalbaranes')
      socket.on('get:detalleordenproduccionalbaranes',(results)=>{
        datos = results.filter(dato=>dato.idOrdenProduccion == idord.value)
        let todosEnCero = true;
        datos.forEach((dato)=>{
          if(dato.cantidadCambiaria != 0){
            todosEnCero = false;
          }
        })
        if (todosEnCero) {
          socket.emit('finalizar:ordenproduccionalbaran', idord.value);
        }
      })
 
       
    })
   })
   setTimeout(()=>{
    location.pathname = rutaAbsoluta
   }, 800)

})

let messageCantidad = document.getElementById('messagecantidad')
cantidadentregar.addEventListener('keyup',(e)=>{
  if(cantidadentregar.value == '' || cantidadentregar.value == 0){
    cantidadentregar.style = 'border:2px solid red; color: red'
    messageCantidad.innerHTML = 'Este campo no puede ser enviado vacio o en "0"'
    submitmodaladd.disabled = 'disabled'

  }
  else if(cantidadentregar.value > parseInt(cantidadPendiente.value)){
    console.log(cantidadentregar.value)
    cantidadentregar.style = 'border:2px solid red; color: red'
    messageCantidad.innerHTML = 'La cantidad no puede ser mayor a "Cantidad pendiente por asignar"'
    submitmodaladd.disabled = 'disabled'

  }
  else{
    cantidadentregar.style = 'border:2px solid green; color:green'
    messageCantidad.innerHTML = ''
    submitmodaladd.disabled = ''
  }
})



