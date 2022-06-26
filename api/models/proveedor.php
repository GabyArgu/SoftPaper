<?php
/*
*	Clase para manejar la tabla categorias de la base de datos.
*   Es clase hija de Validator.
*/
class Proveedor extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
    private $proveedor = null;
    private $telefono = null;
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

    public function setProveedor($value)
    {
        if ($this->validateString($value, 1, 50)) {
            $this->proveedor = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setTelefono($value)
    {   
        if ($this->validatePhone($value)) {
            $this->telefono = $value;
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

    public function getProveedor()
    {
        return $this->proveedor;
    }

    public function getTelefono()
    {
        return $this->telefono;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    // Método para leer toda la información de los colores existentes-------------------------.
    public function readAll()
    {
        $sql = 'SELECT uuid_proveedor, nombre_proveedor, telefono_proveedor, estado_proveedor FROM proveedor WHERE estado_proveedor = true;';
        $params = null;
        return Database::getRows($sql, $params);
    }

    // Método para un dato en especifico de los colores existentes-------------------------.
    public function readOne()
    {
        $sql = 'SELECT "nombre_proveedor", "telefono_proveedor", "estado_proveedor" FROM proveedor WHERE "uuid_proveedor" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readOneShow()
    {
        $sql = 'SELECT "nombreProveedor", "telefonoProveedor", "direccionProveedor", e.estado FROM proveedor p INNER JOIN estado as e on p.estado = e."idEstado" 
		WHERE "idProveedor" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT "uuid_proveedor", "nombre_proveedor", "telefono_proveedor", "estado_proveedor"
        FROM proveedor
        WHERE "nombre_proveedor" ILIKE ?
		ORDER BY "uuid_proveedor"';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO proveedor(
            "nombre_proveedor", "telefono_proveedor", "estado_proveedor")
            VALUES (?, ?, ?);';
        $params = array($this->proveedor, $this->telefono, $this->estado);
        return Database::executeRow($sql, $params);
    }

    /* UPDATE */
    public function updateRow()
    {   
        $sql = 'UPDATE proveedor
        SET "nombre_proveedor" = ?, "telefono_proveedor" = ?, "estado_proveedor" = ?
        WHERE "uuid_proveedor" = ?;';
            $params = array($this->proveedor, $this->telefono, $this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    /* Función para inhabilitar un usuario ya que no los borraremos de la base---------------------------*/
    public function deleteRow()
    {
        $this->estado = 0;
        //No eliminaremos registros, solo los inhabilitaremos----------------------------
        $sql = 'UPDATE proveedor SET "estado_proveedor" = ? WHERE "uuid_proveedor" = ?';
        $params = array($this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }
}