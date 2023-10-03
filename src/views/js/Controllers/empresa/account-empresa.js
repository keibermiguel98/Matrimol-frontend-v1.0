const Swal = require('sweetalert2')

const io = require('socket.io-client');
const socket = io(`http://localhost:${process.env.SOCKET_PORT}`);

const descripcion = document.querySelector('#descripcion')
const nit = document.querySelector('#nit')
const direccion = document.querySelector('#direccion')
const btnGuardar = document.querySelector('#btnGuardar');
const btnCancelar = document.getElementById('btnCancelar')


btnGuardar.addEventListener('click', (e)=>{
    e.preventDefault()

    const dataEmpresa = {
        descripcion: descripcion.value,
        nit: nit.value,
        direccion: direccion.value,
    }

    console.log(dataEmpresa)
     
    socket.emit('Add:Empresa', dataEmpresa)

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your work has been saved',
        showConfirmButton: false,
        timer: 1500
      })
      
      window.location.pathname = './src/views/tables-empresa.html'

})

btnCancelar.addEventListener('click',(e)=>{
    e.preventDefault()
    window.location.pathname = './src/views/tables-productos.html'
})
