<?php
require_once('../helpers/database.php');
require_once('../helpers/validaciones.php');
require_once('../models/estado_producto.php');

// Se comprueba si existe una acción a realizar por medio de isset, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $estadoProducto = new EstadoProducto;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'exception' => null, 'dataset' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['uuid_empleado'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Accion de leer toda la información------------------.
            case 'readAll':
                if ($result['dataset'] = $estadoProducto->readAll()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'No hay datos registrados';
                }
                break;
            // Accion leer un elemento de toda la información------------------.       
            case 'readOne':
                if (!$estadoProducto->setId($_POST['id'])) {
                    $result['exception'] = 'Subcategoría incorrecta';
                } elseif ($result['dataset'] = $estadoProducto->readOne()) {
                    $result['status'] = 1;
                } elseif (Database::getException()) {
                    $result['exception'] = Database::getException();
                } else {
                    $result['exception'] = 'Subcategoría inexistente';
                }
                break;
            // Accion de actualizar un elemento de toda la información------------------.     
            // case 'update':
            //     //Especificamos los inputs por medio de su atributo name, y los capturamos con el método post
            //     $_POST = $estadoProducto->validateForm($_POST);
            //     if (!$estadoProducto->setId($_POST['id'])) {
            //         $result['exception'] = 'Subcategoria incorrecta';
            //     } elseif (!$data = $estadoProducto->readOne()) {
            //         $result['exception'] = 'Subcategoria inexistente';
            //     }elseif (!$estadoProducto->setNombre($_POST['nombre'])) {
            //         $result['exception'] = 'Nombre inválido';
            //     }  elseif (!$estadoProducto->setCategoria($_POST['categoria'])){
            //         $result['exception'] = 'Categoría inválida';
            //     } elseif (!$estadoProducto->setDescripcion($_POST['descripcion'])) {
            //         $result['exception'] = 'Descripción inválida';
            //     } elseif (!$estadoProducto->setEstado($_POST['estado'])) {
            //         $result['exception'] = 'Estado inválido';
            //     } elseif (!is_uploaded_file($_FILES['archivo']['tmp_name'])) {
            //         if ($estadoProducto->updateRow($data['imagenSubcategoria'])) {
            //             $result['status'] = 1;
            //             $result['message'] = 'Subcategoría modificada correctamente';
            //         } else {
            //             $result['exception'] = Database::getException();
            //         }
            //     } elseif (!$estadoProducto->setImagen($_FILES['archivo'])) {
            //         $result['exception'] = $estadoProducto->getFileError();
            //     } elseif ($estadoProducto->updateRow($data['imagenSubcategoria'])) {
            //         $result['status'] = 1;
            //         if ($estadoProducto->saveFile($_FILES['archivo'], $estadoProducto->getRuta(), $estadoProducto->getImagen())) {
            //             $result['message'] = 'Subcategoría actualizada correctamente';
            //         } else {
            //             $result['message'] = 'Subcategoría actualizada pero no se guardó la imagen';
            //         }
            //     } else {
            //         $result['exception'] = Database::getException();
            //     }
            //     break;
            // Accion de desabilitar un elemento de toda la información------------------.        
            case 'delete':
                if (!$productos->setId($_POST['id-delete'])) {
                    $result['exception'] = 'Producto incorrecto';
                } elseif (!$productos->readOne()) {
                    $result['exception'] = 'Producto inexistente';
                } elseif ($productos->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto inhabilitado correctamente';
                } else {
                    $result['exception'] = Database::getException();
                }
                break;   
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
