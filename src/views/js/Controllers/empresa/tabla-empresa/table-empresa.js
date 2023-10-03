const io = require('socket.io-client');
const socket = io(`http://localhost:${process.env.SOCKET_PORT}`);


let myEmpresa; 
document.addEventListener('DOMContentLoaded', ()=>{
myEmpresa = document.getElementById('myEmpresa')

 renderGetEmpresa()

})


async function renderGetEmpresa(){
  await socket.emit('get:Empresa')
}

 socket.on('set:Empresa',(results)=>{
    let template ="";
    let EmpresaList = results;
    console.log('Estos son los datos:',EmpresaList)

    EmpresaList.forEach(element=>{
      template+=`
    <div ${element.id} class='Seleccionar'>
   <tr> 
     <td><i class="fab fa-angular fa-lg text-danger me-2"></i> <strong>${element.id}</strong></td>
       <td>${element.descripcion}</td>
       <td>${element.nit}</td>
       <td> ${element.direccion} </td>
    
    <td>
     <div class="dropdown">
       <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
         <i class="bx bx-dots-vertical-rounded"></i>
     </button>
     <div class="dropdown-menu">
      <button class="dropdown-item" id=${element.id}>
      <i class="bx bx-edit-alt me-1"></i> Edit</button>
      <button class="dropdown-item" id=${element.id}>
      <i class="bx bx-trash me-1"></i> Delete</button>
    </div>
  </div>
 </td>
 </tr>
 </div>
 `;
    })

    myEmpresa.innerHTML= template;
})