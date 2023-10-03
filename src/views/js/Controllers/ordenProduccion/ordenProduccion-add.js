const path = require('path');
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const Swal = require('sweetalert2')

let rutaAbsoluta = path.join(__dirname, 'tables-ordenes-autorizaciones.html')

//////Buscadores////////

let btnOther = document.querySelector('.btn-other')
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
let exportpais = document.getElementById('exportpais')
let revision = document.getElementById('revision')
let numpedido = document.getElementById('numpedido')
let fechaprogramada = document.getElementById('fechaprogramada')
let propiedadCliente = document.getElementById('propiedadCliente')

//Obtener el usuario iniciado
let User = JSON.parse(localStorage.getItem('UserLogin'))
 User.forEach(user=>{
    programado.value = user.nombre + ' ' + user.apellido
    idUser.value = user.id
 })


//tabla de productos y caracteristicas de orden de produccion
let myOrdenProduccion = document.getElementById('myOrdenProduccion')

function clear(){
    observacion.value = '',
    idProduct.value = ''
    producto.value = '',
    reference.value = '',
    cantidad.value = '1',
    fechaentrega.value = ''
}

btnOther.addEventListener('click', addProduct )

//Datos modal detalles producto
let idProduct = document.getElementById('idProduct')
let producto = document.getElementById('producto')
let reference = document.getElementById('reference')
let cantidad = document.getElementById('cantidad')
let uso = document.getElementById('uso')
let observacion = document.getElementById('observacion')
let molde = document.getElementById('molde')
let fechaentrega = document.getElementById('fechaentrega')


let productos = []

let messageProducto = document.getElementById('messageproducto')
function adicionarProducto(){
  if(idProduct.value == ''){
    btnOther.disabled = 'disabled'
    messageProducto.classList.remove('d-none')
}}

function addProduct(e) {
  e.preventDefault();
  if (productos == '') {
    fechaentrega.value = fechaprogramada.value;
    let product = {
      idProduct: idProduct.value,
      producto: producto.value,
      reference: reference.value,
      cantidad: cantidad.value,
      uso: uso.value,
      observacion: observacion.value,
      molde: molde.value,
      fechaEntregaRequerida: fechaentrega.value
    };
    productos.push(product);
    clear();
    getProduct();
  } else {
    let product = {
      idProduct: idProduct.value,
      producto: producto.value,
      reference: reference.value,
      cantidad: cantidad.value,
      uso: uso.value,
      observacion: observacion.value,
      molde: molde.value,
      fechaEntregaRequerida: fechaentrega.value
    };

    let productoDuplicado = false;

    productos.forEach((producto) => {
      if (producto.idProduct == idProduct.value && producto.uso == uso.value) {
        productoDuplicado = true;
        Swal.fire({
          icon: 'error',
          title: 'Disculpe!',
          text: 'Ya cuenta con este producto en los detalles, no es posible volver a utilizarlo!',
          footer: '<h4>Gracias!</h4>'
        });
      }
    });

    if (!productoDuplicado) {
      productos.push(product);
      clear();
      getProduct();
    }
  }
}
   // }

  function getProduct(){
    myOrdenProduccion.innerHTML= '';
    productos.forEach((dato,index)=>{
        myOrdenProduccion.innerHTML+=  `<tr> 
        <td><i class="fab fa-angular fa-lg me-2"></i> <strong>${index +1}</strong></td>
        <td>${dato.reference}</td>
        <td>${dato.producto}</td>
        <td>${dato.uso}</td> 
        <td>${dato.cantidad}</td>
       <td>
       <button type='button' class="btn btn-icon btn-outline-info" onClick='editProduct("${index}")' data-bs-toggle="modal"
       data-bs-target="#modalEditProduct">
       <i class='bx bx-edit'></i>
       </button>

       <button type='button' class="btn btn-icon btn-outline-danger" onClick='deleteProduct("${index}")'>
       <i class="bx bx-trash-alt"></i>
       </button>
       </td>
      </tr>`;
   })
} 
  getProduct()


  function deleteProduct(index){
    productos.splice(index, 1)
    getProduct()
}

function editProduct(index){
    let eidProduct = document.getElementById('eidProduct')
    let eproducto = document.getElementById('eproducto')
    let ereference = document.getElementById('ereference')
    let ecantidad = document.getElementById('ecantidad')
    let euso = document.getElementById('euso')
    let eobservacion = document.getElementById('eobservacion')
    let emolde = document.getElementById('emolde')
    let efechaentrega = document.getElementById('efechaentrega')

    let id = productos[index]
    eobservacion.value = id.observacion,
    eidProduct.value = id.idProduct,
    eproducto.value =  id.producto,
    ereference.value = id.reference,
    ecantidad.value =  id.cantidad,
    euso.value = id.uso,
    emolde.value = id.molde,
    efechaentrega.value = id.fechaEntregaRequerida

    document.querySelector('.btnModificar').addEventListener('click', (e)=>{
        e.preventDefault()
          productos.splice(index, 1, {
          idProduct: eidProduct.value,
          producto: eproducto.value,
          reference: ereference.value,  
          cantidad: ecantidad.value,
          uso: euso.value,
          observacion: eobservacion.value,
          molde: emolde.value,
          fechaEntregaRequerida:efechaentrega.value
      })
      getProduct()
    })

    getProduct()
}
   

///Modal agregar cliente
let nombre = document.getElementById('nombre')
let movil = document.getElementById('movil')
let cif = document.getElementById('cif')
let direccion = document.getElementById('direccion')
let btnGuardar = document.getElementById('btnGuardarModal')

btnGuardar.addEventListener('click', (e)=>{
    e.preventDefault()
   
    let datosModal  = {
        nombre : nombre.value,
        movil: movil.value,
        cif: cif.value,
        direccion: direccion.value,
        eliminado: 0
    
    }
    console.log(datosModal)
    socket.emit('addModalClient', datosModal)
    socket.on('resultClientModal', (data)=>{
        obtenerClientCreado(data)
    })    
})

function obtenerClientCreado(data){
    socket.emit('idClientModal', data)
}

//Datos obtenidos del modal de creacion
    socket.on('idClienteModal', (results)=>{
        results.forEach((client)=>{
        idclient.value = client.id
        clienteForm.value = client.nombre
    })
})

let mysClientes;
let mysArticles;

   mysClientes = document.getElementById('mysClientes')
   mysArticles = document.getElementById('mysArticles')
      
async function emitirClientes(){await socket.emit('clientsModal')}
emitirClientes()

async function emitirArticles(){await socket.emit('getarticle:modal')}
emitirArticles()


  socket.on('getArticleModal', (results)=>{
    console.log(results)

    const inputBuscador = document.getElementById('searchproduct');
    inputBuscador.addEventListener('input', function() {
        const valorBusqueda = inputBuscador.value.toLowerCase();
        const resultados = results.filter(function(dato) {
            return dato.descripcion.toLowerCase().includes(valorBusqueda) || dato.referencia.includes(valorBusqueda);
        });

        // Se limpia la variable 'template' antes de agregar los nuevos resultados del filtrado
        templateArticle = '';
        resultados.forEach((resultado)=>{
            templateArticle+=`
                <tr> 
                    <td>${resultado.referencia}</td>
                    <td>${resultado.descripcion}</td>
                    <td>${resultado.unidad}</td> 
                    <td>
                    <input type="button" value='Seleccionar' id="${resultado.id}" data-bs-toggle="modal"
                    data-bs-target="#modalScrollable" class="btn btn-primary p-2 btn-select">  
                </td>
                </tr>`;
        });
        mysArticles.innerHTML = templateArticle;

        const btnSelectArticle = document.querySelectorAll('.btn-select')
     
        btnSelectArticle.forEach(button=>{
            button.addEventListener('click', renderGetArticle )
        })
    
         function renderGetArticle(e){
          messageProducto.classList.add('d-none')
          btnOther.disabled = ''
          console.log(idProduct.value)

            let id = parseInt(e.target.id)
            socket.emit('idArticleModal', id)
    
            socket.on('getIdArticleModal', (article)=>{
              article.forEach(article=>{
                idProduct.value = article.id
                producto.value = article.descripcion,
                reference.value = article.referencia
              })
            })
            console.log(id)
        }
    });
   })


    let template = '';
   socket.on('clientesModal', (results)=>{  
    const inputBuscador = document.getElementById('searchclt');
    inputBuscador.addEventListener('input', function() {
        const valorBusqueda = inputBuscador.value.toLowerCase();
        const resultados = results.filter(function(dato) {
            return dato.nombre.toLowerCase().includes(valorBusqueda) || dato.cif.includes(valorBusqueda);
        });

        // Se limpia la variable 'template' antes de agregar los nuevos resultados del filtrado
        template = '';
        resultados.forEach((resultado)=>{
            template+=`
                <tr> 
                    <td>${resultado.cif}</td>
                    <td>${resultado.nombre}</td>
                    <td>
                        <input type="button" value='Seleccionar' id="${resultado.id}" data-bs-dismiss="modal" class="btn btn-primary p-2 btn-select">  
                    </td>
                </tr>`;
        });
        mysClientes.innerHTML = template;

        const btnSelect = document.querySelectorAll('.btn-select')
     
        btnSelect.forEach(boton=>{
            boton.addEventListener('click', renderGetCliente )
        })
    
        async function renderGetCliente(e){
            let id = parseInt(e.target.id)
            socket.emit('idClienteModal', id)
    
            socket.on('getClientModal', (datos)=>{
              datos.forEach(client=>{
                idclient.value = client.id
                clienteForm.value = client.nombre
              })
            })
        }
    });
  
   
   })

   socket.emit('orden:configuracion')

   socket.on('ordenconfiguracion', (valor)=>{
    let resultado = valor.filter(ultimo=>ultimo.tipo == 1)
    if(resultado == ''){
       socket.emit('config:data')
       socket.on('getconfig:data',(data)=>{
        data.forEach(config=>{
          numOrdenProduccion.value = 1
          numinit.value = config.numerordinit
          caracteres.value = config.siglasOrdenProduccion
          codigoorden.value = config.siglasOrdenProduccion
          numord.innerText = numOrdenProduccion.value
          caracter.innerText = config.siglasOrdenProduccion
        })
       })
    }else{
      socket.emit('get:ultimaorden')
      socket.on('get:ultimaorden', results=>{
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
        if(productos == '' ){
          Swal.fire({
            icon: 'error',
            title: 'Disculpe!',
            text: 'Para finalizar la orden de produccion debe agregar minimo 1 producto!',
            footer: '<h4>Gracias!</h4>'
          })
        }else if(clienteForm.value == ''){
          Swal.fire({
            icon: 'error',
            title: 'Disculpe!',
            text: 'Por favor! debe asignar un cliente!',
            footer: '<h4>Gracias!</h4>'
          })
        }else{
        
        let dataOrden = {
            idClientes: idclient.value,
            codigoOrden: codigoorden.value,
            caracteres: caracteres.value,
            numOrdenProduccion: numOrdenProduccion.value,
            numinit: numinit.value,
            revision : revision.value,
            exportPais: exportpais.value,
            programadoPor : programado.value,
            fechaEntregaProgramada: fechaprogramada.value,
            pedido: numpedido.value,
            idUsuario: idUser.value,
            propiedadCliente: propiedadCliente.value,
            proceso: 0,
            entregada: 0,
            tipo: 1,
            status: 'Pendiente',
            eliminado: 0,
            fecha: new Date
        }

        socket.emit('addOrdenProduccion', dataOrden)  

        socket.on('idResultOrdenProduccion', (results)=>{
          productos.forEach(producto=>{
         let dataCompleted =  {
            idOrdenProduccion: results.insertId,
            idProducto: producto.idProduct,
            cantidad: producto.cantidad,
            cantidadCambiaria: producto.cantidad,
            cantidadCambiariaEntregasJefe: producto.cantidad,
            uso: producto.uso,
            observaciones:producto.observacion,
            fabricMolde: producto.molde,
            fechaEntregaRequerida: producto.fechaEntregaRequerida}
            socket.emit('detalleOrdenProduccion', dataCompleted)
            console.log('orden creada')
          })         
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Su orden a sido guardada con exito!',
            showConfirmButton: false,
            timer: 1500,
            footer: '<h4>Gracias</h4>'
          })
             setTimeout(()=>{
            location.pathname = rutaAbsoluta
            },1000)
           })} 
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
          window.location.pathname = rutaAbsoluta
        }})})


