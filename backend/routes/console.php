<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

/* todos los dias se ejecutan los siguientes comandos: 
1. Comando para expirar reservas cuya fecha de recogida ha pasado y no se hayan marcado como completadas
2. Comando para expirar alquileres cuya fecha de recogida ha pasado y no se hayan marcado como completados
3. Comando para retrasar alquileres cuya fecha de devolución ha pasado y el producto ya se ha recogido
*/
Schedule::command('reservas:expirar')->daily();
Schedule::command('alquileres:expirar')->daily();
Schedule::command('alquileres:retrasar')->daily();

Schedule::command('reservas:recordar-recogida')->daily();
Schedule::command('alquileres:recordar-recogida')->daily();
Schedule::command('alquileres:recordar-devolucion')->daily();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
