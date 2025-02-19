<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FichajeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    DB::table('fichajes')->insert([
        [
            'id_usuario' => 1,
            'tipo_fichaje' => 'entrada',
            'fecha' => '2025-02-17',
            'hora' => '08:00:00',
            'ubicacion' => 'Oficina Madrid',
            'ciudad' => 'Madrid',
            'latitud' => 40.416775,
            'longitud' => -3.703790
        ],
        [
            'id_usuario' => 1,
            'tipo_fichaje' => 'salida',
            'fecha' => '2025-02-17',
            'hora' => '16:00:00',
            'ubicacion' => 'Oficina Madrid',
            'ciudad' => 'Madrid',
            'latitud' => 40.416775,
            'longitud' => -3.703790
        ],
        [
            'id_usuario' => 2,
            'tipo_fichaje' => 'entrada',
            'fecha' => '2025-02-17',
            'hora' => '09:00:00',
            'ubicacion' => 'Oficina Barcelona',
            'ciudad' => 'Barcelona',
            'latitud' => 41.385064,  // Coordenadas de Barcelona
            'longitud' => 2.173404
        ],
        [
            'id_usuario' => 2,
            'tipo_fichaje' => 'inicio_descanso',
            'fecha' => '2025-02-17',
            'hora' => '13:00:00',
            'ubicacion' => 'Oficina Barcelona',
            'ciudad' => 'Barcelona',
            'latitud' => 41.385064,
            'longitud' => 2.173404
        ],
    ]);
}

}
