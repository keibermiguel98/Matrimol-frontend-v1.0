const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const moment = require('moment');
const path = require('path');
const Swal = require('sweetalert2')

let rutaAbsoluta = path.join(__dirname,'tables-productos.html')


let referenciac = document.getElementById('comreferencia')
let nombreArticuloc = document.getElementById('comnombreArticulo')

let tableSearch = document.getElementById('tableSearch')
let tableComun = document.getElementById('tableComun')


let idcomponente = document.getElementById('idcomponente')
let cantidadComponente = document.getElementById("cantidadComponente")
let componentee = document.getElementById('componente')
let referenciaComponente = document.getElementById('referenciacomponente')
let eidcomposicion = document.getElementById('eidcomponente')
let ecantidadComponente = document.getElementById("ecantidadComponente")
let ecomponentee = document.getElementById('ecomponente')
let ereferencia = document.getElementById('ereferencia')

let referencia = document.getElementById('referencia')
let nombreArticulo = document.getElementById('nombreArticulo')
let unidad = document.getElementById('unidad')

let validarReferencia = document.getElementById('validarReferencia')
let validarDescripcion = document.getElementById('validarDescripcion')
let validarUnidad = document.getElementById('validarUnidad')

let inputsearch = document.getElementById('inputsearch')


let mycomponente;
let mycomposicion;
let mycomponentessearch = document.getElementById('mycomponentessearch')

inputsearch.addEventListener('input',()=>{
    if(inputsearch.value !== ''){
      tableSearch.classList.remove('d-none')
      tableComun.classList.add('d-none')
    }else{
     tableSearch.classList.add('d-none')
     tableComun.classList.remove('d-none')
    }
  })


document.addEventListener('DOMContentLoaded',()=>{
    mycomponente = document.getElementById('mycomponentes')
    mycomposicion = document.getElementById('mycomposicion')
    handleGetComponent()
    handleGetComposicion()
})

async function handleGetComponent(){await socket.emit('get:componentemodal')}
async function handleGetComposicion(){await socket.emit('get:composicion')}

socket.on('get:componentemodal',(results)=>{
   let template = '';
    let filtrado = results.filter(dato=>dato.eliminado == 0)
    filtrado.forEach((results,index)=>{
    template+= `<tr> 
        <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
          <td>${results.nombreCompuesto}</td>
          <td>${results.referenciaCompuesto}</td>
          <td>${results.parametro}</td>
          <td>${moment(results.fecha).utc().format('DD/MM/YYYY')}</td>
          <td>
          <input type="button" value="Seleccionar" id="${index}" class="btn btn-primary p-2 btn-ver m-1" data-bs-toggle="modal"
          data-bs-target="#modalScrollable"></input>
         </td>
    </tr>`;
})
mycomponente.innerHTML = template

let button = document.querySelectorAll('.btn-ver')
button.forEach(button=>{
    button.addEventListener('click',handleGetItem)
})
function handleGetItem(e){
e.preventDefault()
let id = e.target.id
let componente = filtrado[id]
componentee.value = componente.nombreCompuesto
referenciaComponente.value = componente.referenciaCompuesto
idcomponente.value = componente.id
}
});

socket.on('get:componentemodal',(results)=>{
     inputsearch.addEventListener('input',()=>{
        let inputDatos = inputsearch.value.toLowerCase();
        const datosfiltrados = results.filter((dato)=>{
          return dato.referenciaCompuesto.toLowerCase().includes(inputDatos)
        })
    let template = '';
     datosfiltrados.forEach((results,index)=>{
     template+= `<tr> 
         <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
           <td>${results.nombreCompuesto}</td>
           <td>${results.referenciaCompuesto}</td>
           <td>${results.parametro}</td>
           <td>${moment(results.fecha).utc().format('DD/MM/YYYY')}</td>
           <td>
           <input type="button" value="Seleccionar" id="${index}" class="btn btn-primary p-2 btn-ver m-1" data-bs-toggle="modal"
           data-bs-target="#modalScrollable"></input>
          </td>
     </tr>`;
 })
 mycomponentessearch.innerHTML = template
 
 let button = document.querySelectorAll('.btn-ver')
 button.forEach(button=>{
     button.addEventListener('click',handleGetItem)
 })
 function handleGetItem(e){
 e.preventDefault()
 let id = e.target.id
 let componente = results[id]
 componentee.value = componente.nombreCompuesto
 referenciaComponente.value = componente.referenciaCompuesto
 idcomponente.value = componente.id
 }
 })
 });
 

let productos = JSON.parse(localStorage.getItem('producto'))
referencia.value = productos.referencia
nombreArticulo.value = productos.descripcion
unidad.value = productos.unidad

function handleEditProducto(e){
    e.preventDefault()
    if(referencia.value == ''){
        validarReferencia.innerHTML = 'el campo Referencia es obligatorio'
        validarDescripcion.innerHTML = ''
        validarUnidad.innerHTML = ''   
    
    
       }else if(nombreArticulo.value == ''){
           validarReferencia.innerHTML = ''
           validarUnidad.innerHTML = ''   
           validarDescripcion.innerHTML = 'el campo Descripcion es obligatorio'
       }else if(unidad.value == '---'){
           validarDescripcion.innerHTML = ''
           validarReferencia.innerHTML = ''   
           validarUnidad.innerHTML = 'el campo Unidad es obligatorio'
       }else{
          validarUnidad.innerHTML = ''   
          validarDescripcion.innerHTML = ''
          validarReferencia.innerHTML = ''   

    let datoproducto = {
        id:productos.id,
        referencia: referencia.value,
        descripcion: nombreArticulo.value,
        unidad: unidad.value
    }
    socket.emit('update:datosproducto', datoproducto)
    location.pathname = rutaAbsoluta
    localStorage.setItem('producto', JSON.stringify(datoproducto))
}}

let buttonGuardar = document.getElementById('btnGuardar')

buttonGuardar.addEventListener('click',handleEditProducto)
referenciac.value = productos.referencia
nombreArticuloc.value = productos.descripcion


let btnSubmit = document.querySelector('.btn-submit');

btnSubmit.addEventListener('click', (e) => {
  e.preventDefault();
        let composicion = {
          idComponente: idcomponente.value,
          idProducto: productos.id,
          cantidadComponente: cantidadComponente.value
        };
        socket.emit('send:composicioninsert', composicion);
      //  Swal.fire({
      //    icon: 'error',
       ///   title: 'Oops...',
        //  text: 'Esta materia prima ya se encuentra en la composicion del producto!',
       //   footer: '<a href="#">Gracias</a>'
     //   });
      
    });

socket.on('get:composicion', (datos)=>{
    console.log(datos)
    let composicion = datos.filter(com=>com.idProducto == productos.id)
    let template = '';
    composicion.forEach((compo,index)=>{
        template+= `<tr> 
        <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index +1}</strong></td>
          <td>${compo.nombreCompuesto}</td>
          <td>${compo.referenciaCompuesto}</td>
          <td>${compo.cantidadComponente}</td>
          <td>${compo.parametro}</td>
          <td>
          <input type="button" value="Editar" id="${index}" class="btn btn-primary p-2 btnEditar m-1" data-bs-toggle="modal"
          data-bs-target="#modalEditarComposicion"></input>
          <input type="button" value="Eliminar" id="${compo.idComposicion}" class="btn btn-danger p-2 btnDelete m-1"></input>

         </td>
    </tr>`;
    })
    mycomposicion.innerHTML = template;
    let btnEliminar = document.querySelectorAll('.btnDelete')
    btnEliminar.forEach((button)=>{
        button.addEventListener('click', handleDelete)
    })
    function handleDelete(e){
        let id = e.target.id
        socket.emit('delete:composicion', id )
    }

    let buttonEditar = document.querySelectorAll('.btnEditar')
    buttonEditar.forEach(button=>{
        button.addEventListener('click', handleEditar)
    })
    function handleEditar(e){
    e.preventDefault()
    let id = e.target.id 
    let resultado = datos[id]
    eidcomposicion.value = resultado.idComposicion
    ecantidadComponente.value = resultado.cantidadComponente
    ecomponentee.value = resultado.nombreCompuesto
    ereferencia.value = resultado.referenciaCompuesto
    }
})

let buttonEdit = document.querySelector('.btn-editar')

buttonEdit.addEventListener('click', (e)=>{
    e.preventDefault()
    datos = {
        id: eidcomposicion.value,
        cantidadComponente: ecantidadComponente.value
    }
    socket.emit('edit:composicion', datos)
})

////////Botones form///////
let formUno = document.getElementById('formUno')
let formDos = document.getElementById('formDos')
let buttonUno = document.getElementById('buttonUno')
let buttonDos = document.getElementById('buttonDos')

buttonUno.addEventListener('click', (e)=>{
    e.preventDefault()
    formUno.classList.remove('d-none')
    formDos.classList.add('d-none')
    buttonDos.classList.remove('active')
    buttonUno.classList.add('active')
  })

  buttonDos.addEventListener('click',(e)=>{
    e.preventDefault()
    formDos.classList.remove('d-none')
    formUno.classList.add('d-none')
    buttonUno.classList.remove('active')
    buttonDos.classList.add('active')  
  })