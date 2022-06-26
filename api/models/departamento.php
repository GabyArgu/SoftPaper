<?php
/*
*	Clase para manejar la tabla catalogo de colores de la base de datos de la tienda.
*   Es una clase hija de Validator.
*/
class Departamento extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
    private $nombre = null;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setId($value)
    {
        if ($this->validateString($value, 1, 50)) {
            $this->id = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setNombre($value)
    {
        if ($this->validateAlphabetic($value)) {
            $this->nombre = $value;
            return true;
        } else {
            return false;
        }
    }
    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getId()
    {
        return $this->id;
    }

    public function getNombre()
    {
        return $this->nombre;
    }

    // Método para leer toda la información de los colores existentes-------------------------.
    public function readAll()
    {
        $sql = 'SELECT uuid_departamento, nombre_departamento FROM departamento';
        $params = null;
        return Database::getRows($sql, $params);
    }
}