<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $usuarios = User::withCount(['reservas', 'alquileres'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($usuarios);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $usuario = User::with(['reservas.producto', 'alquileres.producto'])
            ->findOrFail($id);

        return response()->json($usuario);
    }

    /**
     * Update the specified resource in storage.
     */
    public function cambiarRol(Request $request, $id)
    {
        $request->validate([
            'rol' => 'required|in:cliente,admin',
        ]);

        $usuario = User::findOrFail($id);
        $usuario->update(['rol' => $request->rol]);

        return response()->json([
            'mensaje'  => 'Rol actualizado correctamente',
            'usuario'  => $usuario,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $usuario = User::findOrFail($id);

        if ($usuario->rol === 'admin') {
            return response()->json([
                'mensaje' => 'No se puede eliminar un administrador',
            ], 403);
        }

        $usuario->delete();

        return response()->json([
            'mensaje' => 'Usuario eliminado correctamente',
        ]);
    }
}
