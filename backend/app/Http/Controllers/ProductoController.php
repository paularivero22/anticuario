<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Producto;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Producto::with(['subcategoria.categoria', 'epoca', 'pais', 'imagenPrincipal'])
            ->where('estado', '!=', 'inactivo');

        // FILTROS

        // categoria
        if ($request->categoria) {
            $query->whereHas('subcategoria.categoria', function ($q) use ($request) {
                $q->where('nombre', $request->categoria);
            });
        }

        // subcategoria
        if ($request->subcategoria_id) {
            $query->where('subcategoria_id', $request->subcategoria_id);
        }

        // epoca 
        if ($request->epoca_id) {
            $query->where('epoca_id', $request->epoca_id);
        }

        // pais
        if ($request->pais_id) {
            $query->where('pais_id', $request->pais_id);
        }

        // precio (rango)
        if ($request->precio_min) {
            $query->where('precio', '>=', $request->precio_min);
        }
        if ($request->precio_max) {
            $query->where('precio', '<=', $request->precio_max);
        }

        // tipo (reserva o alquiler)
        if ($request->permite_reserva) {
            $query->where('permite_reserva', true);
        }
        if ($request->permite_alquiler) {
            $query->where('permite_alquiler', true);
        }

        // destacado 
        if ($request->destacado) {
            $query->where('destacado', true);
        }

        // ORDENAR POR
        switch ($request->orden) {
            case 'precio_asc':
                $query->orderBy('precio', 'asc');
                break;
            case 'precio_desc':
                $query->orderBy('precio', 'desc');
                break;
            case 'nombre_asc':
                $query->orderBy('nombre', 'asc');
                break;
            case 'nombre_desc':
                $query->orderBy('nombre', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        return response()->json($query->get());
    }

    // obtener los productos destacados rapidamente (usado en la pagina principal)
    public function destacados()
    {
        $productos = Producto::with(['subcategoria.categoria', 'imagenPrincipal'])
            ->where('destacado', true)
            ->where('estado', '!=', 'inactivo')
            ->limit(6)
            ->get();

        return response()->json($productos);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $producto = Producto::with(['subcategoria.categoria', 'epoca', 'pais', 'imagenes'])
            ->where('estado', '!=', 'inactivo')
            ->findOrFail($id);

        return response()->json($producto);
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
}
