<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pais extends Model
{
    use HasFactory;

    // laravel plurariza automatiamente el nombre de la tabla como paiss
    protected $table = 'paises';

    protected $fillable = [
        'nombre',
    ];

    // un pais puede tener muchos productos
    public function productos()
    {
        return $this->hasMany(Producto::class);
    }
}