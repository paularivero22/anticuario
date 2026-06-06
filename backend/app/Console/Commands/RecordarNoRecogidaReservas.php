<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use App\Models\Reserva;
use App\Mail\ReservaNoRecogida;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
class RecordarNoRecogidaReservas extends Command
{
    protected $signature = 'reservas:recordar-no-recogida';
    protected $description = 'Avisa al admin de reservas no recogidas el día anterior';
    public function handle()
    {
        $ayer = Carbon::yesterday()->toDateString();
        $reservas = Reserva::with(['usuario', 'producto'])
            ->where('estado', 'expirada')
            ->where('fecha_recogida', $ayer)
            ->get();
        foreach ($reservas as $reserva) {
            Mail::to('antiguedadesmortera@gmail.com')->send(new ReservaNoRecogida($reserva));
        }
        $this->info('Avisos de no recogida de reservas enviados: ' . $reservas->count());
    }
}