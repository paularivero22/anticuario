<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Epoca extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
    ];

    // una epoca puede tener muchos productos
    public function productos()
    {
        return $this->hasMany(Producto::class);
    }
}