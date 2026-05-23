<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Imagen;
use App\Services\CloudinaryService;

class ProductoController extends Controller
{
    protected $cloudinary;

    public function __construct(CloudinaryService $cloudinary)
    {
        $this->cloudinary = $cloudinary;
    }

    public function index()
    {
        $productos = Producto::with(['subcategoria.categoria', 'epoca', 'pais', 'imagenPrincipal'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($productos);
    }

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
            'estado'           => $request->estado ?? 'disponible',
            'destacado'        => $request->destacado ?? false,
            'permite_reserva'  => $request->permite_reserva ?? false,
            'permite_alquiler' => $request->permite_alquiler ?? false,
            'subcategoria_id'  => $request->subcategoria_id,
            'pais_id'          => $request->pais_id,
            'epoca_id'         => $request->epoca_id,
            'medidas'          => $request->medidas,
            'materiales'       => $request->materiales,
        ]);

        if ($request->hasFile('imagenes')) {
            foreach ($request->file('imagenes') as $index => $imagen) {
                $resultado = $this->cloudinary->upload($imagen);

                Imagen::create([
                    'url'          => $resultado['url'],
                    'public_id'    => $resultado['public_id'],
                    'es_principal' => $index === 0,
                    'producto_id'  => $producto->id,
                ]);
            }
        }

        return response()->json([
            'mensaje'  => 'Producto creado correctamente',
            'producto' => $producto->load(['imagenes', 'subcategoria.categoria']),
        ], 201);
    }

    public function show($id)
    {
        $producto = Producto::with(['subcategoria.categoria', 'epoca', 'pais', 'imagenes'])
            ->findOrFail($id);

        return response()->json($producto);
    }

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
            'nombre', 'descripcion', 'precio', 'estado', 'destacado',
            'permite_reserva', 'permite_alquiler', 'subcategoria_id',
            'pais_id', 'epoca_id', 'medidas', 'materiales',
        ]));

        if ($request->hasFile('imagenes')) {
            $esPrimera = !$producto->imagenes()->where('es_principal', true)->exists();

            foreach ($request->file('imagenes') as $index => $imagen) {
                $resultado = $this->cloudinary->upload($imagen);

                Imagen::create([
                    'url'          => $resultado['url'],
                    'public_id'    => $resultado['public_id'],
                    'es_principal' => $esPrimera && $index === 0,
                    'producto_id'  => $producto->id,
                ]);
            }
        }

        return response()->json([
            'mensaje'  => 'Producto actualizado correctamente',
            'producto' => $producto->load(['imagenes', 'subcategoria.categoria']),
        ]);
    }

    public function cambiarImagenPrincipal(Request $request, $id)
    {
        $request->validate([
            'imagen_id' => 'required|exists:imagenes,id',
        ]);

        Imagen::where('producto_id', $id)->update(['es_principal' => false]);
        Imagen::where('id', $request->imagen_id)
            ->where('producto_id', $id)
            ->update(['es_principal' => true]);

        return response()->json(['mensaje' => 'Imagen principal actualizada correctamente']);
    }

    public function destroy(string $id)
    {
        $producto = Producto::with('imagenes')->findOrFail($id);

        foreach ($producto->imagenes as $imagen) {
            if ($imagen->public_id) {
                $this->cloudinary->delete($imagen->public_id);
            }
            $imagen->delete();
        }

        $producto->delete();

        return response()->json(['mensaje' => 'Producto eliminado correctamente']);
    }

    public function eliminarImagen($id)
    {
        $imagen = Imagen::findOrFail($id);

        if ($imagen->public_id) {
            $this->cloudinary->delete($imagen->public_id);
        }

        $imagen->delete();

        return response()->json(['mensaje' => 'Imagen eliminada correctamente']);
    }
}