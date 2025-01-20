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
        if (!Schema::hasTable('usuarios')) {
            Schema::create('usuarios', function (Blueprint $table) {
                $table->id('id_usuario');
                $table->string('dni', 9)->unique();
                $table->string('nombre', 50);
                $table->string('apellidos', 100);
                $table->string('email', 100)->unique();
                $table->string('cif_empresa', 15);
                $table->string('cargo', 50)->nullable();
                $table->enum('rol', ['maestro', 'trabajador']);
                $table->foreign('cif_empresa')->references('cif')->on('empresas')->onUpdate('cascade')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuarios');
    }
};
