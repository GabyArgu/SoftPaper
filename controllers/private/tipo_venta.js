// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_TIPO_VENTA = SERVER + 'private/tipo_venta.php?action=';

document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_TIPO_VENTA);
    // Se define una variable para establecer las opciones del componente Modal.
    let options = {
        dismissible: false,
        onOpenStart: function () {
            // Se restauran los elementos del formulario.
            document.getElementById('agregar-tv').reset();
        }
    }
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        (row.estado_tipo_venta) ? icon = '<span class="estado">Activo</span>' : icon = '<span class="estado3">Inactivo</span>';
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        // Se coloca el nombre de la columna de la tabla---------------.
        content += `
        <tr>
            <td data-title="Proveedor" class="col-table ">${row.tipo_venta}</td>
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
                        <li><a onclick="openUpdateTV('${row.uuid_tipo_venta}')" class="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-agregarTV">Editar</a>
                        </li>
                        <li><a onclick="openDeleteTV('${row.uuid_tipo_venta}')" class="dropdown-item"
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

document.addEventListener('DOMContentLoaded', function () {
    readRows(API_TIPO_VENTA);
    setTimeout(() => {
        /*Inicializando y configurando tabla---------*/
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
        let table = new DataTable('#tipo_venta', options);
    }, 300);
});

function openCreateTV() {
    document.getElementById("agregar-tv").reset();
    document.getElementById("nombre_tipo_venta").value = "";
    document.getElementById("estado_tipo_venta").disabled = true;
}

function openUpdateTV(id) {
    document.getElementById("estado_tipo_venta").disabled = false;
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id-tv', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_TIPO_VENTA + 'readOne', {
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
                    document.getElementById('id-tv').value = (id);
                    document.getElementById('nombre_tipo_venta').value = response.dataset.tipo_venta;
                    if (response.dataset.estado_tipo_venta) {
                        document.getElementById('estado_tipo_venta').value = 1;
                    } else {
                        document.getElementById('estado_tipo_venta').value = 0;
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
document.getElementById('agregar-tv').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (document.getElementById('id-tv').value) ? action = 'update' : action = 'create';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_TIPO_VENTA, action, 'agregar-tv', 'modal-agregarTV');
});

function openDeleteTV(id) {
    document.getElementById('id_delete').value = (id);
}

// Método manejador de eventos que se ejecuta cuando se envía el modal de eliminar.
//No se borra se deshabilita-----------------------------.
document.getElementById('delete-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //Llamamos al método que se encuentra en la api y le pasamos la ruta de la API y el id del formulario dentro de nuestro modal eliminar
    confirmDelete(API_TIPO_VENTA, 'delete-form');
});