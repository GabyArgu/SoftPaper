// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_USUARIOS = SERVER + 'private/usuarios.php?action=';

/*Inicializando y configurando tabla*/
$(document).ready(function () {
    $('#example').DataTable({
        "info": false,
        "columnDefs": [
            {
                "targets": [3],
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
        $('#example').DataTable().columns([3]).visible($(this).is(':checked'))
    })

    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
  
});

const reInitTable = () => {
    table.destroy();
    setTimeout(() => {
        readRows(API_PRODUCTOS);
    }, 100);

    setTimeout(() => {
        /*Inicializando y configurando tabla*/
        table = new DataTable('#table', options);

        /*Función para mostrar y ocultar campos de la tabla*/
        document.getElementById('checkTabla').addEventListener('change', function () {
            $('#table').DataTable().columns([4, 5, 6]).visible($(this).is(':checked'))
        });

    }, 300);
}

//Función para refrescar la tabla manualmente al darle click al botón refresh
document.getElementById('refresh').addEventListener('click', function () {
    readRows(API_USUARIOS);
    document.getElementById('search').value = "";
});


//Función que se ejecuta cada vez que apretamos una tecla dentro del input #search, sirve para buscador en tiempo real
$(document).on('keyup', '#search', function () {
    var valor = $(this).val();
    if (valor != "") {
        //SearchRows se encuentra en componentes.js y mandamos la ruta de la api, el formulario el cual contiene nuestro input para buscar (id) y el input de buscar (id)
        searchRows(API_USUARIOS, 'search-form', 'search');
    }
    else {
        //Cuando el input este vacío porque borramos el texto manualmente
        readRows(API_USUARIOS);
    }
});

// Función para preparar el modal al momento de insertar un registro.
function openCreate() {

    //Limpiamos los campos del modal
    document.getElementById('save-form').reset();

    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('modal-title').textContent = 'Agregar empleado';
    // Se habilitan los campos de alias y contraseña.
    document.getElementById('alias').disabled = false;
    document.getElementById('clave').disabled = false;
    document.getElementById('confirmar').disabled = false;

    //Añadimos la clase que esconde el select estado ya que todos los usuarios ingresados, tendrán el valor de activo y este se manda automaticamente
    document.getElementById('estado').classList.add('input-hide')
    document.getElementById('estado-label').classList.add('input-hide')

    //Ocultamos la imagen del avatar ya que por defecto no aparecerá, solo hasta que se seleccione un avatar
    document.getElementById('imagen-avatar').style.display = 'none '

    /* Se llama a la función que llena el select del formulario. Se encuentra en el archivo components.js, 
     * mandar de parametros la ruta de la api de la tabla que utiliza el select, y el id del select*/
    fillSelect(ENDPOINT_CARGO, 'cargo', null);
    fillSelect(ENDPOINT_AVATAR, 'foto', null);
}

// Función para preparar el formulario al momento de modificar un registro.
function openUpdate(id) {
    //Limpiamos los campos del modal
    document.getElementById('save-form').reset();
    // Se asigna el título para la caja de diálogo (modal).
    document.getElementById('modal-title').textContent = 'Actualizar empleado';
    //Desactivamos campos que no se podrán modificar-------------------.
    document.getElementById('alias').disabled = true;
    document.getElementById('clave').disabled = true;
    document.getElementById('confirmar').disabled = true;
    document.getElementById('estado').classList.remove('input-hide')
    document.getElementById('estado-label').classList.remove('input-hide')
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_USUARIOS + 'readOne', {
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
                    document.getElementById('id').value = response.dataset.uuid_empleado;
                     fillSelect(ENDPOINT_AVATAR, 'foto', response.dataset.fotoEmpleado);
                    document.getElementById('nombres').value = response.dataset.nombres_empleado;
                    document.getElementById('apellidos').value = response.dataset.apellidos_empleado;
                    document.getElementById('alias').value = response.dataset.alias_empleado;
                    document.getElementById('correo').value = response.dataset.correo_empleado;
                    fillSelect(ENDPOINT_CARGO, 'cargo', response.dataset.uuid_cargo_empleado);
                    fillSelect(ENDPOINT_ESTADO, 'estado', response.dataset.estado_empleado);
                    document.getElementById('imagen-avatar').src = `../../resources/img/avatares/avatar${response.dataset.fotoEmpleado}.jpg`
                    document.getElementById('imagen-avatar').style.display = 'inline-block'
                    
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Función para mandar el id de la row seleccionada al modal eliminar-------------------.
function openDelete(id) {
    document.getElementById('uuid_empleado').value = id;
}

// Función para preparar el formulario al momento de visualizar un registro.
function openShow(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_USUARIOS + 'readOneShow', {
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
                    document.getElementById('show-nombres').innerText = response.dataset.nombres_empleado;
                    document.getElementById('show-apellidos').innerText = response.dataset.apellidos_empleado;
                    document.getElementById('show-correo').innerText = response.dataset.correo_empleado;
                    document.getElementById('show-alias').innerText = response.dataset.alias_empleado;
                    document.getElementById('show-cargo').innerText = response.dataset.cargo_empleado;
                    document.getElementById('show-estado').innerText = response.dataset.estado_empleado;
                    document.getElementById('show-avatar').src = `../../resources/img/avatares/${response.dataset.avatar}.jpg`;
                    
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Función para llenar la tabla con los datos de los registros. Se manda a llamar en la función readRows().
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += `
            <tr>
                <th>${row.nombres_empleado}</th>
                <th>${row.apellidos_empleado}</th>
                <th>${row.alias_empleado}</th>
                <th>${row.correo_empleado}</th>
                <th>${row.cargo_empleado}</th>
                <th>${row.estado_empleado}</th>
                <td class="botones-table">
                    <div class="acciones d-flex mx-auto">
                        <span onclick="openUpdate(${row.uuid_empleado})" class="accion-btn" type="button"
                            data-bs-toggle="modal" data-bs-target="#save-modal">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </span>
                        <span onclick="openDelete(${row.uuid_empleado})" class="accion-btn" type="button"
                            data-bs-toggle="modal" data-bs-target="#modal-eliminar">
                            <i class="fa-solid fa-trash-can fa-lg"></i>
                        </span>
                        <span onclick="openShow(${row.uuid_empleado})" class="accion-btn" type="button"
                            data-bs-toggle="modal" data-bs-target="#modal-ver">
                            <i class="fa-solid fa-eye"></i>
                        </span>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se agregan las filas al cuerpo de la tabla mediante su id para mostrar los registros.
    document.getElementById('tbody-rows').innerHTML = content;
}


// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('save-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (document.getElementById('id').value) ? action = 'update' : action = 'create';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_USUARIOS, action, 'save-form', 'save-modal');
});

// Método manejador de eventos que se ejecuta cuando se envía el modal de eliminar-------------------.
document.getElementById('delete-form').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario-------------------.
    event.preventDefault();
    //Llamamos al método que se encuentra en la api y le pasamos la ruta de la API y el id del formulario dentro de nuestro modal eliminar-------------------.
    confirmDelete(API_USUARIOS, 'delete-form');
});


//Función para cambiar y mostrar el avatar dinámicamente en modals-------------------.
function changeAvatar() {
    let combo = document.getElementById('foto')
    let selected = combo.options[combo.selectedIndex].text;
    document.getElementById('imagen-avatar').style.display = 'inline-block'
    document.getElementById('imagen-avatar').src = `../../resources/img/avatares/${selected}.jpg`;
}



