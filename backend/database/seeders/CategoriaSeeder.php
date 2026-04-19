<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('categorias')->insert([
            ['nombre' => 'Muebles'],
            ['nombre' => 'Decoración'],
            ['nombre' => 'Iluminación'],
            ['nombre' => 'Vajilla y cristalería'],
            ['nombre' => 'Figuras y esculturas'],
            ['nombre' => 'Arte y cuadros'],
            ['nombre' => 'Joyería y complementos'],
            ['nombre' => 'Coleccionismo'],
        ]);
    }
}
