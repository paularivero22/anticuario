<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Imagen extends Model
{
    use HasFactory;

    protected $table = 'imagenes';

    protected $fillable = [
        'url',
        'es_principal',
        'producto_id',
    ];

    // una imagen pertenece a un producto
    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}