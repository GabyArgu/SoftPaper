const API_VENTAS = SERVER + 'private/venta.php?action=';

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
    "mode": "range"
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
