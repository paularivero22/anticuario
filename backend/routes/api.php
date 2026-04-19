<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\SubcategoriaController;
use App\Http\Controllers\EpocaController;
use App\Http\Controllers\PaisController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\AlquilerController;
use App\Http\Controllers\Admin\ProductoController as AdminProductoController;
use App\Http\Controllers\Admin\ReservaController as AdminReservaController;
use App\Http\Controllers\Admin\AlquilerController as AdminAlquilerController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\CategoriaController as AdminCategoriaController;
use App\Http\Controllers\PerfilController;

// Rutas públicas autenticación
Route::post('/registro', [AuthController::class, 'registro']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas públicas
Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/productos/destacados', [ProductoController::class, 'destacados']);
Route::get('/productos/{id}', [ProductoController::class, 'show']);
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/subcategorias', [SubcategoriaController::class, 'index']);
Route::get('/epocas', [EpocaController::class, 'index']);
Route::get('/paises', [PaisController::class, 'index']);

// Rutas protegidas cliente
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Reservas
    Route::get('/mis-reservas', [ReservaController::class, 'index']);
    Route::post('/reservas', [ReservaController::class, 'store']);
    Route::put('/reservas/{id}/cancelar', [ReservaController::class, 'cancelar']);

    // Alquileres
    Route::get('/mis-alquileres', [AlquilerController::class, 'index']);
    Route::post('/alquileres', [AlquilerController::class, 'store']);
    Route::put('/alquileres/{id}/cancelar', [AlquilerController::class, 'cancelar']);

    // Perfil
    Route::get('/perfil', [PerfilController::class, 'show']);
    Route::put('/perfil', [PerfilController::class, 'update']);
    Route::put('/perfil/password', [PerfilController::class, 'cambiarPassword']);
    Route::get('/perfil/reservas', [PerfilController::class, 'misReservas']);
    Route::get('/perfil/alquileres', [PerfilController::class, 'misAlquileres']);
});

// Rutas protegidas admin
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Productos
    Route::get('/productos', [AdminProductoController::class, 'index']);
    Route::post('/productos', [AdminProductoController::class, 'store']);
    Route::get('/productos/{id}', [AdminProductoController::class, 'show']);
    Route::put('/productos/{id}', [AdminProductoController::class, 'update']);
    Route::delete('/productos/{id}', [AdminProductoController::class, 'destroy']);
    Route::post('/productos/{id}/imagen-principal', [AdminProductoController::class, 'cambiarImagenPrincipal']);
    Route::delete('/imagenes/{id}', [AdminProductoController::class, 'eliminarImagen']);

    // Reservas
    Route::get('/reservas', [AdminReservaController::class, 'index']);
    Route::put('/reservas/{id}/estado', [AdminReservaController::class, 'cambiarEstado']);

    // Alquileres
    Route::get('/alquileres', [AdminAlquilerController::class, 'index']);
    Route::put('/alquileres/{id}/estado', [AdminAlquilerController::class, 'cambiarEstado']);

    // Usuarios
    Route::get('/usuarios', [AdminUserController::class, 'index']);
    Route::get('/usuarios/{id}', [AdminUserController::class, 'show']);
    Route::delete('/usuarios/{id}', [AdminUserController::class, 'destroy']);
    Route::put('/usuarios/{id}/rol', [AdminUserController::class, 'cambiarRol']);

    // Categorías
    Route::get('/categorias', [AdminCategoriaController::class, 'index']);
    Route::post('/categorias', [AdminCategoriaController::class, 'store']);
    Route::put('/categorias/{id}', [AdminCategoriaController::class, 'update']);
    Route::delete('/categorias/{id}', [AdminCategoriaController::class, 'destroy']);

    // Subcategorías
    Route::post('/subcategorias', [AdminCategoriaController::class, 'storeSubcategoria']);
    Route::put('/subcategorias/{id}', [AdminCategoriaController::class, 'updateSubcategoria']);
    Route::delete('/subcategorias/{id}', [AdminCategoriaController::class, 'destroySubcategoria']);
});