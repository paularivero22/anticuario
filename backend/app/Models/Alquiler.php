<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alquiler extends Model
{
    use HasFactory;

    // laravel plurariza automatiamente el nombre de la tabla como alquilers 
    protected $table = 'alquileres';

    protected $fillable = [
        'usuario_id',
        'producto_id',
        'fecha_recogida',
        'fecha_devolucion',
        'estado',
    ];

    // un alquiler pertenece a un usuario
    public function usuario()
    {
        return $this->belongsTo(User::class);
    }

    // un alquiler pertenece a un producto
    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}