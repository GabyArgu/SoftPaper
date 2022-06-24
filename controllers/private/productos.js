// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_PRODUCTOS = SERVER + 'private/productos.php?action=';
const ENDPOINT_CATEGORIA = SERVER + 'private/categoria.php?action=readAll';
const ENDPOINT_SUBCATEGORIA = SERVER + 'private/subcategoria.php?action=readAllParam';
const ENDPOINT_MARCA = SERVER + 'private/marca.php?action=readAll';
const ENDPOINT_PROVEEDOR = SERVER + 'private/proveedor.php?action=readAll';
const ENDPOINT_COLOR = SERVER + 'private/color.php?action=readAll';
const ENDPOINT_ESTADO = SERVER + 'private/estado_producto.php?action=readAll';

Dropzone.autoDiscover = false;

// Dropzone class:
var myDropzone = new Dropzone("div#file", {
    url: `http://localhost/softpaper/api/images/productos/`,
    method: null,
    withCredentials: false,
    timeout: null,
    parallelUploads: 1,
    uploadMultiple: false,
    chunking: false,
    forceChunking: false,
    maxFilesize: 25,
    paramName: "file",
    maxFiles: 1,
    addRemoveLinks: true,
    acceptedFiles: "image/jpeg,image/png,image",
    init: function () {
        this.on("maxfilesexceeded", function (file) {
            this.removeAllFiles();
            this.addFile(file);
        });
    }
});
// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    readRows(API_PRODUCTOS);
    setTimeout(() => {
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
            $('#example').DataTable().columns([4, 5, 6]).visible($(this).is(':checked'))
        });

    }, 300);


});

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
                            <li><a class="dropdown-item" onclick="openShow(${row.uuid_producto})" data-bs-toggle="modal"
                                    data-bs-target="#modal-actualizar">Editar</a>
                            </li>
                            <li><a class="dropdown-item" onclick="openDelete(${row.idProducto})" type="button"
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
    myDropzone.removeAllFiles();
    //Añadimos la clase que esconde el select estado ya que todos los usuarios ingresados, tendrán el valor de activo y este se manda automaticamente
    document.getElementById('estado').classList.add('input-hide')
    document.getElementById('estado-label').classList.add('input-hide')

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