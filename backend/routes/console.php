<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Schedule::command('reservas:expirar')->daily();
// Schedule::command('alquileres:expirar')->daily();
// Schedule::command('alquileres:retrasar')->daily();

// Schedule::command('reservas:recordar-recogida')->daily();
// Schedule::command('alquileres:recordar-recogida')->daily();
// Schedule::command('alquileres:recordar-devolucion')->daily();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
