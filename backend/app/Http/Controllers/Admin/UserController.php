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

    // Ver los detalles de un usuario, incluyendo sus reservas y alquileres con los productos correspondientes
    public function show(string $id)
    {
        $usuario = User::with(['reservas.producto', 'alquileres.producto'])
            ->findOrFail($id);

        return response()->json($usuario);
    }

    // Función para cambiar el rol de un usuario (cliente o admin)
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

    // Eliminar un usuario
    public function destroy(string $id)
    {
        $usuario = User::findOrFail($id);

        // no se podrá eliminar un administrador sin cambiarlo a cliente previamente
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

    // Crear un nuevo usuario desde el panel de administración
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'telefono' => 'nullable|string|max:20',
            'rol'      => 'required|in:cliente,admin',
        ]);

        $usuario = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
            'telefono' => $request->telefono,
            'rol'      => $request->rol,
        ]);

        return response()->json([
            'mensaje'  => 'Usuario creado correctamente',
            'usuario'  => $usuario,
        ], 201);
    }
}
