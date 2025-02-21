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
            ['id_usuario' => 1, 'password' => 'Password1', 'reset_code' => null, 'reset_code_expires' => null],
            ['id_usuario' => 2, 'password' => 'Password1', 'reset_code' => null, 'reset_code_expires' => null],
            ['id_usuario' => 3, 'password' => 'Password1', 'reset_code' => null, 'reset_code_expires' => null],
            ['id_usuario' => 4, 'password' => 'Password1', 'reset_code' => null, 'reset_code_expires' => null],
            ['id_usuario' => 5, 'password' => 'Password1', 'reset_code' => null, 'reset_code_expires' => null],
            ['id_usuario' => 6, 'password' => 'Password1', 'reset_code' => null, 'reset_code_expires' => null],
        ]);
    }
}
