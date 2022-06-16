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