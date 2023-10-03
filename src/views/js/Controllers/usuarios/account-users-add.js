const path = require('path');
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 

const Swal = require('sweetalert2')
let rutaAbsoluta = path.join(__dirname, 'tables-usuario.html')


const nombre = document.querySelector('#nombre')
const apellido = document.querySelector('#apellido')
const nombreUsuario = document.querySelector('#nombreusuario')
const contrasena = document.querySelector('#contrasena')
const identificacion = document.querySelector('#identificacion')
const rol = document.querySelector('#rol')

const btnCancelar = document.querySelector('#btnCancelar');
const btnGuardar = document.querySelector('#btnGuardar');

btnGuardar.addEventListener('click', validator)
btnCancelar.addEventListener('click', cancelar)

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

function validator(e){
    e.preventDefault()
    let validarnombre = document.getElementById('validarNombre')
    let validarapellido = document.getElementById('validarApellido')
    let validarnombreusuario = document.getElementById('validarNombreUsuario')
    let validarpassword = document.getElementById('validarPassword')
    let validaridentificacion = document.getElementById('validarIdentificacion')
    let validarRol = document.getElementById('validarRoles')

    if(identificacion.value == ''){
        validaridentificacion.innerHTML = 'El campo "Identificacion" es obligatorio'
        validarnombre.innerHTML = ''
        validarapellido.innerHTML = ''
        validarnombreusuario.innerHTML = ''
        validarpassword.innerHTML = ''
        validarRol.innerHTML = ''
       }else if(nombre.value == ''){
           validaridentificacion.innerHTML = ''
           validarapellido.innerHTML = ''
           validarnombreusuario.innerHTML = ''
           validarpassword.innerHTML = ''
           validarRol.innerHTML = ''
           validarnombre.innerHTML = 'El campo "Nombre" es obligatorio'
       }else if(apellido.value == ''){
           validarnombreusuario.innerHTML = ''
           validarpassword.innerHTML = ''
           validarRol.innerHTML = ''
           validarnombre.innerHTML = ''
           validarapellido.innerHTML = 'El campo "Apellido"  es obligatorio'
       }else if(nombreUsuario.value == ''){
           validarnombre.innerHTML = ''
           validarapellido.innerHTML = ''
           validarpassword.innerHTML = ''
           validarRol.innerHTML = ''
           validarnombreusuario.innerHTML = 'El campo "Nombre de usuario" es totalmente obligatorio'
       }else if(contrasena.value == ''){
           validarnombre.innerHTML = ''
           validarapellido.innerHTML = ''
           validarnombreusuario.innerHTML = ''
           validarRol.innerHTML = ''
           validarpassword.innerHTML = 'El campo "Password" es totalmente obligatorio'
       }else if(rol.value == 'Seleccionar'){
           validarnombre.innerHTML = ''
           validarapellido.innerHTML = ''
           validarnombreusuario.innerHTML = ''
           validarpassword.innerHTML = ''
           validarRol.innerHTML = 'el campo "roles" es obligatorio'
       }else{
           validarRol.innerHTML = ''
           validaridentificacion = ''
           validarnombre.innerHTML = ''
           validarapellido.innerHTML = ''
           validarnombreusuario.innerHTML = ''
           validarpassword.innerHTML = ''
           validarRol.innerHTML = ''

        let fecha = new Date()
        let date = fecha.getFullYear() +'/'+ fecha.getMonth() +'/'+ fecha.getDate()
    
        const datosUsuario = {
            imagen: nombreImage,
            username: nombreUsuario.value,
            password: contrasena.value,
            nombre: nombre.value,
            apellido: apellido.value,
            cif: identificacion.value,
            rol: rol.value,
            eliminado: 0,
            created_at: date
        }
         socket.emit('add:Data', datosUsuario)
         console.log(datosUsuario)
    
          setTimeout(()=>{
            location.pathname = rutaAbsoluta
          },1000)
        }}


          function cancelar(e){
            e.preventDefault()
            window.location.pathname = rutaAbsoluta}




