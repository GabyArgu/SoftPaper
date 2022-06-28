<?php
/*
*	Clase para manejar la tabla catalogo de colores de la base de datos de la tienda.
*   Es una clase hija de Validator.
*/
class ColorProducto extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
    private $color = null;
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

    public function setColor($value)
    {
        if ($this->validateAlphanumeric($value, 1, 50)) {
            $this->color = $value;
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

    public function getColor()
    {
        return $this->color;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    // Método para leer toda la información de los colores existentes-------------------------.
    public function readAll()
    {
        $sql = 'SELECT uuid_color_producto, color_producto, estado_color_producto FROM color_producto;';
        $params = null;
        return Database::getRows($sql, $params);
    }


    public function readColorProducto()
    {
        $sql = 'SELECT  uuid_color_producto, color_producto
                FROM color_producto inner join color_stock using(uuid_color_producto)
                inner join producto using(uuid_producto)
                WHERE producto.uuid_producto = ?
                ORDER BY color_producto';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }


    // Método para un dato en especifico de los colores existentes-------------------------.
    public function readOne()
    {
        $sql = 'SELECT *
        FROM "color_producto"
        where "uuid_color_producto" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT  "uuid_color_producto","color_producto", "estado_color_producto"
                FROM "color_producto" 
                WHERE "color_producto" ILIKE ?
                ORDER BY "uuid_color_producto"';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO "color_producto"("color_producto", "estado_color_producto")
        VALUES (?, ?);';
        $params = array($this->color,  $this->estado);
        return Database::executeRow($sql, $params);
    }


    /* UPDATE */
    public function updateRow()
    {
        $sql = 'UPDATE "color_producto"
                SET "color_producto" = ?, "estado_color_producto" = ?
                WHERE "uuid_color_producto" = ?';
            $params = array($this->color,$this->estado,$this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    /* Función para borrar un color de la base (Solo se inahbilita)-------------------------*/
    public function deleteRow()
    {
        $this->estado = 0;
        //No eliminaremos registros, solo los inhabilitaremos----------------------------
        $sql = 'UPDATE "color_producto" SET estado_color_producto = ? WHERE "uuid_color_producto" = ?';
        $params = array($this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }
}