// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PROVEEDOR = SERVER + 'private/proveedor.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_PROVEEDOR);
    setTimeout(() => {
        /*Inicializando y configurando tabla------------------------------------*/
        let options = {
            "info": false,
        "searching": false,
        "dom":
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'l><'col-sm-1'><'col-sm-6'p>>",
        "language": {
            "lengthMenu": "Mostrando _MENU_ registros",
            "paginate": {
                "next": '<i class="bi bi-arrow-right-short"></i>',
                "previous": '<i class="bi bi-arrow-left-short"></i>'
            }
        },
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "Todos"]]
        };
        let table = new DataTable('#proveedor', options);
    }, 300);
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        (row.estado_proveedor) ? icon = '<span class="estado">Activo</span>' : icon = '<span class="estado3">Inactivo</span>';
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        // Se coloca el nombre de la columna de la tabla---------------.
        content += `
        <tr>
            <td data-title="Proveedor" class="col-table ">${row.nombre_proveedor}</td>
            <td data-title="telefono"
                class="proveedores text-center">
                ${row.telefono_proveedor}</td>
            <td data-title="estado" class="estado-stock">${icon}</td>
            <td data-title="Acciones" class="botones-table">
                <div class="dropdown">
                    <button class=" btn-acciones dropdown-toggle"
                        type="button" id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Acciones
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end animate slideIn"
                        aria-labelledby="dropdownMenuButton1">
                        <li><a onclick="openUpdateProv('${row.uuid_proveedor}')" class="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-agregarP">Editar</a>
                        </li>
                        <li><a onclick="openDeleteProv('${row.uuid_proveedor}')" class="dropdown-item"
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
    document.getElementById('tbody-rows234').innerHTML = content;
}

document.getElementById('buscar-proveedor').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRows(API_PROVEEDOR, 'buscar-proveedor');
});

function openCreateProv() {
    // Se limpian los campos, se deshabilita el campo de estado y se cambia el título del modal-----------------.
    document.getElementById("nombre_prov").value = "";
    document.getElementById("tele_prov").value = "";
    document.getElementById("estado_prov").disabled = true;
    document.getElementById('modal-title').innerText = 'Ingresar proveedor';
}

function openUpdateProv(id) {
    document.getElementById('modal-title').innerText = 'Actualizar proveedor';
    document.getElementById("estado_prov").disabled = false;
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PROVEEDOR + 'readOne', {
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
                    document.getElementById('id').value = (id);
                    document.getElementById('nombre_prov').value = response.dataset.nombre_proveedor;
                    document.getElementById('tele_prov').value = response.dataset.telefono_proveedor;
                    if (response.dataset.estado_proveedor) {
                        document.getElementById('estado_prov').value = 1;
                    } else {
                        document.getElementById('estado_prov').value = 0;
                    }
                    // Se actualizan los campos para que las etiquetas (labels) no queden sobre los datos.
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('agregar-prov').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (document.getElementById('id').value) ? action = 'update' : action = 'create';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_PROVEEDOR, action, 'agregar-prov', 'modal-agregarP');
    readRows(API_PROVEEDOR);
});

// Función para cargar el id a eliminar
function openDeleteProv(id) {
    document.getElementById('id_delete').value = (id);
}

// Método manejador de eventos que se ejecuta cuando se envía el modal de eliminar.
document.getElementById('delete-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //Llamamos al método que se encuentra en la api y le pasamos la ruta de la API y el id del formulario dentro de nuestro modal eliminar
    confirmDelete(API_PROVEEDOR, 'delete-form');
});