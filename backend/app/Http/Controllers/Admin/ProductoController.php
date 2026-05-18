<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Imagen;
use Illuminate\Support\Facades\Storage;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // obtener todos los productos con su subcategoria, categoria, epoca, pais e imagen principal ordenados por fecha de creacion para ver los mas recientes primero
        $productos = Producto::with(['subcategoria.categoria', 'epoca', 'pais', 'imagenPrincipal'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($productos);
    }

    // Crear un producto
    public function store(Request $request)
    {
        $request->validate([
            'nombre'           => 'required|string|max:255',
            'descripcion'      => 'nullable|string',
            'precio'           => 'nullable|numeric|min:0',
            'estado'           => 'nullable|string',
            'destacado'        => 'nullable|boolean',
            'permite_reserva'  => 'nullable|boolean',
            'permite_alquiler' => 'nullable|boolean',
            'subcategoria_id'  => 'required|exists:subcategorias,id',
            'pais_id'          => 'nullable|exists:paises,id',
            'epoca_id'         => 'nullable|exists:epocas,id',
            'medidas'          => 'nullable|string',
            'materiales'       => 'nullable|string',
            'imagenes'         => 'nullable|array',
            'imagenes.*'       => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $producto = Producto::create([
            'nombre'           => $request->nombre,
            'descripcion'      => $request->descripcion,
            'precio'           => $request->precio,
            'estado'           => $request->estado ?? 'disponible', // estado por defecto disponible
            'destacado'        => $request->destacado ?? false, // no es destacado por defecto
            'permite_reserva'  => $request->permite_reserva ?? false, // no permite reserva por defecto
            'permite_alquiler' => $request->permite_alquiler ?? false, // no permite alquiler por defecto
            'subcategoria_id'  => $request->subcategoria_id,
            'pais_id'          => $request->pais_id,
            'epoca_id'         => $request->epoca_id,
            'medidas'          => $request->medidas,
            'materiales'       => $request->materiales,
        ]);

        // Subir imágenes si las hay
        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $index => $imagen) {
                $path = $imagen->store('productos', 'public'); // se guardará en storage/app/public/productos

                Imagen::create([
                    'url'          => '/storage/' . $path,
                    'es_principal' => $index === 0 ? true : false, // la primera imagen subida es la principal
                    'producto_id'  => $producto->id,
                ]);
            }
        }

        return response()->json([
            'mensaje'  => 'Producto creado correctamente',
            'producto' => $producto->load(['imagenes', 'subcategoria.categoria']), // cargar relaciones para devolver el producto con toda su información
        ], 201);
    }

    public function show($id)
    {
        $producto = Producto::with(['subcategoria.categoria', 'epoca', 'pais', 'imagenes'])
            ->findOrFail($id);

        return response()->json($producto);
    }

    // Editar un producto
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nombre'           => 'nullable|string|max:255',
            'descripcion'      => 'nullable|string',
            'precio'           => 'nullable|numeric|min:0',
            'estado'           => 'nullable|string',
            'destacado'        => 'nullable|boolean',
            'permite_reserva'  => 'nullable|boolean',
            'permite_alquiler' => 'nullable|boolean',
            'subcategoria_id'  => 'nullable|exists:subcategorias,id',
            'pais_id'          => 'nullable|exists:paises,id',
            'epoca_id'         => 'nullable|exists:epocas,id',
            'medidas'          => 'nullable|string',
            'materiales'       => 'nullable|string',
            'imagenes'         => 'nullable|array',
            'imagenes.*'       => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $producto = Producto::findOrFail($id);
        $producto->update($request->only([
            'nombre',
            'descripcion',
            'precio',
            'estado',
            'destacado',
            'permite_reserva',
            'permite_alquiler',
            'subcategoria_id',
            'pais_id',
            'epoca_id',
            'medidas',
            'materiales',
        ]));

        // subir nuevas imágenes si las hay
        if ($request->hasFile('imagenes')) {
            // comprueba si el producto ya tiene una imagen principal
            $esPrimera = !$producto->imagenes()->where('es_principal', true)->exists();

            foreach ($request->file('imagenes') as $index => $imagen) { // guardar las imagenes nuevas en storage/productos
                $path = $imagen->store('productos', 'public');

                Imagen::create([
                    'url'          => '/storage/' . $path,
                    'es_principal' => $esPrimera && $index === 0 ? true : false, // si no tenía imagen principal se guardará como principal la primera imagen de las nuevas
                    'producto_id'  => $producto->id,
                ]);
            }
        }

        return response()->json([
            'mensaje'  => 'Producto actualizado correctamente',
            'producto' => $producto->load(['imagenes', 'subcategoria.categoria']),
        ]);
    }

    // Funcion para cambiar la imagen principal de un producto (botón "marcar como principal" en el frontend)
    public function cambiarImagenPrincipal(Request $request, $id)
    {
        $request->validate([
            'imagen_id' => 'required|exists:imagenes,id',
        ]);

        // quitar imagen principal actual
        Imagen::where('producto_id', $id)
            ->update(['es_principal' => false]);

        // marcar la nueva imagen principal
        Imagen::where('id', $request->imagen_id)
            ->where('producto_id', $id)
            ->update(['es_principal' => true]);

        return response()->json([
            'mensaje' => 'Imagen principal actualizada correctamente',
        ]);
    }

    // Eliminar un producto
    public function destroy(string $id)
    {
        $producto = Producto::with('imagenes')->findOrFail($id);

        // Eliminar imágenes del storage
        foreach ($producto->imagenes as $imagen) {
            $path = str_replace('/storage/', '', $imagen->url);
            Storage::disk('public')->delete($path);
            $imagen->delete();
        }

        $producto->delete();

        return response()->json([
            'mensaje' => 'Producto eliminado correctamente',
        ]);
    }

    // Eliminar una imagen de un producto
    public function eliminarImagen($id)
    {
        $imagen = Imagen::findOrFail($id);
        $path   = str_replace('/storage/', '', $imagen->url);
        Storage::disk('public')->delete($path);
        $imagen->delete();

        return response()->json([
            'mensaje' => 'Imagen eliminada correctamente',
        ]);
    }
}
