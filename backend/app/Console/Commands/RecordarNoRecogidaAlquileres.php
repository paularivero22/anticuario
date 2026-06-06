<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use App\Models\Alquiler;
use App\Mail\AlquilerNoRecogido;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
class RecordarNoRecogidaAlquileres extends Command
{
    protected $signature = 'alquileres:recordar-no-recogida';
    protected $description = 'Avisa al admin de alquileres no recogidos el día anterior';
    public function handle()
    {
        $ayer = Carbon::yesterday()->toDateString();
        $alquileres = Alquiler::with(['usuario', 'producto'])
            ->where('estado', 'expirado')
            ->where('fecha_recogida', $ayer)
            ->get();
        foreach ($alquileres as $alquiler) {
            Mail::to($alquiler->usuario->email)->send(new AlquilerNoRecogido($alquiler));
        }
        $this->info('Avisos de no recogida de alquileres enviados: ' . $alquileres->count());
    }
}