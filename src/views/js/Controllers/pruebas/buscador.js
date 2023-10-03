const io = require('socket.io-client');
const socket = io(`http://localhost:${process.env.SOCKET_PORT}`);

let mysClientes;
mysClientes = document.getElementById('mysClientes')
 
async function emitirClientes(){ await socket.emit('clientsModal')}

// Se llama a la función emitirClientes() para cargar los datos de los clientes una sola vez al cargar la página
emitirClientes();

let template = '';
socket.on('clientesModal', (results)=>{  
    console.log(results)
    const inputBuscador = document.getElementById('search');
    inputBuscador.addEventListener('input', function() {
        const valorBusqueda = inputBuscador.value.toLowerCase();
        const resultados = results.filter(function(dato) {
            return dato.nombre.toLowerCase().includes(valorBusqueda);
        });

        // Se limpia la variable 'template' antes de agregar los nuevos resultados del filtrado
        template = '';
        resultados.forEach((resultado)=>{
            template+=`
                <tr> 
                    <td>${resultado.cif}</td>
                    <td>${resultado.nombre}</td>
                    <td>${resultado.apellido}</td> 
                    <td>
                        <input type="button" value='Seleccionar' id="${resultado.id}" data-bs-dismiss="modal" class="btn btn-primary p-2 btn-select">  
                    </td>
                </tr>`;
        });
        mysClientes.innerHTML = template;
    });
});
