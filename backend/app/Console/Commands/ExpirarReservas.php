<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use App\Models\Reserva;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservaAceptadaCancelada;
use Carbon\Carbon;
class ExpirarReservas extends Command
{
    protected $signature = 'reservas:expirar';
    protected $description = 'Expira reservas cuya fecha de recogida ha pasado';

    public function handle()
    {
        $reservas = Reserva::with(['usuario', 'producto'])
            ->where('estado', 'aceptada')
            ->where('fecha_recogida', '<', Carbon::today())
            ->get();

        foreach ($reservas as $reserva) {
            $reserva->update(['estado' => 'expirada']);
        }

        $this->info('Reservas expiradas: ' . $reservas->count());
    }
}