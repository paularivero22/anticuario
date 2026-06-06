<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Alquiler;
use Carbon\Carbon;

class RestrasarAlquileres extends Command
{
    protected $signature = 'alquileres:retrasar';
    protected $description = 'Command description';

    public function handle()
    {
        $retrasados = Alquiler::where('estado', 'recogido')
            ->where('fecha_devolucion', '<', Carbon::today())
            ->get();

        foreach ($retrasados as $alquiler) {
            $alquiler->update(['estado' => 'retrasado']);
        }

        $this->info('Alquileres retrasados: ' . $retrasados->count());
    }
}