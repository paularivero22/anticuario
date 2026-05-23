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
        DB::table('users')->insertOrIgnore([
            [
                'id'         => 1,
                'name'       => 'Administrador',
                'email'      => 'admin@anticuario.com',
                'password'   => '$2y$12$pgGpRZK5dAqPp/GqpFih3us0p4PPT91uSXifsBUoWDpOXxycW.kq2',
                'telefono'   => '600000000',
                'rol'        => 'admin',
            ],
            [
                'id'         => 2,
                'name'       => 'Cliente Prueba',
                'email'      => 'cliente@prueba.com',
                'password'   => '$2y$12$h.tpQ/onb15zJFpWiCNKZONreFnUqmgzSNacjAltA7rtzKK9ckMKy',
                'telefono'   => '600 000 000',
                'rol'        => 'cliente',
            ],
            [
                'id'         => 4,
                'name'       => 'Antiguedades Mortera',
                'email'      => 'antiguedadesmortera@gmail.com',
                'password'   => '$2y$12$zgBFZCh95EJGTodvjXhVguM.OhVvK8pd/ILtDT5Q0dQTZm15WcZmy',
                'telefono'   => '626111556',
                'rol'        => 'admin',
            ],
        ]);
    }
}
