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
        DB::table('subcategorias')->insert([
            // Muebles (id: 1)
            ['nombre' => 'Sillas', 'categoria_id' => 1],
            ['nombre' => 'Mesas', 'categoria_id' => 1],
            ['nombre' => 'Armarios', 'categoria_id' => 1],
            ['nombre' => 'Cómodas', 'categoria_id' => 1],
            ['nombre' => 'Sofás', 'categoria_id' => 1],
            // Decoración (id: 2)
            ['nombre' => 'Espejos', 'categoria_id' => 2],
            ['nombre' => 'Relojes', 'categoria_id' => 2],
            ['nombre' => 'Jarrones', 'categoria_id' => 2],
            // Iluminación (id: 3)
            ['nombre' => 'Lámparas de pie', 'categoria_id' => 3],
            ['nombre' => 'Lámparas de mesa', 'categoria_id' => 3],
            ['nombre' => 'Candelabros', 'categoria_id' => 3],
            // Vajilla y cristalería (id: 4)
            ['nombre' => 'Platos', 'categoria_id' => 4],
            ['nombre' => 'Copas', 'categoria_id' => 4],
            ['nombre' => 'Teteras', 'categoria_id' => 4],
            // Figuras y esculturas (id: 5)
            ['nombre' => 'Figuras de porcelana', 'categoria_id' => 5],
            ['nombre' => 'Esculturas de bronce', 'categoria_id' => 5],
            // Arte y cuadros (id: 6)
            ['nombre' => 'Pinturas al óleo', 'categoria_id' => 6],
            ['nombre' => 'Grabados', 'categoria_id' => 6],
            // Joyería y complementos (id: 7)
            ['nombre' => 'Broches', 'categoria_id' => 7],
            ['nombre' => 'Relojes de bolsillo', 'categoria_id' => 7],
            // Coleccionismo (id: 8)
            ['nombre' => 'Monedas', 'categoria_id' => 8],
            ['nombre' => 'Sellos', 'categoria_id' => 8],
        ]);
    }
}
