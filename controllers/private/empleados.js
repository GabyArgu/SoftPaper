// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_USUARIOS = SERVER + 'private/usuarios.php?action=';
const ENDPOINT_CARGO = SERVER + 'private/cargo_empleado.php?action=readAll';
const ENDPOINT_AVATAR = SERVER + 'private/avatar.php?action=readAll';

const options = {
    "info": false,
    "columnDefs": [
        {
            "targets": [0],
            "visible": false
        }
    ],
    "searching": false,
    "dom":
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-2 text-center'l><'col-sm-10'p>>",
    "language": {
        "lengthMenu": "Mostrando _MENU_ registros",
        "paginate": {
            "next": '<i class="bi bi-arrow-right-short"></i>',
            "previous": '<i class="bi bi-arrow-left-short"></i>'
        }
    },
    "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "Todos"]]
};


document.addEventListener('DOMContentLoaded', function () {

    readRows(API_USUARIOS);
    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#table-empleados', options);

        /*Función para mostrar y ocultar campos de la tabla*/
        document.getElementById('checkTabla').addEventListener('change', function () {
            $('#table').DataTable().columns([0]).visible($(this).is(':checked'))
        });

    }, 250);
});





// Función para preparar el modal al momento de insertar un registro.
function openCreate() {
    //Limpiamos los campos del modal
    document.getElementById('save-form').reset();
    //Añadimos la clase que esconde el select estado ya que todos los usuarios ingresados, tendrán el valor de activo y este se manda automaticamente
    document.getElementById('estado-empleado').disabled = true;
    

    /* Se llama a la función que llena el select del formulario. Se encuentra en el archivo components.js, 
    * mandar de parametros la ruta de la api de la tabla que utiliza el select, y el id del select*/
    fillSelect(ENDPOINT_CARGO, 'cargo', null);
    fillSelect(ENDPOINT_AVATAR, 'foto', null);
    
}

// Función para preparar el formulario al momento de modificar un registro.
function openUpdate(id) {
    //Limpiamos los campos del modal
    document.getElementById('save-form').reset();
    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('id').value = id;
    //Desactivamos campos que no se podrán modificar-------------------.
    document.getElementById('alias').disabled = true;
    document.getElementById('clave').disabled = true;
    document.getElementById('confirmar').disabled = true;
    document.getElementById('estado-empleado').disabled = false;
    
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_USUARIOS + 'readOne', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.
                    document.getElementById('id').value = response.dataset.uuid_empleado;
                    fillSelect(ENDPOINT_AVATAR, 'foto', response.dataset.fotoEmpleado);
                    document.getElementById('nombres').value = response.dataset.nombres_empleado;
                    document.getElementById('apellidos').value = response.dataset.apellidos_empleado;
                    document.getElementById('alias').value = response.dataset.alias_empleado;
                    document.getElementById('correo').value = response.dataset.correo_empleado;
                    fillSelect(ENDPOINT_CARGO, 'cargo', response.dataset.uuid_cargo_empleado);
                    if (response.dataset.estado_cliente) {
                        document.getElementById('estado-empleado').value = 0;
                    } else {
                        document.getElementById('estado-empleado').value = 1;
                    }
                    document.getElementById('imagen-avatar').src = `../../resources/img/avatares/${response.dataset.fotoEmpleado}`
                    document.getElementById('imagen-avatar').style.display = 'inline-block'

                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Función para mandar el id de la row seleccionada al modal eliminar-------------------.
function openDelete(id) {
    document.getElementById('uuid_empleado').value = id;
}


// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        (row.estado_empleado) ? icon = '<span class="estado">Activo</span>' : icon = '<span class="estado3">Inactivo</span>';
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
            <td class="col-table">
                <div class="nombre-producto">${row.uuid_empleado}
                </div>
            </td>
            <td class="col-table">
                <div class="nombre-producto"><img
                        src="../../resources/img/avatares/${row.imagen_avatar}" alt="">${row.nombres_empleado}
                </div>
            </td>
            <td class="text-center">${row.apellidos_empleado}</td>
            <td class="text-center">${row.alias_empleado}</td>
            <td class="text-center">${row.correo_empleado}</td>
            <td class="text-center">${row.cargo_empleado}</td>
            <td data-title="ESTADO" class="estado-stock">${icon}</td>
            <td data-title="Acciones" class="botones-table">
                <div class="dropdown">
                    <button class=" btn-acciones dropdown-toggle" type="button"
                        id="dropdownMenuButton1" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Acciones
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end animate slideIn"
                        aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" onclick="openUpdate('${row.uuid_empleado}')" data-bs-toggle="modal"
                                type="button"
                                data-bs-target="#save-modal">Editar</a>
                        </li>
                        <li><a class="dropdown-item" onclick="openDelete('${row.uuid_empleado}')" type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-eliminar">Eliminar</a>
                        </li>
                    </ul>
                </div>
            </td>
        </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody-rows').innerHTML = content;
}


// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('save-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (document.getElementById('id').value) ? action = 'update' : action = 'create';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_USUARIOS, action, 'save-form', 'save-modal');
});

// Método manejador de eventos que se ejecuta cuando se envía el modal de eliminar-------------------.
document.getElementById('delete-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario-------------------.
    event.preventDefault();
    //Llamamos al método que se encuentra en la api y le pasamos la ruta de la API y el id del formulario dentro de nuestro modal eliminar-------------------.
    confirmDelete(API_USUARIOS, 'delete-form');
});


//Función para cambiar y mostrar el avatar dinámicamente en modals-------------------.
function changeAvatar() {
    let combo = document.getElementById('foto')
    let selected = combo.options[combo.selectedIndex].text;
    document.getElementById('imagen-avatar').style.display = 'inline-block'
    document.getElementById('imagen-avatar').src = `../../resources/img/avatares/${selected}`;
}



