// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_CLIENTES = SERVER + 'private/clientes.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_CLIENTES);
    // Se define una variable para establecer las opciones del componente Modal.
    let options = {
        dismissible: false,
        onOpenStart: function () {
            // Se restauran los elementos del formulario.
            document.getElementById('save-form').reset();
        }
    }
    // Se inicializa el componente Modal para que funcionen las cajas de diálogo.
    //M.Modal.init(document.querySelectorAll('.modal'), options);
});

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        (row.estado_cliente) ? icon = 'Activo' : icon = 'Inactivo';
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
        <tr>
            <td class="col-table text-center">${row.nombre_cliente}</td>
            <td class="text-center">${row.direccion_cliente}</td>
            <td class="text-center">${row.nombre_municipio}</td>
            <td class="text-center">${row.nrc_cliente}</td>
            <td class="text-center">${row.dui_cliente}</td>
            <td class="text-center">${row.telefono_cliente}</td>
            <td class="text-center">${row.giro_cliente}</td>
            <td class="estado-stock"><span class="estado">${icon}</span></td>
            <td class="botones-table">
                <div class="dropdown">
                    <button class=" btn-acciones dropdown-toggle" type="button"
                        id="dropdownMenuButton1" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        Acciones
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end animate slideIn"
                        aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-agregar">Editar</a></li>
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
    document.getElementById('tbody-rows').innerHTML = content;
}

/*Inicializando y configurando tabla*/
$(document).ready(function () {
    $('#example').DataTable({
        "info": false,
        "columnDefs": [
            {
                "targets": [2],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [3],
                "visible": false
            },
            {
                "targets": [5],
                "visible": false
            }
            ,
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
    });
    /*Función para mostrar y ocultar campos de la tabla*/
    $('#checkTabla').change(function () {
        $('#example').DataTable().columns([2, 3, 5, 6]).visible($(this).is(':checked'))
    })
});

/*Función para mostrar y ocultar cmbs según departamento seleccionado*/
function pagoOnChange(sel) {
    if (sel.value == "san salvador") {
        divC = document.getElementById("municipio");
        divC.style.display = "block";

    } else {
        divC = document.getElementById("municipio");
        divC.style.display = "none";
    }
}