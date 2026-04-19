<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Alquiler;
use Carbon\Carbon;

class ExpirarAlquileres extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'alquileres:expirar';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expira alquileres cuya fecha de recogida ha pasado y gestiona retrasos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        /* obtiene los alquileres que no se hayan marcado como recogidos (estado aceptado)
        cuya fecha de recogida ha pasado (con margen de 24 horas) */
        $expirados = Alquiler::where('estado', 'aceptado')
            ->where('fecha_recogida', '<', Carbon::yesterday())
            ->get();

        foreach ($expirados as $alquiler) {
            // los alquileres se marcan automaticamente como expirados
            $alquiler->update(['estado' => 'expirado']);

            /* el producto alquilado se marca como disponible y se verá en la pagina 
            si ha sido un error y el admin se ha olvidado de marcar el alquiler como completado
            el producto se puede desactivar manualmente y si se ha reservado o alquilado se pueden cancelar*/
            $alquiler->producto->update(['estado' => 'disponible']);
        }

        $this->info('Alquileres expirados: ' . $expirados->count());
    }
}
