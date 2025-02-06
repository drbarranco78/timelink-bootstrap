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
        Schema::create('invitaciones', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->unsignedBigInteger('id_empresa');
            $table->foreign('id_empresa')->references('id_empresa')->on('empresas')->onUpdate('cascade')->onDelete('cascade');

            $table->timestamp('fecha_expiracion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invitaciones');
    }
};
