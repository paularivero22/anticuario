<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pais;

class PaisController extends Controller
{
    // Crear un país
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:paises,nombre',
        ]);

        $pais = Pais::create(['nombre' => $request->nombre]);

        return response()->json([
            'mensaje' => 'País creado correctamente',
            'pais'    => $pais,
        ], 201);
    }

    // Actualizar el nombre de un país
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:paises,nombre,' . $id,
        ]);

        $pais = Pais::findOrFail($id);
        $pais->update(['nombre' => $request->nombre]);

        return response()->json([
            'mensaje' => 'País actualizado correctamente',
            'pais'    => $pais,
        ]);
    }

    // Eliminar un país
    public function destroy($id)
    {
        $pais = Pais::findOrFail($id);

        if ($pais->productos()->count() > 0) {
            return response()->json([
                'mensaje' => 'No se puede eliminar un país con productos asociados',
            ], 400);
        }

        $pais->delete();

        return response()->json([
            'mensaje' => 'País eliminado correctamente',
        ]);
    }
}
