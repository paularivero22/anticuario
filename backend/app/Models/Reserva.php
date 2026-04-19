<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'producto_id',
        'fecha_recogida',
        'estado',
    ];

    // una reserva pertenece a un usuario
    public function usuario()
    {
        return $this->belongsTo(User::class);
    }

    // una reserva pertenece a un producto
    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}