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
    private $estado = null;

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

    public function setEstado($value)
    {
        if ($this->validateBoolean($value)) {
            $this->estado = $value;
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

    public function getEstado()
    {
        return $this->estado;
    }

    // Método para leer toda la información de tipo factura existentes-------------------------.
    public function readAll()
    {
        $sql = 'SELECT uuid_tipo_venta, tipo_venta, estado_tipo_venta FROM tipo_venta';
        $params = null;
        return Database::getRows($sql, $params);
    }

    // Método para un dato en especifico de tipo factura existentes-------------------------.
    public function readOne()
    {
        $sql = 'SELECT uuid_tipo_venta, tipo_venta, estado_tipo_venta FROM tipo_venta where uuid_tipo_venta = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO tipo_venta(tipo_venta, estado_tipo_venta)
            VALUES (?, ?)';
        $params = array($this->tipo, $this->estado);
        return Database::executeRow($sql, $params);
    }

    /* UPDATE */
    public function updateRow()
    {
        $sql = 'UPDATE tipo_venta
        SET tipo_venta=?, estado_tipo_venta=?
        WHERE uuid_tipo_venta = ?;';
            $params = array($this->tipo,$this->estado,$this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    /* Función para borrar un color de la base (Solo se inahbilita)-------------------------*/
    public function deleteRow()
    {
        $this->estado = 0;
        //No eliminaremos registros, solo los inhabilitaremos-------------------------
        $sql = 'UPDATE tipo_venta
                SET estado_tipo_venta = ?
                WHERE uuid_tipo_venta = ?';
        $params = array($this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }
}