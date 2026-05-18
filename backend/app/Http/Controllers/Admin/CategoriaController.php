<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Subcategoria;
use App\Models\Categoria;

class CategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(
            Categoria::with('subcategorias')->orderBy('nombre')->get()
        );
    }

    // Crear categoria
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        $categoria = Categoria::create(['nombre' => $request->nombre]);

        return response()->json([
            'mensaje'   => 'Categoría creada correctamente',
            'categoria' => $categoria,
        ], 201);
    }

    // Actualizar el nombre de una categoria
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        $categoria = Categoria::findOrFail($id);
        $categoria->update(['nombre' => $request->nombre]);

        return response()->json([
            'mensaje'   => 'Categoría actualizada correctamente',
            'categoria' => $categoria,
        ]);
    }

    // Eliminar una categoria
    public function destroy(string $id)
    {
        $categoria = Categoria::findOrFail($id);

        if ($categoria->subcategorias()->count() > 0) {
            return response()->json([
                'mensaje' => 'No se puede eliminar una categoría con subcategorías',
            ], 400);
        }

        $categoria->delete();

        return response()->json([
            'mensaje' => 'Categoría eliminada correctamente',
        ]);
    }

    // Crear una sobcategoría desde la tabla de la categoria a la que pertenece
    public function storeSubcategoria(Request $request)
    {
        $request->validate([
            'nombre'       => 'required|string|max:255',
            'categoria_id' => 'required|exists:categorias,id',
        ]);

        $subcategoria = Subcategoria::create([
            'nombre'       => $request->nombre,
            'categoria_id' => $request->categoria_id,
        ]);

        return response()->json([
            'mensaje'      => 'Subcategoría creada correctamente',
            'subcategoria' => $subcategoria,
        ], 201);
    }

    // Editar una subcategoria
    public function updateSubcategoria(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        $subcategoria = Subcategoria::findOrFail($id);
        $subcategoria->update(['nombre' => $request->nombre]);

        return response()->json([
            'mensaje'      => 'Subcategoría actualizada correctamente',
            'subcategoria' => $subcategoria,
        ]);
    }

    // Eliminar una subcategoria
    public function destroySubcategoria($id)
    {
        $subcategoria = Subcategoria::findOrFail($id);

        if ($subcategoria->productos()->count() > 0) {
            return response()->json([
                'mensaje' => 'No se puede eliminar una subcategoría con productos asociados',
            ], 400);
        }

        $subcategoria->delete();

        return response()->json([
            'mensaje' => 'Subcategoría eliminada correctamente',
        ]);
    }
}
