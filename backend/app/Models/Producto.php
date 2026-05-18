<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos'; 

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'estado',
        'destacado',
        'permite_reserva',
        'permite_alquiler',
        'subcategoria_id',
        'pais_id',
        'epoca_id',
        'medidas',
        'materiales',
    ];

    // un producto pertenece a una subcategoria
    public function subcategoria()
    {
        return $this->belongsTo(Subcategoria::class);
    }

    // un producto pertenece a un pais 
    public function pais()
    {
        return $this->belongsTo(Pais::class);
    }

    // un producto pertenece a una epoca
    public function epoca()
    {
        return $this->belongsTo(Epoca::class);
    }

    // un producto puede tener muchas imagenes
    public function imagenes()
    {
        return $this->hasMany(Imagen::class);
    }

    // un producto puede tener muchas reservas
    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }

    // un producto puede tener muchos alquileres
    public function alquileres()
    {
        return $this->hasMany(Alquiler::class);
    }

    // Funcion para obtener la imagen principal del producto
    public function imagenPrincipal()
    {
        return $this->hasOne(Imagen::class)->where('es_principal', true);
    }
}
