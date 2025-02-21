<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            ['dni' => '12345678A', 'nombre' => 'Juan', 'apellidos' => 'Pérez López', 'email' => 'juan.perez@techsolutions.com', 'id_empresa' => '1', 'cargo' => 'Administrador', 'rol' => 'maestro'],
            ['dni' => '12345678B', 'nombre' => 'María', 'apellidos' => 'Gómez Sánchez', 'email' => 'maria.gomez@innovatech.com', 'id_empresa' => '2', 'cargo' => 'Gerente', 'rol' => 'maestro'],
            ['dni' => '12345678C', 'nombre' => 'Carlos', 'apellidos' => 'Martínez Ruiz', 'email' => 'carlos.martinez@techsolutions.com', 'id_empresa' => '1', 'cargo' => 'Técnico', 'rol' => 'trabajador'],
            ['dni' => '12345678D', 'nombre' => 'Ana', 'apellidos' => 'Ramírez Torres', 'email' => 'ana.ramirez@innovatech.com', 'id_empresa' => '2', 'cargo' => 'Asistente', 'rol' => 'trabajador'],
            ['dni' => '12345678E', 'nombre' => 'Luis', 'apellidos' => 'Fernández Gómez', 'email' => 'luis.fernandez@techsolutions.com', 'id_empresa' => '1', 'cargo' => 'Jefe de Proyecto', 'rol' => 'maestro'],
            ['dni' => '12345678F', 'nombre' => 'Sofia', 'apellidos' => 'Hernández Pérez', 'email' => 'sofia.hernandez@innovatech.com', 'id_empresa' => '2', 'cargo' => 'Diseñadora', 'rol' => 'trabajador'],
        ]);
    }
}
