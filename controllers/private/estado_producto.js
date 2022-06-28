// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_ESTADO_PRODUCTO = SERVER + 'private/estado_producto.php?action=';
const API_ESTADO_VENTA = SERVER + 'private/estado_venta.php?action=';

const options = {
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

const options2 = {
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


let table;
let table2;
let tableDelete;


// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_ESTADO_PRODUCTO);
    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#estado_producto', options);
    }, 250);
});

document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows2(API_ESTADO_VENTA);
    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table2 = new DataTable('#estado_venta', options2);
    }, 250);
});

const reInitTable = () => {
    table.destroy();
    setTimeout(() => {
        readRows(API_ESTADO_PRODUCTO);
    }, 100);

    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#estado_producto', options);
    }, 300);
}

const reInitTable2 = () => {
    table.destroy();
    setTimeout(() => {
        readRows2(API_ESTADO_VENTA);
    }, 100);

    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table2 = new DataTable('#estado_venta', options2);
    }, 300);
}

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        (row.estado_estado_producto) ? icon = '<span class="estado">Activo</span>' : icon = '<span class="estado3">Inactivo</span>';
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
        <tr>
            <td data-title="Proveedor" class="col-table ">${row.estado_producto}</td>
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
                        <li><a onclick="openUpdateEP('${row.uuid_estado_producto}')" class="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-agregarEP">Editar</a>
                        </li>
                        <li><a onclick="openDeleteEP('${row.uuid_estado_producto}')" class="dropdown-item"
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

function fillTable2(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        (row.estado_estado_venta) ? icon = '<span class="estado">Activo</span>' : icon = '<span class="estado3">Inactivo</span>';
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
        <tr>
            <td data-title="Proveedor" class="col-table ">${row.estado_venta}</td>
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
                        <li><a onclick="openUpdateEV('${row.uuid_estado_venta}')" class="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-agregarEV">Editar</a>
                        </li>
                        <li><a onclick="openDeleteEP('${row.uuid_estado_venta}')" class="dropdown-item"
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

// $(document).ready(function () {
//     $('#proveedor').DataTable({
//         "info": false,
//         "searching": false,
//         "dom":
//             "<'row'<'col-sm-12'tr>>" +
//             "<'row'<'col-sm-5'l><'col-sm-1'><'col-sm-6'p>>",
//         "language": {
//             "lengthMenu": "Mostrando _MENU_ registros",
//             "paginate": {
//                 "next": '<i class="bi bi-arrow-right-short"></i>',
//                 "previous": '<i class="bi bi-arrow-left-short"></i>'
//             }
//         },
//         "lengthMenu": [[10, 15, 10, -1], [10, 15, 20, "Todos"]]
//     });
// });

// BUSCADOR
// document.getElementById('buscar-proveedor').addEventListener('submit', function (event) {
//     // Se evita recargar la página web después de enviar el formulario.
//     event.preventDefault();
//     // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
//     searchRows(API_PROVEEDOR, 'buscar-proveedor');
// });

function openCreateEP() {
    document.getElementById("agregar-ep").reset();
    document.getElementById("nombre_estado_producto").value = "";
    document.getElementById("estado_estado_producto").disabled = true;

}

function openCreateEV() {
    document.getElementById("agregar-ev").reset();
    document.getElementById("nombre_estado_venta").value = "";
    document.getElementById("estado_estado_venta").disabled = true;
}

function openUpdateEP(id) {
    document.getElementById("estado_estado_producto").disabled = false;
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_ESTADO_PRODUCTO + 'readOne', {
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
                    document.getElementById('nombre_estado_producto').value = response.dataset.estado_producto;
                    if (response.dataset.estado_estado_producto) {
                        document.getElementById('estado_estado_producto').value = 1;
                    } else {
                        document.getElementById('estado_estado_producto').value = 0;
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

function openUpdateEV(id) {
    document.getElementById("estado_estado_venta").disabled = false;
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id-v', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_ESTADO_VENTA + 'readOne', {
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
                    document.getElementById('id-v').value = (id);
                    document.getElementById('nombre_estado_venta').value = response.dataset.estado_venta;
                    if (response.dataset.estado_estado_venta) {
                        document.getElementById('estado_estado_venta').value = 1;
                    } else {
                        document.getElementById('estado_estado_venta').value = 0;
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
document.getElementById('agregar-ep').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (document.getElementById('id').value) ? action = 'update' : action = 'create';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_ESTADO_PRODUCTO, action, 'agregar-ep', 'modal-agregarEP');
    reInitTable();
});

document.getElementById('agregar-ev').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (document.getElementById('id-v').value) ? action = 'update' : action = 'create';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_ESTADO_VENTA, action, 'agregar-ev', 'modal-agregarEV');
    reInitTable2();
});

function openDeleteEP(id) {
    document.getElementById('id_delete').value = (id);
    tableDelete = 1;
}

function openDeleteEV(id) {
    document.getElementById('id_delete').value = (id);
    tableDelete = 2;
}

// Método manejador de eventos que se ejecuta cuando se envía el modal de eliminar.
document.getElementById('delete-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //Llamamos al método que se encuentra en la api y le pasamos la ruta de la API y el id del formulario dentro de nuestro modal eliminar
    if (table == 1) {
        confirmDelete(API_ESTADO_PRODUCTO, 'delete-form');
    }
    else {
        confirmDelete2(API_ESTADO_VENTA, 'delete-form');
    }
    setTimeout(() => {
        reInitTable();
    }, 100);
});