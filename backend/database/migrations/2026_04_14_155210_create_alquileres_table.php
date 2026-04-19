<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('alquileres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')
                ->constrained('users')
                ->onDelete('cascade');
            $table->foreignId('producto_id')
                ->constrained('productos')
                ->onDelete('cascade');
            $table->date('fecha_recogida')->nullable();
            $table->date('fecha_devolucion')->nullable();
            $table->string('estado')->default('solicitado');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alquileres');
    }
};
