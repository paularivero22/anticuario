<?php

namespace App\Http\Controllers;

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
        $alquileres = Alquiler::where('usuario_id', $request->user()->id)
            ->with(['producto'])
            ->get();

        return response()->json($alquileres);
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
            'producto_id'      => 'required|exists:productos,id',
            'fecha_recogida'   => 'nullable|date|after:today',
            'fecha_devolucion' => 'nullable|date|after:fecha_recogida',
        ]);

        $alquiler = Alquiler::create([
            'usuario_id'       => $request->user()->id,
            'producto_id'      => $request->producto_id,
            'fecha_recogida'   => $request->fecha_recogida,
            'fecha_devolucion' => $request->fecha_devolucion,
            'estado'           => 'solicitado',
        ]);

        return response()->json([
            'mensaje'   => 'Alquiler solicitado correctamente',
            'alquiler'  => $alquiler,
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
        $alquiler = Alquiler::where('id', $id)
            ->where('usuario_id', $request->user()->id)
            ->firstOrFail();

        if (!in_array($alquiler->estado, ['solicitado', 'aceptado'])) {
            return response()->json([
                'mensaje' => 'No se puede cancelar este alquiler',
            ], 400);
        }

        $alquiler->update(['estado' => 'cancelado']);

        return response()->json([
            'mensaje' => 'Alquiler cancelado correctamente',
        ]);
    }
}
