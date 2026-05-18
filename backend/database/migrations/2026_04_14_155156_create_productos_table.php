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
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 10, 2)->nullable();
            $table->string('estado')->default('disponible');
            $table->boolean('destacado')->default(false);
            $table->boolean('permite_reserva')->default(false);
            $table->boolean('permite_alquiler')->default(false);

            $table->foreignId('subcategoria_id')
                ->constrained('subcategorias')
                ->onDelete('cascade');

            $table->foreignId('pais_id')
                ->nullable()
                ->constrained('paises')
                ->onDelete('set null');

            $table->foreignId('epoca_id')
                ->nullable()
                ->constrained('epocas')
                ->onDelete('set null');

            $table->string('medidas')->nullable();
            $table->string('materiales')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
