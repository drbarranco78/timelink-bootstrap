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
        if (!Schema::hasTable('fichajes')) {
            Schema::create('fichajes', function (Blueprint $table) {
                $table->id('id_fichaje');
                $table->unsignedBigInteger('id_usuario');
                $table->enum('tipo_fichaje', ['entrada', 'salida', 'inicio_descanso', 'fin_descanso', 'registro']);
                $table->date('fecha');
                $table->time('hora');
                $table->string('ubicacion', 255)->nullable();                
                $table->string('ciudad', 100)->nullable();
                $table->decimal('latitud', 10, 7)->nullable();
                $table->decimal('longitud', 10, 7)->nullable();
                $table->integer('duracion')->default(0);
                $table->string('comentarios',255)->nullable();  
                $table->foreign('id_usuario')->references('id')->on('users')->onUpdate('cascade')->onDelete('cascade');
                $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
                $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
                //$table->timestamps(); //Necesario para el ORM Eloquent
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fichajes');
    }
};
