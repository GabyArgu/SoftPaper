$("input[type='number']").inputSpinner();

let añadirClaseSpinnerInputBtn = () => {
    var elemento1 = document.getElementsByClassName("btn-decrement");
    for (var i = 0; i < elemento1.length; i++)
        elemento1[i].className += " btn-second";

    var elemento = document.getElementsByClassName("btn-increment");
    for (var i = 0; i < elemento.length; i++)
        elemento[i].className += " btn-second";
}

añadirClaseSpinnerInputBtn();

/*Inicializando y configurando tabla*/
$(document).ready(function () {
    $('#example').DataTable({
        "info": false,
        "searching": false,
        "scrollCollapse": true,
        "paging":         false,
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "Todos"]]
    });
    /*Función para mostrar y ocultar campos de la tabla*/
    $('#checkTabla').change(function () {
        $('#example').DataTable().columns([4, 5, 6, 7]).visible($(this).is(':checked'))
    })
});
flatpickr('#calendar', {
});

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
// $(document).ready(function () {
//     $("#tipo-venta").change(function () {
//         $(this).find("option:selected")
//                .each(function () {
//             var optionValue = $(this).attr("value");
//             if (optionValue) {
//                 $(".hide-cmb").not("." + optionValue).hide();
//                 $("." + optionValue).show();
//             } else {
//                 $(".hide-cmb").hide();
//             }
//         });
//     }).change();
// });