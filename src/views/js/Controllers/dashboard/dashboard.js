
document.addEventListener('DOMContentLoaded', () => {
  let welcome = document.querySelector('.bienvenido');
  let welcome2 = document.querySelector('.bienvenido2');
  let rol = document.querySelector('.rol')
  let datos = JSON.parse(localStorage.getItem('UserLogin'))

  let rolordenproduccion = document.querySelector('.rol-orden-produccion')
  let rolnotasentrega = document.querySelector('.rol-notas-entrega')
  let roljefeplanta = document.querySelector('.rol-jefe-de-planta')
  let rolmaster = document.querySelector('.rol-maestros')
  let rolseguridad = document.querySelector('.rol-security')
  let rolconfigurar = document.querySelector('.rol-configure')
  let roloperadores = document.querySelector('.rol-operadores-planta')

  let crearOrden = document.getElementById('rol-create-orden')
  let rolnotacrear = document.querySelector('.rol-nota-crear')
  let roloperadorestareas = document.querySelector('.rol-operadores-tareas')
  let accountUserImage = document.getElementById('uploadedAvatar')
  let imgAvatar = document.getElementById('imgavatar')


  
  datos.forEach(rol=>{
    let url = `http://192.168.1.128:18092/imagen/${rol.imagen}`
    fetch(url)
    .then(response => response.blob())
    .then(blob => {
      const urlImagen = URL.createObjectURL(blob);
      accountUserImage.src = urlImagen;
      imgAvatar.src = urlImagen
  })
    .catch(error => {
      console.error('Error al consultar la imagen:', error);
  });

    if(rol.rol == 'Jefe de Planta'){
        /////////Roles//////////
     crearOrden.classList.add('d-none')
     rolmaster.classList.add('d-none')
     rolseguridad.classList.add('d-none')
     rolconfigurar.classList.add('d-none')
     rolnotasentrega.classList.add('d-none')
     roloperadores.classList.remove('d-none')
     roljefeplanta.classList.remove('d-none')
     rolordenproduccion.classList.remove('d-none')
     rolnotacrear.classList.add('d-none')
     roloperadorestareas.classList.add('d-none')
    }
    else if(rol.rol == 'Planta'){
    rolordenproduccion.classList.add('d-none')
    rolnotasentrega.classList.add('d-none')
    roljefeplanta.classList.add('d-none')
    rolmaster.classList.add('d-none')
    rolseguridad.classList.add('d-none')
    rolconfigurar.classList.add('d-none')
    roloperadorestareas.classList.remove('d-none')
    roloperadores.classList.remove('d-none')
    }
    else if(rol.rol == 'Administrativo'){
      rolconfigurar.classList.add('d-none')
      rolmaster.classList.remove('d-none')
      rolordenproduccion.classList.remove('d-none')
      rolseguridad.classList.add('d-none')
      rolconfigurar.classList.add('d-none')
      rolnotasentrega.classList.remove('d-none')
      roloperadorestareas.classList.add('d-none')
      roloperadores.classList.remove('d-none')
      roljefeplanta.classList.remove('d-none')
    }
    else if(rol.rol == 'Despachos'){
      rolconfigurar.classList.add('d-none')
      crearOrden.classList.add('d-none')
      rolseguridad.classList.add('d-none')
      rolmaster.classList.remove('d-none')
      roljefeplanta.classList.add('d-none')
      roloperadorestareas.classList.add('d-none')
      rolordenproduccion.classList.add('d-none')
      rolnotasentrega.classList.remove('d-none')
      
    }else if(rol.rol == 'Super usuario'){
      rolconfigurar.classList.remove('d-none')
      rolordenproduccion.classList.remove('d-none')
      roljefeplanta.classList.remove('d-none')
      rolmaster.classList.remove('d-none')
      rolseguridad.classList.remove('d-none')
      rolconfigurar.classList.remove('d-none')
      rolnotasentrega.classList.remove('d-none')
      roloperadores.classList.remove('d-none')
      roloperadorestareas.classList.remove('d-none')
    }

 
  })

let nombre = ''
let nombre2 = ''
let roll = ''

datos.map((item)=>{
  console.log(item.nombre)
  nombre = item.nombre +' '+item.apellido
  nombre2 = item.nombre +' '+item.apellido
  roll = item.rol
})
  welcome.innerHTML = nombre
  welcome2.innerHTML = nombre2
  rol.innerHTML = roll

});

