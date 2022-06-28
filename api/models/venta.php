<?php
/*
*	Clase para manejar la tabla ventas de la base de datos.
*   Es clase hija de Validator.
*/
class Ventas extends Validator
{
    // Declaración de atributos (propiedades) según nuestra tabla en la base de datos.
    private $id = null;
    private $empleado = null;
    private $cliente = null;
    private $estado = null;
    private $tipo_venta = null;
    private $tipo_factura = null;
    private $fecha = null;
    private $correlativo = null;
    private $total = null;
    private $color = null;
    private $id_detalle = null;
    private $producto = null;
    private $cantidad = null;
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
        if ($this->validateString($value, 1, 38)) {
            $this->color = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setIdDetalle($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->id_detalle = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setProducto($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->producto = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setEmpleado($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setCliente($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->cliente = $value;
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

    public function setTipoVenta($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->tipo_venta = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setTipoFactura($value)
    {
        if ($this->validateString($value, 1, 38)) {
            $this->tipo_factura = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setFecha($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setCorrelativo($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->correlativo = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setTotal($value)
    {
        if ($this->validateMoney($value)) {
            $this->total = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setCantidad($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->cantidad = $value;
            return true;
        } else {
            return false;
        }
    }

    /*
    *   Métodos para obtener valores de los atributos.
    */
    public function getIdVenta()
    {
        return $this->id;
    }

    /* 
    *   Método para comprobar que existen pedidos registrados en nuestra base de datos-----------------.
    */

    public function readAll()
    {
        $sql = 'SELECT uuid_venta, nombres_empleado, apellidos_empleado, nombre_cliente, estado_venta, tipo_venta, tipo_factura, fecha_venta, correlativo_venta
                from venta inner join empleado using(uuid_empleado)
                inner join cliente using(uuid_cliente)
                inner join estado_venta using(uuid_estado_venta)
                inner join tipo_venta using(uuid_tipo_venta)
                inner join tipo_factura using (uuid_tipo_factura)';
        $params = null;
        return Database::getRows($sql, $params);
    }

    // Método para obtener los productos que se encuentran en la venta seleccionada------------------.
    public function readOrderDetail()
    {
        $sql = 'SELECT correlativo_venta, uuid_detalle_venta, imagen_producto, nombre_producto, color_producto, precio_producto, cantidad_producto, uuid_color_stock
                from venta inner join detalle_venta using(uuid_venta)
                inner join color_stock using (uuid_color_stock)
                inner join producto using (uuid_producto)
                inner join color_producto using (uuid_color_producto)
                where uuid_venta = ?
                order by color_producto';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT "idPedido", c."nombresCliente", c."apellidosCliente", c."direccionCliente", c."telefonoCliente", "fechaPedido", p."estadoPedido", "montoTotal", tp."tipoPago"
                from pedido as p inner join "cliente" as c using ("idCliente")
                inner join "tipoPago" as tp on p."tipoPago" = tp."idTipoPago"
                where "idPedido" = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, delete).
    */

    /* SEARCH */

    public function searchRows($value)
    {
        $sql = 'SELECT uuid_venta, nombres_empleado, apellidos_empleado, nombre_cliente, estado_venta, tipo_venta, tipo_factura, fecha_venta, correlativo_venta, monto_total
                from venta inner join empleado using(uuid_empleado)
                inner join cliente using(uuid_cliente)
                inner join estado_venta using(uuid_estado_venta)
                inner join tipo_venta using(uuid_tipo_venta)
                inner join tipo_factura using (uuid_tipo_factura)
                WHERE correlativo_venta::varchar(255) ILIKE ?';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    /* Método para filtrar tabla
    *   Parámetros: categoria = categoria por la cual filtrar, estado = estado por el cual filtrar-----------------.
    */
    public function readRowsFilter($tipo, $estado)
    {
        $sql = 'SELECT uuid_venta, nombres_empleado, apellidos_empleado, nombre_cliente, estado_venta, tipo_venta, tipo_factura, fecha_venta, correlativo_venta, monto_total
        from venta inner join empleado using(uuid_empleado)
        inner join cliente using(uuid_cliente)
        inner join estado_venta using(uuid_estado_venta)
        inner join tipo_venta using(uuid_tipo_venta)
        inner join tipo_factura using (uuid_tipo_factura)
        WHERE uuid_tipo_venta = ? AND uuid_estado_venta = ?';
        $params = array($tipo, $estado);
        return Database::getRows($sql, $params);
    }

    public function readRowsFilterDate($start, $end)
    {
        $sql = 'SELECT uuid_venta, nombres_empleado, apellidos_empleado, nombre_cliente, estado_venta, tipo_venta, tipo_factura, fecha_venta, correlativo_venta, monto_total
        from venta inner join empleado using(uuid_empleado)
        inner join cliente using(uuid_cliente)
        inner join estado_venta using(uuid_estado_venta)
        inner join tipo_venta using(uuid_tipo_venta)
        inner join tipo_factura using (uuid_tipo_factura)
        WHERE fecha_venta BETWEEN ? AND ?';
        $params = array($start, $end);
        return Database::getRows($sql, $params);
    }

    /* UPDATE */

    public function updateRow()
    {
        $sql = 'UPDATE "pedido"
                SET "estadoPedido" = ?
                WHERE "idPedido" = ?';
        $params = array($this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    /*
    *   MÉTODOS PARA EL SITIO PÚBLICO
    */

    /*
    *   Método para obtener los pedidos del cliente activo--------------------.
    */

    public function readPedidosCliente()
    {
        $sql = 'SELECT "idPedido", "fechaPedido", ep."estadoPedido", "montoTotal"
                from pedido as p inner join "estadoPedido" as ep on p."estadoPedido" = ep."idEstadoPedido"
                inner join "cliente" as c on p."idCliente" = c."idCliente"
                where p."idCliente" = ?
                and ep."idEstadoPedido" != 2
                order by "idPedido"';
        $params = array($_SESSION['idCliente']);
        return Database::getRows($sql, $params);
    }

    /* Método para verificar si existe un pedido en proceso para seguir comprando, de lo contrario se crea uno.*/
    public function startOrder()
    {           
        $sql = "INSERT INTO venta(uuid_empleado, uuid_estado_venta)
        VALUES(?, (select uuid_estado_venta from estado_venta where estado_venta = 'En proceso')) RETURNING uuid_venta;";
        $params = array($_SESSION['uuid_empleado']);
        if ($this->id = Database::getRowId($sql, $params)) {
            return true;
        } else {
            return false;
        }
        
    }


     public function readVentaId()
    {
        $sql = 'SELECT uuid_venta FROM venta WHERE uuid_venta = ?;';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Método para agregar un producto al carrito de compras.
    public function createDetail()
    {
        // Se realiza una subconsulta para obtener el precio del producto.
        $sql = 'INSERT INTO detalle_venta(uuid_color_stock, precio_unitario, cantidad_producto, uuid_venta)
        VALUES((SELECT uuid_color_stock FROM color_stock WHERE uuid_producto = ? AND uuid_color_producto = ?), (SELECT precio_producto FROM producto WHERE uuid_producto = ?), ?, ?);';
        $params = array($this->producto, $this->color, $this->producto, $this->cantidad, $this->id);
        return Database::executeRow($sql, $params);
    }



    public function checkProducto($idProducto)
    {
        $sql = 'SELECT COUNT(*) 
        FROM detalle_venta INNER JOIN color_stock USING (uuid_color_stock) INNER JOIN venta USING (uuid_venta)
        WHERE color_stock.uuid_producto = ? AND color_stock.uuid_color_producto = ? AND uuid_venta = ?;';
        $params = array($idProducto, $this->color, $this->id);
        return Database::registerExist($sql, $params);
    }



    public function readProductStock()
    {
        $sql = 'SELECT  stock
        FROM "colorStock" 
		WHERE "idColorStock" = ?';
        $params = array($this->color);
        return Database::getRow($sql, $params);
    }

    // Método para finalizar un pedido por parte del cliente.
    public function finishOrder($tipoFactura, $tipoVenta)
    {
        //Credito
        if(strval($tipoFactura) == '44a24a3c-06c1-42c1-a0d8-2c229cba197e'){
            if($tipoVenta == '6f2d2f0a-6134-4825-a9ff-978d156d5c49'){
                $sql = "UPDATE venta
                SET uuid_cliente = (SELECT uuid_cliente FROM cliente WHERE dui_cliente = ?), uuid_tipo_venta = ?, uuid_tipo_factura = ?, fecha_venta = CURRENT_DATE, correlativo_venta = (select nextval('seq_correlativo_credito')), uuid_estado_venta = 'f486f9a3-2083-4117-9342-804d5a3c3328'
                WHERE uuid_venta = ?";
                $params = array($this->cliente, $this->tipo_venta, $this->tipo_factura, $this->id);
                return Database::executeRow($sql, $params);
            } else {
                $sql = "UPDATE venta
                SET uuid_cliente = (SELECT uuid_cliente FROM cliente WHERE dui_cliente = ?), uuid_tipo_venta = ?, uuid_tipo_factura = ?, fecha_venta = CURRENT_DATE, correlativo_venta = (select nextval('seq_correlativo_credito')), uuid_estado_venta = 'afa22507-c0a0-42e0-b6ad-7b8da3ffddcb'
                WHERE uuid_venta = ?";
                $params = array($this->cliente, $this->tipo_venta, $this->tipo_factura, $this->id);
                return Database::executeRow($sql, $params);
            }
            
        //Consumidor
        } elseif(strval($tipoFactura) == 'f53a9f03-d43b-41fb-8e00-cdc9dfd81e26') {
            if($tipoVenta == '6f2d2f0a-6134-4825-a9ff-978d156d5c49'){
                $sql = "UPDATE venta
                SET uuid_cliente = (SELECT uuid_cliente FROM cliente WHERE dui_cliente = ?), uuid_tipo_venta = ?, uuid_tipo_factura = ?, fecha_venta = CURRENT_DATE, correlativo_venta = (select nextval('seq_correlativo_consumidor')), uuid_estado_venta = 'f486f9a3-2083-4117-9342-804d5a3c3328'
                WHERE uuid_venta = ?";
                $params = array($this->cliente, $this->tipo_venta, $this->tipo_factura, $this->id);
                return Database::executeRow($sql, $params);
            } else {
                $sql = "UPDATE venta
                SET uuid_cliente = (SELECT uuid_cliente FROM cliente WHERE dui_cliente = ?), uuid_tipo_venta = ?, uuid_tipo_factura = ?, fecha_venta = CURRENT_DATE, correlativo_venta = (select nextval('seq_correlativo_consumidor')), uuid_estado_venta = 'afa22507-c0a0-42e0-b6ad-7b8da3ffddcb'
                WHERE uuid_venta = ?";
                $params = array($this->cliente, $this->tipo_venta, $this->tipo_factura, $this->id);
                return Database::executeRow($sql, $params);
            }
            

        //Ticket
        } else {
            if($tipoVenta == '6f2d2f0a-6134-4825-a9ff-978d156d5c49'){
                $sql = "UPDATE venta
                SET uuid_cliente = (SELECT uuid_cliente FROM cliente WHERE dui_cliente = ?), uuid_tipo_venta = ?, uuid_tipo_factura = ?, fecha_venta = CURRENT_DATE, correlativo_venta = (select nextval('seq_correlativo_ticket')), uuid_estado_venta = 'f486f9a3-2083-4117-9342-804d5a3c3328'
                WHERE uuid_venta = ?";
                $params = array($this->cliente, $this->tipo_venta, $this->tipo_factura, $this->id);
                return Database::executeRow($sql, $params);
            } else {
                $sql = "UPDATE venta
                SET uuid_cliente = (SELECT uuid_cliente FROM cliente WHERE dui_cliente = ?), uuid_tipo_venta = ?, uuid_tipo_factura = ?, fecha_venta = CURRENT_DATE, correlativo_venta = (select nextval('seq_correlativo_ticket')), uuid_estado_venta = 'afa22507-c0a0-42e0-b6ad-7b8da3ffddcb'
                WHERE uuid_venta = ?";
                $params = array($this->cliente, $this->tipo_venta, $this->tipo_factura, $this->id);
                return Database::executeRow($sql, $params);
            }
            
        }
        
    }

    // Método para actualizar la cantidad de un producto agregado al carrito de compras.
    public function updateDetail()
    {
        $sql = 'UPDATE detalle_venta
            SET cantidad_producto = ?
            WHERE uuid_detalle_venta = ? AND uuid_venta = ?;';
        $params = array($this->cantidad, $this->id_detalle, $this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar un producto que se encuentra en el carrito de compras.
    public function deleteDetail()
    {
        $sql = 'DELETE FROM "detallePedido"
                    WHERE "idDetallePedido" = ? AND "idPedido" = ?';
        $params = array($this->idDetalle, $_SESSION['idPedido']);
        return Database::executeRow($sql, $params);
    }

    // Método para cancelar la venta.
    public function deleteRow()
    {
        $sql = "UPDATE venta
                SET  uuid_estado_venta = '2b735ff0-837e-4ad2-be13-6a6039640e3c'
                WHERE uuid_venta = ?";
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
