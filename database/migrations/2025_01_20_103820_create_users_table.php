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
        if (!Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->id('id');
                $table->string('dni', 9)->unique();
                $table->string('nombre', 50);
                $table->string('apellidos', 100);
                $table->string('email', 100)->unique();
                $table->unsignedBigInteger('id_empresa');
                $table->string('cargo', 50)->nullable();
                $table->enum('rol', ['maestro', 'empleado']);
                $table->enum('estado', ['pendiente', 'aceptada', 'rechazada'])->default('pendiente');
                $table->foreign('id_empresa')->references('id_empresa')->on('empresas')->onUpdate('cascade')->onDelete('cascade');
                $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
                $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
                //$table->timestamps(); //Necesario para el ORM Eloquent
            });
        }
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->id(); 
            //$table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // Constrained para la relación
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
