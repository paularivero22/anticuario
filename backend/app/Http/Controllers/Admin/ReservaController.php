<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reserva;
use App\Models\Producto;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservaAceptadaCancelada;
use App\Mail\ReservaCompletada;

class ReservaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // ordenadas por fecha de creacion para ver las mas recientes primero
        $reservas = Reserva::with(['usuario', 'producto'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reservas);
    }

    // Funcion para cambiar el estado de una reserva (solicitada, aceptada, cancelada, expirada, completada)
    public function cambiarEstado(Request $request, $id)
    {
        // el admin no puede cambiar el estado a solicitada, por lo que no está en la validación
        $request->validate([
            'estado' => 'required|in:aceptada,cancelada,completada,expirada',
        ]);

        $reserva = Reserva::with('producto')->findOrFail($id);
        $estadoAnterior = $reserva->estado;
        $reserva->update(['estado' => $request->estado]);

        // actualizar estado del producto segun el estado de la reserva

        // si la reserva esta aceptada el producto pasa a reservado (no se verá en la pagina)
        if ($request->estado === 'aceptada') {
            $reserva->producto->update(['estado' => 'reservado']);

            /* si la reserva se cancela o expira la fecha de recogida
        el producto pasa a disponible (se verá en la pagina) 
        Esto ultimo tambien se controla con el comando programado */
        } elseif (in_array($request->estado, ['cancelada', 'expirada'])) {
            $reserva->producto->update(['estado' => 'disponible']);

            /* si la reserva se completa (el cliente recoge y paga el producto) el producto 
        pasa a inactivo (no se podrá volver a ver en la pagina pero seguirá en la base de datos) */
        } elseif ($request->estado === 'completada') {
            $reserva->producto->update(['estado' => 'inactivo']);
        }

        $reserva->load(['usuario', 'producto']);

        if (in_array($request->estado, ['aceptada', 'cancelada'])) {
            Mail::to($reserva->usuario->email)->send(new ReservaAceptadaCancelada($reserva));
        }

        if ($request->estado === 'completada') {
            Mail::to($reserva->usuario->email)->send(new ReservaCompletada($reserva));
        }

        return response()->json([
            'mensaje' => 'Estado actualizado correctamente',
            'reserva' => $reserva,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    // Actualizar la fecha de recogida de una reserva
    public function update(Request $request, string $id)
    {
        $request->validate([
            'fecha_recogida' => 'required|date',
        ]);

        $reserva = Reserva::findOrFail($id);
        $reserva->update(['fecha_recogida' => $request->fecha_recogida]);

        return response()->json([
            'mensaje' => 'Fecha actualizada correctamente',
            'reserva' => $reserva,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
