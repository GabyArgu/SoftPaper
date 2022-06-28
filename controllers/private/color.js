// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_COLOR = SERVER + 'private/color.php?action=';

//Configuración de la tabla
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
let table;

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_COLOR);
    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#color', options);
    }, 250);
});

const reInitTable = () => {
    table.destroy();
    setTimeout(() => {
        readRows(API_COLOR);
    }, 100);

    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#color', options);
    }, 300);
}

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        (row.estado_color_producto) ? icon = '<span class="estado">Activo</span>' : icon = '<span class="estado3">Inactivo</span>';
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
        <tr>
            <td data-title="Nombre" class="categoria">${row.color_producto}</td>
            <td data-title="Estado" class="estado-stock">${icon}</td>
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
                        <li><a onclick="openUpdate('${row.uuid_color_producto}')" class="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-agregarCo">Editar</a>
                        </li>
                        <li><a onclick="openDelete('${row.uuid_color_producto}')" class="dropdown-item"
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



document.getElementById('buscar-color').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    if(document.getElementById('buscar-color-input').value == ""){
        sweetAlert(3, 'Cambo de búsqueda vacío', null)
    }
    else{
        table.destroy();
        // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
        searchRows(API_COLOR, 'buscar-color', 'buscar-color-input');
        setTimeout(() => {
            /*Inicializando y configurando tabla*/
            table = new DataTable('#color', options);
        }, 250);
    }
    
});

function openCreate() {
    document.getElementById("nombre_color").value = "";
    document.getElementById("estado_color").disabled = true;
}

function openUpdate(id) {
    document.getElementById("estado_color").disabled = false;
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_COLOR + 'readOne', {
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
                    document.getElementById('nombre_color').value = response.dataset.color_producto;

                    if (response.dataset.estado_cliente) {
                        document.getElementById('estado_color').value = 0;
                    } else {
                        document.getElementById('estado_color').value = 1;
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
document.getElementById('agregar-color').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (document.getElementById('id').value) ? action = 'update' : action = 'create';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_COLOR, action, 'agregar-color', 'modal-agregarCo');
    reInitTable();
});

function openDelete(id) {
    document.getElementById('id_delete').value = (id);
}

// Método manejador de eventos que se ejecuta cuando se envía el modal de eliminar.
document.getElementById('delete-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //Llamamos al método que se encuentra en la api y le pasamos la ruta de la API y el id del formulario dentro de nuestro modal eliminar
    confirmDelete(API_COLOR, 'delete-form');
    setTimeout(() => {
        reInitTable();
    }, 100);
});

//Función para refrescar la tabla manualmente al darle click al botón refresh
document.getElementById('limpiar').addEventListener('click', function () {
    table.destroy();
    readRows(API_COLOR);
    document.getElementById('buscar-color-input').value ="";
    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#color', options);

    }, 250);
});