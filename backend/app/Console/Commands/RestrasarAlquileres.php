<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Alquiler;
use Carbon\Carbon;

class RestrasarAlquileres extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'alquileres:retrasar';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        /* obtiene los alquileres que no se hayan marcado como completados pero si 
        se ha recogido el producto (estado recogido) y cuya fecha de recogida 
        ha pasado (con margen de 24 horas) */
        $retrasados = Alquiler::where('estado', 'recogido')
            ->where('fecha_devolucion', '<', Carbon::today())
            ->get();

        /* los alquileres se marcan automaticamente como retrasados 
        el estado del producto seguirá siendo alquilado hasta que 
        el admin cancele manualmente el alquiler o lo marque como completado */
        foreach ($retrasados as $alquiler) {
            $alquiler->update(['estado' => 'retrasado']);
        }

        $this->info('Alquileres retrasados: ' . $retrasados->count());
    }
}
