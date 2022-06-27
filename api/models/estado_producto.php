<?php
/*
*	Clase para manejar la tabla catalogo de colores de la base de datos de la tienda.
*   Es una clase hija de Validator.
*/
class EstadoProducto extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
    private $estado = null;
    private $estado_estado = null;

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


    public function setEstado($value)
    {
        if ($this->validateString($value, 1, 50)) {
            $this->estado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setEstadoEstado($value)
    {
        if ($this->validateBoolean($value)) {
            $this->estado_estado = $value;
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

    public function getEstado()
    {
        return $this->estado;
    }

    public function getEstadoEstado()
    {
        return $this->estado_estado;
    }

    // Método para leer toda la información de los colores existentes-------------------------.
    public function readAll()
    {
        $sql = 'SELECT uuid_estado_producto, estado_producto, estado_estado_producto FROM estado_producto';
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readColorProducto()
    {
        $sql = 'SELECT  cp."idColor", "colorProducto"
        FROM "colorProducto" as cp inner join "colorStock" as cs on cp."idColor"  = cs."idColor"
		inner join producto as p on cs."idProducto" = p."idProducto"
		WHERE p."idProducto" = ?
        ORDER BY "idColor"';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    // Método para un dato en especifico de los colores existentes-------------------------.
    public function readOne()
    {
        $sql = 'SELECT *
        FROM "colorProducto"
        where "idColor" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT  "idColor","colorProducto", ee."estado"
                FROM "colorProducto" as e inner join estado as ee on e."estado" = ee."idEstado"
                WHERE "colorProducto" ILIKE ?
                ORDER BY "idColor"';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO "colorProducto"("colorProducto", estado)
                VALUES (?, 1);';
        $params = array($this->color);
        return Database::executeRow($sql, $params);
    }


    /* UPDATE */
    public function updateRow()
    {
        $sql = 'UPDATE "colorProducto"
                SET "colorProducto" = ?,
                "estado" = ?
                WHERE "idColor" = ?';
            $params = array($this->color,$this->estado,$this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    /* Función para borrar un color de la base (Solo se inahbilita)-------------------------*/
    public function deleteRow()
    {
        //No eliminaremos registros, solo los inhabilitaremos-------------------------
        $sql = 'UPDATE "colorProducto"
                SET estado = 2
                WHERE "idColor" = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}