<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Reserva;
use Carbon\Carbon;

class ExpirarReservas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reservas:expirar';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Expira reservas cuya fecha de recogida ha pasado';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        /* obtiene las reservas que no se hayan marcado como completadas (estado aceptada)
        cuya fecha de recogida ha pasado (con margen de 24 horas) */
        $reservas = Reserva::where('estado', 'aceptada')
            ->where('fecha_recogida', '<', Carbon::yesterday())
            ->get();

        foreach ($reservas as $reserva) {
            // las reservas se marcan automaticamente como expiradas    
            $reserva->update(['estado' => 'expirada']);
            
            /* el producto reservado se marca como disponible y se verá en la pagina
            si ha sido un error y el admin se ha olvidado de marcar la reserva como completada
            el producto se puede desactivar manualmente y si se ha reservado o alquilado se pueden cancelar */
            $reserva->producto->update(['estado' => 'disponible']);
        }

        // informacion de cuantas reservas se han marcado como reservadas 
        $this->info('Reservas expiradas: ' . $reservas->count());
    }
}
