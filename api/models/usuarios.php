<?php
/*
*	Esta sera la clase para manejar la tabla usuarios de la base de datos.
*   Es una clase hija de Validator.
*/
class Usuarios extends Validator
{
    // Declaración de atributos (propiedades) según nuestra tabla en la base de datos.
    private $id = null;
    private $nombres = null;
    private $apellidos = null;
    private $cargo = null;
    private $foto = null;
    private $estado = null;
    private $correo = null;
    private $alias = null;
    private $clave = null;

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

    public function setNombres($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->nombres = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setApellidos($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->apellidos = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setCargo($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->cargo = $value;
            return true;
        } else {
            return false;
        }
    }


    public function setCorreo($value)
    {
        if ($this->validateEmail($value)) {
            $this->correo = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setAlias($value)
    {
        if ($this->validateAlphanumeric($value, 1, 38)) {
            $this->alias = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setClave($value)
    {
        if ($this->validatePassword($value)) {
            $this->clave = password_hash($value, PASSWORD_DEFAULT);
            return true;
        } else {
            return false;
        }
    }

    public function setFoto($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->foto = $value;
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

    public function getNombres()
    {
        return $this->nombres;
    }

    public function getApellidos()
    {
        return $this->apellidos;
    }

    public function getCargo()
    {
        return $this->cargo;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    public function getCorreo()
    {
        return $this->correo;
    }

    public function getAlias()
    {
        return $this->alias;
    }

    public function getClave()
    {
        return $this->clave;
    }
    
    public function getFoto()
    {
        return $this->foto;
    }

    /*
    *   Métodos para gestionar la cuenta de la tabla usuario.
    */

    // Se verifica si hay concidencias de información mediante el correo del empleado ingresado-------------------------.

    public function checkUser($correo)
    {
        $sql = 'SELECT uuid_empleado, estado_empleado FROM empleado WHERE correo_empleado = ? or alias_empleado = ?';
        $params = array($correo, $correo);
        if ($data = Database::getRow($sql, $params)) {
            $this->id = $data['uuid_empleado'];
            $this->estado = $data['estado_empleado'];
            $this->correo = $correo;
            return true;
        } else {
            return false;
        }
    }

    // Método para verificar la contraseña-------------------------.
    public function checkPassword($password)
    {
        $sql = "SELECT contrasena_empleado FROM empleado WHERE uuid_empleado = ?";
        $params = array($this->id);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['contrasena_empleado'])) {
            return true;
        } else {
            return false;
        }
    }

    // Método para cambiar la contraseña-------------------------.
    public function changePassword()
    {
        $sql = 'UPDATE empleado SET claveEmpleado = ? WHERE idEmpleado = ?';
        $params = array($this->clave, $this->id);
        return Database::executeRow($sql, $params);
    }
    /* 
    *   Método para comprobar que existen usuarios registrados en nuestra base de datos
    */

    // Método para leer toda la información de los usuarios registrados-------------------------.
    public function readAll()
    {
        $sql = 'SELECT uuid_empleado, nombres_empleado, apellidos_empleado, ce.cargo_empleado, estado_empleado
        FROM empleado as e inner join cargo_empleado as ce USING(uuid_cargo_empleado)
		order by nombres_empleado, estado_empleado;';
        
        $params = null;
        return Database::getRows($sql, $params);
    }

    // Método para un dato en especifico de los usuarios registrados-------------------------.
    public function readOne()
    {
        $sql = 'SELECT "uuid_empleado", "nombres_empleado", "apellidos_empleado", "correo_empleado", "alias_empleado", "uuid_avatar", "estado_empleado", "uuid_cargo_empleado"
        FROM empleado
        where "uuid_empleado" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /* Método para obtener un empleado y mostrarlo en modal de visualizar*/
    public function readOneShow()
    {
        $sql = 'SELECT "uuid_empleado", "nombres_empleado", "apellidos_empleado", "correo_empleado",  "alias_empleado", a."uuid_avatar", ce."uuid_cargo_empleado", ce."cargo_empleado", "estado_empleado"
        FROM empleado as e inner join "cargo_empleado" as ce on e."uuid_cargo_empleado" = ce."uuid_cargo_empleado"
		inner join "avatar_empleado" as a on e."uuid_avatar" = a."uuid_avatar" 
        where "uuid_empleado" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT "idEmpleado", "nombresEmpleado", "apellidosEmpleado", ce."cargoEmpleado", ee."estadoEmpleado"
                FROM empleado as e inner join "cargoEmpleado" as ce on e."cargoEmpleado" = ce."idCargoEmpleado"
                inner join "estadoEmpleado" as ee on e."estadoEmpleado" = ee."idEstadoEmpleado"
                WHERE "nombresEmpleado" ILIKE ? OR "apellidosEmpleado" ILIKE ?
                order by "idEmpleado", e."estadoEmpleado"';
        $params = array("%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO empleado(nombres_empleado, apellidos_empleado, correo_empleado, alias_empleado, contrasena_empleado, uuid_avatar, uuid_cargo_empleado, estado_empleado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
        $params = array($this->nombres, $this->apellidos, $this->correo, $this->alias, $this->clave, $this->foto, $this->cargo, $this->estado);
        return Database::executeRow($sql, $params);
    }


    /* UPDATE */
    public function updateRow()
    {
        $sql = 'UPDATE empleado
                SET "nombres_empleado" = ?, "apellidos_empleado" = ?, "correo_empleado" = ?, "alias_empleado" = ?, "contrasena_empleado" = ?, "uuid_avatar" = ?, "uuid_cargo_empleado" = ?, "estado_empleado" = ?
                WHERE "uuid_empleado" = ?';
            $params = array($this->nombres, $this->apellidos, $this->correo, $this->alias, $this->clave, $this->foto, $this->cargo, $this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    // Update perfil del empleado
    public function updatePerfil()
    {
        $sql = 'UPDATE empleado
                SET "nombres_empleado" = ?, "apellidos_empleado" = ?, "alias_empleado" = ?
                WHERE "uuid_empleado" = ?';
            $params = array($this->nombres, $this->apellidos, $this->alias, $this->id);
        return Database::executeRow($sql, $params);
    }

    /* DELETE */
    /* Función para inhabilitar un usuario ya que no los borraremos de la base------------------------- */
    public function deleteRow()
    {
        //No eliminaremos registros, solo los inhabilitaremos-------------------------.
        $sql = 'UPDATE empleado SET "estado_empleado" = 3 WHERE "uuid_empleado" = ?'; //Delete from empleado where "idEmpleado" = ? -------------------------.
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}