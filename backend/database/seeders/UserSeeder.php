<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'name' => 'Administrador',
                'email' => 'admin@anticuario.com',
                'password' => bcrypt('admin1234'),
                'telefono' => '600000000',
                'rol' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cliente Prueba',
                'email' => 'cliente@prueba.com',
                'password' => bcrypt('cliente1234'),
                'telefono' => '611111111',
                'rol' => 'cliente',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
