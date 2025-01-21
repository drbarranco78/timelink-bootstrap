<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('usuarios')->insert([
            ['dni' => '12345678A', 'nombre' => 'Juan', 'apellidos' => 'Pérez López', 'email' => 'juan.perez@techsolutions.com', 'cif_empresa' => 'A12345678', 'cargo' => 'Desarrollador', 'rol' => 'trabajador'],
            ['dni' => '87654321B', 'nombre' => 'María', 'apellidos' => 'Gómez Sánchez', 'email' => 'maria.gomez@innovatech.com', 'cif_empresa' => 'B87654321', 'cargo' => 'Gerente', 'rol' => 'maestro'],
        ]);
    }
}
