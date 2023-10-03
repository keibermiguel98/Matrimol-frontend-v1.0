const Swal = require('sweetalert2')
const io = require('socket.io-client');
const path = require('path');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 

const rutaAbsoluta = path.join(__dirname, 'tables-usuario.html')

let validarnombre = document.getElementById('validarNombre')
let validarapellido = document.getElementById('validarApellido')
let validarnombreusuario = document.getElementById('validarNombreUsuario')
let validarpassword = document.getElementById('validarPassword')
let validaridentificacion = document.getElementById('validarIdentificacion')
let validarRol = document.getElementById('validarRoles')


let id = document.getElementById('id')
let nombre = document.getElementById('nombre')
let apellido = document.getElementById('apellido')
let username = document.getElementById('nombreusuario')
let password = document.getElementById('contrasena')
let identificacion = document.getElementById('identificacion')
let rol = document.getElementById('rol')
let imgtext = document.getElementById('imgtext')
let btnCancelar = document.getElementById('btnCancelar')
let btnEliminar = document.getElementById('btnEliminar')

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
          console.log(nombreImage)
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


const valores = JSON.parse(localStorage.getItem('usuario'))

    valores.forEach((datos)=>{
     url = `http://192.168.1.128:18092/imagen/${datos.imagen}`
      socket.emit('idEditUsuario', datos.id)

     //btnCancelar.addEventListener('click',()=>{
       // localStorage.removeItem('cliente')
        //window.location.pathname ='../src/views/tables-clientes.html'
     })

     fetch(url)
     .then(response => response.blob())
     .then(blob => {
       const urlImagen = URL.createObjectURL(blob);
       accountUserImage.src = urlImagen;
  })
     .catch(error => {
       console.error('Error al consultar la imagen:', error);
  });

 
     socket.on('datosUsuario', (result)=>{
        console.log(result)
         result.forEach((datos)=>{
           id.value = datos.id,
           nombre.value = datos.nombre,
           apellido.value = datos.apellido,
           username.value = datos.username,
           password.value = datos.password,
           identificacion.value = datos.cif
           imgtext.value = datos.imagen
           rol.value = datos.rol 
         })
     })

     btnGuardar.addEventListener('click', (e)=>{
        e.preventDefault()

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
            validarnombre.innerHTML = ''
            validarnombreusuario.innerHTML = ''
            validarpassword.innerHTML = ''
            validarRol.innerHTML = ''
            validarapellido.innerHTML = 'El campo "Apellido"  es obligatorio'
        }else if(username.value == ''){
            validarnombre.innerHTML = ''
            validarapellido.innerHTML = ''
            validarpassword.innerHTML = ''
            validarRol.innerHTML = ''
            validarnombreusuario.innerHTML = 'El campo "Nombre de usuario" es totalmente obligatorio'
        }else if(password.value == ''){
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
            validarRol.innerHTML = 'el campo "rol" es obligatorio'
        }else{
            validarRol.innerHTML = ''
            validaridentificacion = ''
            validarnombre.innerHTML = ''
            validarapellido.innerHTML = ''
            validarnombreusuario.innerHTML = ''
            validarpassword.innerHTML = ''
            validarRol.innerHTML = ''

          datos = {
           id: parseInt(id.value),
           imagen: imgtext.value,
           username: username.value,
           password: password.value,
           nombre: nombre.value,
           apellido: apellido.value,
           cif: identificacion.value,
           status:1,
           rol: rol.value
        }

        socket.emit('Usuario:Update', datos)
     ///   localStorage.removeItem('usuario')
        window.location.pathname = rutaAbsoluta

     }})

     btnEliminar.addEventListener('click', (e)=>{
        e.preventDefault()
        datos = {
            id: parseInt(id.value),
            username: username.value,
            password: password.value,
            nombre: nombre.value,
            apellido: apellido.value,
            cif: identificacion.value,
            rol: rol.value,
            eliminado: 1 
         }
        socket.emit('idDeleteUsuario', datos)
        window.location.pathname = rutaAbsoluta
        console.log(datos)
     })

     btnCancelar.addEventListener('click', (e)=>{
        e.preventDefault()
        window.location.pathname = rutaAbsoluta
        localStorage.removeItem('usuario')
     })
