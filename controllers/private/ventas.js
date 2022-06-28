const API_VENTAS = SERVER + 'private/venta.php?action=';
const ENDPOINT_TIPOVENTA = SERVER + 'private/tipo_venta.php?action=readAll';
const ENDPOINT_ESTADO = SERVER + 'private/estado_venta.php?action=readAll';

const options = {
    "info": false,
    "columnDefs": [
        {
            "targets": [2],
            "visible": false,
            "searchable": false
        },
        {
            "targets": [6],
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
let table;


flatpickr('#calendar-range', {
    "mode": "range",
    dateFormat: "Y-m-d",
    onChange: function (selectedDates, dateStr, instance) {
        if (selectedDates.length == 2) {
            var from = selectedDates[0].getFullYear() + "-" + numeroAdosCaracteres(selectedDates[0].getMonth() + 1) + "-" + numeroAdosCaracteres(selectedDates[0].getDate());

            var to = selectedDates[1].getFullYear() + "-" + numeroAdosCaracteres(selectedDates[1].getMonth() + 1) + "-" + numeroAdosCaracteres(selectedDates[1].getDate());


            console.log(from);
            console.log(to);
            
            filterDate(from, to);
            table.destroy();
            setTimeout(() => {
                /*Inicializando y configurando tabla*/
                table = new DataTable('#table-ventas', options);

                /*Función para mostrar y ocultar campos de la tabla*/
                document.getElementById('checkTabla').addEventListener('change', function () {
                    $('#table').DataTable().columns([4, 5, 6]).visible($(this).is(':checked'))
                });

            }, 300);
            

            // interact with selected dates here
        }




    }
});

document.addEventListener('DOMContentLoaded', function () {

    readRows(API_VENTAS);

    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#table-ventas', options);

        /*Función para mostrar y ocultar campos de la tabla*/
        document.getElementById('checkTabla').addEventListener('change', function () {
            $('#table-ventas').DataTable().columns([2, 6]).visible($(this).is(':checked'))
        });

    }, 250);
});

function numeroAdosCaracteres(fecha) {
    if (fecha > 9) {
        return "" + fecha;
    } else {
        return "0" + fecha;
    }
}

const reInitTable = () => {
    table.destroy();
    setTimeout(() => {
        readRows(API_VENTAS);
    }, 100);

    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#table-ventas', options);

        /*Función para mostrar y ocultar campos de la tabla*/
        document.getElementById('checkTabla').addEventListener('change', function () {
            $('#table-ventas').DataTable().columns([2, 6]).visible($(this).is(':checked'))
        });

    }, 300);
}

function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td class="correlativo">${row.correlativo_venta}</td>
                <td class="tipo">${row.tipo_venta}</td>
                <td class="tipo">${row.tipo_factura}</td>
                <td class="cliente">${row.nombre_cliente}</td>
                <td class="fecha">${row.fecha_venta}</td>
                <td class="monto">$${row.monto_total}</td>
                <td class="empleado">${row.nombres_empleado} ${row.apellidos_empleado}</td>
                <td class="estado-stock"><span class="estado">${row.estado_venta}</span></td>
                <td class="botones-table">
                    <div class="dropdown">
                        <button class=" btn-acciones dropdown-toggle" type="button"
                            id="dropdownMenuButton1" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Acciones
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end animate slideIn"
                            aria-labelledby="dropdownMenuButton1">
                            <li><a class="dropdown-item" href="detalle_venta.html?uuid_venta=${row.uuid_venta}"
                                    type="button">Editar</a>
                            </li>   
                            <li><a class="dropdown-item" type="button"
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
    document.getElementById('tbody_rows').innerHTML = content;
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de buscar.
document.getElementById('search-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    if (document.getElementById('search').value == "") {
        sweetAlert(3, 'Cambo de búsqueda vacío', null)
    }
    else {
        table.destroy();
        // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
        searchRows(API_VENTAS, 'search-form', 'search');
        setTimeout(() => {
            /*Inicializando y configurando tabla*/
            table = new DataTable('#table-ventas', options);

            /*Función para mostrar y ocultar campos de la tabla*/
            document.getElementById('checkTabla').addEventListener('change', function () {
                $('#table').DataTable().columns([4, 5, 6]).visible($(this).is(':checked'))
            });

        }, 150);
    }
});

//Función para refrescar la tabla manualmente al darle click al botón refresh
document.getElementById('limpiar').addEventListener('click', function () {
    table.destroy();
    readRows(API_VENTAS);
    document.getElementById('search').value = "";
    document.getElementById('calendar-range').value = "";
    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#table-ventas', options);

        /*Función para mostrar y ocultar campos de la tabla*/
        document.getElementById('checkTabla').addEventListener('change', function () {
            $('#table').DataTable().columns([4, 5, 6]).visible($(this).is(':checked'))
        });

    }, 250);
});

document.getElementById('filter-btn').addEventListener('click', function () {
    fillSelect(ENDPOINT_TIPOVENTA, 'filter-tipo-venta', null);
    fillSelect(ENDPOINT_ESTADO, 'filter-estado', null);
});

document.getElementById('filter-form').addEventListener('submit', function (event) {
    event.preventDefault();
    let valCategoria = document.getElementById('filter-tipo-venta').value;
    let valEstado = document.getElementById('filter-estado').value;
    if (valCategoria == "Seleccione una opción") {
        sweetAlert(3, 'No se han seleccionado opciones para filtrar', null)
    }
    else if (valEstado == "Seleccione una opción") {
        sweetAlert(3, 'No se han seleccionado opciones para filtrar', null)
    }
    else {
        table.destroy();
        readRowsFilter(API_VENTAS, 'filter-form');
        setTimeout(() => {
            /*Inicializando y configurando tabla*/
            table = new DataTable('#table-ventas', options);

            /*Función para mostrar y ocultar campos de la tabla*/
            document.getElementById('checkTabla').addEventListener('change', function () {
                $('#table').DataTable().columns([4, 5, 6]).visible($(this).is(':checked'))
            });

        }, 300);
    }
});

function filterDate(start, end) {
    const data = new FormData();
    data.append('start-date', start);
    data.append('end-date', end);
    fetch(API_VENTAS + 'filterDate', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se envían los datos a la función del controlador para que llene la tabla en la vista y se muestra un mensaje de éxito.
                    fillTable(response.dataset);
                    //sweetAlert(1, response.message, null);
                } else {
                    /* En caso de no encontrar coincidencias, limpiara el campo y se recargará la tabla */
                    sweetAlert(2, response.exception, null);
                    readRows(API_VENTAS);
                    document.getElementById('calendar-range').value = "";
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}