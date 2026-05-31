<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Alquiler;
use Illuminate\Support\Facades\Mail;
use App\Mail\AlquilerAceptadoCancelado;
use App\Mail\AlquilerCompletado;

class AlquilerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // ordenados por fecha de creacion para ver los mas recientes primero
        $alquileres = Alquiler::with(['usuario', 'producto'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($alquileres);
    }

    // Funcion para cambiar el estado de un alquiler (solicitado, aceptado, cancelado, expirado, recogido, retrasado, completado)
    public function cambiarEstado(Request $request, $id)
    {
        // el admin no puede cambiar el estado a solicitado, por lo que no está en la validación
        $request->validate([
            'estado' => 'required|in:aceptado,cancelado,recogido,retrasado,completado,expirado',
        ]);

        $alquiler = Alquiler::with('producto')->findOrFail($id);
        $alquiler->update(['estado' => $request->estado]);

        // actualizar estado del producto según el estado del alquiler

        // si el alquiler es aceptado el producto pasa a alquilado (se verá en la pagina pero como alquilado)
        if ($request->estado === 'aceptado') {
            $alquiler->producto->update(['estado' => 'alquilado']);

            /* si el alquiler se retrasa (el cliente no ha devuelto el producto) el producto 
        pasa a retrasado 
        Esto tambien se controla con el comando programado 
        */
        } elseif ($request->estado === 'retrasado') {
            $alquiler->producto->update(['estado' => 'retrasado']);

            /* si el alquiler se completa (el cliente devuelve el producto) el producto 
        pasa a disponible (se verá en la pagina como disponible) */
        } elseif ($request->estado === 'recogido') {
            $alquiler->producto->update(['estado' => 'alquilado']);

            /* si el alquiler se cancela, se completa o expira la fecha de recogida el producto pasa a
        disponible (se verá en la pagina como disponible) */
        } elseif (in_array($request->estado, ['cancelado', 'completado', 'expirado'])) {
            $alquiler->producto->update(['estado' => 'disponible']);
        }

        $alquiler->load(['usuario', 'producto']);

        if (in_array($request->estado, ['aceptado', 'cancelado'])) {
            Mail::to($alquiler->usuario->email)->send(new AlquilerAceptadoCancelado($alquiler));
        }

        if ($request->estado === 'completado') {
            Mail::to($alquiler->usuario->email)->send(new AlquilerCompletado($alquiler));
        }

        return response()->json([
            'mensaje' => 'Estado actualizado correctamente',
            'alquiler' => $alquiler,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    // Actualizar la fecha de recogida y devolucion de un alquiler
    public function update(Request $request, string $id)
    {
        $request->validate([
            'fecha_recogida'   => 'nullable|date',
            'fecha_devolucion' => 'nullable|date|after_or_equal:fecha_recogida',
        ]);

        $alquiler = Alquiler::findOrFail($id);
        $alquiler->update($request->only(['fecha_recogida', 'fecha_devolucion']));

        return response()->json([
            'mensaje'   => 'Fechas actualizadas correctamente',
            'alquiler'  => $alquiler,
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
