<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reserva;
use App\Models\Producto;

class ReservaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // mostrar las reservas del usuario autenticado, con la información del producto reservado
        $reservas = Reserva::where('usuario_id', $request->user()->id)
            ->with(['producto'])
            ->get();

        return response()->json($reservas);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    // Solicitar una reserva de un producto
    public function store(Request $request)
    {
        $request->validate([
            'producto_id'    => 'required|exists:productos,id',
            'fecha_recogida' => 'nullable|date|after:today',
        ]);

        $producto = Producto::findOrFail($request->producto_id);
        if ($producto->estado !== 'disponible') { // solo se pueden reservar productos disponibles
            return response()->json([
                'mensaje' => 'Este producto no está disponible para reservar',
            ], 422);
        }

        $reserva = Reserva::create([
            'usuario_id'     => $request->user()->id, // recoger el id del usuario autenticado
            'producto_id'    => $request->producto_id,
            'fecha_recogida' => $request->fecha_recogida,
            'estado'         => 'solicitada', // el estado inicial de la reserva es solicitada
        ]);

        // actualizar el estado del producto señalado a "reservado" (no se verá en la página)
        $reserva->load('producto');
        $reserva->producto->update(['estado' => 'reservado']);

        return response()->json([
            'mensaje' => 'Reserva solicitada correctamente',
            'reserva' => $reserva,
        ], 201);
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

    // Función para cancelar una reserva (solo si está en estado solicitada o aceptada)
    public function cancelar(Request $request, $id)
    {
        $reserva = Reserva::where('id', $id)
            ->where('usuario_id', $request->user()->id)
            ->firstOrFail();

        if (!in_array($reserva->estado, ['solicitada', 'aceptada'])) {
            // solo se pueden cancelar las reservas que estén en estado solicitada o aceptada
            return response()->json([
                'mensaje' => 'No se puede cancelar esta reserva',
            ], 400);
        }

        $reserva->update(['estado' => 'cancelada']);

        // actualizar el estado del producto señalado a "disponible" (se volverá a ver en la página)
        $reserva->load('producto');
        $reserva->producto->update(['estado' => 'disponible']);

        return response()->json([
            'mensaje' => 'Reserva cancelada correctamente',
        ]);
    }
}
