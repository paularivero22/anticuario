<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('productos')->insert([
            [
                'nombre' => 'Silla Luis XV',
                'descripcion' => 'Elegante silla estilo Luis XV con tapizado original en buen estado.',
                'precio' => 450.00,
                'estado' => 'disponible',
                'destacado' => true,
                'permite_reserva' => true,
                'permite_alquiler' => false,
                'medidas' => '45x45x90 cm',
                'materiales' => 'Madera de nogal, terciopelo',
                'subcategoria_id' => 1,
                'epoca_id' => 2,
                'pais_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Mesa de comedor victoriana',
                'descripcion' => 'Mesa de comedor extensible estilo victoriano para 8 personas.',
                'precio' => 1200.00,
                'estado' => 'disponible',
                'destacado' => true,
                'permite_reserva' => true,
                'permite_alquiler' => true,
                'medidas' => '200x90x75 cm',
                'materiales' => 'Madera de caoba',
                'subcategoria_id' => 2,
                'epoca_id' => 3,
                'pais_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Espejo dorado Art Déco',
                'descripcion' => 'Espejo de pared con marco dorado estilo Art Déco.',
                'precio' => 320.00,
                'estado' => 'disponible',
                'destacado' => false,
                'permite_reserva' => true,
                'permite_alquiler' => false,
                'medidas' => '60x120 cm',
                'materiales' => 'Marco de madera dorada',
                'subcategoria_id' => 6,
                'epoca_id' => 3,
                'pais_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Lámpara de pie modernista',
                'descripcion' => 'Lámpara de pie con base de bronce y pantalla de cristal emplomado.',
                'precio' => 680.00,
                'estado' => 'disponible',
                'destacado' => true,
                'permite_reserva' => false,
                'permite_alquiler' => true,
                'medidas' => '40x170 cm',
                'materiales' => 'Bronce, cristal emplomado',
                'subcategoria_id' => 9,
                'epoca_id' => 3,
                'pais_id' => 4,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre' => 'Jarrón chino dinastía Qing',
                'descripcion' => 'Jarrón de porcelana china con decoración floral.',
                'precio' => 890.00,
                'estado' => 'disponible',
                'destacado' => false,
                'permite_reserva' => true,
                'permite_alquiler' => true,
                'medidas' => '20x50 cm',
                'materiales' => 'Porcelana',
                'subcategoria_id' => 8,
                'epoca_id' => 3,
                'pais_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
