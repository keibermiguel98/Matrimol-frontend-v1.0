const path = require('path');
const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const sound = new Audio();
let rutaAbsoluta = path.join(__dirname, 'panelbujesaisladores.html')

let mytareas;
let idoperador = document.getElementById('idoperadorr')


document.addEventListener('DOMContentLoaded',()=>{
mytareas = document.getElementById('mytareas')
  renderTareasOperadores()
})

async function renderTareasOperadores(){await socket.emit('get:tareasoperadores')}

  socket.on('get:tareasoperadores',(results)=>{
    let template = '';
    results.forEach((tareas,index)=>{      
        template+= `
        <div class="col-md-3 col-lg-3 mb-3 mr-2" >
        <div class="card h-10">
        <img class="card-img-top imgoperador"  src="../assets/img/elements/matrimol.png" alt="Operadores" style='  width: auto; height: 350px;' />
        <div class="card-body text-center">
          <h5 class="card-title" style='font-size:25px;'>${tareas.alias}</h5>
          <p style='font-size:20px;'>${tareas.nombre + ' ' + tareas.apellido}</p>  
          <input type='button' style='font-size:25px;' class="btn btn-primary col-md-12 codigo" id="${index}" value="Ver mis tareas" data-bs-toggle="modal"
          data-bs-target="#teclado"></input>
        </div>
      </div>
      </div>`
    });
    
  //Para activar el modal del pin de seguridad 

  //data-bs-toggle="modal"
  //data-bs-target="#backDropModal"
    mytareas.innerHTML = template
    let accountUserImage = document.querySelectorAll('.imgoperador');
    accountUserImage.forEach((accountImagen,index)=>{
      let url = `http://192.168.1.128:18092/imagen/${results[index].imagen}`;
      fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const urlImagen = URL.createObjectURL(blob);
        accountImagen.src = urlImagen;
      })
      .catch(error => {
        console.error('Error al consultar la imagen:', error);
   });
    })

    const codigo = document.querySelectorAll(".codigo")

    codigo.forEach((button)=>{
      button.addEventListener('click', buttonCodigo)
    })

    function buttonCodigo(e){
      e.preventDefault()
      let id = e.target.id
      let res = results[id]
      idoperador.value = res.id
      localStorage.setItem('idoperador', JSON.stringify(res))     
    }})

    //Digitador de PIN
  const uno = document.getElementById('uno')
  const dos = document.getElementById('dos')
  const tres = document.getElementById('tres')
  const cuatro = document.getElementById('cuatro')
  const cinco = document.getElementById('cinco')
  const seis = document.getElementById('seis')
  const siete = document.getElementById('siete')
  const ocho = document.getElementById('ocho')
  const nueve = document.getElementById('nueve')
  const cero = document.getElementById('cero')
  let messageError = document.getElementById('messageError')

  const pin = document.getElementById('pin')
   
  uno.addEventListener('click', (e)=>{
    e.preventDefault()
    sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
    pin.value += uno.value = '1'
    if(pin.value.length == 4){
      socket.emit('clave:operador', idoperador.value)
      socket.on('clave:operador', (resultado)=>{
        resultado.forEach((clave)=>{
          if(clave.password == pin.value){
            setTimeout(()=>{
              window.location.pathname = rutaAbsoluta
            }, 200)
          }else{
            console.log('No puede pasar')
            pin.value = ''
            messageError.innerHTML = 'Credencial incorrecta!🔒'
          }
        })
      })
    }
    messageError.innerHTML = ''

  })

  dos.addEventListener('click', (e)=>{
    e.preventDefault()
    sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
    pin.value += dos.value = '2'
    if(pin.value.length == 4){
      socket.emit('clave:operador', idoperador.value)
      socket.on('clave:operador', (resultado)=>{
        resultado.forEach((clave)=>{
          if(clave.password == pin.value){
            setTimeout(()=>{
              window.location.pathname = rutaAbsoluta
            }, 200)
          }else{
            console.log('No puede pasar')
            pin.value = ''
            messageError.innerHTML = 'Credencial incorrecta!🔒'
          }
        })
      })
    }
    messageError.innerHTML = ''
  })

  tres.addEventListener('click', (e)=>{
    e.preventDefault()
    sound.src = '../assets/sonidos/Bixby_BOS.ogg';
     sound.play();
    pin.value += cuatro.value = '3'
    if(pin.value.length == 4){
      socket.emit('clave:operador', idoperador.value)
      socket.on('clave:operador', (resultado)=>{
        resultado.forEach((clave)=>{
          if(clave.password == pin.value){
            setTimeout(()=>{
              window.location.pathname = rutaAbsoluta
            }, 200)
          }else{
            console.log('No puede pasar')
            pin.value = ''
            messageError.innerHTML = 'Credencial incorrecta!🔒'
          }
        })
      })
    }
    messageError.innerHTML = ''
  })

  cuatro.addEventListener('click', (e)=>{
    e.preventDefault()
    sound.src = '../assets/sonidos/Bixby_BOS.ogg';
    sound.play();
    pin.value += cuatro.value = '4'
    if(pin.value.length == 4){
      socket.emit('clave:operador', idoperador.value)
      socket.on('clave:operador', (resultado)=>{
        resultado.forEach((clave)=>{
          if(clave.password == pin.value){
            setTimeout(()=>{
              window.location.pathname = rutaAbsoluta
            }, 200)
          }else{
            console.log('No puede pasar')
            pin.value = ''
            messageError.innerHTML = 'Credencial incorrecta!🔒'
          }
        })
      })
    }
    messageError.innerHTML = ''
  })

  cinco.addEventListener('click', (e)=>{
    e.preventDefault()
    sound.src = '../assets/sonidos/Bixby_BOS.ogg';
    sound.play();
    pin.value += cinco.value = '5'
    if(pin.value.length == 4){
      socket.emit('clave:operador', idoperador.value)
      socket.on('clave:operador', (resultado)=>{
        resultado.forEach((clave)=>{
          if(clave.password == pin.value){
            setTimeout(()=>{
              window.location.pathname = rutaAbsoluta
            }, 200)
          }else{
            console.log('No puede pasar')
            pin.value = ''
            messageError.innerHTML = 'Credencial incorrecta!🔒'
          }
        })
      })
    }
    messageError.innerHTML = ''
  })

  seis.addEventListener('click', (e)=>{
    e.preventDefault()
    sound.src = '../assets/sonidos/Bixby_BOS.ogg';
    sound.play();
    pin.value += seis.value = '6'
    if(pin.value.length == 4){
      socket.emit('clave:operador', idoperador.value)
      socket.on('clave:operador', (resultado)=>{
        resultado.forEach((clave)=>{
          if(clave.password == pin.value){
            setTimeout(()=>{
              window.location.pathname = rutaAbsoluta
            }, 200)
          }else{
            console.log('No puede pasar')
            pin.value = ''
            messageError.innerHTML = 'Credencial incorrecta!🔒'
          }
        })
      })
    }
    messageError.innerHTML = ''
  })

  siete.addEventListener('click', (e)=>{
    e.preventDefault()
    sound.src = '../assets/sonidos/Bixby_BOS.ogg';
    sound.play();
    pin.value += siete.value = '7'
    if(pin.value.length == 4){
      socket.emit('clave:operador', idoperador.value)
      socket.on('clave:operador', (resultado)=>{
        resultado.forEach((clave)=>{
          if(clave.password == pin.value){
            setTimeout(()=>{
              window.location.pathname = rutaAbsoluta
            }, 200)
          }else{
            console.log('No puede pasar')
            pin.value = ''
            messageError.innerHTML = 'Credencial incorrecta!🔒'
          }
        })
      })
    }
    messageError.innerHTML = ''
  })

  ocho.addEventListener('click', (e)=>{
    e.preventDefault()
    sound.src = '../assets/sonidos/Bixby_BOS.ogg';
    sound.play();
    pin.value += ocho.value = '8'
    if(pin.value.length == 4){
      socket.emit('clave:operador', idoperador.value)
      socket.on('clave:operador', (resultado)=>{
        resultado.forEach((clave)=>{
          if(clave.password == pin.value){
            setTimeout(()=>{
              window.location.pathname = rutaAbsoluta
            }, 200)
          }else{
            console.log('No puede pasar')
            pin.value = ''
            messageError.innerHTML = 'Credencial incorrecta!🔒'
          }
        })
      })
    }
    messageError.innerHTML = ''
  })

  nueve.addEventListener('click', (e)=>{
    e.preventDefault()
    sound.src = '../assets/sonidos/Bixby_BOS.ogg';
    sound.play();
    pin.value += nueve.value = '9'
    if(pin.value.length == 4){
      socket.emit('clave:operador', idoperador.value)
      socket.on('clave:operador', (resultado)=>{
        resultado.forEach((clave)=>{
          if(clave.password == pin.value){
            setTimeout(()=>{
              window.location.pathname = rutaAbsoluta
            }, 200)
          }else{
            console.log('No puede pasar')
            pin.value = ''
            messageError.innerHTML = 'Credencial incorrecta!🔒'
          }
        })
      })
    }
    messageError.innerHTML = ''
  })

  cero.addEventListener('click', (e)=>{
    e.preventDefault()
    sound.src = '../assets/sonidos/Bixby_BOS.ogg';
    sound.play();
    pin.value += cero.value = '0'
    if(pin.value.length == 4){
      socket.emit('clave:operador', idoperador.value)
      socket.on('clave:operador', (resultado)=>{
        resultado.forEach((clave)=>{
          if(clave.password == pin.value){
            setTimeout(()=>{
              window.location.pathname = rutaAbsoluta
            }, 200)
          }else{
            console.log('No puede pasar')
            pin.value = ''
            messageError.innerHTML = 'Credencial incorrecta!🔒'
          }
        })
      })
    }
    messageError.innerHTML = ''
  })


