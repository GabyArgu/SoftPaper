// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_USUARIOS = SERVER + 'private/usuarios.php?action=';

const ENDPOINT_CARGO = SERVER + 'private/cargo_empleado.php?action=readAll';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se define una variable para establecer las opciones del componente Modal.
    cargarDatos();
});

function cargarDatos(id) {
    // Se define un objeto con los datos del registro seleccionado.
    const data = new FormData();
    data.append('id', id);
    // Petición para obtener los datos del registro solicitado.
    fetch(API_USUARIOS + 'readOnePerfil', {
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
                    document.getElementById("nombre_emp").value = response.dataset.nombres_empleado;
                    document.getElementById("apellido_emp").value = response.dataset.apellidos_empleado;
                    document.getElementById("alias_emp").value = response.dataset.alias_empleado;
                    document.getElementById("cargo_emp").disabled = false;
                    document.getElementById("estado_emp").disabled = false;
                    // Se llama a la función para cargar los select---------------------------.
                    if (response.dataset.estado_empleado) {
                        document.getElementById('estado_emp').value = 1;
                    } else {
                        document.getElementById('estado_emp').value = 0;
                    }
                    fillSelect(ENDPOINT_CARGO, 'cargo_emp', response.dataset.uuid_cargo_empleado);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de actualizar.
document.getElementById('update-empleado').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow3(API_USUARIOS, 'updateP', 'update-empleado', null);
});