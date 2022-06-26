<?php
/*
*	Clase para manejar la tabla catalogo de colores de la base de datos de la tienda.
*   Es una clase hija de Validator.
*/
class Municipio extends Validator
{
    // Declaración de atributos (propiedades).
    private $id = null;
    private $municipio = null;

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

    public function setMunicipio($value)
    {
        if ($this->validateAlphanumeric($value, 1, 50)) {
            $this->municipio = $value;
            return true;
        } else {
            return false;
        }
    }

    public function setDepartamento($value)
    {
        if ($this->validateString($value, 1, 50)) {
            $this->departamento = $value;
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

    public function getMunicipio()
    {
        return $this->municipio;
    }

    public function getDepartamento()
    {
        return $this->departamento;
    }

    // Método para leer toda la información de los colores existentes-------------------------.
    public function readAll()
    {
        $sql = 'SELECT uuid_municipio, nombre_municipio, d.uuid_departamento
        FROM municipio as m inner join "departamento" as d on m.uuid_departamento = d.uuid_departamento 
        WHERE nombre_departamento = ?';
        $params = array($this->departamento);
        return Database::getRows($sql, $params);
    }

    public function readAllParam()
    {
        $sql = 'SELECT uuid_municipio, nombre_municipio FROM municipio WHERE uuid_departamento = ?;';
        
        $params = array($this->departamento);
        return Database::getRows($sql, $params);
    }
}