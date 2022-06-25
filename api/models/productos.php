<?php
/*
*	Clase para manejar la tabla usuarios de la base de datos.
*   Es clase hija de Validator.
*/
class Productos extends Validator
{
    // Declaración de atributos (propiedades) según nuestra tabla en la base de datos.
    private $id = null;
    private $nombre = null;
    private $descripcion = null;
    private $precio = null;
    private $subcategoria = null;
    private $proveedor = null;
    private $marca = null;
    private $estado = null;
    private $color = null;
    private $stock = null;
    private $descuento = null;
    private $imagen = null;
    private $ruta = '../images/productos/';

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

    
    public function setNombre($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->nombre = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setPrecio($value)//validaciones
    {
        if ($this->validateMoney($value)) {
            $this->precio = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setSubcategoria($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->subcategoria = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setProveedor($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->proveedor = $value;
            return true;
        } else {
            return false;
        }
    }
    public function setMarca($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->marca = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDescripcion($value)
    {
        if($this->validateString($value, 1, 400)) {
            $this->descripcion = $value;
            return true;
        } else {
            return false;
        }
        
    }

    public function setImagen($file)
    {
        if ($this->validateImageFile($file, 1000, 1000)) {
            $this->imagen = $this->getFileName();
            return true;
        } else {
            return false;
        }
    }

    public function setEstado($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->estado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setColor($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->color = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setStock($value)
    {
        if ($this->validateStock($value)) {
            $this->stock = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDescuento($value)
    {
        if ($this->validateStock($value)) {
            $this->descuento = $value;
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

    public function getPrecio()
    {
        return $this->precio;
    }

    public function getSubcategoria()
    {
        return $this->subcategoria;
    }

    public function getProveedor()
    {
        return $this->proveedor;
    }

    public function getMarca()
    {
        return $this->marca;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function getImagen()
    {
        return $this->imagen;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    public function getColor()
    {
        return $this->color;
    }

    public function getStock()
    {
        return $this->stock;
    }

    public function getDescuento()
    {
        return $this->descuento;
    }

    public function getRuta()
    {
        return $this->ruta;
    }

    /* 
    *   Método para comprobar que existen subcategorias registradas en nuestra base de datos
    */
    public function readAll()
    {
        $sql = "SELECT Distinct on (nombre_producto) nombre_producto, uuid_producto, imagen_producto, nombre_subcategoria_p, precio_producto, uuid_color_producto, uuid_color_stock, stock, nombre_marca, nombre_proveedor, descripcion_producto, estado_producto
        FROM producto INNER JOIN estado_producto USING(uuid_estado_producto)
		INNER JOIN subcategoria_producto USING(uuid_subcategoria_p)
		INNER JOIN color_stock USING(uuid_producto)
		INNER JOIN marca USING(uuid_marca)
		INNER JOIN detalle_producto USING(uuid_producto)
		INNER JOIN proveedor USING(uuid_proveedor)
		ORDER BY  nombre_producto, stock DESC";
        
        $params = null;
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT Distinct on (nombre_producto) nombre_producto, descripcion_producto, imagen_producto, precio_producto, uuid_subcategoria_p, uuid_marca, uuid_estado_producto,  uuid_proveedor, uuid_color_producto, stock, (SELECT uuid_categoria_p FROM subcategoria_producto WHERE uuid_subcategoria_p = (SELECT uuid_subcategoria_p FROM producto WHERE uuid_producto = ?))
        FROM producto INNER JOIN color_stock USING(uuid_producto) INNER JOIN detalle_producto USING(uuid_producto)
        WHERE uuid_producto = ?
		ORDER BY  nombre_producto, stock DESC;';
        $params = array($this->id, $this->id);
        return Database::getRow($sql, $params);
    }



    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */
    /* SEARCH */
    public function searchRows($value)
    {
        $sql = 'SELECT Distinct on (nombre_producto) nombre_producto, uuid_producto, imagen_producto, nombre_subcategoria_p, precio_producto, uuid_color_producto, uuid_color_stock, stock, nombre_marca, nombre_proveedor, descripcion_producto, estado_producto
        FROM producto INNER JOIN estado_producto USING(uuid_estado_producto)
		INNER JOIN subcategoria_producto USING(uuid_subcategoria_p)
		INNER JOIN color_stock USING(uuid_producto)
		INNER JOIN marca USING(uuid_marca)
		INNER JOIN detalle_producto USING(uuid_producto)
		INNER JOIN proveedor USING(uuid_proveedor)
        WHERE "nombre_producto" ILIKE ?
        ORDER BY  nombre_producto, stock DESC';
        $params = array("%$value%");
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
        $sql = 'INSERT INTO public.producto(
            uuid_subcategoria_p, uuid_marca, nombre_producto, descripcion_producto, precio_producto, imagen_producto, uuid_estado_producto)
            VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING uuid_producto';
        $params = array($this->subcategoria, $this->marca, $this->nombre, $this->descripcion, $this->precio, $this->imagen, $this->estado,);
        /* Guardamos el último id porque es necesario para hacer el insert de manera completa */
        if ($this->id = Database::getRowId($sql, $params)) {
            return true;
        } else {
            return false;
        }
    }

    /*FUNCIONES PARA INSERTAR EN TABLAS FORANEAS INFORMACIÓN DEL PRODUCTO */
    public function insertStock()
    {
        $sql = 'INSERT INTO color_stock(uuid_producto, uuid_color_producto, stock) VALUES(?, ?, ?)';
        $params = array($this->id, $this->color, $this->stock);
        return Database::executeRow($sql, $params);
    }

    public function insertProvider()
    {
        $sql = 'INSERT INTO detalle_producto(uuid_producto, uuid_proveedor) VALUES(?, ?)';
        $params = array($this->id, $this->proveedor);
        return Database::executeRow($sql, $params);
    }


    /* UPDATE */
    public function updateRow($current_image)
    {   
        // Se verifica si existe una nueva imagen para borrar la actual, de lo contrario se mantiene la actual.
        ($this->imagen) ? $this->deleteFile($this->getRuta(), $current_image) : $this->imagen = $current_image;

        $sql = 'UPDATE producto
                SET uuid_subcategoria_p=?, uuid_marca=?, nombre_producto=?, descripcion_producto=?, precio_producto=?, imagen_producto=?, uuid_estado_producto=?
                WHERE uuid_producto=?;';
        $params = array($this->subcategoria, $this->marca, $this->nombre, $this->descripcion, $this->precio, $this->imagen, $this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function updateStock()
    {   
        $sql = 'SELECT COUNT(*) 
                FROM color_stock WHERE uuid_color_producto = ? AND uuid_producto = ?';
        $params = array($this->color, $this->id);

        if (Database::registerExist($sql, $params)) {
            $sql = 'UPDATE color_stock SET stock = ? WHERE uuid_color_producto = ? AND uuid_producto = ?;';
            $params = array($this->stock, $this->color, $this->id);
            return Database::executeRow($sql, $params);
        }
        else{
            $sql = 'INSERT INTO color_stock(uuid_producto, uuid_color_producto, stock) VALUES(?, ?, ?)';
            $params = array($this->id, $this->color, $this->stock);
            return Database::executeRow($sql, $params);
        } 
    }
    public function updateProvider()
    {   
        $sql = 'SELECT COUNT(*) 
                FROM detalle_producto WHERE uuid_proveedor = ? AND uuid_producto = ?;';
        $params = array($this->proveedor, $this->id);

        if (Database::registerExist($sql, $params)) {
            return true;
        }
        else{
            $sql = 'INSERT INTO detalle_producto(uuid_producto, uuid_proveedor) VALUES(?, ?)';
            $params = array($this->id, $this->proveedor);
            return Database::executeRow($sql, $params);
        } 
    }
    /* */
    public function readProductStock()
    {
        $sql = 'SELECT 	stock
        FROM color_stock 
		WHERE uuid_producto = ? and uuid_color_producto = ?';
        $params = array($this->id, $this->color);
        return Database::getRow($sql, $params);
    }

    /* DELETE */
    /* Funciones para inhabilitar un producto ya que no los borraremos de la base*/
    /* Función que actualiza el estado del producto a sin existencias*/
    public function deleteRow()
    {
        //No eliminaremos registros, solo los inhabilitaremos, borraremos el stock, y borraremos sus registros en tablas foraneas, dejando uno para que se pueda mostrar en la tabla
        $sql = "UPDATE producto SET uuid_estado_producto = (SELECT uuid_estado_producto FROM estado_producto WHERE estado_producto = 'Sin existencias') WHERE uuid_producto = ?;";
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    /* Función que borra todos los registros del producto en la tabla color_stock dejando uno para que se muestre en el readRows*/
    public function deleteColorStock()
    {
        $sql = 'DELETE FROM color_stock
        WHERE uuid_color_stock IN 
        (SELECT uuid_color_stock
        FROM (SELECT uuid_color_stock,
                ROW_NUMBER() OVER (partition BY uuid_producto ORDER BY uuid_color_stock) AS RowNumber
                FROM color_stock) AS T
        WHERE T.RowNumber > 1) AND uuid_producto = ?;';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
    /* Función que borra todos los registros del producto en la tabla detalle_producto dejando uno para que se muestre en el readRows*/
    public function deleteProvider()
    {
        $sql = 'DELETE FROM detalle_producto
        WHERE uuid_detalle_producto IN 
        (SELECT uuid_detalle_producto
        FROM (SELECT uuid_detalle_producto,
                ROW_NUMBER() OVER (partition BY uuid_producto ORDER BY uuid_detalle_producto) AS RowNumber
            FROM detalle_producto) AS T
        WHERE T.RowNumber > 1) AND uuid_producto = ?;';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
    /* Función que actualiza el stock del producto después de vaciar las tablas necesarias*/
    public function colorAfterDelete()
    {
        $sql = 'UPDATE color_stock SET stock = 0 WHERE uuid_producto = ?;';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
