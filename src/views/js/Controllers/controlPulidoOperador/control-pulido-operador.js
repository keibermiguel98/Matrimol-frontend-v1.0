const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const Swal = require('sweetalert2')
const moment = require('moment');
const path = require('path');
const sound = new Audio();

let rutaAbsoluta = path.join(__dirname, 'tasksOperadores.html')
let btnRegister = document.getElementById('btnRegister')
let buttonMostrar = document.getElementById("mostrar")
let buttoncancelar = document.getElementById('btnCancelar')
let inputMaquinaria = document.getElementById('maquinaria')
let inputReferencia = document.getElementById('referencia')
let inputidcontrolPulido = document.getElementById('idcontrolapulido')

let dlineaflujo = document.getElementById('dlineaflujo')
let dchupados = document.getElementById('dchupados')
let descurrido = document.getElementById('descurrido')
let dburbujas= document.getElementById('dburbujas')
let drotura = document.getElementById('drotura')
let dbujes = document.getElementById('dbujes')
let dpresionllenado = document.getElementById('dpresionllenado')
let dexcesosilicona = document.getElementById('dexcesosilicona')
let dfallasmaquina = document.getElementById('dfallasmaquina')
let dmezclanoconforme = document.getElementById('dmezclanoconforme')
let drespiradero = document.getElementById('drespiradero')
let dfinmezcla = document.getElementById('dfinmezcla')


//Input de add detalles
let actividad = document.getElementById('actividadmodal')
let conformespulido = document.getElementById('conformes-pulido')
let lineaflujopulido = document.getElementById('lineaflujo-pulido')
let chupadospulido = document.getElementById ('chupados-pulido')
let escurridopulido = document.getElementById('escurrido-pulido')
let presionpulido = document.getElementById('presion-pulido')
let roturapulido = document.getElementById('rotura-pulido')
let bujespulido = document.getElementById('bujes-pulido')
let burbujapulido = document.getElementById('burbuja-pulido')
let buttontime = document.querySelector('.temporizador')

//Totalidades//
let cantConformes = document.getElementById('cantConforme')
let cantNoConforme = document.getElementById('cantNoConforme')

let buttonTerminar = document.getElementById('btnTerminar')
let buttoniniciar = document.getElementById('buttoniniciartarea')
let formcontrol = document.getElementById('formcontrol')

buttonMostrar.addEventListener('click', (e)=>{
    e.preventDefault()
    formcontrol.classList.remove('d-none')
    buttonMostrar.classList.add('d-none')
})

buttoncancelar.addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.pathname = rutaAbsoluta
})
 
let datospulido = JSON.parse(localStorage.getItem('datatareabuje'))
let idoperador = JSON.parse(localStorage.getItem('idoperador'))
console.log(datospulido.idPulido)

inputReferencia.value = datospulido.referencia
inputMaquinaria.value = datospulido.descripcion
inputidcontrolPulido.value = datospulido.idPulido

let nameoperador = document.getElementById('nameoperador')
nameoperador.innerHTML = idoperador.nombre + ' ' + idoperador.apellido + ' / ' + idoperador.alias


let mycontrolpulido;
document.addEventListener('DOMContentLoaded', ()=>{
 
 mycontrolpulido = document.getElementById('mycontrolpulido')
  handleemitcontrolaisladores()
  getDetalleControlAisladores()
 // getControlAisladores()
})

async function getDetalleControlAisladores(){
    await socket.emit('get:detallescontrolpulido')
}


async function handleemitcontrolaisladores(){
  await socket.emit('get:operadorescontroles')
}

let inputsn;

buttonTerminar.addEventListener('click', (e)=>{
  e.preventDefault()
  
    let total = 0
    let resinput = 0
     inputsn =  document.querySelectorAll('input.n')

    for(i=0;i<inputsn.length; i++){
      if(inputsn[i].value !== ''){
        resinput+=parseInt(inputsn[i].value)
      }
    }
    let totalC = 0
    
    let inputsC = document.querySelectorAll('input.c')
    for(i=0; i<inputsC.length; i++){
      if(inputsC[i].value !== ''){
        totalC+=parseInt(inputsC[i].value) 
      }
    }

    if(resinput > conformespulido.value){
      Swal.fire({
        icon: 'error',
        title: 'Algo salio mal',
        text: 'Lo sentimos, la cantidad de no conformes no puede ser menor a la cantidad de conformes!',
        footer: '<p>Solucione sus totales para continuar</p>'
      })
    }else{

    socket.emit('get:controlapulidonoconformes', inputidcontrolPulido.value)
    socket.on('get:controlapulidonoconformes',(results)=>{
      let respuesta = results.filter(respuesta=> respuesta.id == inputidcontrolPulido.value)
      respuesta.forEach((result)=>{
        total+= result.noconformestrabajados + resinput
      })

      let info = {
        id: inputidcontrolPulido.value,
        conformestrabajados: conformespulido.value - resinput,
        noconformestrabajados: total
       }
       console.log(info)
       socket.emit('emit:noconformesumapulido',info)  
    })

    socket.emit('get:ultimodetallepulido')
 
    socket.on('get:ultimodetallepulido',(resultado)=>{
      resultado.forEach(id=>{
        let hora = new Date()

        datos = {
          id: parseInt(id.id),
          fecha: new Date(), 
          horaFinaliza: hora.getHours() +':'+ hora.getMinutes(),   
          conformes: parseInt(conformespulido.value) - resinput,
          lineasFlujo: parseInt(lineaflujopulido.value),
          chupados: parseInt(chupadospulido.value),
          escurrido: parseInt(escurridopulido.value),
          burbujas: parseInt(burbujapulido.value),
          rotura: parseInt(roturapulido.value),
          bujes: parseInt(bujespulido.value), 
          presion:parseInt(presionpulido.value)
      }
    
      //Esto se cambiara por otra consulta de editar
       socket.emit('actualizar:detallecontrolpulido', datos)
      formcontrol.classList.add('d-none')
      buttonMostrar.classList.remove('d-none')
      })
    })

  
 
    }
})
let selectesperilado = document.getElementById('selectesmerilado')
let selectrebabeo = document.getElementById('selectrebabeo')
let selectresane = document.getElementById('selectresane')
let selectpulidoresane = document.getElementById('selectpulidoresane')
let selectpasarmacho = document.getElementById('selectpasarmacho')
let selectlavar = document.getElementById('selectlavar')
let actividadModal = document.getElementById('actividadmodal')

socket.on('get:detallescontrolpulido', (results)=>{
  let resultado = results.filter(dato=> dato.idcontrolpulido == inputidcontrolPulido.value )
  let filtrado = resultado.filter((dato)=>dato.actividad == 'Lavar' && dato.horaFinaliza !== null)
  console.log(filtrado)
   if(filtrado!=0){

    let info = {
      id:inputidcontrolPulido.value,
      cantidadFinal: conformespulido.value,
      conformesEntregados: conformespulido.value,
      fechaFinal: new Date(),
      horaFinal:hora.getHours() + ':' + hora.getMinutes(),
     }

    socket.emit('pulido:notificar', info )

    Swal.fire({
      title: 'Completado!',
      text: "Desea salir y esperar la revision del jefe de planta?",
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, salir!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Perfecto!',
          'Completo su proceso exitosamente.',
          'success'
        )
         setTimeout(() => {
          location.pathname = rutaAbsoluta
         },2000);    
      }
    })

   }else{
     console.log('nega')
   }

  
  resultado.forEach((item)=>{
    if(item.horaFinaliza == null){
      buttonMostrar.classList.remove('d-none')
      buttontime.classList.add('d-none')

    }else{
      buttonMostrar.classList.add('d-none')
      buttontime.classList.remove('d-none')
    }
  
    if(item.actividad == 'Esmerilado'){
    selectesperilado.classList.add('d-none')
    selectrebabeo.classList.remove('d-none')
    actividadModal.value = 'Rebabeo'
    }else if(item.actividad == 'Rebabeo'){
    selectrebabeo.classList.add('d-none')
    selectresane.classList.remove('d-none')
    actividadModal.value = 'Resane'
    }else if(item.actividad == 'Resane'){
    selectresane.classList.add('d-none')
    selectpulidoresane.classList.remove('d-none')
    actividadModal.value = 'Pulido de resanes'
    }else if(item.actividad == 'Pulido de resanes'){
    selectpulidoresane.classList.add('d-none')
    selectpasarmacho.classList.remove('d-none')
    actividadModal.value = 'Pasar macho'
    }else if(item.actividad == 'Pasar macho'){
    selectpasarmacho.classList.add('d-none')
    selectlavar.classList.remove('d-none')
    actividadModal.value = 'Lavar'
    }else if(item.actividad == 'Lavar'){
    selectlavar.classList.add('d-none')
    buttontime.classList.add('d-none')
    buttoniniciar.classList.add('d-none')

    }
  })
    
    let template = '';
     resultado.forEach((detalle,index)=>{
     template+=`<tr>
      <td>${index+1}</td>
      <td><strong>${detalle.referencia}</strong></td>
      <td><strong>${detalle.actividad}</strong></td>
      <td><strong>${moment(detalle.fecha).utc().format('DD/MM/YYYY')}</strong></td>
      <td><strong>${moment(detalle.horaInicio, 'HH:mm').format('h:mm A')}</strong></td>
      <td><strong>${(moment(detalle.horaFinaliza, 'HH:mm').format('h:mm A') == 'Invalid date')? '' : moment(detalle.horaFinaliza, 'HH:mm').format('h:mm A')}</strong></td>
      <td>${(detalle.conformes == null) ? '': detalle.conformes}</td>
      <td>${(detalle.lineasFlujo == null) ? '': detalle.lineasFlujo}</td>
      <td>${(detalle.chupados == null) ? '': detalle.chupados}</td>
      <td>${(detalle.escurrido == null) ? '': detalle.escurrido}</td>
      <td>${(detalle.presion == null)? '': detalle.presion}</td>
      <td>${(detalle.rotura) == null ? '' : detalle.rotura}</td>
      <td>${(detalle.bujes == null)? '' : detalle.bujes}</td>
      <td>${(detalle.burbujas == null)? '': detalle.burbujas}</td>
      </tr>`; 
      })

      mycontrolpulido.innerHTML= template
})

let cantInicial = document.getElementById('cantInicial')



socket.on('get:operadorpulido', (results)=>{
 let fillaislador = results.filter(fil=>fil.idPulido == inputidcontrolPulido.value)
 
 fillaislador.forEach(fil=>{

   cantInicial.innerHTML = `
   <span class="fw-semibold d-block mb-3">Cantidad inicio</span>
   <h1 class="card-title mb-2">${(fil.cantidadInicio == null) ? '0' : fil.cantidadInicio}</h1>
   `;
   //cantAgregada.innerHTML = `
   //<span class="fw-semibold d-block mb-3">Cantidad Agregada</span>
   ///<h1 class="card-title mb-2">${(fil.cantidadAgregada == null) ? '0' : fil.cantidadAgregada}</h1>
   //<small class="text-success m-3 fw-semibold"><i class="bx bx-up-arrow-alt" style='font-size:30px'></i></small>
   //`;
 


   cantNoConforme.innerHTML = `<span class="fw-semibold d-block mb-3">No conformes trabajados</span>
   <h1 class="card-title mb-2">${(fil.noconformestrabajados == null)? '0' : fil.noconformestrabajados}</h1>
    <a href='#' class='col-md-12'  data-bs-toggle="modal"
    data-bs-target="#modalScrollable">Ver detalles</a>
   `
   
   cantConformes.innerHTML = `<span class="fw-semibold d-block mb-3">Conformes trabajados</span>
   <h1 class="card-title mb-2">${(fil.conformestrabajados == null)? '0' : fil.noconformestrabajados}</h1>
   <small class="text-warning fw-semibold"><i class="bx bx-up-arrow-alt"></i></small>
   `

  conformespulido.value = fil.cantidadInicio - fil.noconformestrabajados

   let messagecantidad = document.querySelector('.messagecantidad')
   conformespulido.addEventListener('keyup',()=>{
    if(conformespulido.value > pen){
      conformespulido.style = 'border:2px solid red; color: red; font-size: 25px;'
      messagecantidad.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
      buttonTerminar.disabled = 'disabled'
    //  buttonnew.disabled= 'disabled'
  
    }
    else{
      conformespulido.style = 'font-size: 25px;'
      messagecantidad.innerHTML = ''
      btnRegister.disabled = ''
      buttonTerminar.disabled = ''
  
     // buttonnew.disabled=''
    }
  })

  })
})

let hora = new Date()
buttoniniciar.addEventListener('click',(e)=>{
  e.preventDefault()
  let inicio={
    idcontrolpulido: inputidcontrolPulido.value,
    horaInicio: hora.getHours() + ':' + hora.getMinutes(),
    fecha: new Date(),
    actividad: actividad.value,
    referencia: datospulido.referencia
  }
  //buttonMostrar.classList.remove('d-none')
  //buttontime.classList.add('d-none')
  socket.emit('insert:detallecontrolpulido',inicio)
})

let inputtecladoone = document.getElementById('inputtecladouno')
let inputtecladodos = document.getElementById('inputtecladodos')
let inputtecladotres = document.getElementById('inputtecladotres')
let inputtecladocuatro = document.getElementById('inputtecladocuatro')
let inputtecladocinco = document.getElementById('inputtecladocinco')
let inputtecladoseis = document.getElementById('inputtecladoseis')
let inputtecladosiete = document.getElementById('inputtecladosiete')


let enviarinputone = document.getElementById('enviarinputone')
let enviarinputdos = document.getElementById('enviarinputdos')
let enviarinputtres = document.getElementById('enviarinputtres')
let enviarinputcuatro = document.getElementById('enviarinputcuatro')
let enviarinputcinco = document.getElementById('enviarinputcinco')
let enviarinputseis = document.getElementById('enviarinputseis')
let enviarinputsiete = document.getElementById('enviarinputsiete')


let messagetecladoone = document.getElementById('messagetecladoone')
let messagetecladodos = document.getElementById('messagetecladodos')
let messagetecladotres = document.getElementById('messagetecladotres')
let messagetecladocuatro = document.getElementById('messagetecladocuatro')
let messagetecladocinco = document.getElementById('messagetecladocinco')
let messagetecladoseis = document.getElementById('messagetecladoseis')
let messagetecladosiete = document.getElementById('messagetecladosiete')
let messagetecladoocho = document.getElementById('messagetecladoocho')
let messagetecladonueve = document.getElementById('messagetecladonueve')
let messagetecladocero = document.getElementById('messagetecladocero')

const clearBtnone = document.getElementById("clearBtnone");
const clearBtndos = document.getElementById("clearBtndos");
const clearBtntres = document.getElementById("clearBtntres");
const clearBtncuatro = document.getElementById("clearBtncuatro");
const clearBtncinco = document.getElementById("clearBtncinco");
const clearBtnseis = document.getElementById("clearBtnseis");
const clearBtnsiete = document.getElementById("clearBtnsiete");
const clearBtnocho = document.getElementById("clearBtnocho");



let unolf = document.getElementById('unolf')
let doslf = document.getElementById('doslf')
let treslf = document.getElementById('treslf')
let cuatrolf = document.getElementById('cuatrolf')
let cincolf = document.getElementById('cincolf')
let seislf = document.getElementById('seislf')
let sietelf = document.getElementById('sietelf')
let ocholf = document.getElementById('ocholf')
let nuevelf = document.getElementById('nuevelf')
let cerolf = document.getElementById('cerolf')

let unoch = document.getElementById('unoch')
let dosch = document.getElementById('dosch')
let tresch = document.getElementById('tresch')
let cuatroch = document.getElementById('cuatroch')
let cincoch = document.getElementById('cincoch')
let seisch = document.getElementById('seisch')
let sietech = document.getElementById('sietech')
let ochoch = document.getElementById('ochoch')
let nuevech = document.getElementById('nuevech')
let ceroch = document.getElementById('ceroch')

let unoesc = document.getElementById('unoesc')
let dosesc = document.getElementById('dosesc')
let tresesc = document.getElementById('tresesc')
let cuatroesc = document.getElementById('cuatroesc')
let cincoesc = document.getElementById('cincoesc')
let seisesc = document.getElementById('seisesc')
let sieteesc = document.getElementById('sieteesc')
let ochoesc = document.getElementById('ochoesc')
let nueveesc = document.getElementById('nueveesc')
let ceroesc = document.getElementById('ceroesc')

let unobur = document.getElementById('unobur')
let dosbur = document.getElementById('dosbur')
let tresbur = document.getElementById('tresbur')
let cuatrobur = document.getElementById('cuatrobur')
let cincobur = document.getElementById('cincobur')
let seisbur = document.getElementById('seisbur')
let sietebur = document.getElementById('sietebur')
let ochobur = document.getElementById('ochobur')
let nuevebur = document.getElementById('nuevebur')
let cerobur = document.getElementById('cerobur')

let unorot = document.getElementById('unorot')
let dosrot = document.getElementById('dosrot')
let tresrot = document.getElementById('tresrot')
let cuatrorot = document.getElementById('cuatrorot')
let cincorot = document.getElementById('cincorot')
let seisrot = document.getElementById('seisrot')
let sieterot = document.getElementById('sieterot')
let ochorot = document.getElementById('ochorot')
let nueverot = document.getElementById('nueverot')
let cerorot = document.getElementById('cerorot')

let unobuj = document.getElementById('unobuj')
let dosbuj = document.getElementById('dosbuj')
let tresbuj = document.getElementById('tresbuj')
let cuatrobuj = document.getElementById('cuatrobuj')
let cincobuj = document.getElementById('cincobuj')
let seisbuj = document.getElementById('seisbuj')
let sietebuj = document.getElementById('sietebuj')
let ochobuj = document.getElementById('ochobuj')
let nuevebuj = document.getElementById('nuevebuj')
let cerobuj = document.getElementById('cerobuj')

let unopres = document.getElementById('unopres')
let dospres = document.getElementById('dospres')
let trespres = document.getElementById('trespres')
let cuatropres = document.getElementById('cuatropres')
let cincopres = document.getElementById('cincopres')
let seispres = document.getElementById('seispres')
let sietepres = document.getElementById('sietepres')
let ochopres = document.getElementById('ochopres')
let nuevepres = document.getElementById('nuevepres')
let ceropres = document.getElementById('ceropres')

//Linea flujo 1
//Chupado 2
//Escurrido 3
//presion 4
//rotura 5
//bujes 6
//burbuja 7


lineaflujopulido.addEventListener('focus',()=>{
  inputtecladoone.value = lineaflujopulido.value
})
chupadospulido.addEventListener('focus',()=>{
  inputtecladodos.value = chupadospulido.value
})
escurridopulido.addEventListener('focus',()=>{
  inputtecladotres.value = escurridopulido.value
})
bujespulido.addEventListener('focus',()=>{
  inputtecladoseis.value = bujespulido.value
})
roturapulido.addEventListener('focus',()=>{
  inputtecladocinco.value = roturapulido.value
})
presionpulido.addEventListener('focus',()=>{
  inputtecladocuatro.value = presionpulido.value
})
burbujapulido.addEventListener('focus',()=>{
  inputtecladosiete.value = burbujapulido.value
})



unolf.addEventListener('click', (e) => {
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladoone.value += unolf.value = 1;
  inputtecladoone.focus()
  const input = document.activeElement;
    if(inputtecladoone.value > pen){
      inputtecladoone.style = 'border:2px solid red; color: red; font-size: 25px;'
      messagetecladoone.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
      enviarinputone.disabled = 'disabled'
      buttonTerminar.disabled = 'disabled'
    //  buttonnew.disabled= 'disabled'
  
    }
    else{
      inputtecladoone.style = 'font-size: 25px;'
      messagetecladoone.innerHTML = ''
      buttonTerminar.disabled = ''
      enviarinputone.disabled = ''
     // buttonnew.disabled=''
    }
});
doslf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= doslf.value= 2
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    inputtecladoone.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoone.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputone.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoone.style = 'font-size: 25px;'
    messagetecladoone.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputone.disabled = ''
   // buttonnew.disabled=''
  }
})
treslf.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladoone.value+= treslf.value =3
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    inputtecladoone.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoone.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputone.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoone.style = 'font-size: 25px;'
    messagetecladoone.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputone.disabled = ''

   // buttonnew.disabled=''
  }
})
cuatrolf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= cuatrolf.value = 4
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    inputtecladoone.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoone.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputone.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoone.style = 'font-size: 25px;'
    messagetecladoone.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputone.disabled = ''

   // buttonnew.disabled=''
  }
})
cincolf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= cincolf.value = 5
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    inputtecladoone.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoone.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputone.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoone.style = 'font-size: 25px;'
    messagetecladoone.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputone.disabled = ''

   // buttonnew.disabled=''
  }
})
seislf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= seislf.value = 6
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    inputtecladoone.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoone.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputone.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoone.style = 'font-size: 25px;'
    messagetecladoone.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputone.disabled = ''
   // buttonnew.disabled=''
  }
})
sietelf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= sietelf.value = 7
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    inputtecladoone.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoone.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputone.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoone.style = 'font-size: 25px;'
    messagetecladoone.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputone.disabled = ''
   // buttonnew.disabled=''
  }
})
ocholf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= ocholf.value = 8
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    inputtecladoone.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoone.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputone.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoone.style = 'font-size: 25px;'
    messagetecladoone.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputone.disabled = ''
   // buttonnew.disabled=''
  }
})
nuevelf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= nuevelf.value = 9
  inputtecladodos.focus()
  if(inputtecladoone.value > pen){
    inputtecladoone.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoone.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputone.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoone.style = 'font-size: 25px;'
    messagetecladoone.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputone.disabled = ''
   // buttonnew.disabled=''
  }
})
cerolf.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= cerolf.value = 0
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    inputtecladoone.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoone.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputone.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoone.style = 'font-size: 25px;'
      messagetecladoone.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputone.disabled = ''
   // buttonnew.disabled=''
  }
})
clearBtnone.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Lock.ogg';
  sound.play();
  let input = document.activeElement
  inputtecladoone.value = ''
  inputtecladoone.focus()
  enviarinputone.disabled = ''
  inputtecladoone.style = 'font-size: 25px;'
  messagetecladoone.innerHTML = ''

})
enviarinputone.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Unlock_VA_Mode.ogg';
  sound.play();
  lineaflujopulido.value = inputtecladoone.value
})


unoch.addEventListener('click', (e) => {
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladodos.value += unoch.value = 1;
  inputtecladodos.focus()
  const input = document.activeElement;
    if(inputtecladodos.value > pen){
      inputtecladodos.style = 'border:2px solid red; color: red; font-size: 25px;'
      messagetecladodos.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
      enviarinputdos.disabled = 'disabled'
      buttonTerminar.disabled = 'disabled'
    //  buttonnew.disabled= 'disabled'
  
    }
    else{
      inputtecladodos.style = 'font-size: 25px;'
      messagetecladodos.innerHTML = ''
      buttonTerminar.disabled = ''
      enviarinputdos.disabled = ''
     // buttonnew.disabled=''
    }
});
dosch.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= dosch.value= 2
  inputtecladodos.focus()
  if(inputtecladodos.value > pen){
    inputtecladodos.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladodos.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputdos.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladodos.style = 'font-size: 25px;'
    messagetecladodos.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputdos.disabled = ''
   // buttonnew.disabled=''
  }
})
tresch.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladodos.value+= tresch.value =3
  inputtecladodos.focus()
  if(inputtecladodos.value > pen){
    inputtecladodos.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladodos.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputdos.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladodos.style = 'font-size: 25px;'
    messagetecladodos.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputdos.disabled = ''

   // buttonnew.disabled=''
  }
})
cuatroch.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= cuatroch.value = 4
  inputtecladodos.focus()
  if(inputtecladodos.value > pen){
    inputtecladodos.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladodos.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputdos.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'
  }
  else{
    inputtecladodos.style = 'font-size: 25px;'
    messagetecladodos.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputdos.disabled = ''

   // buttonnew.disabled=''
  }
})
cincoch.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= cincoch.value = 5
  inputtecladodos.focus()
  if(inputtecladodos.value > pen){
    inputtecladodos.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladodos.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputdos.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladodos.style = 'font-size: 25px;'
    messagetecladodos.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputdos.disabled = ''

   // buttonnew.disabled=''
  }
})
seisch.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= seisch.value = 6
  inputtecladodos.focus()
  if(inputtecladodos.value > pen){
    inputtecladodos.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladodos.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputdos.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladodos.style = 'font-size: 25px;'
    messagetecladodos.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputdos.disabled = ''
   // buttonnew.disabled=''
  }
})
sietech.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= sietech.value = 7
  inputtecladodos.focus()
  if(inputtecladodos.value > pen){
    console.log('es mayor')
    inputtecladodos.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladodos.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputdos.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladodos.style = 'font-size: 25px;'
    messagetecladodos.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputdos.disabled = ''
   // buttonnew.disabled=''
  }
})
ochoch.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= ochoch.value = 8
  inputtecladodos.focus()
  if(inputtecladodos.value > pen){
    console.log('es mayor')
    inputtecladodos.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladodos.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputdos.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladodos.style = 'font-size: 25px;'
    messagetecladodos.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputdos.disabled = ''
   // buttonnew.disabled=''
  }
})
nuevech.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= nuevech.value = 9
  inputtecladodos.focus()
  if(inputtecladodos.value > pen){
    inputtecladodos.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladodos.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputdos.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladodos.style = 'font-size: 25px;'
    messagetecladodos.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputdos.disabled = ''
   // buttonnew.disabled=''
  }
})
ceroch.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= ceroch.value = 0
  inputtecladodos.focus()
  if(inputtecladodos.value > pen){
    inputtecladodos.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladodos.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputdos.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladodos.style = 'font-size: 25px;'
      messagetecladodos.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputdos.disabled = ''
   // buttonnew.disabled=''
  }
})
clearBtndos.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Lock.ogg';
  sound.play();
  let input = document.activeElement
  inputtecladodos.value = ''
  inputtecladodos.focus()
  enviarinputdos.disabled = ''
  inputtecladodos.style = 'font-size: 25px;'
  messagetecladodos.innerHTML = ''

})
enviarinputdos.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Unlock_VA_Mode.ogg';
  sound.play();
  chupadospulido.value = inputtecladodos.value
})

unopres.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladocuatro.value += unopres.value = 1;
  inputtecladocuatro.focus()
  const input = document.activeElement;
    if(inputtecladocuatro.value > pen){
      inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
      messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
      enviarinputcuatro.disabled = 'disabled'
      buttonTerminar.disabled = 'disabled'
    //  buttonnew.disabled= 'disabled'
  
    }
    else{
      inputtecladocuatro.style = 'font-size: 25px;'
      messagetecladocuatro.innerHTML = ''
      buttonTerminar.disabled = ''
      enviarinputcuatro.disabled = ''
     // buttonnew.disabled=''
    }
});
dospres.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= dospres.value= 2
  inputtecladocuatro.focus()
  if(inputtecladocuatro.value > pen){
    inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcuatro.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocuatro.style = 'font-size: 25px;'
    messagetecladocuatro.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcuatro.disabled = ''
   // buttonnew.disabled=''
  }
})
trespres.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladocuatro.value+= trespres.value =3
  inputtecladocuatro.focus()
  if(inputtecladocuatro.value > pen){
    inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcuatro.disabled = 'disabled'
    buttonTermcuatro.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocuatro.style = 'font-size: 25px;'
    messagetecladocuatro.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcuatro.disabled = ''

   // buttonnew.disabled=''
  }
})
cuatropres.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= cuatropres.value = 4
  inputtecladocuatro.focus()
  if(inputtecladocuatro.value > pen){
    inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcuatro.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'
  }
  else{
    inputtecladocuatro.style = 'font-size: 25px;'
    messagetecladocuatro.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcuatro.disabled = ''

   // buttonnew.disabled=''
  }
})
cincopres.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= cincopres.value = 5
  inputtecladocuatro.focus()
  if(inputtecladocuatro.value > pen){
    inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcuatro.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocuatro.style = 'font-size: 25px;'
    messagetecladocuatro.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcuatro.disabled = ''

   // buttonnew.disabled=''
  }
})
seispres.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= seispres.value = 6
  inputtecladocuatro.focus()
  if(inputtecladocuatro.value > pen){
    inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcuatro.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocuatro.style = 'font-size: 25px;'
    messagetecladocuatro.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcuatro.disabled = ''
   // buttonnew.disabled=''
  }
})
sietepres.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= sietepres.value = 7
  inputtecladocuatro.focus()
  if(inputtecladocuatro.value > pen){
    console.log('es mayor')
    inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcuatro.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocuatro.style = 'font-size: 25px;'
    messagetecladocuatro.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcuatro.disabled = ''
   // buttonnew.disabled=''
  }
})
ochopres.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= ochopres.value = 8
  inputtecladocuatro.focus()
  if(inputtecladocuatro.value > pen){
    console.log('es mayor')
    inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcuatro.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocuatro.style = 'font-size: 25px;'
    messagetecladocuatro.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcuatro.disabled = ''
   // buttonnew.disabled=''
  }
})
nuevepres.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= nuevepres.value = 9
  inputtecladocuatro.focus()
  if(inputtecladocuatro.value > pen){
    inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcuatro.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocuatro.style = 'font-size: 25px;'
    messagetecladocuatro.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcuatro.disabled = ''
   // buttonnew.disabled=''
  }
})
ceropres.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= ceropres.value = 0
  inputtecladocuatro.focus()
  if(inputtecladocuatro.value > pen){
    inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcuatro.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocuatro.style = 'font-size: 25px;'
      messagetecladocuatro.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcuatro.disabled = ''
   // buttonnew.disabled=''
  }
})
clearBtncuatro.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Lock.ogg';
  sound.play();
  let input = document.activeElement
  inputtecladocuatro.value = ''
  inputtecladocuatro.focus()
  enviarinputcuatro.disabled = ''
  inputtecladocuatro.style = 'font-size: 25px;'
  messagetecladocuatro.innerHTML = ''

})
enviarinputcuatro.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Unlock_VA_Mode.ogg';
  sound.play();
  presionpulido.value = inputtecladocuatro.value
})


unobur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladosiete.value += unobur.value = 1;
  inputtecladosiete.focus()
  const input = document.activeElement;
    if(inputtecladosiete.value > pen){
      inputtecladosiete.style = 'border:2px solid red; color: red; font-size: 25px;'
      messagetecladosiete.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
      enviarinputsiete.disabled = 'disabled'
      buttonTerminar.disabled = 'disabled'
    //  buttonnew.disabled= 'disabled'
  
    }
    else{
      inputtecladosiete.style = 'font-size: 25px;'
      messagetecladosiete.innerHTML = ''
      buttonTerminar.disabled = ''
      enviarinputsiete.disabled = ''
     // buttonnew.disabled=''
    }
});
dosbur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= dosbur.value= 2
  inputtecladosiete.focus()
  if(inputtecladosiete.value > pen){
    inputtecladosiete.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladosiete.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputsiete.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladosiete.style = 'font-size: 25px;'
    messagetecladosiete.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputsiete.disabled = ''
   // buttonnew.disabled=''
  }
})
tresbur.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladosiete.value+= tresbur.value =3
  inputtecladosiete.focus()
  if(inputtecladosiete.value > pen){
    inputtecladosiete.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladosiete.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputsiete.disabled = 'disabled'
    buttonTerosiete.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladosiete.style = 'font-size: 25px;'
    messagetecladosiete.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputsiete.disabled = ''

   // buttonnew.disabled=''
  }
})
cuatrobur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= cuatrobur.value = 4
  inputtecladosiete.focus()
  if(inputtecladosiete.value > pen){
    inputtecladosiete.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladosiete.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputsiete.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'
  }
  else{
    inputtecladosiete.style = 'font-size: 25px;'
    messagetecladosiete.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputsiete.disabled = ''

   // buttonnew.disabled=''
  }
})
cincobur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= cincobur.value = 5
  inputtecladosiete.focus()
  if(inputtecladosiete.value > pen){
    inputtecladosiete.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladosiete.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputsiete.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladosiete.style = 'font-size: 25px;'
    messagetecladosiete.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputsiete.disabled = ''

   // buttonnew.disabled=''
  }
})
seisbur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= seisbur.value = 6
  inputtecladosiete.focus()
  if(inputtecladosiete.value > pen){
    inputtecladosiete.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladosiete.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputsiete.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladosiete.style = 'font-size: 25px;'
    messagetecladosiete.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputsiete.disabled = ''
   // buttonnew.disabled=''
  }
})
sietebur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= sietebur.value = 7
  inputtecladosiete.focus()
  if(inputtecladosiete.value > pen){
    inputtecladosiete.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladosiete.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputsiete.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladosiete.style = 'font-size: 25px;'
    messagetecladosiete.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputsiete.disabled = ''
   // buttonnew.disabled=''
  }
})
ochobur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= ochobur.value = 8
  inputtecladosiete.focus()
  if(inputtecladosiete.value > pen){
    inputtecladosiete.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladosiete.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputsiete.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladosiete.style = 'font-size: 25px;'
    messagetecladosiete.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputsiete.disabled = ''
   // buttonnew.disabled=''
  }
})
nuevebur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= nuevebur.value = 9
  inputtecladosiete.focus()
  if(inputtecladosiete.value > pen){
    inputtecladosiete.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladosiete.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputsiete.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladosiete.style = 'font-size: 25px;'
    messagetecladosiete.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputsiete.disabled = ''
   // buttonnew.disabled=''
  }
})
cerobur.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= cerobur.value = 0
  inputtecladosiete.focus()
  if(inputtecladosiete.value > pen){
    inputtecladosiete.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladosiete.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputsiete.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladosiete.style = 'font-size: 25px;'
      messagetecladosiete.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputsiete.disabled = ''
   // buttonnew.disabled=''
  }
})
clearBtnsiete.addEventListener('click',(e)=>{
  e.preventDefault()
  let input = document.activeElement
  inputtecladosiete.value = ''
  inputtecladosiete.focus()
  enviarinputsiete.disabled = ''
  inputtecladosiete.style = 'font-size: 25px;'
  messagetecladosiete.innerHTML = ''

})
enviarinputsiete.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Unlock_VA_Mode.ogg';
  sound.play();
  burbujapulido.value = inputtecladosiete.value
})

unorot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladocinco.value += unorot.value = 1;
  inputtecladocinco.focus()
  const input = document.activeElement;
    if(inputtecladocinco.value > pen){
      inputtecladocinco.style = 'border:2px solid red; color: red; font-size: 25px;'
      messagetecladocinco.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
      enviarinputcinco.disabled = 'disabled'
      buttonTerminar.disabled = 'disabled'
    //  buttonnew.disabled= 'disabled'
  
    }
    else{
      inputtecladocinco.style = 'font-size: 25px;'
      messagetecladocinco.innerHTML = ''
      buttonTerminar.disabled = ''
      enviarinputcinco.disabled = ''
     // buttonnew.disabled=''
    }
});
dosrot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= dosrot.value= 2
  inputtecladocinco.focus()
  if(inputtecladocinco.value > pen){
    inputtecladocinco.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocinco.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcinco.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocinco.style = 'font-size: 25px;'
    messagetecladocinco.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcinco.disabled = ''
   // buttonnew.disabled=''
  }
})
tresrot.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladocinco.value+= tresrot.value =3
  inputtecladocinco.focus()
  if(inputtecladocinco.value > pen){
    inputtecladocinco.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocinco.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcinco.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocinco.style = 'font-size: 25px;'
    messagetecladocinco.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcinco.disabled = ''

   // buttonnew.disabled=''
  }
})
cuatrorot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= cuatrorot.value = 4
  inputtecladocinco.focus()
  if(inputtecladocinco.value > pen){
    inputtecladocinco.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocinco.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcinco.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'
  }
  else{
    inputtecladocinco.style = 'font-size: 25px;'
    messagetecladocinco.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcinco.disabled = ''

   // buttonnew.disabled=''
  }
})
cincorot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= cincorot.value = 5
  inputtecladocinco.focus()
  if(inputtecladocinco.value > pen){
    inputtecladocinco.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocinco.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcinco.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocinco.style = 'font-size: 25px;'
    messagetecladocinco.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcinco.disabled = ''

   // buttonnew.disabled=''
  }
})
seisrot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= seisrot.value = 6
  inputtecladocinco.focus()
  if(inputtecladocinco.value > pen){
    inputtecladocinco.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocinco.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcinco.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocinco.style = 'font-size: 25px;'
    messagetecladocinco.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcinco.disabled = ''
   // buttonnew.disabled=''
  }
})
sieterot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= sieterot.value = 7
  inputtecladocinco.focus()
  if(inputtecladocinco.value > pen){
    inputtecladocinco.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocinco.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcinco.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocinco.style = 'font-size: 25px;'
    messagetecladocinco.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcinco.disabled = ''
   // buttonnew.disabled=''
  }
})
ochorot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= ochorot.value = 8
  inputtecladocinco.focus()
  if(inputtecladocinco.value > pen){
    inputtecladocinco.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocinco.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcinco.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocinco.style = 'font-size: 25px;'
    messagetecladocinco.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcinco.disabled = ''
   // buttonnew.disabled=''
  }
})
nueverot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= nueverot.value = 9
  inputtecladocinco.focus()
  if(inputtecladocinco.value > pen){
    inputtecladocinco.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocinco.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcinco.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladocinco.style = 'font-size: 25px;'
    messagetecladocinco.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcinco.disabled = ''
   // buttonnew.disabled=''
  }
})
cerorot.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= cerorot.value = 0
  inputtecladocinco.focus()
  if(inputtecladocinco.value > pen){
    inputtecladocinco.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocinco.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcinco.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputteclacinco.style = 'font-size: 25px;'
    messagetecladocinco.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputcinco.disabled = ''
   // buttonnew.disabled=''
  }
})
clearBtncinco.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Lock.ogg';
  sound.play();
  let input = document.activeElement
  inputtecladocinco.value = ''
  inputtecladocinco.focus()
  enviarinputcinco.disabled = ''
  inputtecladocinco.style = 'font-size: 25px;'
  messagetecladocinco.innerHTML = ''

})
enviarinputcinco.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Unlock_VA_Mode.ogg';
  sound.play();
  roturapulido.value = inputtecladocinco.value
})

unobuj.addEventListener('click', (e)=>{
  e.preventDefault()
  inputtecladoseis.value += unobuj.value = 1;
  inputtecladoseis.focus()
  const input = document.activeElement;
    if(inputtecladoseis.value > pen){
      inputtecladoseis.style = 'border:2px solid red; color: red; font-size: 25px;'
      messagetecladoseis.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
      enviarinputseis.disabled = 'disabled'
      buttonTerminar.disabled = 'disabled'
    //  buttonnew.disabled= 'disabled'
  
    }
    else{
      inputtecladoseis.style = 'font-size: 25px;'
      messagetecladoseis.innerHTML = ''
      buttonTerminar.disabled = ''
      enviarinputseis.disabled = ''
     // buttonnew.disabled=''
    }
});
dosbuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= dosbuj.value= 2
  inputtecladoseis.focus()
  if(inputtecladoseis.value > pen){
    inputtecladoseis.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoseis.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputseis.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoseis.style = 'font-size: 25px;'
    messagetecladoseis.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputseis.disabled = ''
   // buttonnew.disabled=''
  }
})
tresbuj.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladoseis.value+= tresbuj.value =3
  inputtecladoseis.focus()
  if(inputtecladoseis.value > pen){
    inputtecladoseis.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoseis.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputseis.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladosiete.style = 'font-size: 25px;'
    messagetecladosiete.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputsiete.disabled = ''

   // buttonnew.disabled=''
  }
})
cuatrobuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= cuatrobuj.value = 4
  inputtecladoseis.focus()
  if(inputtecladoseis.value > pen){
    inputtecladoseis.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoseis.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputseis.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'
  }
  else{
    inputtecladoseis.style = 'font-size: 25px;'
    messagetecladoseis.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputseis.disabled = ''

   // buttonnew.disabled=''
  }
})
cincobuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= cincobuj.value = 5
  inputtecladoseis.focus()
  if(inputtecladoseis.value > pen){
    inputtecladoseis.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoseis.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputseis.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoseis.style = 'font-size: 25px;'
    messagetecladoseis.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputseis.disabled = ''

   // buttonnew.disabled=''
  }
})
seisbuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= seisbuj.value = 6
  inputtecladosseisfocus()
  if(inputtecladoseis.value > pen){
    inputtecladoseis.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoseis.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputseis.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoseis.style = 'font-size: 25px;'
    messagetecladoseis.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputseis.disabled = ''
   // buttonnew.disabled=''
  }
})
sietebuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= sietebuj.value = 7
  inputtecladoseis.focus()
  if(inputtecladoseis.value > pen){
    inputtecladoseis.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoseis.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputseis.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoseis.style = 'font-size: 25px;'
    messagetecladoseis.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputseis.disabled = ''
   // buttonnew.disabled=''
  }
})
ochobuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= ochobuj.value = 8
  inputtecladoseis.focus()
  if(inputtecladoseis.value > pen){
    inputtecladoseis.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoseis.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputseis.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoseis.style = 'font-size: 25px;'
    messagetecladoseis.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputseis.disabled = ''
   // buttonnew.disabled=''
  }
})
nuevebuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= nuevebuj.value = 9
  inputtecladoseis.focus()
  if(inputtecladoseis.value > pen){
    inputtecladosiete.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoseis.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputseis.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoseis.style = 'font-size: 25px;'
    messagetecladoseis.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputseis.disabled = ''
   // buttonnew.disabled=''
  }
})
cerobuj.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= cerobuj.value = 0
  inputtecladoseis.focus()
  if(inputtecladoseis.value > pen){
    inputtecladoseis.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoseis.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputseis.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputteclaseis.style = 'font-size: 25px;'
    messagetecladoseis.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputseis.disabled = ''
   // buttonnew.disabled=''
  }
})
clearBtnseis.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Lock.ogg';
  sound.play();
  let input = document.activeElement
  inputtecladoseis.value = ''
  inputtecladoseis.focus()
  enviarinputseis.disabled = ''
  inputtecladoseis.style = 'font-size: 25px;'
  messagetecladoseis.innerHTML = ''

})
enviarinputseis.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Unlock_VA_Mode.ogg';
  sound.play();
  bujespulido.value = inputtecladoseis.value
})

unoesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladotres.value += unoesc.value = 1;
  inputtecladotres.focus()
  const input = document.activeElement;
    if(inputtecladotres.value > pen){
      inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
      messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
      enviarinputtres.disabled = 'disabled'
      buttonTerminar.disabled = 'disabled'
    //  buttonnew.disabled= 'disabled'
  
    }
    else{
      inputtecladotres.style = 'font-size: 25px;'
      messagetecladotres.innerHTML = ''
      buttonTerminar.disabled = ''
      enviarinputtres.disabled = ''
     // buttonnew.disabled=''
    }
});
dosesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= dosesc.value= 2
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladosiete.style = 'font-size: 25px;'
    messagetecladosiete.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputsiete.disabled = ''
   // buttonnew.disabled=''
  }
})
tresesc.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladotres.value+= tresesc.value =3
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputtres.disabled = ''

   // buttonnew.disabled=''
  }
})
cuatroesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= cuatroesc.value = 4
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'
  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputtres.disabled = ''

   // buttonnew.disabled=''
  }
})
cincoesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= cincoesc.value = 5
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputtres.disabled = ''

   // buttonnew.disabled=''
  }
})
seisesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= seisesc.value = 6
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladootres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladosiete.style = 'font-size: 25px;'
    messagetecladosiete.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputsiete.disabled = ''
   // buttonnew.disabled=''
  }
})
sieteesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= sieteesc.value = 7
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputtres.disabled = ''
   // buttonnew.disabled=''
  }
})
ochoesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= ochoesc.value = 8
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputtres.disabled = ''
   // buttonnew.disabled=''
  }
})
nueveesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= nueveesc.value = 9
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputtres.disabled = ''
   // buttonnew.disabled=''
  }
})
ceroesc.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= ceroesc.value = 0
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputtres.disabled = ''
   // buttonnew.disabled=''
  }
})
clearBtntres.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Lock.ogg';
  sound.play();
  let input = document.activeElement
  inputtecladotres.value = ''
  inputtecladotres.focus()
  enviarinputtres.disabled = ''
  inputtecladotres.style = 'font-size: 25px;'
  messagetecladotres.innerHTML = ''

})
enviarinputtres.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Unlock_VA_Mode.ogg';
  sound.play();
  escurridopulido.value = inputtecladotres.value
})






//dlineaflujo.innerHTML =`<div class="bg-primary p-3 shadow-lg rounded text-white"style="font-size: 25px;">Lineas de flujo: <span class="shadow-lg flex-shrink-0 badge badge-center rounded-pill bg-success w-px-50 h-px-50">${lineaflujo}</span></div>`
//dchupados.innerHTML = `<div class="bg-primary p-3 shadow-lg rounded text-white"style="font-size: 25px;">Chupados: <span class="shadow-lg flex-shrink-0 badge badge-center rounded-pill bg-success w-px-50 h-px-50">${chupado}</span></div>`
//descurrido.innerHTML = `<div class="bg-primary p-3 shadow-lg rounded text-white"style="font-size: 25px;">Escurridos: <span class="shadow-lg flex-shrink-0 badge badge-center rounded-pill bg-success w-px-50 h-px-50">${escurrido}</span></div>`
//dburbujas.innerHTML = `<div class="bg-primary p-3 shadow-lg rounded text-white"style="font-size: 25px;">Burbuja: <span class="shadow-lg flex-shrink-0 badge badge-center rounded-pill bg-success w-px-50 h-px-50">${burbujas}</span></div>`
//drotura.innerHTML = `<div class="bg-primary p-3 shadow-lg rounded text-white"style="font-size: 25px;">Rotura: <span class="shadow-lg flex-shrink-0 badge badge-center rounded-pill bg-success w-px-50 h-px-50">${rotura}</span></div>`
//dbujes.innerHTML = `<div class="bg-primary p-3 shadow-lg rounded text-white"style="font-size: 25px;">Buje: <span class="shadow-lg flex-shrink-0 badge badge-center rounded-pill bg-success w-px-50 h-px-50">${bujes}</span></div>`
//dpresionllenado.innerHTML = `<div class="bg-primary p-3 shadow-lg rounded text-white"style="font-size: 25px;">Presion de llenado: <span class="shadow-lg flex-shrink-0 badge badge-center rounded-pill bg-success w-px-50 h-px-50">${presionllenado}</span></div>`
//dexcesosilicona.innerHTML = `<div class="bg-primary p-3 shadow-lg rounded text-white"style="font-size: 25px;">Exceso de silicona: <span class="shadow-lg flex-shrink-0 badge badge-center rounded-pill bg-success w-px-50 h-px-50">${excesoSilicona}</span></div>`
//dfallasmaquina.innerHTML = `<div class="bg-primary p-3 shadow-lg rounded text-white"style="font-size: 25px;">Falla en maquina: <span class="shadow-lg flex-shrink-0 badge badge-center rounded-pill bg-success w-px-50 h-px-50">${fallasMaquina}</span></div>`
//dmezclanoconforme.innerHTML = `<div class="bg-primary p-3 shadow-lg rounded text-white"style="font-size: 25px;">Mezcla no conforme: <span class="shadow-lg flex-shrink-0 badge badge-center rounded-pill bg-success w-px-50 h-px-50">${mezclaNoConforme}</span></div>`
//drespiradero.innerHTML = `<div class="bg-primary p-3 shadow-lg rounded text-white"style="font-size: 25px;">Respiradero: <span class="shadow-lg flex-shrink-0 badge badge-center rounded-pill bg-success w-px-50 h-px-50">${respiradero}</span></div>`
//dfinmezcla.innerHTML = `<div class="bg-primary p-3 shadow-lg rounded text-white"style="font-size: 25px;">Fin de mezcla: <span class="shadow-lg flex-shrink-0 badge badge-center rounded-pill bg-success w-px-50 h-px-50">${finMezcla}</span></div>`





