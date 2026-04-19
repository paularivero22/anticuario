<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PerfilController extends Controller
{
    // Ver perfil del usuario logueado
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    // Editar perfil
    public function update(Request $request)
    {
        $request->validate([
            'name'     => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'email'    => 'required|string|email|unique:users,email,' . $request->user()->id,
        ]);

        $request->user()->update($request->only(['name', 'telefono', 'email']));

        return response()->json([
            'mensaje' => 'Perfil actualizado correctamente',
            'user'    => $request->user(),
        ]);
    }

    // Cambiar contraseña
    public function cambiarPassword(Request $request)
    {
        $request->validate([
            'password_actual' => 'required|string',
            'password_nuevo'  => 'required|string|min:6|confirmed',
        ]);

        if (!Hash::check($request->password_actual, $request->user()->password)) {
            return response()->json([
                'mensaje' => 'La contraseña actual no es correcta',
            ], 400);
        }

        $request->user()->update([
            'password' => Hash::make($request->password_nuevo),
        ]);

        return response()->json([
            'mensaje' => 'Contraseña actualizada correctamente',
        ]);
    }

    // Ver mis reservas
    public function misReservas(Request $request)
    {
        $reservas = $request->user()
            ->reservas()
            ->with(['producto.imagenPrincipal'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reservas);
    }

    // Ver mis alquileres
    public function misAlquileres(Request $request)
    {
        $alquileres = $request->user()
            ->alquileres()
            ->with(['producto.imagenPrincipal'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($alquileres);
    }
}