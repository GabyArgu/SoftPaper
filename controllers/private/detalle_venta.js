const API_VENTAS = SERVER + 'private/venta.php?action=';
const API_PRODUCTOS = SERVER + 'private/productos.php?action='

const options = {
    "info": false,
    "columnDefs": [],
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

document.addEventListener('DOMContentLoaded', function () {

    readRows3(API_PRODUCTOS);
    
    //Inicializando tooltips-----------------------.
    $("body").tooltip({ selector: '[data-bs-toggle=tooltip]' });

    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#table-productos', options);
    }, 250);

    // Se busca en la URL las variables (parámetros) disponibles.
    let params = new URLSearchParams(location.search);
    // Se obtienen los datos localizados por medio de las variables.
    const ID = params.get('uuid_venta');
    // Se llama a la función que muestra el detalle del producto seleccionado previamente.
    readOrderDetail(ID);
    // Se llama a la función que muestra los productos destacados----------------.
})

const reInitTable = () => {
    table.destroy();
    setTimeout(() => {
        readRows3(API_PRODUCTOS);
    }, 100);

    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#table-productos', options);
    }, 300);
}

function readOrderDetail(uuid_venta) {
    const data = new FormData();
    data.append('uuid_venta', uuid_venta);
    // Petición para solicitar los datos del pedido en proceso----------------.
    fetch(API_VENTAS + 'readOrderDetail', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se declara e inicializa una variable para concatenar las filas de la tabla en la vista.
                    let content = '';
                    // Se declara e inicializa una variable para calcular el importe por cada producto.
                    let subtotal = 0;
                    // Se declara e inicializa una variable para ir sumando cada subtotal y obtener el monto final a pagar.
                    let total = 0;
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        subtotal = row.precio_producto * row.cantidad_producto;
                        total += subtotal;
                        correlativo = row.correlativo_venta;
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                        <div class="col my-2 producto-card">
                            <div
                                class="d-flex p-2 border border-dashed rounded producto-card-content">
                                <div class="imagen-producto me-4">
                                    <img src="${SERVER}images/productos/${row.imagen_producto}" alt="" class="mt-3">
                                </div>
                                <div class="info-producto">
                                    <h4>${row.nombre_producto}</h4>
                                    <h5>Color: ${row.color_producto}</h5>
                                    <h5>${row.cantidad_producto} x $${row.precio_producto} = <span>$${subtotal.toFixed(2)}</span></h5>
                                </div>
                                <i class="bi bi-x"></i>
                            </div>
                        </div>
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    document.getElementById('productos-detalle').innerHTML = content;
                    // Se muestra el total a pagar con dos decimales.
                    document.getElementById('correlativo').textContent = correlativo;
                    document.getElementById('subtotal-detalle').textContent = `$${(parseFloat(total.toFixed(2)))}`;
                } else {
                    document.getElementById('productos-detalle').innerHTML = `<h1 class="text-center fs-5">${response.exception}</h1>`;
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
        <tr>
            <td data-title="PRODUCTO" class="text-center">
                <div class="nombre-producto">${row.nombre_producto}</div>
            </td>
            <td>
                <a onclick="" data-bs-toggle="modal" data-bs-target="#item-modal">
                    <i class="bi bi-plus-circle ms-3"></i>
                </a>
            </td>
        </tr> 
		`;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody_rows').innerHTML = content;
}

/*Inicializando y configurando tabla de detalle venta--------------*/
$(document).ready(function () {
    $('#example1').DataTable({
        "info": false,
        "searching": false,
        "scrollCollapse": true,
        "paging": false,
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "Todos"]],
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0
        }],
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        order: [[1, 'asc']]
    });
});

/*Inicializando y configurando componente de calendario----------------*/
flatpickr('#calendar', {
});

/*Función para mostrar y ocultar cmbs según tipo de venta seleccionado-----------------------*/
function pagoOnChange(sel) {
    if (sel.value == "consumidor") {
        divC = document.getElementById("tipo-venta-div");
        divC.style.display = "block";
        iva = document.getElementById("iva");
        iva.textContent = "$0";

    } else {

        divC = document.getElementById("tipo-venta-div");
        divC.style.display = "none";
        iva = document.getElementById("iva");
        iva.textContent = "$2";
    }
}
