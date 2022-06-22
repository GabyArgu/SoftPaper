<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Cliente extends Validator
{
    // Declaración de atributos (propiedades) según nuestra tabla en la base de datos.
    private $id = null;
    private $nombre = null;
    private $direccion = null;
    private $municipio = null;
    private $nrc = null;
    private $nit = null;
    private $dui = null;
    private $telefono = null;
    private $giro = null;
    private $estado = null;

    /*
    *   Métodos para validar y asignar valores de los atributos.
    */
    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id = $value;
            return true;
        } else {
            return false;
        }
    }

    
    public function setNombre($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->nombre = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDireccion($value)
    {
        if ($this->validateAlphabetic($value)) {
            $this->direccion = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setMunicipio($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->municipio = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setNrc($value)
    {
        if ($this->validateNRC($value)) {
            $this->nrc = $value;
            return true;
        } else {
            return false;
        }
    }
    public function setNIT($value)
    {
        if ($this->validateNIT($value)) {
            $this->nit = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDUI($value)
    {
        if ($this->validateDUI($value)) {
            $this->dui = $value;
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

    public function setGiro($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->giro = $value;
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

    public function getNombre()
    {
        return $this->nombre;
    }

    public function getDireccion()
    {
        return $this->direccion;
    }

    public function getMunicipio()
    {
        return $this->municipio;
    }

    public function getNRC()
    {
        return $this->nrc;
    }

    public function getNIT()
    {
        return $this->nit;
    }

    public function getDUI()
    {
        return $this->dui;
    }

    public function getTelefono()
    {
        return $this->telefono;
    }

    public function getGiro()
    {
        return $this->giro;
    }

    public function getEstado()
    {
        return $this->estado;
    }
    /* 
    *   Método para comprobar que existen subcategorias registradas en nuestra base de datos
    */
    public function readAll()
    {
        $sql = 'SELECT "uuid_cliente", "nombre_cliente", "direccion_cliente", m."nombre_municipio", "nrc_cliente", "nit_cliente", "dui_cliente", "telefono_cliente", g."giro_cliente", "estado_cliente"
        FROM cliente as cc inner join "municipio" as m on cc."uuid_municipio" = m."uuid_municipio"
		inner join "giro_cliente" as g on cc."uuid_giro_cliente" = g."uuid_giro_cliente" 
        ORDER BY "uuid_cliente"
        ';
        
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT p."idProducto", "idSubCategoriaP", "idProveedor", "idMarca", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", "estadoProducto", "idColor", stock, descuento 
        FROM producto as p inner join "colorStock" as cs on p."idProducto" = cs."idProducto"
        WHERE p."idProducto" =  ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    public function readProductStock()
    {
        $sql = 'SELECT  stock
        FROM "colorProducto" as cp inner join "colorStock" as cs on cp."idColor"  = cs."idColor"
		inner join producto as p on cs."idProducto" = p."idProducto"
		WHERE p."idProducto" = ? and cp."idColor" = ?';
        $params = array($this->id, $this->color);
        return Database::getRow($sql, $params);
    }

    public function readOneShow()
    {
        $sql = 'SELECT p."idProducto", "nombreSubCategoriaP", "nombreMarca", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", ep."estadoProducto", cp."idColor",cp."colorProducto", stock, fecha, descuento 
        FROM producto as p inner join "colorStock" as cs on p."idProducto" = cs."idProducto"
		inner join "subcategoriaProducto" as sp on p."idSubCategoriaP" = sp."idSubCategoriaP"
		inner join "estadoProducto" as ep on p."estadoProducto" = ep."idEstadoProducto"
		inner join marca as m on p."idMarca" = m."idMarca"
		inner join "colorProducto" as cp on cs."idColor" = cp."idColor"
        WHERE p."idProducto" =  ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT "idProducto", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", ep."estadoProducto" 
        FROM producto as p inner join "estadoProducto" as ep on p."estadoProducto" = ep."idEstadoProducto"
        WHERE "nombreProducto" ILIKE ? OR "descripcionProducto" ILIKE ?
        ORDER BY "idProducto"';
        $params = array("%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    public function searchRowsPublic($value)
    {
        $sql = 'SELECT Distinct on ("idProducto") "idProducto", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", descuento, "estadoProducto", "idColorStock", "idColor", p."idSubCategoriaP"
        FROM producto as p INNER JOIN "marca" USING("idMarca") INNER JOIN "colorStock" USING("idProducto")
		WHERE ("nombreProducto" ILIKE ? OR "nombreMarca" ILIKE ?) AND "idSubCategoriaP" = ? AND "estadoProducto" = 1 
		ORDER BY "idProducto"';
        $params = array("%$value%", "%$value%", $this->id);
        return Database::getRows($sql, $params);
    }

    public function filterPrecio($min, $max)
    {
        $sql = 'SELECT Distinct on ("idProducto") "idProducto", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", descuento, "estadoProducto", "idColorStock", "idColor", p."idSubCategoriaP"
        FROM producto as p INNER JOIN "marca" USING("idMarca") INNER JOIN "colorStock" USING("idProducto")
		WHERE  "idSubCategoriaP" = ? AND "estadoProducto" = 1 AND "precioProducto" BETWEEN ? AND ?
		ORDER BY "idProducto"';
        $params = array($this->id, $min, $max);
        return Database::getRows($sql, $params);
    }

    /* CREATE */
    public function createRow()
    {
        $sql = 'INSERT INTO producto(
        "idSubCategoriaP", "idProveedor", "idMarca", "nombreProducto", "descripcionProducto", "precioProducto", "estadoProducto", "imagenPrincipal", descuento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING "idProducto";';
        $params = array($this->subcategoria, $this->proveedor, $this->marca, $this->nombre, $this->descripcion, $this->precio, $this->estado, $this->imagen, $this->descuento);
        return Database::executeRow($sql, $params);
    }

    /* Función para obtener el id del último registro ingresado*/
    public function getLastId()
    {
        $sql = 'SELECT MAX("idProducto") as "idProducto" FROM producto ';
        return Database::getRowId($sql);
    }

    public function insertStock($lastId)
    {
        $sql = 'INSERT INTO "colorStock"(
        "idProducto", "idColor", stock, fecha)
        VALUES (?, ?, ?, CURRENT_DATE);';
        $params = array($lastId, $this->color, $this->stock);
        return Database::executeRow($sql, $params);
    }

    /* UPDATE */
    public function updateRow($current_image)
    {   
        // Se verifica si existe una nueva imagen para borrar la actual, de lo contrario se mantiene la actual.
        ($this->imagen) ? $this->deleteFile($this->getRuta(), $current_image) : $this->imagen = $current_image;

        $sql = 'UPDATE producto
            SET "idSubCategoriaP"=?, "idProveedor"=?, "idMarca"=?, "nombreProducto"=?, "descripcionProducto"=?, "precioProducto"=?, "estadoProducto"=?, "imagenPrincipal"=?, descuento = ?
            WHERE "idProducto"=?;';
            $params = array($this->subcategoria, $this->proveedor, $this->marca, $this->nombre, $this->descripcion, $this->precio, $this->estado, $this->imagen, $this->descuento, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function updateStock()
    {   
        $sql = 'UPDATE "colorStock"
            SET "idColor"=?, stock=?, fecha = CURRENT_DATE
            WHERE "idProducto" = ?;';
            $params = array($this->color, $this->stock, $this->id);
        return Database::executeRow($sql, $params);
    }
    /* DELETE */
    /* Función para inhabilitar un usuario ya que no los borraremos de la base*/
    public function deleteRow()
    {
        //No eliminaremos registros, solo los inhabilitaremos
        $sql = 'UPDATE producto SET "estadoProducto" = 3 WHERE "idProducto" = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }


    /* Funciones para mostrar productos en público */
    public function readDestacados()
    {
        $sql = 'SELECT "idProducto", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", descuento, ep."estadoProducto", "idColorStock"
        FROM producto as p inner join "estadoProducto" as ep on p."estadoProducto" = ep."idEstadoProducto" INNER JOIN "colorStock" USING("idProducto")
		WHERE descuento >=25
        ORDER BY "idProducto"
        ';
        
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readProductosSubcategoria()
    {
        $sql = 'SELECT Distinct on ("idProducto") "idProducto", "imagenPrincipal", "nombreProducto", "descripcionProducto", "precioProducto", descuento, ep."estadoProducto", "idColorStock", "idColor", p."idSubCategoriaP"
        FROM producto as p inner join "estadoProducto" as ep on p."estadoProducto" = ep."idEstadoProducto" INNER JOIN "colorStock" USING("idProducto")
		WHERE "idSubCategoriaP" = ? AND p."estadoProducto" = 1
		ORDER BY "idProducto"';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }
}
