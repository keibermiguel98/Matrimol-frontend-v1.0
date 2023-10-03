const io = require('socket.io-client');
const socket = io(`http://localhost:${process.env.SOCKET_PORT}`);

let myordenpdf;
 
document.addEventListener('DOMContentLoaded', ()=>{
    getOrdenProduccionPdf()
})

myordenpdf = document.getElementById('myordenpdf')


async function getOrdenProduccionPdf(){ await socket.emit('add:pdforden')}

socket.on('add:pdforden', (pdforden)=>{
    console.log(pdforden)
 let template = '';
  pdforden.forEach((info,index)=>{
    template+= `<tr> 
    <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${index + 1}</strong></td>
      <td>${info.id}</td>
      <td>${info.idClientes}</td>
      <td>${info.descripcion} </td>
      <td>${info.exportPais} </td>
      <td>${info.fabricMolde} </td>
      
   
</tr>`
  });

  myordenpdf.innerHTML = template;

})
