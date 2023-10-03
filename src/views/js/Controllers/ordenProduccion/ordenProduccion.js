const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const Swal = require('sweetalert2')
const moment = require('moment'); 
const path = require('path');

let rutaAutorizaciones = path.join(__dirname, 'tables-ordenes-autorizaciones.html')
let rutaProceso = path.join(__dirname, 'tables-ordenes-proceso.html')
let rutaAutorizadas = path.join(__dirname, 'tables-ordenes-autorizadas.html')
let rutaTerminadas = path.join(__dirname, 'tables-ordenes-terminadas.html')
let rutaAnuladas = path.join(__dirname,'tables-ordenes-anuladas.html')

//Motivo
let motivo = document.getElementById('motivo')

//Botones emergentes de salir o volver
let btnCancelar = document.getElementById('btnCancelar')
let btnvolver = document.getElementById('btnvolver')

//input de la orden de produccion completa
let idorden = document.getElementById('idorden')
let idclient = document.getElementById('editidclient') 
let clienteForm = document.querySelector('#editclienteForm')
let programado = document.getElementById('editprogramado')
let idUser = document.getElementById('editidUser')
let exportpais = document.getElementById('editexportpais')
let numord = document.getElementById('numord')
let caracteres = document.getElementById('caracteres')
let revision = document.getElementById('editrevision')
let numpedido = document.getElementById('editnumpedido')
let fechaprogramada = document.getElementById('editfechaprogramada')
let propiedadCliente = document.getElementById('propiedadCliente')
let status = document.getElementById('status')
let btnSearchCliente = document.getElementById('btnSearchCliente')
let btnGroup = document.querySelector('.btn-group')

//Valores del input detalle editar
 let iddetalle = document.getElementById('iddetalle')
 let eidProduct = document.getElementById('eidProduct')
 let eproducto = document.getElementById('eproducto')
 let ereference = document.getElementById('ereference')
 let ecantidad = document.getElementById('ecantidad')
 let euso = document.getElementById('euso')
 let eobservacion = document.getElementById('eobservacion')
 let emolde = document.getElementById('emolde')
 let efechaentrega = document.getElementById('efechaentrega')


 //////////////////////////////////////////////////////////////////////

 //Valores del input detalle agregar
 let idProduct = document.getElementById('idProduct')
 let cantidad = document.getElementById('cantidad')
 let uso = document.getElementById('uso')
 let observacion = document.getElementById('observacion')
 let molde = document.getElementById('molde')
 let fechaentrega = document.getElementById('fechaentrega')

 //buttons editar 
 let buttonAgregar = document.querySelector('.btn-add')


////////////////BOTONES DE STATUS9//////////////////////////////////////////////

let btnrevertir = document.getElementById('btnrevertir')
let revertir = document.querySelector('.revertir')
let btnautorizar = document.getElementById('btnautorizar')
let btnaunular = document.getElementById('btnanular')
let btnfabricar = document.getElementById('btnfabricar')
let btnAdds = document.getElementById('btnAdd')

let ordenstore = JSON.parse(localStorage.getItem('ordenProduccion'))


////Buton pdf//
let btnGenerarPdf = document.getElementById('btnGenerarPdf')

btnGenerarPdf.addEventListener('click', (e)=>{
  e.preventDefault()
  let id = idorden.value
  socket.emit('add:pdforden', id)
})


btnrevertir.addEventListener('click', (e)=>{
  e.preventDefault()
  let motivorevertir = {
    id: idorden.value,
    observacionrevertida: motivo.value,
    revertida: 1
  }
  socket.emit('id:revertirstatus', motivorevertir)
  window.location.pathname = rutaProceso

})

btnautorizar.addEventListener('click',  (e)=>{
  e.preventDefault()
  let autorizado = JSON.parse(localStorage.getItem('UserLogin'))
  let nombrecompleto;
  autorizado.forEach(nombre=>{
    nombrecompleto = nombre.nombre+ ' ' + nombre.apellido
  })

  let datosAutorizada = {
    id: idorden.value,
    autorizadoPor: nombrecompleto,
    revertida: 0,
    fechaAutorizacion: new Date()
  }

  socket.emit('id:autorizadastatus', datosAutorizada)
  window.location.pathname = rutaAutorizaciones

})

btnfabricar.addEventListener('click', (e)=>{
  e.preventDefault()
  socket.emit('id:fabricarstatus', idorden.value)
  window.location.pathname = rutaAutorizadas

})

btnaunular.addEventListener('click', (e)=>{
  e.preventDefault()
  socket.emit('id:anularstatus', idorden.value)
  window.location.pathname = rutaAutorizaciones

})



buttonAgregar.addEventListener('click', (e)=>{
  e.preventDefault()
  let datos = {
    idOrdenProduccion : idorden.value,
    idProducto: idProduct.value,
    cantidad:cantidad.value, 
    cantidadCambiaria: cantidad.value,
    cantidadCambiariaEntregasJefe: cantidad.value,
    uso:uso.value,
    observaciones:observacion.value,
    fabricMolde:molde.value,
    fechaEntregaRequerida:fechaentrega.value
  }
   socket.emit('add:detalleordenedit', datos)
})

 //Variable de la tabla para ingresar los datos
let myOrdenProduccion;

document.addEventListener('DOMContentLoaded', ()=>{
   myOrdenProduccion = document.getElementById('myOrdenProduccion')
  renderGetDetalles()
})

async function renderGetDetalles(){
  await socket.emit('productosdetalles')
}

let orden = JSON.parse(localStorage.getItem('ordenProduccion'))
if(orden.revertida == 1 ){
  Swal.fire({
    title: 'OBSERVACION',
    text: orden.observacionrevertida,
    showCancelButton: false,
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Aceptar'
  })
}
let titleStatus = document.getElementById('titleStatus')
titleStatus.innerHTML = orden.status

let fechaArray = moment(orden.fechaEntregaProgramada).utc().format('YYYY-MM-DD')

  idorden.value = orden.id
  idclient.value = orden.idClientes
  caracteres.innerText = orden.codigoOrden
  numord.innerText = orden.numOrdenProduccion
  clienteForm.value = orden.nombre
  programado.value = orden.programadoPor
  idUser.value = orden.idUsuario
  exportpais.value = orden.exportPais
  revision.value = orden.revision
  numpedido.value = orden.pedido
  propiedadCliente.value = orden.propiedadCliente
  fechaprogramada.value = fechaArray
  status.value = orden.status

   

  //Se optiene el producto y se guarda en el array
 
  socket.on('detalleproduct', (result)=>{
   let template = ''
   let resultDetalle = result.filter(orden=>orden.idOrdenProduccion == idorden.value)

     resultDetalle.forEach((dato,index)=>{
       template+=  `<tr> 
          <td><i class="fab fa-angular fa-lg me-2"></i> <strong>${index +1}</strong></td>
          <td>${dato.referencia}</td>
          <td>${dato.descripcion}</td>
          <td>${dato.cantidad}</td>
          <td>${dato.uso}</td>
          <td>${(dato.observaciones == undefined)? 'N/A' : dato.observaciones}</td>
          <td>${dato.fabricMolde}</td>
          <td>${moment(dato.fechaEntregaRequerida).utc().format('DD/MM/YY')}</td>
         <td>
         <input type='button' class="btn btn-info btnupdate" value='Editar'id='${index}' data-bs-toggle="modal"
         data-bs-target="#modalEditProduct"></input>
         <input type='button' class="btn btn-danger btndelete" value='Eliminar' id="${dato.id}"'></input>
         </td>
        </tr>`;
     })
     myOrdenProduccion.innerHTML = template

     let btndelete = document.querySelectorAll('.btndelete')
     let btnupdate = document.querySelectorAll('.btnupdate')


     btnupdate.forEach(button=>{
       button.addEventListener('click', updateDetalles)
     })

     function updateDetalles(e){
      e.preventDefault()
  
      id = e.target.id
      //socket.emit('id:getdetails', id)
      let obtenerproducto = resultDetalle[id]
      let fechaa = moment(obtenerproducto.fechaEntregaRequerida).utc().format('YYYY-MM-DD')
    
       eproducto.value = obtenerproducto.descripcion
       ereference.value = obtenerproducto.referencia
       iddetalle.value = obtenerproducto.id
       eobservacion.value = obtenerproducto.observaciones,
       eidProduct.value = obtenerproducto.idProducto,
       ecantidad.value =  obtenerproducto.cantidad,
       euso.value = obtenerproducto.uso,
       emolde.value = obtenerproducto.fabricMolde,
       efechaentrega.value = fechaa
     }

     const btnModificar = document.querySelector('.btnModificar')
     btnModificar.addEventListener('click', (e)=>{
       e.preventDefault()
        datos = {
        id: iddetalle.value,
        idProducto: eidProduct.value ,
        observaciones: eobservacion.value,
        cantidad: ecantidad.value ,
        cantidadCambiaria: ecantidad.value,
        cantidadCambiariaEntregasJefe: ecantidad.value,
        uso:  euso.value ,
        fabricMolde: emolde.value ,
        fechaEntregaRequerida: efechaentrega.value 
       }
       socket.emit('editdetalleorden', datos)
       
     })

     btndelete.forEach(button=>{
       button.addEventListener('click', buttonDelete)
      })
      
        function buttonDelete(e){
          Swal.fire({
            title: 'Esta usted seguro?',
            text: "Desea eliminar este producto?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar'
          }).then((result) => {
            if (result.isConfirmed) {
                id = e.target.id
                console.log(e.target.id)
                socket.emit('id:deletedetails', id) 
                renderGetDetalles()  
            }
   })}})



btnCancelar.addEventListener('click', (e)=>{
    e.preventDefault()
    if(ordenstore.status == 'En proceso'){
  
      localStorage.removeItem('ordenProduccion')
      window.location.pathname = rutaProceso
    }else if(ordenstore.status == 'Autorizada' ){
      localStorage.removeItem('ordenProduccion')
      window.location.pathname = rutaAutorizadas
    }else if(ordenstore.status  == 'Finalizada'){
      localStorage.removeItem('ordenProduccion')
      window.location.pathname = rutaTerminadas
    }else if(ordenstore.status == 'Pendiente'){
      localStorage.removeItem('ordenProduccion')
      window.location.pathname = rutaAutorizaciones
    }else{
      localStorage.removeItem('ordenProduccion')
      window.location.pathname = rutaAnuladas
    }
  
})

btnvolver.addEventListener('click', (e)=>{
  e.preventDefault()
 // if()
 
  Swal.fire({
    title: 'Desea usted salir?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, salir!'
  }).then((result) => {
    if (result.isConfirmed) {
      if(ordenstore.status == 'En proceso'){
        localStorage.removeItem('ordenProduccion')
        window.location.pathname = rutaProceso
      }else if(ordenstore.status == 'Autorizada' ){
        localStorage.removeItem('ordenProduccion')
        window.location.pathname = rutaAutorizadas
      }else if(ordenstore.status  == 'Finalizada'){
        localStorage.removeItem('ordenProduccion')
        window.location.pathname = rutaTerminadas
      }else if(ordenstore.status == 'Pendiente'){
        localStorage.removeItem('ordenProduccion')
        window.location.pathname = rutaAutorizaciones
      }else{
        localStorage.removeItem('ordenProduccion')
        window.location.pathname = rutaAnuladas
      }
    }})})

    //Se envia para consultar la orden y el detalle
    let id = idorden.value 
    console.log('orden',id)
    socket.emit('get:detallesordenid', id)


  //Se optiene el resultado y se toma el id del detalle para ser consultado con el producto despues
    socket.on('getresultordendetalleid', (results)=>{
       results.forEach((product)=>{
         let id = product.id
         socket.emit('get:detalleproducts', id)   
       })
    })


  let buttonRegister = document.querySelector('#btnRegister')  

  buttonRegister.addEventListener('click', (e)=>{
  e.preventDefault()
   let data = {
   id: idorden.value,
   idClientes: idclient.value,
   exportPais: exportpais.value,
   pedido: numpedido.value,
   fechaEntregaProgramada:  fechaprogramada.value,
   propiedadCliente: propiedadCliente.value}
   socket.emit('updateOrdenProduccion', data)
   socket.on('message:actualizacion',()=>{
    console.log('SE ACTUALIZO')
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Actualizacion exitosa!',
      showConfirmButton: false,
      timer: 1500
    })
   })

   setTimeout(()=>{
    location.pathname = rutaAutorizaciones
   },1550)

  })
  

  socket.emit('detalleeditdatos',)

  //Modal agregar cliente
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

    emitirClientes()

    console.log(datosModal)
    socket.emit('addModalClient', datosModal)
    socket.on('resultClientModal', (data)=>obtenerClientCreado(data))    
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


let mysClientes = document.getElementById('mysClientes')
let mysArticles = document.getElementById('mysArticles')
let Articulos = document.getElementById('Articulos')

async function emitirClientes(){await socket.emit('clientsModal')}
emitirClientes()

async function emitirArticles(){await socket.emit('getarticle:modal')}
emitirArticles()

//Proceso de busqueda del modal para el lado de agregar articulo
let templateArticle=''
socket.on('getArticleModal', (results)=>{
  console.log(results)
  const inputBuscador = document.getElementById('searchproduct');
  inputBuscador.addEventListener('input', function() {
      const valorBusqueda = inputBuscador.value.toLowerCase();
      const resultados = results.filter(function(dato) {
          return dato.descripcion.toLowerCase().includes(valorBusqueda);
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
                  <input type="button" value='SELECCIONAR' id="${resultado.id}" data-bs-toggle="modal"
                  data-bs-target="#modalScrollable" class="btn btn-primary p-2 btn-select">  
              </td>
              </tr>`;
      });
      Articulos.innerHTML = templateArticle;

      const btnSelectArticle = document.querySelectorAll('.btn-select')
   
      btnSelectArticle.forEach(button=>{
          button.addEventListener('click', renderGetArticle )
      })
  
       function renderGetArticle(e){
          let id = parseInt(e.target.id)
          socket.emit('idArticleModal', id)
  
          socket.on('getIdArticleModal', (article)=>{
            article.forEach(article=>{
              idProduct.value = article.id
              producto.value = article.descripcion,
              reference.value = article.referencia
            })
          })
      }
  });
 })
  
 //Proceso de busqueda del modal para el lado de editar
socket.on('getArticleModal', (results)=>{
  let templateArticulo=''
    const inputBuscador = document.getElementById('searcharticlemodificar');
    inputBuscador.addEventListener('input', function() {
        const valorBusqueda = inputBuscador.value.toLowerCase();
        const resultados = results.filter(function(dato) {
            return dato.descripcion.toLowerCase().includes(valorBusqueda);
        });

        // Se limpia la variable 'template' antes de agregar los nuevos resultados del filtrado
        templateArticulo = '';
        resultados.forEach((resultado)=>{
            templateArticulo+=`
                <tr> 
                    <td>${resultado.referencia}</td>
                    <td>${resultado.descripcion}</td>
                    <td>${resultado.unidad}</td> 
                    <td>
                    <input type="button" value='SELECT' id="${resultado.id}" data-bs-toggle="modal"
                    data-bs-target="#modalEditProduct" class="btn btn-info p-2 btn-select">  
                </td>
                </tr>`;
        });
        mysArticles.innerHTML = templateArticulo;

        const btnSelectArticle = document.querySelectorAll('.btn-select')
     
        btnSelectArticle.forEach(button=>{
            button.addEventListener('click', renderGetArticle )
        })
    
        async function renderGetArticle(e){
            let id = parseInt(e.target.id)
            socket.emit('idArticleModal', id)
    
            socket.on('getIdArticleModal', (article)=>{
              article.forEach(article=>{
                eidProduct.value = article.id
                eproducto.value = article.descripcion,
                ereference.value = article.referencia
              })
            })
        }
    });
   })

//Proceso de busqueda de clientes modal
socket.on('clientesModal', (results)=>{  
  let template = '';
    const inputBuscador = document.getElementById('searchclt');
    inputBuscador.addEventListener('input', function() {
        const valorBusqueda = inputBuscador.value.toLowerCase();
        const resultados = results.filter(function(dato) {
            return dato.nombre.toLowerCase().includes(valorBusqueda);
        });
        console.log(resultados)

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
 

////////////////////////////////////////SOLO PDF///////////////////////////////////////////////////////////

///const generarPdf = document.querySelector('#btnGenerarPdf')

//generarPdf.addEventListener('click', handleGenerarPdf)

//const filePath = 'src/views/Pdf/ordenproduccion.html';
//if (!fs.existsSync(filePath)) {
//  console.log(`El archivo ${filePath} no existe`);
//}

//function handleGenerarPdf(e) {
 // e.preventDefault();

 // const options = { format: 'Letter' };

////const html = fs.readFileSync('src/views/Pdf/pdf-ordenproduccion.html', 'utf8');

//pdf.create(html, options).toFile('pdf-orden.pdf', (err, res) => {
 //if (err) return console.log(err);
 // console.log(res);
//});

 // console.log(idorden.value);
 // let datoid = idorden.value;
  //socket.emit('get:pdfordenproduccion', datoid);

//}



///////////////////////////Validacion de botones de status////////////////////////////////////////////

let ordenproduccion = JSON.parse(localStorage.getItem('ordenProduccion'))


document.addEventListener('DOMContentLoaded', ()=>{
    handleAutorizada()
})

  function handleAutorizada(){
    if(ordenproduccion.status == 'Pendiente'){
      btnfabricar.classList.add('d-none')
      revertir.classList.add('d-none')
    }

    if(ordenproduccion.status == 'Autorizada'){
       btnautorizar.classList.add('d-none')
       btnaunular.classList.add('d-none')
       revertir.classList.remove('d-none')
    }
      
    if(ordenproduccion.status == 'Anulada'){
       btnaunular.classList.add('d-none')
       btnfabricar.classList.add('d-none')
       btnautorizar.classList.add('d-none')
    } 

    if(ordenproduccion.status == 'En proceso'){
      btnaunular.classList.add('d-none')
      btnfabricar.classList.add('d-none')
      btnautorizar.classList.add('d-none')
      revertir.classList.add('d-none')
      btnGuardar.disabled = 'disabled'
      btnGuardar.disabled = 'disabled'
      buttonAgregar.disabled = 'disabled'
      buttonRegister.disabled = 'disabled'
      btnAdds.classList.add('d-none')
      btnSearchCliente.disabled = 'disabled'
      exportpais.disabled = 'disabled'
      numpedido.disabled = 'disabled'
      propiedadCliente.disabled = 'disabled'
      fechaprogramada.disabled = 'disabled'
      btnGroup.classList.add('d-none')

    }

    if(ordenproduccion.status == 'Finalizada'){
      btnaunular.classList.add('d-none')
      btnfabricar.classList.add('d-none')
      btnautorizar.classList.add('d-none')
      revertir.classList.add('d-none')
      btnGuardar.disabled = 'disabled'
      buttonAgregar.disabled = 'disabled'
      buttonRegister.disabled = 'disabled'
      btnAdds.classList.add('d-none')
      btnSearchCliente.disabled = 'disabled'
      exportpais.disabled = 'disabled'
      numpedido.disabled = 'disabled'
      propiedadCliente.disabled = 'disabled'
      fechaprogramada.disabled = 'disabled'
      btnGroup.classList.add('d-none')
    }
  }


  //////////////Butones de tab fill - mostrar formularios de orden de produccion, orden de compra , nota de entrega

  //Botones//
  let buttonUno = document.getElementById('buttonUno')
  let buttonTres = document.getElementById('buttonTres')

  //Formularios//

  let formUno = document.getElementById('formUno')
  let formTres = document.getElementById('formTres')

  ////////////////////////////////////////

  buttonUno.addEventListener('click', (e)=>{
    e.preventDefault()
    formUno.classList.remove('d-none')
    formTres.classList.add('d-none')
    buttonUno.classList.add('active')
    buttonTres.classList.remove('active')
  })
  
 
  buttonTres.addEventListener('click',(e)=>{
    e.preventDefault()
    formTres.classList.remove('d-none')
    formUno.classList.add('d-none')
    buttonUno.classList.remove('active')
    buttonTres.classList.add('active')
  })

    socket.on('add:pdforden', (buffer) => {
      // Crea una URL data URI a partir del buffer del PDF
      const pdfUrl = URL.createObjectURL(new Blob([buffer], { type: 'application/pdf' }));
      // Abre una nueva ventana con el PDF
        window.open(pdfUrl, '_blank');
    });
 



  
 let user = JSON.parse(localStorage.getItem('UserLogin'))


 user.forEach((rol)=>{
   if(rol.rol == 'Jefe de Planta'){
     /////////Roles//////////
       btnGuardar.disabled = 'disabled'
       buttonAgregar.disabled = 'disabled'
       buttonRegister.disabled = 'disabled'
       btnAdds.classList.add('d-none')
       btnSearchCliente.disabled = 'disabled'
       exportpais.disabled = 'disabled'
       numpedido.disabled = 'disabled'
       propiedadCliente.disabled = 'disabled'
       fechaprogramada.disabled = 'disabled'
 }
 else if(rol.rol == 'Planta'){
   btnGuardar.disabled = 'disabled'
   buttonAgregar.disabled = 'disabled'
   buttonRegister.disabled = 'disabled'
   btnAdds.classList.add('d-none')
   btnSearchCliente.disabled = 'disabled'
   exportpais.disabled = 'disabled'
   numpedido.disabled = 'disabled'
   propiedadCliente.disabled = 'disabled'
   fechaprogramada.disabled = 'disabled'
   btnGroup.classList.add('d-none')
 }
 
 else if(rol.rol == 'Despachos'){
   btnGuardar.disabled = 'disabled'
   buttonAgregar.disabled = 'disabled'
   buttonRegister.disabled = 'disabled'
   btnAdds.classList.add('d-none')
   btnSearchCliente.disabled = 'disabled'
   exportpais.disabled = 'disabled'
   numpedido.disabled = 'disabled'
   propiedadCliente.disabled = 'disabled'
   fechaprogramada.disabled = 'disabled'
   btnGroup.classList.add('d-none')
   
 }
 })
   

    
   

 
    

   
    
  
  




