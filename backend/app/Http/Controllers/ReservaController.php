<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reserva;

class ReservaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'producto_id'    => 'required|exists:productos,id',
            'fecha_recogida' => 'nullable|date|after:today',
        ]);
        $reserva = Reserva::create([
            'usuario_id'     => $request->user()->id,
            'producto_id'    => $request->producto_id,
            'fecha_recogida' => $request->fecha_recogida,
            'estado'         => 'solicitada',
        ]);

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

    public function cancelar(Request $request, $id)
    {
        $reserva = Reserva::where('id', $id)
            ->where('usuario_id', $request->user()->id)
            ->firstOrFail();

        if (!in_array($reserva->estado, ['solicitada', 'aceptada'])) {
            return response()->json([
                'mensaje' => 'No se puede cancelar esta reserva',
            ], 400);
        }

        $reserva->update(['estado' => 'cancelada']);

        return response()->json([
            'mensaje' => 'Reserva cancelada correctamente',
        ]);
    }
}
