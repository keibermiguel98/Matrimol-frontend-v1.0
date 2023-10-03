const path = require('path');
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const Swal = require('sweetalert2')
let rutaJefePlanta = path.join(__dirname, 'PanelJefePlanta.html')
let rutaPlanilla = path.join(__dirname, 'pages-planilla-jefe-aisladores.html')

//////Buscadores////////

let btnvolver = document.getElementById('btnvolver')

//Datos numericos del formulario 
let numord = document.getElementById('numini')
let caracter = document.getElementById('codcaracter')
let caracteres = document.getElementById('caracteres')

//Datos formulario
let idclient = document.getElementById('idclient') 
let numinit = document.getElementById('numinit')
let codigoorden = document.getElementById('codigoorden') 
let numOrdenProduccion = document.getElementById('numordenproduccion')
let clienteForm = document.querySelector('#clienteForm')
let programado = document.getElementById('programado')
let idUser = document.getElementById('idUser')
//let revision = document.getElementById('revision')

document.addEventListener('DOMContentLoaded',()=>{
    socket.emit('get:firstcliente')
})

socket.on('get:firtscliente',(cliente)=>{
    for(let i =0; i<cliente.length; i++){
        clienteForm.value = cliente[i].nombre
        idclient.value = cliente[i].id
    }
})

let User = JSON.parse(localStorage.getItem('UserLogin'))
    User.forEach(user=>{
       programado.value = user.nombre + ' ' + user.apellido
       idUser.value = user.id
 })



//Datos modal detalles producto
let idProduct = document.getElementById('idProduct')
let producto = document.getElementById('producto')
let reference = document.getElementById('reference')
let cantidad = document.getElementById('cantidad')
let uso = document.getElementById('uso')
let observacion = document.getElementById('observacion')
   
let productocontrol = JSON.parse(localStorage.getItem('producto:controles'))
idProduct.value = productocontrol.id
reference.value = productocontrol.referencia
producto.value = productocontrol.descripcion
uso.value = productocontrol.uso


   socket.emit('orden:configuracion')
   socket.on('ordenconfiguracion', (valor)=>{
     let valores = valor.filter(valor=>valor.tipo == 0)
    if(valores == ''){
       socket.emit('config:data')
       socket.on('getconfig:data',(data)=>{
        data.forEach(config=>{
          numOrdenProduccion.value = 1
          numinit.value = config.numeroordinitjefe
          caracteres.value = config.siglasOrdenJefe
          codigoorden.value = config.siglasOrdenJefe
          numord.innerText = numOrdenProduccion.value
          caracter.innerText = config.siglasOrdenJefe
        })
       })
    }else{
      socket.emit('get:ultimaordenespecial')
      socket.on('get:ultimaordenespecial', results=>{
        results.forEach(config=>{
        let numeroOrden = parseInt(config.numOrdenProduccion) + 1
        let ninit = parseInt(config.numinit) + 1   
        numOrdenProduccion.value = numeroOrden
        numinit.value = ninit
        codigoorden.value = config.caracteres
        numord.innerText =   numOrdenProduccion.value
        caracteres.value = config.caracteres
        caracter.innerText = codigoorden.value 
        })
      })
    }
   })

   ////////obtener datos de orden de produccion//////////////
  
     const btnRegister = document.querySelector('#btnRegister')

     btnRegister.addEventListener('click', (e)=>{
        e.preventDefault()
       
        let dataOrden = {
            idClientes: idclient.value,
            codigoOrden: codigoorden.value,
            caracteres: caracteres.value,
            numOrdenProduccion: numOrdenProduccion.value,
            numinit: numinit.value,
            observacionOrden: observacion.value,
            //revision : revision.value,
            exportPais: 'N/A',
            programadoPor : programado.value,
            fechaEntregaProgramada: 'N/A',
            pedido: 'N/A',
            idUsuario: idUser.value,
            propiedadCliente: 'N/A',
            tipo:0,
            proceso: 0,
            status: 'En proceso',
            eliminado: 0,
            fecha: new Date
        }

        socket.emit('addOrdenProduccion', dataOrden)  

        socket.on('idResultOrdenProduccion', (results)=>{

            let dataCompleted =  {
            idOrdenProduccion: results.insertId,
            idProducto:idProduct.value,
            cantidad: cantidad.value,
            cantidadCambiaria: cantidad.value,
            uso: uso.value,
            observaciones: 'N/A',
            fabricMolde: 'N/A',
            fechaEntregaRequerida: 'N/A'}
            socket.emit('detalleOrdenProduccion', dataCompleted)
            console.log('orden creada')
   
            
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Su orden a sido guardada con exito!',
            showConfirmButton: false,
            timer: 1500,
            footer: '<h4>Gracias</h4>'
          })
             setTimeout(()=>{
            location.pathname = rutaJefePlanta
            },1000)
           })
     })

     btnvolver.addEventListener('click', (e)=>{
      e.preventDefault()
      Swal.fire({
        title: 'Desea usted salir?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, salir!'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.pathname = rutaPlanilla
        }})})


