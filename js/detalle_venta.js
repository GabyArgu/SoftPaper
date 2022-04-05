/*Inicializando input spinner*/
$("input[type='number']").inputSpinner();

/*Añadiendo clase a botones de input spinner para modificar su diseño*/
let añadirClaseSpinnerInputBtn = () => {
    var elemento1 = document.getElementsByClassName("btn-decrement");
    for (var i = 0; i < elemento1.length; i++)
        elemento1[i].className += " btn-second";

    var elemento = document.getElementsByClassName("btn-increment");
    for (var i = 0; i < elemento.length; i++)
        elemento[i].className += " btn-second";
}
añadirClaseSpinnerInputBtn();

/*Inicializando y configurando tabla de productos*/
$(document).ready(function () {
    $('#example').DataTable({
        "info": false,
        "searching": false,
        "scrollCollapse": true,
        "paging":         false,
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "Todos"]]
    });
});
/*Inicializando y configurando tabla de clientes*/
$(document).ready(function() {
    $('#example1').DataTable( {
        "info": false,
        "searching": false,
        "scrollCollapse": true,
        "paging":         false,
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        columnDefs: [ {
            orderable: false,
            className: 'select-checkbox',
            targets:   0
        } ],
        select: {
            style:    'os',
            selector: 'td:first-child'
        },
        order: [[ 1, 'asc' ]]
    } );
} );

/*Inicializando y configurando componente de calendario*/ 
flatpickr('#calendar', {
});

/*Función para mostrar y ocultar cmbs según tipo de venta seleccionado*/
function pagoOnChange(sel) {
    if (sel.value=="consumidor"){
         divC = document.getElementById("tipo-venta-div");
         divC.style.display = "block";
         iva = document.getElementById("iva");
         iva.textContent = "$0";

    }else{

         divC = document.getElementById("tipo-venta-div");
         divC.style.display="none";
         iva = document.getElementById("iva");
         iva.textContent = "$2";
    }
}
