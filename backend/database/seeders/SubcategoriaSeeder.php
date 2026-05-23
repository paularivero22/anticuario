<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubcategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('subcategorias')->insertOrIgnore([
            [
                'id' => 1,
                'nombre' => 'Sillas',
                'categoria_id' => 1
            ],
            [
                'id' => 2,
                'nombre' => 'Mesas',
                'categoria_id' => 1
            ],
            [
                'id' => 3,
                'nombre' => 'Armarios',
                'categoria_id' => 1
            ],
            [
                'id' => 4,
                'nombre' => 'Cómodas',
                'categoria_id' => 1
            ],
            [
                'id' => 5,
                'nombre' => 'Sofás',
                'categoria_id' => 1
            ],
            [
                'id' => 6,
                'nombre' => 'Espejos',
                'categoria_id' => 2
            ],
            [
                'id' => 7,
                'nombre' => 'Relojes',
                'categoria_id' => 2
            ],
            [
                'id' => 8,
                'nombre' => 'Jarrones',
                'categoria_id' => 2
            ],
            [
                'id' => 9,
                'nombre' => 'Lámparas de pie',
                'categoria_id' => 3
            ],
            [
                'id' => 10,
                'nombre' => 'Lámparas de mesa',
                'categoria_id' => 3
            ],
            [
                'id' => 11,
                'nombre' => 'Candelabros',
                'categoria_id' => 3
            ],
            [
                'id' => 12,
                'nombre' => 'Platos',
                'categoria_id' => 4
            ],
            [
                'id' => 13,
                'nombre' => 'Copas',
                'categoria_id' => 4
            ],
            [
                'id' => 14,
                'nombre' => 'Teteras',
                'categoria_id' => 4
            ],
            [
                'id' => 15,
                'nombre' => 'Figuras de porcelana',
                'categoria_id' => 5
            ],
            [
                'id' => 16,
                'nombre' => 'Esculturas de bronce',
                'categoria_id' => 5
            ],
            [
                'id' => 17,
                'nombre' => 'Pinturas al óleo',
                'categoria_id' => 6
            ],
            [
                'id' => 18,
                'nombre' => 'Grabados',
                'categoria_id' => 6
            ],
            [
                'id' => 19,
                'nombre' => 'Broches',
                'categoria_id' => 7
            ],
            [
                'id' => 20,
                'nombre' => 'Relojes de bolsillo',
                'categoria_id' => 7
            ],
            [
                'id' => 21,
                'nombre' => 'Monedas',
                'categoria_id' => 8
            ],
            [
                'id' => 22,
                'nombre' => 'Sellos',
                'categoria_id' => 8
            ],
            [
                'id' => 23,
                'nombre' => 'Licoreras',
                'categoria_id' => 8
            ],
            [
                'id' => 25,
                'nombre' => 'Instrumentales',
                'categoria_id' => 8
            ],
            [
                'id' => 26,
                'nombre' => 'Armaduras',
                'categoria_id' => 2
            ],
            [
                'id' => 27,
                'nombre' => 'Botellas de cristal',
                'categoria_id' => 4
            ],
            [
                'id' => 28,
                'nombre' => 'Caza',
                'categoria_id' => 2
            ],
            [
                'id' => 29,
                'nombre' => 'Cámaras y Estereoscopios',
                'categoria_id' => 8
            ],
            [
                'id' => 30,
                'nombre' => 'Escritorios',
                'categoria_id' => 1
            ],
            [
                'id' => 31,
                'nombre' => 'Cerámica',
                'categoria_id' => 2
            ],
            [
                'id' => 32,
                'nombre' => 'Libros',
                'categoria_id' => 8
            ],
            [
                'id' => 33,
                'nombre' => 'Radios antiguas',
                'categoria_id' => 2
            ],
            [
                'id' => 34,
                'nombre' => 'Teléfonos antiguos',
                'categoria_id' => 2
            ],
            [
                'id' => 35,
                'nombre' => 'Salseras y soperas',
                'categoria_id' => 4
            ],
        ]);
    }
}
