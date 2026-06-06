<?php
namespace App\Console\Commands;
use Illuminate\Console\Command;
use App\Models\Alquiler;
use Illuminate\Support\Facades\Mail;
use App\Mail\AlquilerAceptadoCancelado;
use Carbon\Carbon;
class ExpirarAlquileres extends Command
{
    protected $signature = 'alquileres:expirar';
    protected $description = 'Expira alquileres cuya fecha de recogida ha pasado y gestiona retrasos';

    public function handle()
    {
        $expirados = Alquiler::with(['usuario', 'producto'])
            ->where('estado', 'aceptado')
            ->where('fecha_recogida', '<', Carbon::today())
            ->get();

        foreach ($expirados as $alquiler) {
            $alquiler->update(['estado' => 'expirado']);
        }

        $this->info('Alquileres expirados: ' . $expirados->count());
    }
}