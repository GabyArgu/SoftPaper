const API_PRODUCTOS = SERVER + 'private/productos.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {


    readRows(API_PRODUCTOS);
    /*Inicializando y configurando tabla*/
    let options = {
        "info": false,
        "columnDefs": [
            {
                "targets": [4],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [5],
                "visible": false
            },
            {
                "targets": [6],
                "visible": false
            }
            ,
            {
                "targets": [7],
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
    let table = new DataTable('#example', options);

    /*Función para mostrar y ocultar campos de la tabla*/
    document.getElementById('checkTabla').addEventListener('change', function () {
        $('#example').DataTable().columns([4, 5, 6, 7]).visible($(this).is(':checked'))
    });
});

