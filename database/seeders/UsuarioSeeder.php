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
            ['dni' => '12345678A', 'nombre' => 'Juan', 'apellidos' => 'Pérez López', 'email' => 'juan.perez@techsolutions.com', 'id_empresa' => '1', 'cargo' => 'Desarrollador', 'rol' => 'empleado'],
            ['dni' => '87654321B', 'nombre' => 'María', 'apellidos' => 'Gómez Sánchez', 'email' => 'maria.gomez@innovatech.com', 'id_empresa' => '2', 'cargo' => 'Gerente', 'rol' => 'maestro'],
        ]);
    }
}
