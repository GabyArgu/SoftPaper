const API_VENTAS = SERVER + 'private/venta.php?action=';
const API_PRODUCTOS = SERVER + 'private/productos.php?action='
const ENDPOINT_COLOR = SERVER + 'private/color.php?action=readProductoColor';
const API_CLIENTES = SERVER + 'private/clientes.php?action=';
const ENDPOINT_TIPOVENTA = SERVER + 'private/tipo_venta.php?action=readAll';
const ENDPOINT_TIPOFACTURA = SERVER + 'private/tipo_factura.php?action=readAll';

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

const optionsCli = {
    "info": false,
    "columnDefs": [],
    "searching": false,
    "select": true,
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
let maxStock;
let idVenta;
let tableClientes;
let cliente;
document.addEventListener('DOMContentLoaded', function () {
    fillSelect(ENDPOINT_TIPOVENTA, 'tipo-venta', null);
    fillSelect(ENDPOINT_TIPOFACTURA, 'tipo-factura', null);
    readRows3(API_PRODUCTOS);
    readRows4(API_CLIENTES);
    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#table-productos', options);
        /*Inicializando y configurando tabla*/
        tableClientes = new DataTable('#table-clientes', optionsCli);
    }, 350);


    // Se busca en la URL las variables (parámetros) disponibles.
    let params = new URLSearchParams(location.search);
    if (Array.from(params).length > 0) {
        // Se obtienen los datos localizados por medio de las variables.
        idVenta = params.get('uuid_venta');
        // Se llama a la función que muestra el detalle del producto seleccionado previamente.
        readOrderDetail(idVenta);
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

                    let iva = 0;

                    let totalVenta = 0;
                    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        subtotal = row.precio_producto * row.cantidad_producto;
                        total += subtotal;
                        correlativo = row.correlativo_venta;
                        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
                        content += `
                        <div class="col my-2 producto-card">
                            <div
                                class="d-flex p-2 border border-dashed rounded producto-card-content justify-content-around">
                                <div class="imagen-producto me-4">
                                    <img src="${SERVER}images/productos/${row.imagen_producto}" alt="" class="mt-3">
                                </div>
                                <div class="info-producto">
                                    <h4>${row.nombre_producto}</h4>
                                    <h5>Color: ${row.color_producto}</h5>
                                    <h5>${row.cantidad_producto} x $${row.precio_producto} = <span>$${subtotal.toFixed(2)}</span></h5>
                                </div>
                                <div class="align-content-center justify-content-center">
                                <button class="btn btn-cancel mt-4" onclick="openUpdateDialog('${row.uuid_detalle_venta}', ${row.cantidad_producto}, '${row.uuid_color_stock}')" data-bs-toggle="modal" data-bs-target="#item-modal-update">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                </div>
                                <i class="bi bi-x" onclick="openDeleteDialog(${row.uuid_detalle_venta})"></i>
                            </div>
                        </div>
                        `;
                    });
                    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
                    totalVenta = total * 1.21;
                    iva = total * 0.21;
                    document.getElementById('productos-detalle').innerHTML = content;
                    // Se muestra el total a pagar con dos decimales.
                    document.getElementById('correlativo').textContent = correlativo;
                    document.getElementById('subtotal-detalle').textContent = `$${(parseFloat(total.toFixed(2)))}`;
                    document.getElementById('iva').textContent = `$${(parseFloat(iva.toFixed(2)))}`;
                    document.getElementById('total-venta').textContent = `$${(parseFloat(totalVenta.toFixed(2)))}`;
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
                <a onclick="openProduct('${row.uuid_producto}')" data-bs-toggle="modal" data-bs-target="#item-modal">
                    <i class="bi bi-plus-circle ms-3"></i>
                </a>
            </td>
        </tr> 
		`;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody_rows').innerHTML = content;
}

function fillTable2(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        (row.estado_cliente) ? icon = '<span class="estado">Activo</span>' : icon = '<span class="estado3">Inactivo</span>';
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
        <tr>
            <td class="col-table text-center">${row.nombre_cliente}</td>
            <td class="text-center">${row.dui_cliente}</td>
            <td class="estado-stock">${icon}</td>
        </tr> 
		`;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody_clientes').innerHTML = content;
}



function openProduct(id) {
    document.getElementById('id').value = id;
    document.getElementById('input-stock').value = "";
    fillSelectProducto(ENDPOINT_COLOR, 'color', null, id);
}
//Función para cambiar el stock al cambiar de color en el select
document.getElementById("item-form").addEventListener("submit", function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    const data = new FormData(document.getElementById('item-form'));
    data.append('idVenta', idVenta);
    // Petición para agregar un producto a la venta
    fetch(API_VENTAS + 'createDetail', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria.
                if (response.status) {
                    sweetAlert(1, response.message, null);
                    readOrderDetail(idVenta);
                    $(`#item-form`).modal('hide');
                } else {

                    sweetAlert(2, response.exception, null);

                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    })
});


// Función para abrir una caja de dialogo (modal) con el formulario de cambiar cantidad de producto.
function openUpdateDialog(id, quantity, color) {
    // Se inicializan los campos del formulario con los datos del registro seleccionado.
    document.getElementById('idDetalle').value = id;
    document.getElementById('idColorStock').value = color;
    document.getElementById('input-stock-update').value = quantity;

    let input = document.getElementById("input-stock-update");
    // Se define un objeto con los datos del producto seleccionado.
    const data = new FormData();
    data.append('idColorStock', color);
    // Petición para obtener los datos del producto solicitado.
    fetch(API_PRODUCTOS + 'readStockUpdate', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    console.log(response.dataset.stock)
                    maxStock = parseInt(response.dataset.stock);
                    //Le ponemos el atributo max a nuestro input de stock para que no se pueda agregar al carrito más del stock que se tiene
                    input.max = parseInt(response.dataset.stock);
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de cambiar cantidad de producto.
document.getElementById('item-form-update').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    const data = new FormData(document.getElementById('item-form-update'));
    data.append('idVenta', idVenta);
    // Petición para actualizar la cantidad de producto.
    fetch(API_VENTAS + 'updateDetail', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se actualiza la tabla en la vista para mostrar el cambio de la cantidad de producto.
                    readOrderDetail(idVenta);

                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
});

/*Función para mostrar y ocultar cmbs según tipo de venta seleccionado*/
function pagoOnChange(sel) {
    let tipoF = document.getElementById('tipo-factura').options[2];

    console.log(sel.selectedIndex);
    if (sel.selectedIndex == 2) {
        document.getElementById('tipo-factura').remove(3);
    }
    else {
        fillSelect(ENDPOINT_TIPOFACTURA, 'tipo-factura', null);
    }
}

//Funcion para asignar el atributo max del input max dinámicamente
function setStock() {
    let input = document.getElementById("input-stock");
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
                    maxStock = parseInt(response.dataset.stock);
                    //Le ponemos el atributo max a nuestro input de stock para que no se pueda agregar al carrito más del stock que se tiene
                    input.max = parseInt(response.dataset.stock);
                } else {
                    // Se presenta un mensaje de error cuando no existen datos para mostrar.
                    sweetAlert(2, response.exception, null);
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
        let input = document.getElementById('input-stock').value = 1;

        setStock();
    }
});

//Función que suma 1 al stock y valida que no supere el max
let sumarStock = () => {
    let input = document.getElementById("input-stock");
    let max = input.max;
    let valor = parseInt(input.value);
    if (valor + 1 > max || valor + 1 > maxStock) {
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
    if (valor - 1 <= min || valor - 1 < 0) {
        input.value = input.value;
    }
    else {
        input.value = parseInt(input.value) - 1;
    }

}

//Funciones de validaciones

let validacionInputStockUpdate = () => {
    let input = document.getElementById("input-stock-update");
    let valor = parseInt(input.value);
    if (valor > input.max || valor <= input.min) {
        input.value = 1;
    }
}

//Función que suma 1 al stock y valida que no supere el max
let sumarStockUpdate = () => {
    let input = document.getElementById("input-stock-update");
    let max = input.max;
    let valor = parseInt(input.value);
    if (valor + 1 > max || valor + 1 > maxStock) {
        input.value = input.value;
    }
    else {
        input.value = parseInt(input.value) + 1;
    }
}

//Función que resta 1 al stock y valida que no descienda del min
let restarStockUpdate = () => {
    let input = document.getElementById("input-stock-update");
    let min = input.min;
    let valor = parseInt(input.value);
    if (valor - 1 <= min || valor - 1 < 0) {
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

//Función para cambiar el stock al cambiar de color en el select
document.getElementById("btn-add-client").addEventListener("click", function () {
    readRows4(API_CLIENTES);
    tableClientes.destroy();
    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        tableClientes = new DataTable('#table-clientes', optionsCli);


        tableClientes.on('select', function () {
            var rowData = tableClientes.rows({ selected: true }).data()[0][1];
            cliente = rowData;
            console.log(rowData);
        });
    }, 200);

});

function setCliente() {
    if (!cliente == "") {
        document.getElementById('dui-cliente').value = cliente;
        document.getElementById('btn-add-client').innerText = cliente;
        sweetAlert(1, 'Cliente seleccionado', null);
    }
    else {
        sweetAlert(3, 'No se ha seleccionado ningún cliente', null)
    }
}

// Función para mostrar un mensaje de confirmación al momento de finalizar el pedido.
function finishOrder() {
    swal({
        title: 'Aviso',
        text: '¿Está seguro de finalizar el pedido?',
        icon: 'info',
        buttons: ['No', 'Sí'],
        closeOnClickOutside: false,
        closeOnEsc: false
    }).then(function (value) {
        // Se verifica si fue cliqueado el botón Sí para realizar la petición respectiva, de lo contrario se muestra un mensaje.
        if (value) {
            // Se define un objeto con los datos del producto seleccionado.
            const data = new FormData(document.getElementById('finalizar-venta'));
            data.append('idVenta', idVenta);
            // Petición para finalizar el pedido en proceso.
            fetch(API_VENTAS + 'finishOrder', {
                method: 'post',
                body: data
            }).then(function (request) {
                // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
                if (request.ok) {
                    request.json().then(function (response) {
                        // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                        if (response.status) {
                            sweetAlert(1, response.message, 'venta.html');
                        } else {
                            sweetAlert(2, response.exception, null);
                        }
                    });
                } else {
                    console.log(request.status + ' ' + request.statusText);
                }
            });
        } else {

        }
    });
}

// // Método manejador de eventos que se ejecuta cuando se envía el formulario de cambiar cantidad de producto.
// document.getElementById('item-form-update').addEventListener('submit', function (event) {
//     // Se evita recargar la página web después de enviar el formulario.
//     event.preventDefault();
//     const data = new FormData(document.getElementById('item-form-update'));
//     data.append('idVenta', idVenta);
// });