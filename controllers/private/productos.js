// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTOS = SERVER + 'private/productos.php?action=';
const ENDPOINT_CATEGORIA = SERVER + 'private/categoria.php?action=readAll';
const ENDPOINT_SUBCATEGORIA = SERVER + 'private/subcategoria.php?action=readAllParam';
const ENDPOINT_MARCA = SERVER + 'private/marca.php?action=readAll';
const ENDPOINT_PROVEEDOR = SERVER + 'private/proveedor.php?action=readAll';
const ENDPOINT_COLOR = SERVER + 'private/color.php?action=readAll';
const ENDPOINT_ESTADO = SERVER + 'private/estado_producto.php?action=readAll';

//Configuración de la tabla
const options = {
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
// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {

    readRows(API_PRODUCTOS);

    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#table', options);

        /*Función para mostrar y ocultar campos de la tabla*/
        document.getElementById('checkTabla').addEventListener('change', function () {
            $('#table').DataTable().columns([4, 5, 6]).visible($(this).is(':checked'))
        });

    }, 300);
});

const reInitTable = () => {
    table.destroy();
    readRows(API_PRODUCTOS);

    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#table', options);

        /*Función para mostrar y ocultar campos de la tabla*/
        document.getElementById('checkTabla').addEventListener('change', function () {
            $('#table').DataTable().columns([4, 5, 6]).visible($(this).is(':checked'))
        });

    }, 300);
}

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <td data-title="PRODUCTO" class="col-table">
                    <div class="nombre-producto"><img
                            src="${SERVER}images/productos/${row.imagen_producto}"
                            alt="">${row.nombre_producto}
                    </div>
                </td>
                <td data-title="CATEGORIA" class="categoria">${row.nombre_subcategoria_p}</td>
                <td data-title="PRECIO" class="precio">$${row.precio_producto}</td>
                <td data-title="INVENTARIO" class="inventario">${row.stock}</td>
                <td data-title="MARCA" class="marca">${row.nombre_marca}</td>
                <td data-title="PROVEEDOR" class="proveedor">${row.nombre_proveedor}</td>
                <td data-title="DESCRIPCION" class="descripcion">${row.descripcion_producto}</td>
                <td data-title="ESTADO" class="estado-stock"><span class="estado">${row.estado_producto}</span></td>
                <td data-title="Acciones" class="botones-table">
                    <div class="dropdown">
                        <button class=" btn-acciones dropdown-toggle" type="button"
                            id="dropdownMenuButton1" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Acciones
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end animate slideIn"
                            aria-labelledby="dropdownMenuButton1">
                            <li><a class="dropdown-item" onclick="openUpdate('${row.uuid_producto}')" type="button"  data-bs-toggle="modal"
                                    data-bs-target="#save-modal">Editar</a>
                            </li>
                            <li><a class="dropdown-item" onclick="openDelete('${row.uuid_producto}')" type="button"
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

// Función para preparar el modal al momento de insertar un registro.
function openCreate() {
    //Limpiamos los campos del modal
    document.getElementById('save-form').reset();
    //Limpiamos el select dependiente
    subcategoria.length = null;
    //Añadimos la clase que esconde el select estado ya que todos los usuarios ingresados, tendrán el valor de activo y este se manda automaticamente
    document.getElementById('estado').classList.add('input-hide')
    document.getElementById('estado-label').classList.add('input-hide')
    document.getElementById('img-thumbnail').classList.add('input-hide');
    //Activamos el stock
    document.getElementById('stock').disabled = false;
    document.getElementById('update-stock').classList.add('input-hide')
    /* Se llama a la función que llena el select del formulario. Se encuentra en el archivo components.js, 
    * mandar de parametros la ruta de la api de la tabla que utiliza el select, y el id del select*/
    fillSelect(ENDPOINT_CATEGORIA, 'categoria', null);
    fillSelect(ENDPOINT_MARCA, 'marca', null);
    fillSelect(ENDPOINT_PROVEEDOR, 'proveedor', null);
    fillSelect(ENDPOINT_COLOR, 'color', null);
}

document.getElementById("categoria").addEventListener("change", function () {
    var selectValue = document.getElementById('categoria').value;
    fillSelectDependent(ENDPOINT_SUBCATEGORIA, 'subcategoria', null, selectValue);
});

// Función para preparar el formulario al momento de modificar un registro.
function openUpdate(id) {
    //Limpiamos los campos del modal
    document.getElementById('save-form').reset();
    document.getElementById('id').value = id;
    //Mostramos label y select de estado
    document.getElementById('estado').classList.remove('input-hide')
    document.getElementById('estado-label').classList.remove('input-hide')
    // Se establece el campo de archivo como opcional.
    document.getElementById('archivo').required = false;
    //Desactivamos el stock al actualizar
    document.getElementById('stock').disabled = true;
    document.getElementById('update-stock').classList.remove('input-hide')


    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_PRODUCTOS + 'readOne', {
        method: 'post',
        body: data
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.
                    document.getElementById('nombre').value = response.dataset.nombre_producto;
                    document.getElementById('descripcion').value = response.dataset.descripcion_producto;
                    document.getElementById('precio').value = response.dataset.precio_producto;
                    document.getElementById('stock').value = response.dataset.stock;
                    fillSelect(ENDPOINT_CATEGORIA, 'categoria', response.dataset.uuid_categoria_p);
                    fillSelectDependent(ENDPOINT_SUBCATEGORIA, 'subcategoria', response.dataset.uuid_subcategoria_p, response.dataset.uuid_categoria_p);
                    fillSelect(ENDPOINT_MARCA, 'marca', response.dataset.uuid_marca);
                    fillSelect(ENDPOINT_PROVEEDOR, 'proveedor', response.dataset.uuid_proveedor);
                    fillSelect(ENDPOINT_COLOR, 'color', response.dataset.uuid_color_producto);
                    fillSelect(ENDPOINT_ESTADO, 'estado', response.dataset.uuid_estado_producto);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}


// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('save-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (document.getElementById('id').value) ? action = 'update' : action = 'create';
    //Se activa el campo de stock para poder mandarlo al servidor, si está desactivado no se puede mandar
    document.getElementById('stock').disabled = false;
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_PRODUCTOS, action, 'save-form', 'save-modal');
    //Se desactiva el campo de stock porque ya se utilizo
    document.getElementById('stock').disabled = true;
    reInitTable();
});

//Función para general thumbnail de imagen en el input file
function previewFile() {
    var preview = document.getElementById('img-thumbnail');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    
    if(preview.classList.contains('input-hide')){
        preview.classList.remove('input-hide');
    }

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }
}