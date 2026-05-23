<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EpocaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('epocas')->insertOrIgnore([
            ['nombre' => 'Siglo XVII'],
            ['nombre' => 'Siglo XVIII'],
            ['nombre' => 'Siglo XIX'],
            ['nombre' => 'Siglo XX'],
        ]);
    }
}
