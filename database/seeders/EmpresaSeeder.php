<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmpresaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('empresas')->insert([
            ['cif' => 'A12345678', 'nombre_empresa' => 'Tech Solutions', 'direccion' => 'Calle Tecnología 123, Madrid', 'telefono' => '912345678', 'email' => 'contacto@techsolutions.com'],
            ['cif' => 'B87654321', 'nombre_empresa' => 'Innovatech', 'direccion' => 'Avenida Innovación 45, Barcelona', 'telefono' => '934567890', 'email' => 'info@innovatech.com'],
        ]);
    }
}
