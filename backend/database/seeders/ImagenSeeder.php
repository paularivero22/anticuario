<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImagenSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('imagenes')->insert([
            ['url' => 'imagenes/silla-luis-xv-1.jpg', 'es_principal' => true, 'producto_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['url' => 'imagenes/silla-luis-xv-2.jpg', 'es_principal' => false, 'producto_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['url' => 'imagenes/mesa-victoriana-1.jpg', 'es_principal' => true, 'producto_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['url' => 'imagenes/mesa-victoriana-2.jpg', 'es_principal' => false, 'producto_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['url' => 'imagenes/espejo-art-deco-1.jpg', 'es_principal' => true, 'producto_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['url' => 'imagenes/lampara-modernista-1.jpg', 'es_principal' => true, 'producto_id' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['url' => 'imagenes/jarron-chino-1.jpg', 'es_principal' => true, 'producto_id' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['url' => 'imagenes/jarron-chino-2.jpg', 'es_principal' => false, 'producto_id' => 5, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
