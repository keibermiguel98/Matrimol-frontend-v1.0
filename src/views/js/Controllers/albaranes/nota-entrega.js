const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 

let mynotaentregaedit;

let log = document.getElementById('programado')
let logid = document.getElementById('idUser')
let orden = document.getElementById('ordenproduccion')
let idord = document.getElementById('idord')

let local = JSON.parse(localStorage.getItem('notaentrega'))

logid.value = local.idusuario
log.value = local.programado
orden.value = local.codigoOrden + ' - ' + local.nombre
idord.value = local.idordenproduccion

document.addEventListener('DOMContentLoaded', ()=>{
  mynotaentregaedit = document.getElementById('mynotaentregaedit')
  handleGetDetalleNota()
})

async function handleGetDetalleNota(){await socket.emit('get:detallealbaran')}

socket.on('get:detallealbaran',datos=>{
    let template = '';
    let dato = datos.filter(item=>item.idalbaran == local.id)
    console.log(dato)
    dato.forEach((dato,index)=>{
      console.log(dato)
        template+= `<tr> 
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
    mynotaentregaedit.innerHTML = template

})