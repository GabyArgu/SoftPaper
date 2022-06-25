// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PROVEEDOR = SERVER + 'private/proveedor.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_PROVEEDOR);
    // Se define una variable para establecer las opciones del componente Modal.
    let options = {
        dismissible: false,
        onOpenStart: function () {
            // Se restauran los elementos del formulario.
            document.getElementById('save-form').reset();
        }
    }
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        (row.estado_proveedor) ? icon = '<span class="estado">Activo</span>' : icon = '<span class="estado3">Inactivo</span>';
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
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
                        <li><button onclick="openUpdateProv(${row.uuid_proveedor})" class="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-actualizarP">Editar</button>
                        </li>
                        <li><a class="dropdown-item"
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

$(document).ready(function () {
    $('#proveedor').DataTable({
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
        "lengthMenu": [[10, 15, 10, -1], [10, 15, 20, "Todos"]]
    });
});

document.getElementById('buscar-proveedor').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRows(API_PROVEEDOR, 'buscar-proveedor');
});

function openCreateProv() {
    // Se establece que el campo archivo sea obligatorio (input de subir imagen).
    document.getElementById("nombre_prov").value = "";
    document.getElementById("tele_prov").value = "";
    document.getElementById('estado_prov').disabled = true;
}

// Función para crear proveedor
document.getElementById('modal-agregarP').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    let action = 'create';
    saveRow(API_PROVEEDOR, action, 'agregar-prov', 'modal-agregarP');
});

function openUpdateProv(id) {
    document.getElementById('uestado_prov').disabled = false;
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
                    document.getElementById('id_prov').value = response.dataset.uuid_proveedor;
                    document.getElementById('unombre_prov').value = response.dataset.nombre_proveedor;
                    if (response.dataset.estado_cliente) {
                        document.getElementById('uestado_prov').value = 1;
                    } else {
                        document.getElementById('uestado_prov').value = 0;
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

// Método manejador de eventos que se ejecuta cuando se envía el formulario de actualizar.
document.getElementById('update-prov').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_PROVEEDOR, 'update', 'update-prov', 'modal-actualizarP');
});

function openDelete(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Se llama a la función que elimina un registro. Se encuentra en el archivo components.js
    confirmDelete(API_CLIENTES, data);
}