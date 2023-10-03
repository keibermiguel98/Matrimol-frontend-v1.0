const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const path = require('path');
const Swal = require('sweetalert2');
let rutaAbsoluta = path.join(__dirname, 'index.html')

  username = document.querySelector("#username");
  password = document.querySelector("#password");
  btnLogin = document.getElementById("btnLogin");


btnLogin.addEventListener('click',(e)=>{
  e.preventDefault()
  
  const obj = {
    username: username.value,
    password: password.value
  }
  
   socket.emit('login', obj)
   socket.on('ventanas', (user)=>{
    localStorage.setItem('UserLogin', JSON.stringify(user))
    location.pathname = rutaAbsoluta
    console.log(rutaAbsoluta)
  })

  socket.on('error', (e)=>{
    console.log(e)
    Swal.fire({
      icon: 'error',
      title: 'Lo sentimos!',
      text: 'Usuario o contraseña incorrectas!',
      footer: '<a href="">El problema persiste?</a>'
    })
  })
   //Swal.fire({
    //icon: 'error',
    //title: '¡Lo sentimos!',
    //text: 'Usuario o contraseña incorrectas!',
    //footer: '<a href="">Olvido su contraseña?</a>',
  //})
}
)



