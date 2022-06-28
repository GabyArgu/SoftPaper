<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/estado_venta.php');

// Se comprueba si existe una acción a realizar por medio de isset, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $estadoVenta = new EstadoVenta;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['uuid_empleado'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Accion de leer toda la información------------------.
            case 'readAll':
                if ($result['dataset'] = $estadoVenta->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
                // Accion leer un elemento de toda la información------------------.       
            case 'readOne':
                if (!$estadoVenta->setId($_POST['id-v'])) {
                    $result['exception'] = 'Estado de producto incorrecto';
                } elseif ($result['dataset'] = $estadoVenta->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Estado de producto inexistente';
                }
                break;
            case 'create':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $estadoVenta->validateForm($_POST);
                if (!$estadoVenta->setEstado($_POST['nombre_estado_venta'])) {
                    $result['exception'] = 'Nombre de estado inválido';
                } elseif (!$estadoVenta->setEstadoEstado(1)) {
                    $result['exception'] = 'Estado de estado inválido';
                } elseif ($estadoVenta->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Estado de producto creado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'update':
                //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
                $_POST = $estadoVenta->validateForm($_POST);
                if (!$estadoVenta->setId($_POST['id-v'])) {
                    $result['exception'] = 'Estado incorrecto';
                } elseif (!$estadoVenta->setEstado($_POST['nombre_estado_venta'])) {
                    $result['exception'] = 'Nombre de estado inválido';
                } elseif (!$estadoVenta->setEstadoEstado($_POST['estado_estado_venta'])) {
                    $result['exception'] = 'Estado de estado inválido';
                } elseif ($estadoVenta->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Estado de producto actualizado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            case 'delete':
                if (!$estadoVenta->setId($_POST['id_delete'])) {
                    $result['exception'] = 'Estado de producto incorrecto';
                } elseif (!$estadoVenta->readOne()) {
                    $result['exception'] = 'Estado de producto inexistente';
                } elseif ($estadoVenta->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Estado de producto inhabilitado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;
            default:
                $result['exception'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        print(json_encode('Acceso denegado'));
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}