const io = require('socket.io-client');
const socket = io(`http://192.168.1.128:${process.env.SOCKET_PORT}`); 
const Swal = require('sweetalert2')
const moment = require('moment');
const sound = new Audio();

const path = require('path')
let rutaAbsoluta = path.join(__dirname, 'panelbujesaisladores.html')

let messageConformes = document.querySelector('.messageCantidad')
let inputtecladoone = document.getElementById('inputtecladouno')
let inputtecladodos = document.getElementById('inputtecladodos')
let inputtecladotres = document.getElementById('inputtecladotres')
let inputtecladocuatro = document.getElementById('inputtecladocuatro')
let inputtecladocinco = document.getElementById('inputtecladocinco')
let inputtecladoseis = document.getElementById('inputtecladoseis')
let inputtecladosiete = document.getElementById('inputtecladosiete')
let inputtecladoocho = document.getElementById('inputtecladoocho')

let enviarinputone = document.getElementById('enviarinputone')
let enviarinputdos = document.getElementById('enviarinputdos')
let enviarinputtres = document.getElementById('enviarinputtres')
let enviarinputcuatro = document.getElementById('enviarinputcuatro')
let enviarinputcinco = document.getElementById('enviarinputcinco')
let enviarinputseis = document.getElementById('enviarinputseis')
let enviarinputsiete = document.getElementById('enviarinputsiete')
let enviarinputocho = document.getElementById('enviarinputocho')

let btnRegister = document.getElementById('btnRegister')
let buttonMostrar = document.getElementById("mostrar")
let butcancelar = document.getElementById('btnCancela')
let inputMaquinaria = document.getElementById('maquinaria')
let inputReferencia = document.getElementById('referencia')
let inputidcontrolaisladores = document.getElementById('idcontrolaisladores')

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
let inputconforme = document.getElementById('inputconforme')
let inputlineaflujo = document.getElementById('inputlineaflujo')
let inputchupado = document.getElementById('inputchupado')
let inputescurrido = document.getElementById('inputescurrido')
let inputburbuja = document.getElementById('inputburbuja')
let inputrotura = document.getElementById('inputrotura')
let inputbujes = document.getElementById('inputbujes')
let inputincompleto = document.getElementById('inputincompleto')

//Totalidades//
let cantConformes = document.getElementById('cantConforme')
let cantNoConforme = document.getElementById('cantNoConforme')
let totProducido = document.getElementById('totProducido')
let cantPendiente = document.querySelector('.cantPendiente')

let buttonTerminar = document.getElementById('btnTerminar')
let formcontrol = document.getElementById('formcontrol')
let totales = document.getElementById('totales')
let nombreoperador = document.getElementById('nombreoperador')

butcancelar.addEventListener('click',(e)=>{
  e.preventDefault()
  formcontrol.classList.add('d-none')
  buttonMostrar.classList.remove('d-none')
  totales.classList.remove('d-none')
  nombreoperador.classList.remove('d-none')
})

buttonMostrar.addEventListener('click', (e)=>{
    e.preventDefault()
    formcontrol.classList.remove('d-none')
    buttonMostrar.classList.add('d-none')

})

 
let datos = JSON.parse(localStorage.getItem('datatareabuje'))
let idoperador = JSON.parse(localStorage.getItem('idoperador'))

inputReferencia.value = datos.referencia
inputMaquinaria.value = datos.descripcion
inputidcontrolaisladores.value = datos.idAislador

//Pendiente por limpiar campos
function limpiar(){
  inputconforme.value = ''
  inputlineaflujo.value = ''
  inputchupado.value = ''
  inputescurrido.value = ''
  inputburbuja.value = ''
  inputrotura.value = ''
  inputbujes.value = ''
  inputincompleto.value = ''
}

let nameoperador = document.getElementById('nameoperador')
nameoperador.innerHTML = idoperador.nombre + ' ' + idoperador.apellido + ' / ' + idoperador.alias


let mycontrolAisladores;
document.addEventListener('DOMContentLoaded', ()=>{
 
 mycontrolAisladores = document.getElementById('mycontrolaisladores')
  handleemitcontrolaisladores()
  getDetalleControlAisladores()
 // getControlAisladores()
})

async function getDetalleControlAisladores(){
    await socket.emit('get:detallescontrolaisladores')
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
    let restotal = 0
    
    let inputsC = document.querySelectorAll('input.c')
    for(i=0; i<inputsC.length; i++){
      if(inputsC[i].value !== ''){
        totalC+=parseInt(inputsC[i].value) 
      }
    }
 let totalTotales = 0
    let inputt = document.querySelectorAll('input.t')
    for(i=0; i<inputt.length; i++){
      if(inputt[i].value !== ''){
        totalTotales+=parseInt(inputt[i].value) 
      }
    }
     if(totalTotales > pen){
      Swal.fire({
        icon: 'error',
        title: 'Algo salio mal',
        text: 'Lo sentimos, la cantidad entre Conformes y no conformes es mayor a cantidad pendiente!',
        footer: '<p>Solucione sus totales para continuar</p>'
      })
     }else{
      totalTotales = 0

    socket.emit('get:controlaisladoresnoconformes', inputidcontrolaisladores.value)
    socket.on('get:controlaisladoresnoconformes',(results)=>{
      let respuesta = results.filter(respuesta=> respuesta.id == inputidcontrolaisladores.value)
      let totalproduc = 0;
      respuesta.forEach((result)=>{
        totalproduc+= result.conformes + totalC +  result.noConformesReport + resinput
        restotal+=result.conformes + totalC
        total+= result.noConformesReport + resinput
      })

      let info = {
        id: inputidcontrolaisladores.value,
        conformes: restotal,
        noConformesReport: total,
        totalProducido: totalproduc
       }
       socket.emit('emit:noconformesuma',info)  
    })


    let hora = new Date()

    datos = {
      idcontrolaisladores: parseInt(inputidcontrolaisladores.value),
      hora: hora.getHours() + ':'+ hora.getMinutes(),
      fecha: new Date(),
      conformes: parseInt(inputconforme.value),
      lineasFlujo: parseInt(inputlineaflujo.value),
      chupados: parseInt(inputchupado.value),
      escurrido: parseInt(inputescurrido.value),
      burbujas: parseInt(inputburbuja.value),
      rotura: parseInt(inputrotura.value),
      bujes: parseInt(inputbujes.value), 
      incompleto:parseInt(inputincompleto.value)
  }


  socket.emit('insert:detallecontrolaisladores', datos)
  formcontrol.classList.add('d-none')
  buttonMostrar.classList.remove('d-none')
  limpiar()
     }
})

socket.on('get:detallescontrolaisladores', (results)=>{
  let resultado = results.filter(dato=> dato.idcontrolaisladores == inputidcontrolaisladores.value )
    let template = '';
     resultado.forEach((detalle,index)=>{
     template+=`<tr>
      <td>${index + 1}</td>
      <td><strong>${moment(detalle.fecha).utc().format('DD/MM/YYYY')}</strong></td>
      <td><strong>${moment(detalle.hora, 'HH:mm').format('h:mm A')}</strong></td>

      <td>${(detalle.conformes == null) ? '' : detalle.conformes}</td>
      <td>${(detalle.lineasFlujo == null) ? '' : detalle.lineasFlujo}</td>
      <td>${(detalle.chupados == null) ? '' : detalle.chupados}</td>
      <td>${(detalle.escurrido == null) ? '': detalle.escurrido}</td>
      <td>${(detalle.burbujas == null) ? '': detalle.burbujas}</td>
      <td>${(detalle.rotura == null) ? '': detalle.rotura}</td>
      <td>${(detalle.bujes == null) ? '': detalle.bujes}</td>
      <td>${(detalle.incompleto==null)? '': detalle.incompleto}</td>
     </tr>`; 
      })
      mycontrolAisladores.innerHTML= template


})

let cantInicial = document.getElementById('cantInicial')
let cantAgregada = document.getElementById('cantAgregada')

let result;
let pen;

socket.on('get:controlaisladores', (results)=>{
 let fillaislador = results.filter(fil=>fil.idAislador == inputidcontrolaisladores.value)
 result=0;
 pen=0
 fillaislador.map((item)=>{
  result+= item.cantidadAsignada - item.cantidadAgregada
 })
 
 fillaislador.forEach(fil=>{

   cantInicial.innerHTML = `
   <span class="fw-semibold d-block mb-3">Cantid inicial</span>
   <h1 class="card-title mb-2">${fil.cantidadAsignada}</h1>
   <small class="text-warning fw-semibold" style='font-size:20px;'><i class="bx bx-up-arrow-alt" ></i>${result}</small>
   `;
   cantAgregada.innerHTML = `
   <span class="fw-semibold d-block mb-3">Cantidad Agregada</span>
   <h1 class="card-title mb-2">${(fil.cantidadAgregada == null) ? '0' : fil.cantidadAgregada}</h1>
   <small class="text-success m-3 fw-semibold"><i class="bx bx-up-arrow-alt" style='font-size:30px'></i></small>
   `;
 
   pen+=fil.cantidadAsignada - fil.totalProducido
 

   cantPendiente.innerHTML = `
   <p>Pendientes por fabricar</p>
   <h1>${pen}</h1>`

   cantNoConforme.innerHTML = `<span class="fw-semibold d-block mb-3">No conformes</span>
   <h1 class="card-title mb-2">${fil.noConformesReport}</h1>
    <a href='#' class='col-md-12'  data-bs-toggle="modal"
    data-bs-target="#modalScrollable">Ver detalles</a>
   `
   
   cantConformes.innerHTML = `<span class="fw-semibold d-block mb-3">Conformes</span>
   <h1 class="card-title mb-2">${fil.conformes}</h1>
   <small class="text-warning fw-semibold"><i class="bx bx-up-arrow-alt"></i></small>
   `

   totProducido.innerHTML = `
   <p>Total Produccidos</p>
   <h1>${fil.totalProducido}</h1>`

   if(pen == 0){
    buttonMostrar.classList.add('d-none') 
    btnRegister.classList.remove('d-none')
   }else{
    buttonMostrar.classList.remove('d-none') 
    btnRegister.classList.add('d-none')
   }
  })

  inputconforme.addEventListener('keyup',()=>{
    if(inputconforme.value > pen){
      inputconforme.style = 'border:2px solid red; color: red; font-size: 25px;'
      messageConformes.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
      buttonTerminar.disabled = 'disabled'
    //  buttonnew.disabled= 'disabled'
  
    }
    else{
      inputconforme.style = 'font-size: 25px;'
      messageConformes.innerHTML = ''
      buttonTerminar.disabled = ''
  
     // buttonnew.disabled=''
    }
  })
})


btnRegister.addEventListener('click', (e)=>{
  e.preventDefault()
 // socket.emit('finalizar:controlaisladores', inputidcontrolaisladores.value)
  socket.emit('notificar:controlaisladores', inputidcontrolaisladores.value)
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Notificado',
    showConfirmButton: false,
    timer: 1500
  })
  setTimeout(()=>{
    location.pathname = rutaAbsoluta

  },1500)
})



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
const clearBtnsiete = document.getElementById("clearBtnsiete");
const clearBtnocho = document.getElementById("clearBtnocho");



let inputs = document.querySelectorAll("input[type='number']")
inputs.forEach((input)=>{
  input.addEventListener('focus',(e)=>{
     e.preventDefault()
    switch(input.id){
      case 'inputconforme': 
      teclado.classList.remove('d-none')
      
      break;
      case 'inputlineaflujo': 
      teclado.classList.remove('d-none')
      break;
      case 'inputchupado':
        teclado.classList.remove('d-none')
      break;
      case 'inputescurrido': 
      teclado.classList.remove('d-none')
      break;
      case 'inputburbuja':
        teclado.classList.remove('d-none')
      break;
      case 'inputrotura': 
        teclado.classList.remove('d-none')
        break;
      case 'inputbujes': 
      teclado.classList.remove('d-none')
      break;
    
      case 'inputincompleto':
         teclado.classList.remove('d-none')
         break;
    } 
  })
})

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

let unoinc = document.getElementById('unoinc')
let dosinc = document.getElementById('dosinc')
let tresinc = document.getElementById('tresinc')
let cuatroinc = document.getElementById('cuatroinc')
let cincoinc = document.getElementById('cincoinc')
let seisinc = document.getElementById('seisinc')
let sieteinc = document.getElementById('sieteinc')
let ochoinc = document.getElementById('ochoinc')
let nueveinc = document.getElementById('nueveinc')
let ceroinc = document.getElementById('ceroinc')



inputconforme.addEventListener('focus',()=>{
  inputtecladoone.value = inputconforme.value
})
inputlineaflujo.addEventListener('focus',()=>{
  inputtecladodos.value = inputlineaflujo.value
})
inputchupado.addEventListener('focus',()=>{
  inputtecladotres.value = inputchupado.value
})
inputescurrido.addEventListener('focus',()=>{
  inputtecladocuatro.value = inputescurrido.value
})

inputburbuja.addEventListener('focus',()=>{
  inputtecladocinco.value = inputburbuja.value
})
inputrotura.addEventListener('focus',()=>{
  inputtecladoseis.value = inputrotura.value
})
inputbujes.addEventListener('focus',()=>{
  inputtecladosiete.value = inputbujes.value
})

inputincompleto.addEventListener('focus',()=>{
  inputtecladoocho.value = inputincompleto.value
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
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
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
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
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
  inputconforme.value = inputtecladoone.value
})


unolf.addEventListener('click', (e) => {
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladodos.value += unolf.value = 1;
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
doslf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= doslf.value= 2
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
treslf.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladodos.value+= treslf.value =3
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
cuatrolf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= cuatrolf.value = 4
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
cincolf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= cincolf.value = 5
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
seislf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= seislf.value = 6
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
sietelf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= sietelf.value = 7
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
ocholf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= ocholf.value = 8
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
nuevelf.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= nuevelf.value = 9
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
cerolf.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladodos.value+= cerolf.value = 0
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
  inputlineaflujo.value = inputtecladodos.value
})


unoch.addEventListener('click', (e) => {
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladotres.value += unoch.value = 1;
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
dosch.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= dosch.value= 2
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
tresch.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladotres.value+= tresch.value =3
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
cuatroch.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= cuatroch.value = 4
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
cincoch.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= cincoch.value = 5
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
seisch.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= seis.value = 6
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
sietech.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= sietech.value = 7
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    console.log('es mayor')
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
ochoch.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= ocho.value = 8
  inputtecladotres.focus()
  if(inputtecladotres.value > pen){
    console.log('es mayor')
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
nuevech.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= nueve.value = 9
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
ceroch.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladotres.value+= cero.value = 0
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
  inputchupado.value = inputtecladotres.value
})

unoesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladocuatro.value += unoesc.value = 1;
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
dosesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= dosesc.value= 2
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
tresesc.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladocuatro.value+= tresesc.value =3
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
cuatroesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= cuatroesc.value = 4
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
cincoesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= cincoesc.value = 5
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
seisesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= seisesc.value = 6
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
sieteesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= sieteesc.value = 7
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
ochoesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= ochoesc.value = 8
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
nueveesc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocuatro.value+= nueveesc.value = 9
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
  inputescurrido.value = inputtecladocuatro.value
})


unobur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladocinco.value += unobur.value = 1;
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
dosbur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= dosbur.value= 2
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
tresbur.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladocinco.value+= tresbur.value =3
  inputtecladocinco.focus()
  if(inputtecladocinco.value > pen){
    inputtecladocinco.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladocinco.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputcinco.disabled = 'disabled'
    buttonTermcinco.disabled = 'disabled'
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
cuatrobur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= cuatrobur.value = 4
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
cincobur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= cincobur.value = 5
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
seisbur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= seisbur.value = 6
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
sietebur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= sietebur.value = 7
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
ochobur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= ochobur.value = 8
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
nuevebur.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= nuevebur.value = 9
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
cerobur.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladocinco.value+= ceroesc.value = 0
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
      messageteclacinco.innerHTML = ''
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
  inputburbuja.value = inputtecladocinco.value
})

unorot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladoseis.value += unorot.value = 1;
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
dosrot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= dosrot.value= 2
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
tresrot.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladoseis.value+= tresrot.value =3
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
cuatrorot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= cuatrorot.value = 4
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
cincorot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= cincorot.value = 5
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
seisrot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= seisrot.value = 6
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
sieterot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= sieterot.value = 7
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
ochorot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= ochorot.value = 8
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
nueverot.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= nueverot.value = 9
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
cerorot.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoseis.value+= cerorot.value = 0
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
  inputrotura.value = inputtecladoseis.value
})

unobuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladosiete.value += unobuj.value = 1;
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
dosbuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= dosbuj.value= 2
  inputtecladosiete.focus()
  if(inputtecladosiete.value > pen){
    inputtecladosiete.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladosiete.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputsiete.disabled = 'disabled'
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
  inputtecladosiete.value+= tresbuj.value =3
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
cuatrobuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= cuatrobuj.value = 4
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
cincobuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= cincobuj.value = 5
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
seisbuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= seisbuj.value = 6
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
sietebuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= sietebuj.value = 7
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
ochobuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= ochobuj.value = 8
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
nuevebuj.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladosiete.value+= nuevebuj.value = 9
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
cerobuj.addEventListener('click',(e)=>{
  e.preventDefault()
  const input = document.activeElement
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladosiete.value+= cerobuj.value = 0
  inputtecladosiete.focus()
  if(inputtecladosiete.value > pen){
    inputtecladosiete.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladosiete.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputsiete.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputteclasiete.style = 'font-size: 25px;'
    messagetecladosiete.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputsiete.disabled = ''
   // buttonnew.disabled=''
  }
})
clearBtnsiete.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Lock.ogg';
  sound.play();
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
  inputbujes.value = inputtecladosiete.value
})

unoinc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladoocho.value += unoinc.value = 1;
  inputtecladoocho.focus()
  const input = document.activeElement;
    if(inputtecladoocho.value > pen){
      inputtecladoocho.style = 'border:2px solid red; color: red; font-size: 25px;'
      messagetecladoocho.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
      enviarinputocho.disabled = 'disabled'
      buttonTerminar.disabled = 'disabled'
    //  buttonnew.disabled= 'disabled'
  
    }
    else{
      inputtecladoocho.style = 'font-size: 25px;'
      messagetecladoocho.innerHTML = ''
      buttonTerminar.disabled = ''
      enviarinputocho.disabled = ''
     // buttonnew.disabled=''
    }
});
dosinc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoocho.value+= dosinc.value= 2
  inputtecladoocho.focus()
  if(inputtecladoocho.value > pen){
    inputtecladoocho.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoocho.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputocho.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoocho.style = 'font-size: 25px;'
    messagetecladoocho.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputocho.disabled = ''
   // buttonnew.disabled=''
  }
})
tresinc.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  inputtecladoocho.value+= tresinc.value =3
  inputtecladoocho.focus()
  if(inputtecladoocho.value > pen){
    inputtecladoocho.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoocho.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputocho.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoocho.style = 'font-size: 25px;'
    messagetecladoocho.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputocho.disabled = ''

   // buttonnew.disabled=''
  }
})
cuatroinc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoocho.value+= cuatroinc.value = 4
  inputtecladoocho.focus()
  if(inputtecladoocho.value > pen){
    inputtecladoocho.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoocho.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputocho.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'
  }
  else{
    inputtecladoocho.style = 'font-size: 25px;'
    messagetecladoocho.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputocho.disabled = ''

   // buttonnew.disabled=''
  }
})
cincoinc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoocho.value+= cincoinc.value = 5
  inputtecladoocho.focus()
  if(inputtecladoocho.value > pen){
    inputtecladoocho.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoocho.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputocho.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoocho.style = 'font-size: 25px;'
    messagetecladoocho.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputocho.disabled = ''

   // buttonnew.disabled=''
  }
})
seisinc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoocho.value+= seisinc.value = 6
  inputtecladoocho.focus()
  if(inputtecladoocho.value > pen){
    inputtecladoocho.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoocho.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputocho.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoocho.style = 'font-size: 25px;'
    messagetecladoocho.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputocho.disabled = ''
   // buttonnew.disabled=''
  }
})
sieteinc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoocho.value+= sieteinc.value = 7
  inputtecladoocho.focus()
  if(inputtecladoocho.value > pen){
    inputtecladoocho.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoocho.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputocho.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoocho.style = 'font-size: 25px;'
    messagetecladoocho.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputocho.disabled = ''
   // buttonnew.disabled=''
  }
})
ochoinc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoocho.value+= ochoinc.value = 8
  inputtecladoocho.focus()
  if(inputtecladoocho.value > pen){
    inputtecladoocho.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoocho.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputocho.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoocho.style = 'font-size: 25px;'
    messagetecladoocho.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputocho.disabled = ''
   // buttonnew.disabled=''
  }
})
nueveinc.addEventListener('click', (e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoocho.value+= nueveinc.value = 9
  inputtecladoocho.focus()
  if(inputtecladoocho.value > pen){
    inputtecladoocho.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoocho.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputocho.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoocho.style = 'font-size: 25px;'
    messagetecladoocho.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputocho.disabled = ''
   // buttonnew.disabled=''
  }
})
ceroinc.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Bixby_BOS.ogg';
  sound.play();
  const input = document.activeElement
  inputtecladoocho.value+= ceroinc.value = 0
  inputtecladoocho.focus()
  if(inputtecladoocho.value > pen){
    inputtecladoocho.style = 'border:2px solid red; color: red; font-size: 25px;'
    messagetecladoocho.innerHTML = 'Este campo no puede ser mayor a "Pendientes por fabricar"'
    enviarinputocho.disabled = 'disabled'
    buttonTerminar.disabled = 'disabled'
  //  buttonnew.disabled= 'disabled'

  }
  else{
    inputtecladoocho.style = 'font-size: 25px;'
    messagetecladoocho.innerHTML = ''
    buttonTerminar.disabled = ''
    enviarinputocho.disabled = ''
   // buttonnew.disabled=''
  }
})
clearBtnocho.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Lock.ogg';
  sound.play();
  let input = document.activeElement
  inputtecladoocho.value = ''
  inputtecladoocho.focus()
  enviarinputocho.disabled = ''
  inputtecladoocho.style = 'font-size: 25px;'
  messagetecladoocho.innerHTML = ''

})
enviarinputocho.addEventListener('click',(e)=>{
  e.preventDefault()
  sound.src = '../assets/sonidos/Unlock_VA_Mode.ogg';
  sound.play();
  inputincompleto.value = inputtecladoocho.value
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





