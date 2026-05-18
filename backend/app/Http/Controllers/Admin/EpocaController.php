<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Epoca;

class EpocaController extends Controller
{
    // Crear una época
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:epocas,nombre',
        ]);

        $epoca = Epoca::create(['nombre' => $request->nombre]);

        return response()->json([
            'mensaje' => 'Época creada correctamente',
            'epoca'   => $epoca,
        ], 201);
    }

    // Actualizar el nombre de una época
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:epocas,nombre,' . $id,
        ]);

        $epoca = Epoca::findOrFail($id);
        $epoca->update(['nombre' => $request->nombre]);

        return response()->json([
            'mensaje' => 'Época actualizada correctamente',
            'epoca'   => $epoca,
        ]);
    }

    // Eliminar una época
    public function destroy($id)
    {
        $epoca = Epoca::findOrFail($id);

        if ($epoca->productos()->count() > 0) {
            return response()->json([
                'mensaje' => 'No se puede eliminar una época con productos asociados',
            ], 400);
        }

        $epoca->delete();

        return response()->json([
            'mensaje' => 'Época eliminada correctamente',
        ]);
    }
}
