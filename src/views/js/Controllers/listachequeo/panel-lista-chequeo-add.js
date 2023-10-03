const io = require('socket.io-client');
const socket = io(`http://localhost:${process.env.SOCKET_PORT}`);
 
 let reqinscliente = document.getElementById('reqinscliente');
 let reqpruebas = document.getElementById('reqpruebas');
 let condicioneslegregla = document.getElementById('condicioneslegregla')
 let antidel = document.getElementById('anticipodel')
 let saldoanticipomaterialdespacho = document.getElementById('saldoalanunciomaterialdespacho')
 let saldoalrecibomaterial = document.getElementById('saldoalrecibomaterial')
 let saldoalrecibodefactura = document.getElementById('saldoalrecibofactura')
 let saldoalosdiasradicada = document.getElementById('saldoalosdiasradicada')
 let creditoalosdias = document.getElementById('creditoalosdias')
 let aceptaentregasparciales = document.getElementById('aceptaentregasparciales')
 let aceptafacturacionparcial = document.getElementById('aceptafacturacionparcial')
 let polizadecumplimientocontrato = document.getElementById('polizadecumplimientocontrato')
 let polizadebuenmanejoanticipo = document.getElementById('polizadebuenmanejoanticipo')
 let polizagarantiamateriales = document.getElementById('polizagarantiamateriales')
 let polizacargocliente = document.getElementById('polizacargocliente')
 let cobrarfleteseguro = document.getElementById('cobrarfleteseguro')
 let despachoconfletealcobro = document.getElementById('despachoconfletealcobro')
 let incluyesuministradocliente = document.getElementById('incluyesuministradocliente')
 let anexaplanos = document.getElementById('anexaplanos')
 let planospendientesporanexar = document.getElementById('planospendientesporanexar')
 let requieredocumentacionadicional = document.getElementById('requiredocumentacionadicional')

 let buttonEnviar = document.getElementById('buttonEnviar')

 let inputAnticipo = document.getElementById('inputAnticipo')
 let inputradicadafactura = document.getElementById('inputradicadafactura')
 let inputcreditoalosdias = document.getElementById('inputcreditoalosdias')


 let requiereInspeCliente = '';
reqinscliente.addEventListener('change', (e) => {
  if (reqinscliente.checked) {
    requiereInspeCliente = 'Si';    
  } else {
    requiereInspeCliente = 'No';
  }
});

console.log(requiereInspeCliente)

let requierepruebas;
  reqpruebas.addEventListener('change',(e)=>{
  if(reqpruebas.checked){
   requierepruebas = 'Si'
  }else{
   requierepruebas = 'No'
  }
})
let condicioneslegales;
condicioneslegregla.addEventListener('change',(e)=>{
  if(condicioneslegregla.checked){
    condicioneslegales = 'Si'
  }else{
    condicioneslegales = 'No'
  }
})

let anticipodel;
antidel.addEventListener('change',(e)=>{
  if(antidel.checked){
    anticipodel = 'Si'
    inputAnticipo.disabled = ''
    inputAnticipo.value = ''
    inputAnticipo.placeholder = 'Ingrese un %'
  }else{
    anticipodel = 0
    inputAnticipo.disabled = 'disabled'
    inputAnticipo.value = 'Sin anticipo'
  }
})

let saldoanticipomaterial;
saldoanticipomaterialdespacho.addEventListener('change', (e)=>{
  if(saldoanticipomaterialdespacho.checked){
    saldoanticipomaterial = 'Si'
  }else{
    saldoanticipomaterial = 'No'
  }
})

let saldoReciboMaterial;
saldoalrecibomaterial.addEventListener('change',(e)=>{
  if(condicioneslegregla.checked){
    saldoReciboMaterial = 'Si'
  }else{
    saldoReciboMaterial = 'No'
  }
})

let saldoReciboFactura;
saldoalrecibodefactura.addEventListener('change',(e)=>{
  if(saldoalrecibodefactura.checked){
    saldoReciboFactura = 'Si'
  }else{
    saldoReciboFactura = 'No'
  }
})

let saldoAlosDiasRadicada;
saldoalosdiasradicada.addEventListener('change',(e)=>{
  if(saldoalosdiasradicada.checked){
    saldoAlosDiasRadicada = 'Si'
  }else{
    saldoAlosDiasRadicada = 'No'
  }
})

let creditoDias;
creditoalosdias.addEventListener('change',(e)=>{
  if(creditoalosdias.checked){
    creditoDias = 'Si'
  }else{
    creditoDias = 'No'
  }
})

let aceptaentregasparcial;
aceptaentregasparciales.addEventListener('change',(e)=>{
  if(aceptaentregasparciales.checked){
    aceptaentregasparcial = 'Si'
  }else{
    aceptaentregasparcial = 'No'
  }
})

let aceptafacturacionparciales;
aceptafacturacionparcial.addEventListener('change',(e)=>{
  if(aceptafacturacionparcial.checked){
    aceptafacturacionparciales = 'Si'
  }else{
    aceptafacturacionparciales = 'No'
  }
})

let polizacumplimientocontrato;
polizadecumplimientocontrato.addEventListener('click',(e)=>{
  if(polizadecumplimientocontrato.checked){
    polizacumplimientocontrato = 'Si'
  }else{
    polizacumplimientocontrato = 'No'
  }
})
  
let polizabuenmanejo;
polizadebuenmanejoanticipo.addEventListener('click',(e)=>{
  if(polizadebuenmanejoanticipo.checked){
    polizabuenmanejo = 'Si'
  }else{
    polizabuenmanejo = 'No'
  }
})

let polizagarantiamaterial;
polizagarantiamateriales.addEventListener('click',(e)=>{
  if(polizagarantiamateriales.checked){
    polizagarantiamaterial = 'Si'
  }else{
    polizagarantiamaterial = 'No'
  }
})


let polizacargoclientes;
polizacargocliente.addEventListener('click',(e)=>{
  if(polizacargocliente.checked){
    polizacargoclientes = 'Si'
  }else{
    polizacargoclientes = 'No'
  }
})

let cobrarfleteseguros;
cobrarfleteseguro.addEventListener('click',(e)=>{
  if(cobrarfleteseguro.checked){
    cobrarfleteseguros = 'Si'
  }else{
    cobrarfleteseguros = 'No'
  }
})

let despachoconflete;
despachoconfletealcobro.addEventListener('click',(e)=>{
  if(despachoconfletealcobro.checked){
    despachoconflete = 'Si'
  }else{
    despachoconflete = 'No'
  }
})

let incluyesuministrado;
 incluyesuministradocliente.addEventListener('click',(e)=>{
  if(incluyesuministradocliente.checked){
    incluyesuministrado = 'Si'
  }else{
    incluyesuministrado = 'No'
  }
})

let anexaplano;
 anexaplanos.addEventListener('click',(e)=>{
  if(anexaplanos.checked){
   anexaplano= 'Si'
  }else{
    anexaplano = 'No'
  }
})

let planospendientes;
  planospendientesporanexar.addEventListener('click',(e)=>{
  if(planospendientesporanexar.checked){
    planospendientes= 'Si'
  }else{
    planospendientes = 'No'
  }
})

let requieredocumentacion;
  requieredocumentacionadicional.addEventListener('click',(e)=>{
  if(requieredocumentacionadicional.checked){
    requieredocumentacion= 'Si'
  }else{
    requieredocumentacion = 'No'
  }
})

 let informacion = {
  requiereInspeCliente: requiereInspeCliente,
  requierePruebas: requierepruebas,
  condicionReglasAplican: condicioneslegales,
  anticipo: anticipodel,
  saldoAnuncioMaterialDespacho: saldoanticipomaterial,
  saldoAlReciboMaterial:saldoReciboMaterial,
  saldoAlReciboFactura: saldoReciboFactura,
  saldoDiasDeRadicadaFactura:saldoAlosDiasRadicada,
  creditoDiasDeRadicadaFactura: creditoDias,
  aceptaEntregasParciales: aceptaentregasparcial,
  aceptaFacturacionParcial: aceptafacturacionparciales,
  polizaCumplimientoContrato: polizacumplimientocontrato,
  polizaBuenManejoAnticipo:polizabuenmanejo,
  polizaGarantinaMateriales:polizagarantiamaterial,
  polizaCargoCliente: polizacargoclientes,
  cobrarFleteConSeguroFactura: cobrarfleteseguros,
  despachoFleteAlCobro: despachoconflete,
  incluyeProductSuminCliente: incluyesuministrado,
  anexaPlanos: anexaplano,
  planosPendientAnexar: planospendientes,
  RequiereDocumentacionAdicional: requieredocumentacion
 }

console.log(informacion)

buttonEnviar.addEventListener('click',(e)=>{
  e.preventDefault()
  socket.emit('add:chequeo', informacion)
  console.log(informacion)
})