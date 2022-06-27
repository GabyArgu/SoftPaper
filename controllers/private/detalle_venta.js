const API_VENTAS = SERVER + 'private/venta.php?action=';
const API_PRODUCTOS = SERVER + 'private/productos.php?action='
const ENDPOINT_COLOR = SERVER + 'private/color.php?action=readProductoColor';


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
    
    //Inicializando tooltips
    $("body").tooltip({ selector: '[data-bs-toggle=tooltip]' });

    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#table-productos', options);
    }, 250);


    // Se busca en la URL las variables (parámetros) disponibles.
    let params = new URLSearchParams(location.search);
    if(Array.from(params).length>0){
    // Se obtienen los datos localizados por medio de las variables.
        const ID = params.get('uuid_venta');
        // Se llama a la función que muestra el detalle del producto seleccionado previamente.
        readOrderDetail(ID);
    }
    else{
        
    }
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
    // Petición para solicitar los datos del pedido en proceso.
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
                <a onclick="openProduct(${row.uuid_producto})" data-bs-toggle="modal" data-bs-target="#item-modal">
                    <i class="bi bi-plus-circle ms-3"></i>
                </a>
            </td>
        </tr> 
		`;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody_rows').innerHTML = content;
}

/*Inicializando y configurando tabla de clientes*/
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

function openProduct(id){
    fillSelectProducto(ENDPOINT_COLOR, 'color', null, id);
}

/*Inicializando y configurando componente de calendario*/
flatpickr('#calendar', {
});

/*Función para mostrar y ocultar cmbs según tipo de venta seleccionado*/
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

//Funcion para asignar el atributo max del input max dinámicamente
function setStock() {
    let input = document.getElementById("stock");
    // Petición para obtener los datos del producto solicitado.
    fetch(API_PRODUCTOS + 'readStock', {
        method: 'post',
        body: new FormData(document.getElementById('item-form'))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    //Le asignamos el valor del stock del color y producto seleccionado
                    input.value = parseInt(response.dataset.stock);
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    sweetAlert(4, response.exception, null);
                    input.value = 0;

                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

//Función para cambiar el stock al cambiar de color en el select
document.getElementById("color").addEventListener("change", function () {
    if (!document.getElementById("id").value.length == 0) {
        let selectValue = document.getElementById('color').value;
        console.log(selectValue);
        setStock();
    }
});

//Función que suma 1 al stock y valida que no supere el max
let sumarStock = () => {
    let input = document.getElementById("input-stock");
    let max = input.max;
    let valor = parseInt(input.value);
    if (valor + 1 > max) {
        input.value = input.value;
    }
    else {
        input.value = parseInt(input.value) + 1;
    }
}

//Función que resta 1 al stock y valida que no descienda del min
let restarStock = () => {
    let input = document.getElementById("input-stock");
    let min = input.min;
    let valor = parseInt(input.value);
    if (valor - 1 <= min) {
        input.value = input.value;
    }
    else {
        input.value = parseInt(input.value) - 1;
    }

}

//Funciones de validaciones

let validacionInputStock = () => {
    let input = document.getElementById("input-stock");
    let valor = parseInt(input.value);
    if (valor > input.max || valor <= input.min) {
        input.value = 1;
    }
}

function valideKey(evt) {

    // code is the decimal ASCII representation of the pressed key.
    var code = (evt.which) ? evt.which : evt.keyCode;

    if (code == 8) { // backspace.
        return true;
    } else if (code >= 48 && code <= 57) { // is a number.
        return true;
    } else { // other keys.
        return false;
    }
}
