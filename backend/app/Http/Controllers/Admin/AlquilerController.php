<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Alquiler;

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

    // funcion para cambiar el estado de un alquiler (solicitado, aceptado, cancelado, expirado, recogido, retrasado, completado)
    public function cambiarEstado(Request $request, $id)
    {
        // el admin no puede cambiar el estado a solicitado, por lo que lo omito de la validacion
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

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
