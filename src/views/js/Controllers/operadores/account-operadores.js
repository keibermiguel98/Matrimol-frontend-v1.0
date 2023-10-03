const Swal = require('sweetalert2')
const io = require('socket.io-client');
const path = require('path');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
let rutaAbsoluta = path.join(__dirname, 'tables-operarios.html')


let nitoperador = document.getElementById('nit-operador')
let aliasoperador = document.getElementById('alias-operador')
let imgtext = document.getElementById('imgtext')

let nombreImage;
document.addEventListener('DOMContentLoaded', function (e) {
  let accountUserImage = document.getElementById('uploadedAvatar');
  const fileInput = document.querySelector('.account-file-input'),
    resetFileInput = document.querySelector('.account-image-reset');

    if (accountUserImage) {
      const resetImage = accountUserImage.src;
      fileInput.onchange = (e) => {
        if (fileInput.files[0].name) {
          accountUserImage.src = window.URL.createObjectURL(fileInput.files[0]);
          nombreImage = fileInput.files[0].name
          imgtext.value = nombreImage
        }
      };
      resetFileInput.onclick = () => {
        fileInput.value = '';
        accountUserImage.src = resetImage;
      };
    }

});

let url;
let accountUserImage = document.getElementById('uploadedAvatar');

  let  id = document.getElementById('idoperadores')
  let  nombre = document.getElementById('nombre')
  let  apellido = document.getElementById('apellido')
  let  alias = document.getElementById('alias')
  let  cif = document.getElementById('cif')
  let pin = document.getElementById('pin')
  let  btnCancelar = document.getElementById('btnCancelar')
  let  btnGuardar = document.getElementById('btnGuardar')
  let  btnEliminar = document.getElementById('btnEliminar')


alias.addEventListener('keyup', (e) => {
  socket.emit('validar:aliasoperador');
  socket.on('validar:aliasoperador', (results) => {
    let resultado = results.filter(res=>res.eliminado == 0)
    const aliasValue = e.target.value.toLowerCase(); 
    for (let i = 0; i < results.length; i++) {
      if (resultado[i].alias.toLowerCase() === aliasValue) { 
        aliasoperador.innerHTML = 'Ya existe un operador con este alias'
        alias.style = 'border: 2px solid red';
        return;
      }
    }
    alias.style = ''; // Pintar en verde solo si no hay coincidencias
    aliasoperador.innerHTML = ''

  });
});

cif.addEventListener('keyup',(e)=>{
  socket.emit('validar:aliasoperador');
  socket.on('validar:aliasoperador',(results)=>{
    let resultado = results.filter(res=>res.eliminado == 0)
    const aliasValue = e.target.value.toLowerCase(); 
    for (let i = 0; i < results.length; i++) {
      if (resultado[i].cif.toLowerCase() === aliasValue) {   
        nitoperador.innerHTML = 'Ya existe un operador con este NIT'
     
        cif.style = 'border: 2px solid red';
        return;
      }
    }
    cif.style = ''; // Pintar en verde solo si no hay coincidencias
    nitoperador.innerHTML = ''

  })
})

const valores = JSON.parse(localStorage.getItem('operador'))

    valores.forEach((data)=>{
      socket.emit('idEditOperador', data.id)

     //btnCancelar.addEventListener('click',()=>{
       // localStorage.removeItem('cliente')
        //window.location.pathname ='../src/views/tables-clientes.html'
     })
 
     socket.on('datosOperador', (result)=>{        
         result.forEach((datos)=>{
           id.value = datos.id
           nombre.value = datos.nombre
           imgtext.value = datos.imagen
           apellido.value = datos.apellido
           alias.value = datos.alias
           cif.value = datos.cif
           pin.value = datos.password
          // eliminado.value = datos.eliminado
           url = `http://192.168.1.128:18092/imagen/${datos.imagen}`
        })

    fetch(url)
     .then(response => response.blob())
     .then(blob => {
       const urlImagen = URL.createObjectURL(blob);
       console.log(urlImagen)
       accountUserImage.src = urlImagen;
  })
     .catch(error => {
       console.error('Error al consultar la imagen:', error);
  });
})

btnGuardar.addEventListener('click', (e)=>{
   e.preventDefault()
   
 let validarNit = document.getElementById('nit-operador')
 let validarAlias = document.getElementById('alias-operador')
 let validarNombre = document.getElementById('nombre-operador')
 let validarApellido = document.getElementById('apellido-operador')
 
 if(cif.value == ''){
    validarNit.innerHTML = 'el campo "Nit" es obligatorio'
    validarAlias.innerHTML = ''
    validarNombre.innerHTML = ''
    validarApellido.innerHTML = ''   


   }else if(alias.value == ''){
    validarNombre.innerHTML = ''
    validarApellido.innerHTML = ''  
    validarNit.innerHTML = ''   
    validarAlias.innerHTML = 'el campo "Alias" es obligatorio'

   }else if(nombre.value == ''){
    validarNombre.innerHTML = 'el campo "Nombre" es obligatorio'
    validarNit.innerHTML = ''
    validarAlias.innerHTML = ''
    validarApellido.innerHTML = ''   
      
   }else if(apellido.value == ''){
    validarApellido.innerHTML = 'El campo "Apellido" es obligatorio'
      validarNombre.innerHTML = ''   
      validarAlias.innerHTML = ''
      validarNit.innerHTML = ''  
   }else{
    validarNit.innerHTML = ''
    validarNit.innerHTML = ''
    validarAlias.innerHTML = ''
    validarApellido.innerHTML = ''   

          datos = {
           id: parseInt(id.value),
           imagen: imgtext.value,
           nombre: nombre.value,
           apellido: apellido.value,
           password: pin.value,
           alias: alias.value,
           eliminado:0,
           cif: cif.value
        }
      console.log('Datos actualizados correctamente', datos)
        socket.emit('Operador:Update', datos)
        reset()
        localStorage.removeItem('operador')
        socket.on('message:actualizacionoperador',()=>{
          Swal.fire({
            position:'center',
            icon: 'success',
            title: 'Actualizacion exitosa!',
            showConfirmButton: false,
            timer: 1500
          })
        })

        setTimeout(()=>{
         location.pathname =rutaAbsoluta
        },1520)
  

    } })

     function reset(){
        id.value = ''
        nombre.value = ''
        apellido.value = ''
        alias.value = ''
        cif.value = ''
     }

     btnEliminar.addEventListener('click', (e)=>{
        e.preventDefault()
        datos = {
            id: parseInt(id.value),
            nombre: nombre.value,
            apellido: apellido.value,
            alias: alias.value,
            cif: cif.value,
            eliminado: 1 
         }
        socket.emit('idDeleteOperador', datos)
        localStorage.removeItem('operador')
        location.pathname = rutaAbsoluta       
     })
 
     btnCancelar.addEventListener('click', (e)=>{
        e.preventDefault()
        window.location.pathname = rutaAbsoluta
        localStorage.removeItem('operador')
     })
     
