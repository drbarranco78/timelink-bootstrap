<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CredencialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('credenciales')->insert([
            ['id_usuario' => 1, 'password' => 'Password123', 'reset_code' => null, 'reset_code_expires' => null],
            ['id_usuario' => 2, 'password' => 'Securepass456', 'reset_code' => null, 'reset_code_expires' => null],
        ]);
    }
}
