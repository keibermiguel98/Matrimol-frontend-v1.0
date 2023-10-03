const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const moment = require('moment');
const path = require('path');
const sound = new Audio();
let rutaAbsolutasalir = path.join(__dirname, 'index.html')


let buttonMostrar = document.getElementById("mostrar")
let buttoncancelar = document.getElementById('btnCancelar')
let inputMaquinaria = document.getElementById('maquinaria')
let inputReferencia = document.getElementById('referencia')
let inputidcontrolbujes = document.getElementById('idcontrolbujes')

let nameoperador = document.getElementById('nameoperador')

let idoperador = JSON.parse(localStorage.getItem('idoperador'))
nameoperador.innerHTML = idoperador.nombre + idoperador.apellido +' / '+ idoperador.alias

//Input de add detalles
let inputLgBuje = document.getElementById('inputLgBuje')
let inputLgRoscaM = document.getElementById('inputLgRoscaMm')
let inputcantidad = document.getElementById('inputCantidad')


let inputPerforados = document.getElementById('inputPerforados')
let inputDescentrados = document.getElementById('inputDescentrados')
let inputLgRosca = document.getElementById('inputLgRosca')
let inputLgExterna = document.getElementById('inputLgExterna')
let inputRoscEquivocada = document.getElementById('inputRoscEquivocada')
let inputHerrPartida = document.getElementById('inputHerrPartida')
let buttonTerminar = document.getElementById('btnTerminar')


document.addEventListener('DOMContentLoaded',()=>{
    getControlProduccionBujes()
})

async function getControlProduccionBujes(){await socket.emit('get:controlproduccionbujestotales')}

let formcontrol = document.getElementById('formcontrol')

buttonMostrar.addEventListener('click', (e)=>{
    e.preventDefault()
    formcontrol.classList.remove('d-none')
    buttonMostrar.classList.add('d-none')
})

buttoncancelar.addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.pathname = rutaAbsolutasalir
})
 
let datos = JSON.parse(localStorage.getItem('datatareabuje'))
inputidcontrolbujes.value = datos.idBuje
let horas = new Date()

inputReferencia.value = datos.referenciaCompuesto
inputMaquinaria.value = datos.descripcion
inputidcontrolbujes.value = datos.idBuje
inputLgBuje.value = datos.longitudbuje
inputLgRoscaM.value = datos.longitudrosca

buttonTerminar.addEventListener('click', (e)=>{
    e.preventDefault()
    totalN = 0;
    let valor = document.querySelectorAll('input.n')
    for(i=0;i<valor.length; i++){
        if(valor[i].value !== ''){
        totalN+=parseInt(valor[i].value)
        }
    }
    
    let valorC = 0;
    let valorc = document.querySelectorAll('input.c')
    for(let i=0; i<valorc.length; i++){
        if(valorc[i].value !== ''){
           valorC+= parseInt(valorc[i].value)
        }
    }

    socket.emit('get:controlbujesnoconformes',inputidcontrolbujes.value)
    socket.on('get:controlbujesnoconformes', (resultado)=>{
       let totalfinaln = 0;
       let totalfinalc = 0;
       let cantidadProduccida = 0;

      resultado.forEach(item=>{
         totalfinaln+=item.noConformesReportados + totalN   
         totalfinalc+=item.conformes + valorC
         cantidadProduccida+= item.conformes + item.noConformesReportados + valorC + totalN;
      })

      let info = {
        id: inputidcontrolbujes.value,
        conformes: totalfinalc,
        noConformesReportados: totalfinaln,
        cantidadProduccida: cantidadProduccida
      }

      socket.emit('set:totalesbujes', info)
    })
    
    datos = {
        idcontrolbujes: inputidcontrolbujes.value,
        fecha: new Date(),
        hora:horas.getHours() + ':' + (horas.getMinutes()<10?'0':'') + horas.getMinutes(),
        cantidadConformes: inputcantidad.value,
        longitudBuje: inputLgBuje.value,
        herramientaPartidabuje: inputHerrPartida.value,
        perforados: inputPerforados.value,
        longitudRosca: inputLgRosca.value,
        roscaEquivocada: inputRoscEquivocada.value,
        descentrados: inputDescentrados.value, 
        longitudRoscaMM:inputLgRoscaM.value
    }
    socket.emit('detalles:controlbujes', datos)
    formcontrol.classList.add('d-none')
    buttonMostrar.classList.remove('d-none')
    limpiar()
  
})



function limpiar(){
    inputcantidad.value = ''
    inputPerforados.value = ''
    inputDescentrados.value = ''
    inputLgRosca.value =''
    inputRoscEquivocada.value = ''
    inputHerrPartida.value = ''
}


let mycontrolbujes;
document.addEventListener('DOMContentLoaded', ()=>{
 mycontrolbujes = document.getElementById('mycontrolbujes')
 getDetalleControlBujes()
})

async function getDetalleControlBujes(){
    await socket.emit('get:detallescontrolbujes')
}

socket.on('get:detallescontrolbujes', (results)=>{
  let resultado = results.filter(dato=> dato.idcontrolbujes == inputidcontrolbujes.value )
    let template = '';
     resultado.forEach((detalle,index)=>{
     template+=`<tr>
      <td>${index + 1}</td>
      <td><strong>${moment(detalle.fecha).utc().format('DD/MM/YYYY')}</strong></td>
      <td><strong>${moment(detalle.hora, 'HH:mm').format('h:mm A')}</strong></td>
      <td>${(detalle.cantidadConformes == '' || detalle.cantidadConformes == 0) ? '' : detalle.cantidadConformes}</td>
      <td class='text-primary'><strong>${detalle.longitudBuje}</strong></td>
      <td class='text-primary'><strong>${detalle.longitudRoscaMM}</strong></td>
      <td>${(detalle.perforados == '' || detalle.perforados == 0) ? '' : detalle.perforados}</td>
      <td>${(detalle.descentrados == '' || detalle.descentrados == 0) ? '' : detalle.descentrados}</td>
      <td>${(detalle.longitudRosca == '' || detalle.longitudRosca == 0) ? '' : detalle.longitudRosca}</td>
      <td>${(detalle.roscaEquivocada == '' || detalle.roscaEquivocada == 0) ? '' : detalle.roscaEquivocada}</td>
      <td>${(detalle.herramientaPartidaBuje == '' || detalle.herramientaPartidaBuje == 0) ? '' : detalle.herramientaPartidaBuje}</td>
     </tr>`; 

      })

      mycontrolbujes.innerHTML= template
})

let cantInicial = document.getElementById('cantInicial')
let cantAgregada = document.getElementById('cantAgregada')
let cantConforme = document.getElementById('cantConforme')
let cantNoConforme = document.getElementById('cantNoConforme')
let totalProducido = document.getElementById('totProducido')
let cantidadPendiente = document.getElementById('cantPen')

let pen;
socket.on('get:controlproduccionbujestotales',(datos)=>{
     pen = 0
     let fillbujes = datos.filter(fil=>fil.id == inputidcontrolbujes.value)

    fillbujes.forEach(fill=>{
   cantInicial.innerHTML = `
   <span class="fw-semibold d-block mb-3">Cantid inicial</span>
   <h1 class="card-title mb-2">${fill.cantidadAsignada}</h1>
   <small class="text-warning fw-semibold" style='font-size:20px;'><i class="bx bx-up-arrow-alt" ></i>${fill.cantidadAsignada - fill.cantidadAgregada}</small>
   `;

   cantAgregada.innerHTML = `
   <span class="fw-semibold d-block mb-3">Cantidad Agregada</span>
   <h1 class="card-title mb-2">${(fill.cantidadAgregada == null)? '0' : fill.cantidadAgregada}</h1>
   <small class="text-success m-3 fw-semibold"><i class="bx bx-up-arrow-alt"></i></small>
   `

   cantConforme.innerHTML = `
   <span class="fw-semibold d-block mb-3">Conformes</span>
   <h1 class="card-title mb-2">${fill.conformes}</h1>
   
   <small class="text-warning fw-semibold"><i class="bx bx-up-arrow-alt"></i></small>
   `

   cantNoConforme.innerHTML = `
   <span class="fw-semibold d-block mb-3">No conformes</span>
   <h1 class="card-title mb-2">${fill.noConformesReportados}</h1>
   <small class="text-success m-3 fw-semibold"><i class="bx bx-up-arrow-alt"></i></small>
   `
   totalProducido.innerHTML = `
   <p>Total Produccidos</p>
   <h1>${fill.cantidadProduccida}</h1>
   `

   cantidadPendiente.innerHTML = `
   <p>Pendientes por fabricar</p>
   <h1>${fill.cantidadAsignada - fill.conformes}</h1>
   `
    pen+= fill.cantidadAsignada - fill.conformes

    if(pen == 0){
        buttonMostrar.classList.add('d-none') 
       }
   let messagecantidad = document.querySelector('.messagecantidad')
   inputcantidad.addEventListener('keyup',()=>{
    if(inputcantidad.value > pen){
      inputcantidad.style = 'border:2px solid red; color: red; font-size: 25px;'
      messagecantidad.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
      buttonTerminar.disabled = 'disabled'
    //  buttonnew.disabled= 'disabled'
  
    }
    else{
      inputcantidad.style = 'font-size: 25px;'
      messagecantidad.innerHTML = ''
      buttonTerminar.disabled = ''
  
     // buttonnew.disabled=''
    }
  })
    })
})



let messageConformes = document.querySelector('.messageCantidad')
let inputtecladoone = document.getElementById('inputtecladouno')
let inputtecladodos = document.getElementById('inputtecladodos')
let inputtecladotres = document.getElementById('inputtecladotres')
let inputtecladocuatro = document.getElementById('inputtecladocuatro')
let inputtecladocinco = document.getElementById('inputtecladocinco')
let inputtecladoseis = document.getElementById('inputtecladoseis')

let enviarinputone = document.getElementById('enviarinputone')
let enviarinputdos = document.getElementById('enviarinputdos')
let enviarinputtres = document.getElementById('enviarinputtres')
let enviarinputcuatro = document.getElementById('enviarinputcuatro')
let enviarinputcinco = document.getElementById('enviarinputcinco')
let enviarinputseis = document.getElementById('enviarinputseis')


let messagetecladoone = document.getElementById('messagetecladoone')
let messagetecladodos = document.getElementById('messagetecladodos')
let messagetecladotres = document.getElementById('messagetecladotres')
let messagetecladocuatro = document.getElementById('messagetecladocuatro')
let messagetecladocinco = document.getElementById('messagetecladocinco')
let messagetecladoseis = document.getElementById('messagetecladoseis')


let objeto = `                    
 <button class="col-3 btn btn-primary m-2 rounded p-4" style="font-size: 20px;" id="uno">1</button>
<button class="col-3 btn btn-primary m-2 rounded p-4" style="font-size: 20px;" id="dos">2</button>
<button class="col-3 btn btn-primary m-2 rounded p-4" style="font-size: 20px;" id="tres">3</button>
<button class="col-3 btn btn-primary m-2 rounded p-4" style="font-size: 20px;" id="cuatro">4</button>
<button class="col-3 btn btn-primary m-2 rounded p-4" style="font-size: 20px;" id="cinco">5</button>
<button class="col-3 btn btn-primary m-2 rounded p-4" style="font-size: 20px;" id="seis">6</button>
<button class="col-3 btn btn-primary m-2 rounded p-4" style="font-size: 20px;" id="siete">7</button>
<button class="col-3 btn btn-primary m-2 rounded p-4" style="font-size: 20px;" id="ocho">8</button>
<button class="col-3 btn btn-primary m-2 rounded p-4" style="font-size: 20px;" id="nueve">9</button>
<button class="col-3 btn btn-primary m-2 rounded p-4" style="font-size: 20px;" id="cero">0</button>
<button class="btn btn-success col-3 m-2 rounded" id="clearBtn" value="Clear"><i class='bx bx-trash bx-md'></i></button>
<button class="btn btn-info col-3 m-2 rounded-pill" id="numsubmit"><i class='bx bxs-send bx-md'></i></button>`

let teclado = document.querySelector('.teclado')
const clearBtn = document.getElementById("clearBtn");
const clearBtndos = document.getElementById("clearBtndos");
const clearBtntres = document.getElementById("clearBtntres");
const clearBtncuatro = document.getElementById("clearBtncuatro");
const clearBtncinco = document.getElementById("clearBtncinco");
const clearBtnseis = document.getElementById("clearBtnseis");


let uno = document.getElementById('uno')
let dos = document.getElementById('dos')
let tres = document.getElementById('tres')
let cuatro = document.getElementById('cuatro')
let cinco = document.getElementById('cinco')
let seis = document.getElementById('seis')
let siete = document.getElementById('siete')
let ocho = document.getElementById('ocho')
let nueve = document.getElementById('nueve')
let cero = document.getElementById('cero')

let unoper = document.getElementById('unoper')
let dosper = document.getElementById('dosper')
let tresper = document.getElementById('tresper')
let cuatroper = document.getElementById('cuatroper')
let cincoper = document.getElementById('cincoper')
let seisper = document.getElementById('seisper')
let sieteper = document.getElementById('sieteper')
let ochoper = document.getElementById('ochoper')
let nueveper = document.getElementById('nueveper')
let cerolper= document.getElementById('ceroper')

let unodesc = document.getElementById('unodesc')
let dosdesc = document.getElementById('dosdesc')
let tresdesc = document.getElementById('tresdesc')
let cuatrodesc = document.getElementById('cuatrodesc')
let cincodesc = document.getElementById('cincodesc')
let seisdesc = document.getElementById('seisdesc')
let sietedesc = document.getElementById('sietedesc')
let ochodesc = document.getElementById('ochodesc')
let nuevedesc = document.getElementById('nuevedesc')
let cerodesc = document.getElementById('cerodesc')

let unolr = document.getElementById('unolr')
let doslr = document.getElementById('doslr')
let treslr = document.getElementById('treslr')
let cuatrolr = document.getElementById('cuatrolr')
let cincolr = document.getElementById('cincolr')
let seislr = document.getElementById('seislr')
let sietelr = document.getElementById('sietelr')
let ocholr = document.getElementById('ocholr')
let nuevelr = document.getElementById('nuevelr')
let cerolr = document.getElementById('cerolr')

let unore = document.getElementById('unore')
let dosre = document.getElementById('dosre')
let tresre = document.getElementById('tresre')
let cuatrore = document.getElementById('cuatrore')
let cincore = document.getElementById('cincore')
let seisre = document.getElementById('seisre')
let sietere = document.getElementById('sietere')
let ochore = document.getElementById('ochore')
let nuevere = document.getElementById('nuevere')
let cerore = document.getElementById('cerore')

let unohp = document.getElementById('unohp')
let doshp = document.getElementById('doshp')
let treshp = document.getElementById('treshp')
let cuatrohp = document.getElementById('cuatrohp')
let cincohp = document.getElementById('cincohp')
let seishp = document.getElementById('seishp')
let sietehp = document.getElementById('sietehp')
let ochohp = document.getElementById('ochohp')
let nuevehp = document.getElementById('nuevehp')
let cerohp = document.getElementById('cerohp')



inputcantidad.addEventListener('focus',()=>{
  inputtecladoone.value = inputcantidad.value
})
inputPerforados.addEventListener('focus',()=>{
  inputtecladodos.value = inputPerforados.value
})
inputDescentrados.addEventListener('focus',()=>{
  inputtecladotres.value = inputDescentrados.value
})
inputLgRosca.addEventListener('focus',()=>{
  inputtecladocuatro.value = inputLgRosca.value
})

inputRoscEquivocada.addEventListener('focus',()=>{
  inputtecladocinco.value = inputRoscEquivocada.value
})
inputHerrPartida.addEventListener('focus',()=>{
  inputtecladoseis.value = inputHerrPartida.value
})


uno.addEventListener('click', (e) => {
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();

  inputtecladoone.value += uno.value = 1;
  inputtecladoone.focus()
  const input = document.activeElement;
    if(inputtecladoone.value > pen){
      console.log('es mayor')
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
dos.addEventListener('click', (e)=>{
  e.preventDefault()
  const input = document.activeElement
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladoone.value+= dos.value= 2
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    console.log('es mayor')
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
tres.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladoone.value+= tres.value =3
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    console.log('es mayor')
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
cuatro.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= cuatro.value = 4
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    console.log('es mayor')
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
cinco.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= cinco.value = 5
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    console.log('es mayor')
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
seis.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= seis.value = 6
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    console.log('es mayor')
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
siete.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= siete.value = 7
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    console.log('es mayor')
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
ocho.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= ocho.value = 8
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    console.log('es mayor')
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
nueve.addEventListener('click', (e)=>{
  e.preventDefault()
  const input = document.activeElement
  inputtecladoone.value+= nueve.value = 9
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    console.log('es mayor')
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
cero.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoone.value+= cero.value = 0
  inputtecladoone.focus()
  if(inputtecladoone.value > pen){
    console.log('es mayor')
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
clearBtn.addEventListener('click',(e)=>{
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
  inputcantidad.value = inputtecladoone.value
})



unoper.addEventListener('click', (e) => {
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladodos.value += unoper.value = 1;
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
      inputtecladoone.style = 'font-size: 25px;'
      messagetecladodos.innerHTML = ''
      buttonTerminar.disabled = ''
      enviarinputdos.disabled = ''
     // buttonnew.disabled=''
    }
});
dosper.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= dosper.value= 2
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
tresper.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladodos.value+= tresper.value =3
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
cuatroper.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= cuatroper.value = 4
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
cincoper.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= cincoper.value = 5
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
seisper.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= seisper.value = 6
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
sieteper.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= sieteper.value = 7
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
ochoper.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= ochoper.value = 8
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
nueveper.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= nueveper.value = 9
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
cerolper.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= cerolper.value = 0
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
  inputPerforados.value = inputtecladodos.value
})

unodesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladotres.value += unodesc.value = 1;
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
dosdesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= dosdesc.value= 2
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
tresdesc.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladotres.value+= tresdesc.value =3
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    enviarinputtres.disabled = ''

   // buttonnew.disabled=''
  }
})
cuatrodesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= cuatrodesc.value = 4
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'
  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    enviarinputtres.disabled = ''

   // buttonnew.disabled=''
  }
})
cincodesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= cincodesc.value = 5
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    enviarinputtres.disabled = ''

   // buttonnew.disabled=''
  }
})
seisdesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= seisdesc.value = 6
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    enviarinputtres.disabled = ''
   // buttonnew.disabled=''
  }
})
sietedesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= sietedesc.value = 7
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    enviarinputtres.disabled = ''
   // buttonnew.disabled=''
  }
})
ochodesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= ochodesc.value = 8
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    enviarinputtres.disabled = ''
   // buttonnew.disabled=''
  }
})
nuevedesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= nuevedesc.value = 9
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
    messagetecladotres.innerHTML = ''
    enviarinputtres.disabled = ''
   // buttonnew.disabled=''
  }
})
cerodesc.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= cerodesc.value = 0
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    inputtecladotres.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladotres.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputtres.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladotres.style = 'font-size: 25px;'
      messagetecladotres.innerHTML = ''
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
  inputDescentrados.value = inputtecladotres.value
})


unolr.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladocuatro.value += unolr.value = 1;
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
doslr.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= doslr.value= 2
  inputtecladocuatro.focus()
  if(inputtecladocuatro.value > pen){
    inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcuatro.disabled = 'disabled'
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
treslr.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladocuatro.value+= treslr.value =3
  inputtecladocuatro.focus()
  if(inputtecladocuatro.value > pen){
    inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcuatro.disabled = 'disabled'
    buttonTermcinco.disabled = 'disabled'
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
cuatrolr.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= cuatrolr.value = 4
  inputtecladocuatro.focus()
  if(inputtecladocuatro.value > pen){
    inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcuatro.disabled = 'disabled'
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
cincolr.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= cincolr.value = 5
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
seislr.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= seislr.value = 6
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
sietelr.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= sietelr.value = 7
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
ocholr.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= ocholr.value = 8
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
nuevelr.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= nuevelr.value = 9
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
cerolr.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= cerolr.value = 0
  inputtecladocuatro.focus()
  if(inputtecladocuatro.value > pen){
    inputtecladocuatro.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocuatro.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcuatro.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
      inputtecladocuatro.style = 'font-size: 25px;'
      messagetecladocuatro.innerHTML = ''
      enviarinputcuatro.disabled = ''
   // buttonnew.disabled=''
  }
})
clearBtncuatro.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
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
  inputLgRosca.value = inputtecladocuatro.value
})

unore.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladocinco.value += unore.value = 1;
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
dosre.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= dosre.value= 2
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
tresre.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladocinco.value+= tresre.value =3
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
cuatrore.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= cuatrore.value = 4
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
cincore.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= cincore.value = 5
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
seisre.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= seisre.value = 6
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
sietere.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= sietere.value = 7
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
ochore.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= ochore.value = 8
  inputtecladocinco.focus()
  if(inputtecladocinco.value > pen){
    inputtecladocinco.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocinco.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcinco.disabled = 'disabled'
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
nuevere.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= nuevere.value = 9
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
cerore.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= cerore.value = 0
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
  sound.src = '../assets/sonidos/Unlock_VA_Mode.ogg';
  sound.play();
  e.preventDefault()
  inputRoscEquivocada.value = inputtecladocinco.value
})


unohp.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladoseis.value += unohp.value = 1;
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
doshp.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= doshp.value= 2
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
treshp.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladoseis.value+= treshp.value =3
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
cuatrohp.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= cuatrohp.value = 4
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
cincohp.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= cincohp.value = 5
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
seishp.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= seishp.value = 6
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
sietehp.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= sietehp.value = 7
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
ochohp.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= ochohp.value = 8
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
nuevehp.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= nuevehp.value = 9
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
cerohp.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= cerohp.value = 0
  inputtecladoseis.focus()
  if(inputtecladoseis.value > pen){
    inputtecladoseis.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoseis.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputseis.disabled = 'disabled'
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
  inputHerrPartida.value = inputtecladoseis.value
})


   


  
 

  