<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use App\Models\Reserva;
use App\Mail\ReservaProximaRecogida;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class RecordarRecogidaReservas extends Command
{
    protected $signature = 'reservas:recordar-recogida';
    protected $description = 'Envía recordatorio a clientes con recogida mañana';

    public function handle()
    {
        $manana = Carbon::tomorrow()->toDateString();

        $reservas = Reserva::with(['usuario', 'producto'])
            ->where('estado', 'aceptada')
            ->where('fecha_recogida', $manana)
            ->get();

        foreach ($reservas as $reserva) {
            Mail::to($reserva->usuario->email)->send(new ReservaProximaRecogida($reserva));
        }

        $this->info('Recordatorios de recogida de reservas enviados: ' . $reservas->count());
    }
}