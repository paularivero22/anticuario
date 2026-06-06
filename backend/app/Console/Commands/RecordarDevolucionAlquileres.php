<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use App\Models\Alquiler;
use App\Mail\AlquilerProximaDevolucion;
use App\Mail\AlquilerRetrasado;
use App\Mail\AlquilerRetrasadoAdmin;
use App\Mail\CancelacionAdmin;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
class RecordarDevolucionAlquileres extends Command
{
    protected $signature = 'alquileres:recordar-devolucion';
    protected $description = 'Envía recordatorio de devolución y avisos de retraso';
    public function handle()
    {
        $manana = Carbon::tomorrow()->toDateString();
        $hoy    = Carbon::today()->toDateString();
        // Recordatorio: devolución mañana
        $proximosADevolver = Alquiler::with(['usuario', 'producto'])
            ->where('estado', 'recogido')
            ->where('fecha_devolucion', $manana)
            ->get();
        foreach ($proximosADevolver as $alquiler) {
            Mail::to($alquiler->usuario->email)->send(new AlquilerProximaDevolucion($alquiler));
        }
        // Aviso de retraso: fecha de devolución ya pasó
        $retrasados = Alquiler::with(['usuario', 'producto'])
            ->where('estado', 'retrasado')
            ->where('fecha_devolucion', '<', $hoy)
            ->get();
        foreach ($retrasados as $alquiler) {
            $diasRetraso = Carbon::parse($alquiler->fecha_devolucion)->diffInDays(Carbon::today());
            Mail::to($alquiler->usuario->email)->send(new AlquilerRetrasado($alquiler, $diasRetraso));
            Mail::to('antiguedadesmortera@gmail.com')->send(new AlquilerRetrasadoAdmin($alquiler, $diasRetraso));
        }
        $this->info('Recordatorios de devolución enviados: ' . $proximosADevolver->count());
        $this->info('Avisos de retraso enviados: ' . $retrasados->count());
    }
}