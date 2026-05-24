<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImagenSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('imagenes')->insertOrIgnore([
            
        ]);
    }
}