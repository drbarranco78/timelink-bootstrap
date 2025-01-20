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
        if (!Schema::hasTable('credenciales')) {
            Schema::create('credenciales', function (Blueprint $table) {
                $table->id('id_credencial');
                $table->unsignedBigInteger('id_usuario');
                $table->string('password', 255);
                $table->string('reset_code', 100)->nullable();
                $table->dateTime('reset_code_expires')->nullable();
                $table->foreign('id_usuario')->references('id_usuario')->on('usuarios')->onUpdate('cascade')->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credenciales');
    }
};
