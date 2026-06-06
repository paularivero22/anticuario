<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Alquiler;
use App\Mail\AlquilerProximaRecogida;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class RecordarRecogidaAlquileres extends Command
{
    protected $signature = 'alquileres:recordar-recogida';
    protected $description = 'Envía recordatorio a clientes con recogida de alquiler mañana';

    public function handle()
    {
        $manana = Carbon::tomorrow()->toDateString();

        $alquileres = Alquiler::with(['usuario', 'producto'])
            ->where('estado', 'aceptado')
            ->where('fecha_recogida', $manana)
            ->get();

        foreach ($alquileres as $alquiler) {
            Mail::to($alquiler->usuario->email)->send(new AlquilerProximaRecogida($alquiler));
        }

        $this->info('Recordatorios de recogida de alquileres enviados: ' . $alquileres->count());
    }
}
