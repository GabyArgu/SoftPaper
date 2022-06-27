<?php
/*
*	Clase para manejar la tabla catalogo de colores de la base de datos de la tienda.
*   Es una clase hija de Validator.
*/
class TipoVenta extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
    private $tipo = null;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setId($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->id = $value;
            return true;
        } else {
            return false;
        }
    }


    public function setTipo($value)
    {
        if ($this->validateString($value, 1, 50)) {
            $this->tipo = $value;
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

    public function getTipo()
    {
        return $this->tipo;
    }

    // Método para leer toda la información de los colores existentes-------------------------.
    public function readAll()
    {
        $sql = 'SELECT uuid_tipo_venta, tipo_venta FROM tipo_venta';
        $params = null;
        return Database::getRows($sql, $params);
    }
}