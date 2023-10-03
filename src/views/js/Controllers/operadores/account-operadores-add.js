const Swal = require('sweetalert2')
const io = require('socket.io-client');
const path = require('path');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
let rutaAbsoluta = path.join(__dirname, 'tables-operarios.html')


let nitoperador = document.getElementById('nit-operador')
let aliasoperador = document.getElementById('alias-operador')

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
        }
      };
      resetFileInput.onclick = () => {
        fileInput.value = '';
        accountUserImage.src = resetImage;
      };
    }

});

  let nombre = document.getElementById('nombre')
  let apellido = document.getElementById('apellido')
  let alias = document.getElementById('alias')
  let cif = document.getElementById('cif')
  let pin = document.getElementById('pin')
  let btnCancelar = document.getElementById('btnCancelar')
  let btnGuardar = document.getElementById('btnGuardar')

  alias.addEventListener('keyup', (e) => {
    socket.emit('validar:aliasoperador');
    socket.on('validar:aliasoperador', (results) => {
      let resultado = results.filter(res=>res.eliminado == 0)
      const aliasValue = e.target.value.toLowerCase(); 
      for (let i = 0; i < resultado.length; i++) {
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

btnGuardar.addEventListener("click", (e)=>{
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

    const operario = {
        imagen: nombreImage,
        nombre: nombre.value,
        apellido: apellido.value,
        alias: alias.value,
        password: pin.value,
        cif: cif.value,
        status: 1,
        eliminado: 0,
        contratacion: new Date
    }
    socket.emit('add:operador', operario)

    Swal.fire({
        icon: 'success',
        title: '¡Grandioso!',
        text: 'Su operador fue almacenada exitosamente!',
        timer: 2500
      }).then(()=>{
        window.location.pathname = rutaAbsoluta
      })   
}})


btnCancelar.addEventListener('click',(e)=>{
  e.preventDefault()
  window.location.pathname = rutaAbsoluta
})